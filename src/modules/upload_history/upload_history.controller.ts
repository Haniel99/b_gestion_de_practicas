import { errorHandler, excelToJson, lazyTable } from "../../helpers";
import { Request, Response } from "../../interfaces";
import { Career, Establishment, Practice, StudyPlan, Subject, User } from "../../app/app.associatios";
import sequelize from "../../configs/config"

export class UploadHistoryModule  {
    constructor(){}

    static async loadData(req: Request, res: Response){
        
        const t = await sequelize.transaction();

        try {
            const { type } = req.body; 

            if (!req.file) {
                return res.status(400).json({
                    message: "No file received"
                })
            }

            const excelData = await excelToJson(req.file.buffer, type);
            console.log(excelData)
            if (excelData.length == 0) {
                return res.status(402).json({
                    message: "Excel formatting is incorrect"
                });
            }
            
            let rowCreated = 0;
            let rowUpdated = 0;

            // type = 0: Archivo de estudiantes, type = 1: Archivo de establecimientos
            // type = 2: Archivo de practicas , type = 3: Archivo de asignaturas
            if (type == 0) {
                for (let row of excelData) {
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
            }
            else if (type == 1) {
                for (const row of excelData) {
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
                for (const row of excelData) {
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
                            code: row.study_plan
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
            }

            const commit = await t.commit();

            return res.status(200).json({
                message: "Data was loaded successfully",
                rowCreated: rowCreated,
                rowUpdated: rowUpdated
            });

        } catch (error) {
            const rollback = await t.rollback();
            console.error(error);
            return res.status(500).json({
                msg: "Hable con el administrador",
                error 
            });
        }
    }

    static async index(req: Request, res: Response){
        try {
            
        } catch (error) {
            
        }
    }
}