import { errorHandler, excelToJson, lazyTable } from "../../helpers";
import { Request, Response } from "../../interfaces";
import { Career, Establishment, Practice, StudyPlan, Subject, UploadHistory, User } from "../../app/app.associatios";
import sequelize from "../../configs/config"

export class UploadHistoryModule  {
    constructor(){}

    static async indexPaginado(req: Request, res: Response){
        try {
            const opts = lazyTable(req.body)
            opts.attributes = ["id", "name", "file_type", "upload_date", "number_rows"];
            opts.include = [
                {
                    model: User,
                    as: "user",
                    attributes: [
                        "name",
                        "pat_last_name",
                        "mat_last_name"
                    ]
                }
            ];

            const files = await UploadHistory.findAndCountAll(opts);

            return res.status(200).json({
                message: "Data was loaded successfully",
                response: files
            });

        } catch (error: any) {
            return res.status(500).json({
                msg: "Error en el servidor, comuniquese con el administrador",
                error: error.message
            });
        }
    }

    static async loadData(req: Request, res: Response){
        
        const t = await sequelize.transaction();

        try {
            const { type, name } = req.body; 

            if (type < 0 || type > 3) {
                return res.status(400).json({
                    message: "Incorrect file type"
                })
            }

            if (!req.file) {
                return res.status(400).json({
                    message: "No file received"
                })
            }

            const excelData: any = await excelToJson(req.file.buffer, type);
            console.log(excelData)
            if (excelData.data.length == 0) {
                return res.status(402).json({
                    message: "Excel formatting is incorrect"
                });
            }
            
            let rowCreated = 0;
            let rowUpdated = 0;

            // type = 0: Archivo de estudiantes, type = 1: Archivo de establecimientos
            // type = 2: Archivo de practicas , type = 3: Archivo de asignaturas
            if (type == 0) {
                for (let row of excelData.data) {
                    const student: any = await User.findOne({
                        where: {
                            rut: row.rut
                        },
                        transaction: t
                    });
                    // Obtener id del plan de estudio
                    const studyPlan: any = await StudyPlan.findOne({
                        where: {
                            code: row.study_plan
                        },
                        transaction: t
                    });
                    row = {
                        ...row,
                        study_plan_id: studyPlan.id
                    }
                    // No se encontro el estudiante, se crea uno nuevo
                    if (!student) {
                        await User.create(row, { transaction: t });
                        rowCreated++;
                    } else { // Si se encontro el estudiante, se actualizan sus datos
                        await student.update(row, { transaction: t })
                        rowUpdated++;
                    }
                };
            } else if (type == 1) {
                for (const row of excelData.data) {
                    const establishment: any = await Establishment.findOne({
                        where: {
                            code: row.code
                        },
                        transaction: t
                    });
                    // No se encontro el establecimiento, se crea uno nuevo
                    if (!establishment) {
                        await Establishment.create(row, { transaction: t });
                        rowCreated++;
                    } else { // Si se encontro el establecimiento, se actualizan sus datos
                        await establishment.update(row, { transaction: t })
                        rowUpdated++;
                    }
                };        
            } else if (type == 2) {
                for (const row of excelData.data) {
                    // Filtramos los datos en: practica, asignatura, estudiante, establecimiento y supervisor
                    // Estudiante:
                    let student: any = await User.findOne({
                        where: {
                            rut: row.rut_student
                        },
                        transaction: t
                    });
                    const studyPlan: any = await StudyPlan.findOne({
                        where: {
                            code: row.code_study_plan
                        },
                        transaction: t
                    });
                    const studentData = {
                        name: row.name_student,
                        pat_last_name: row.pat_last_name_student,
                        mat_last_name: row.mat_last_name_student,
                        rut: row.rut_student,
                        check_digit: row.check_digit_student,
                        study_plan: studyPlan.id
                    }
                    console.log(studentData);
                    // No se encontro el estudiante, se crea uno nuevo
                    if (!student) {
                        student = await User.create(studentData, { transaction: t });
                    } else { // Si se encontro el estudiante, se actualizan sus datos
                        student = await student.update(studentData, { transaction: t })
                    }

                    // Supervisor:
                    let supervisor: any = await User.findOne({
                        where: {
                            rut: row.rut_supervisor
                        },
                        transaction: t
                    });
                    const supervisorData = {
                        name: row.name_supervisor,
                        pat_last_name: row.pat_last_name_supervisor,
                        mat_last_name: row.mat_last_name_supervisor,
                        rut: row.rut_supervisor,
                        check_digit: row.check_digit_supervisor,
                    }
                    // No se encontro el supervisor, se crea uno nuevo
                    if (!supervisor) {
                        supervisor = await User.create(supervisorData, { transaction: t });
                    } else { // Si se encontro el supervisor, se actualizan sus datos
                        supervisor = await supervisor.update(supervisorData, { transaction: t })
                    }
                    // Establecimiento
                    const establishment: any = await Establishment.findOne({
                        where: {
                            code: row.code_establishment
                        },
                        transaction: t
                    });

                    // Asignatura
                    const subject: any = await Subject.findOne({
                        where: {
                            code: row.code_subject
                        },
                        include: [
                            {
                                model: StudyPlan,
                                as: "studyPlan",
                                include: [
                                    {
                                        model: Career,
                                        as: "career"
                                    }
                                ]
                            }
                        ],
                        transaction: t
                    });

                    // Practica
                    const practice: any = await Practice.findOne({
                        where: {
                            code: row.code_practice
                        },
                        transaction: t
                    });
                    const practiceData = {
                        code: row.code_practice,
                        status: row.status,
                        startDate: row.startDate,
                        endDate: row.end_date,
                        career_id: subject.studyPlan.career.id,
                        student_id: student.id,
                        supervisor_id: supervisor.id,
                        establishment_id: establishment.id,
                        subject_id: subject.id
                    };
                    // No se encontro la practica, se crea uno nuevo
                    if (!practice) {
                        await Practice.create(practiceData, { transaction: t });
                        rowCreated++;
                    } else { // Si se encontro la practica, se actualizan sus datos
                        await practice.update(practiceData, { transaction: t });
                        rowUpdated++
                    }
                    
                }; 
            } else if (type == 3) {
                for (const row of excelData.data) {
                    const studyPlan: any = await StudyPlan.findOne({
                        where: {
                            code: row.code_study_plan
                        },
                        transaction: t
                    });
                    // No se encontro el plan de estudio
                    if (!studyPlan) {
                        throw new Error("Incorrect Study Plan");
                    }
                    const subjectData = {
                        name: row.name,
                        code: row.code_subject,
                        description: row.description,
                        practice_number: row.practice_number,
                        total_hours: row.total_hours,
                        start_date: row.start_date,
                        end_date: row.end_date,
                        study_plan_id: studyPlan.id
                    };
                    await Subject.create(subjectData, { transaction: t })
                    rowCreated++;
                };   
            }
            
            const fileData = {
                name: name,
                upload_date: new Date(),
                file: req.file,
                number_rows: excelData.numberRows,
                file_type: (type == 0) ? "Estudiantes" : 
                           (type == 1) ? "Establecimientos" : 
                           (type == 2) ? "Practicas" :
                           (type == 3) ? "Asignaturas" : null,
                user_id: 1
            };
            await UploadHistory.create(fileData, { transaction: t })

            const commit = await t.commit();

            return res.status(200).json({
                message: "Data was loaded successfully",
                rowCreated: rowCreated,
                rowUpdated: rowUpdated
            });

        } catch (error: any) {
            const rollback = await t.rollback();
            console.error(error);
            return res.status(500).json({
                msg: "Error en el servidor, comuniquese con el administrador",
                error: error.message
            });
        }
    }

}