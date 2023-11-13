import { errorHandler, excelToJson, lazyTable } from "../../helpers";
import { IUser, Request, Response } from "../../interfaces";
import { Career, Establishment, Practice, StudyPlan, Subject, UploadHistory, User, Commune, EducationalBranch, EstablishmentBranch, Payment } from "../../app/app.associatios";
import sequelize from "../../configs/config"
import ExcelJS from "exceljs";
const { Op } = require('sequelize');
import { IStudyPlan } from "../../interfaces/IModules/study_plan.interface";

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
            opts.order = [
                ['upload_date', 'DESC']
            ]

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

    static async loadStundents(req: Request, res: Response){

        const t = await sequelize.transaction();

        try {
            const { type, name } = req.body;

            if (!req.file) {
                return res.status(400).json({
                    message: "No file received"
                })
            }

            if (type != 0) {
                return res.status(400).json({
                    message: "Incorrect file type"
                })
            }

            const excelData: any = await excelToJson(req.file.buffer, type);
            if (excelData.length == 0) {
                return res.status(400).json({
                    message: "Excel formatting is incorrect"
                });
            }

            let rowCreated = 0;
            let rowUpdated = 0;
            
            for (let row of excelData.data) {
                const student: any = await User.findOne({
                    where: {
                        rut: row.rut
                    },
                    transaction: t
                });

                const studyPlan: any = await StudyPlan.findOne({
                    where: {
                        code: row.study_plan
                    },
                    transaction: t
                });

                if (!studyPlan) {
                    throw new Error(`Unknown study plan code: ${row.study_plan}` );
                }

                const studentData = {
                    ...row,
                    study_plan_id: studyPlan.id
                }

                // Crear estudiante (si el rut no existe en la bd)
                if (!student) {
                    await User.create(studentData, { transaction: t });
                    rowCreated++;
                } else {// Actualizar datos del estudiante (si el rut existe en la bd)
                    await student.update(studentData, { transaction: t })
                    rowUpdated++;
                }
            }

            const fileData = {
                name: name,
                upload_date: new Date(),
                file: req.file,
                number_rows: rowCreated + rowUpdated,
                file_type: "Estudiantes",
                user_id: 4 //Cambiar por el usuario que inicio sesion
            };
            await UploadHistory.create(fileData, { transaction: t })

            await t.commit();

            return res.status(200).json({
                message: "Data was loaded successfully",
                rowCreated: rowCreated,
                rowUpdated: rowUpdated,
                total: rowCreated + rowUpdated
            });
            
        } catch (error: any) {
            await t.rollback();
            console.error(error);
            return res.status(500).json({
                msg: "Error en el servidor, comuniquese con el administrador",
                error: error.message
            });
        }
    }

    static async loadEstablishment(req: Request, res: Response){
        
        const t = await sequelize.transaction();

        try {
            const { type, name } = req.body;

            if (!req.file) {
                return res.status(400).json({
                    message: "No file received"
                })
            }

            if (type != 1) {
                return res.status(400).json({
                    message: "Incorrect file type"
                })
            }

            const excelData: any = await excelToJson(req.file.buffer, type);
            if (excelData.length == 0) {
                return res.status(400).json({
                    message: "Excel formatting is incorrect"
                });
            }

            let rowCreated = 0;
            let rowUpdated = 0;
            let codeOld = "";
            
            for (let row of excelData.data) {
                if (row.code_region == 15) {
                    const commune: any = await Commune.findOne({
                        where: {
                            code: row.code_commune
                        },
                        transaction: t
                    })
                    if (!commune) {
                        throw new Error(`Unknown commune code: ${row.code_commune}`);
                    }

                    let establishment: any = await Establishment.findOne({
                        where: {
                            code: row.code_establishment
                        },
                        transaction: t
                    })

                    //console.log(row.address)
                    const establishmentData = {
                        name: row.name,
                        code: row.code_establishment,
                        address: row.address,
                        phone: row.phone,
                        fax: row.fax,
                        email: row.email,
                        dependence: row.dependence,
                        commune_id: commune.id
                    }

                    // Crear establecimiento (si el codigo no existe en la bd)
                    if (!establishment) {
                        establishment = await Establishment.create(establishmentData, { transaction: t });
                        rowCreated++;
                    } else { // Actualizar establecimiento (si el codigo existe en la bd)
                        await establishment.update(establishmentData, { transaction: t })
                        rowUpdated++
                    }

                    const establishmentBranchs: any = await EstablishmentBranch.count({
                        where: {
                            establishment_id: establishment.id
                        },
                        transaction: t
                    })

                    const educational_branch: any = await EducationalBranch.findOne({
                        where: {
                            code: row.educational_branch
                        },
                        transaction: t
                    })

                    if (!educational_branch) {
                        throw new Error(`Unknown educational branch code: ${row.educational_branch}`);
                    }
                    
                    //console.log(establishment.code, " ---- ", educational_branch.code, " id:", educational_branch.id)
                    // Primera iteracion de un establecimiento
                    if (establishmentBranchs != 0 && establishment.code != codeOld) {
                        // Borrar ramas educacionales del establecimiento
                        await EstablishmentBranch.destroy({
                            where: {
                                establishment_id: establishment.id
                            },
                            transaction: t
                        })
                        // Agregar las ramas educacionales actuales
                        await EstablishmentBranch.create({
                            establishment_id: establishment.id, 
                            educational_branch_id: educational_branch.id
                        },
                        { transaction: t })
                        
                        codeOld = establishment.code;
                    } else {
                        const branch: any = await EstablishmentBranch.count({
                            where: {
                                establishment_id: establishment.id, 
                                educational_branch_id: educational_branch.id
                            },
                            transaction: t
                        })

                        if (branch == 0) {
                            // Agregar las ramas educacionales actuales
                            await EstablishmentBranch.create({
                                establishment_id: establishment.id, 
                                educational_branch_id: educational_branch.id
                            },
                            { transaction: t })
                            codeOld = establishment.code;
                        }
                    }
                }
            }

            const fileData = {
                name: name,
                upload_date: new Date(),
                file: req.file,
                number_rows: rowCreated + rowUpdated,
                file_type: "Establecimientos",
                user_id: 4 //Cambiar por el usuario que inicio sesion
            };
            await UploadHistory.create(fileData, { transaction: t })

            const commit = await t.commit();

            return res.status(200).json({
                message: "Data was loaded successfully",
                rowCreated: rowCreated,
                rowUpdated: rowUpdated,
                total: rowCreated + rowUpdated
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

    static async loadPractices(req: Request, res: Response){

        const t = await sequelize.transaction();
        
        try {
            const { type, name } = req.body;

            if (!req.file) {
                return res.status(400).json({
                    message: "No file received"
                })
            }

            if (type != 2) {
                return res.status(400).json({
                    message: "Incorrect file type"
                })
            }

            const excelData: any = await excelToJson(req.file.buffer, type);
            if (excelData.length == 0) {
                return res.status(400).json({
                    message: "Excel formatting is incorrect"
                });
            }

            let rowCreated = 0;
            let rowUpdated = 0;
            
            for (let row of excelData.data) {
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
                if (!studyPlan) {
                    throw new Error(`Unknown study plan code: ${row.code_study_plan}`);
                }

                const studentData = {
                    name: row.name_student,
                    pat_last_name: row.pat_last_name_student,
                    mat_last_name: row.mat_last_name_student,
                    rut: row.rut_student,
                    check_digit: row.check_digit_student,
                    study_plan: studyPlan.id
                }
                // Crear estudiante (si el rut no existe en la bd)
                if (!student) {
                    student = await User.create(studentData, { transaction: t });
                } else { // Actualizar estudiante (si el rut existe en la bd)
                    await student.update(studentData, { transaction: t })
                }

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
                // Crear supervisor (si el rut no existe en la bd)
                if (!supervisor) {
                    supervisor = await User.create(supervisorData, { transaction: t });
                } else { // Actualizar supervisor (si el rut existe en la bd)
                    await supervisor.update(supervisorData, { transaction: t })
                }

                const establishment: any = await Establishment.findOne({
                    where: {
                        code: row.code_establishment
                    },
                    transaction: t
                });
                if (!establishment) {
                    throw new Error(`Unknown establishment code: ${row.code_establishment}`);
                }

                const subject: any = await Subject.findOne({
                    where: {
                        code: row.code_subject
                    },
                    include: [
                        {
                            model: StudyPlan,
                            as: "studyPlan",
                        }
                    ],
                    transaction: t
                });

                if (!subject) {
                    throw new Error(`Unknown subject code: ${row.code_subject}`);
                }

                const practice: any = await Practice.findOne({
                    where: {
                        code: row.code_practice
                    },
                    transaction: t
                });

                // Conversion de fechas
                if (row.start_date) {
                    row.start_date = row.start_date.toISOString().split('T')[0];
                }
                if (row.end_date) {
                    row.end_date = row.end_date.toISOString().split('T')[0];
                }
                
                const practiceData = {
                    code: row.code_practice,
                    status: row.status,
                    start_date: row.start_date,
                    end_date: row.end_date,
                    career_id: subject.studyPlan.career_id,
                    student_id: student.id,
                    supervisor_id: supervisor.id,
                    establishment_id: establishment.id,
                    subject_id: subject.id
                };
                // Crear practica (si el codigo no existe en la bd)
                if (!practice) {
                    await Practice.create(practiceData, { transaction: t });
                    rowCreated++;
                } else { // Actualizar practica (si el codigo existe en la bd)
                    await practice.update(practiceData, { transaction: t });
                    rowUpdated++
                }
            }

            const fileData = {
                name: name,
                upload_date: new Date(),
                file: req.file,
                number_rows: rowCreated + rowUpdated,
                file_type: "Practicas",
                user_id: 4 //Cambiar por el usuario que inicio sesion
            };
            await UploadHistory.create(fileData, { transaction: t })

            const commit = await t.commit();

            return res.status(200).json({
                message: "Data was loaded successfully",
                rowCreated: rowCreated,
                rowUpdated: rowUpdated,
                total: rowCreated + rowUpdated
            });

        } catch (error:any) {
            const rollback = await t.rollback();
            console.error(error);
            return res.status(500).json({
                msg: "Error en el servidor, comuniquese con el administrador",
                error: error.message
            });
        }

    }

    static async loadSubjects(req: Request, res: Response){

        const t = await sequelize.transaction();

        try {
            const { type, name } = req.body;

            if (!req.file) {
                return res.status(400).json({
                    message: "No file received"
                })
            }

            if (type != 3) {
                return res.status(400).json({
                    message: "Incorrect file type"
                })
            }

            const excelData: any = await excelToJson(req.file.buffer, type);
            if (excelData.length == 0) {
                return res.status(400).json({
                    message: "Excel formatting is incorrect"
                });
            }

            let rowCreated = 0;
            let rowUpdated = 0;
            
            for (let row of excelData.data) {
                const studyPlan: any = await StudyPlan.findOne({
                    where: {
                        code: row.code_study_plan
                    },
                    transaction: t
                });

                if (!studyPlan) {
                    throw new Error(`Unknown study plan code: ${row.code_study_plan}`);
                }

                // Conversion de fechas
                if (row.start_date) {
                    row.start_date = row.start_date.toISOString().split('T')[0];
                }
                if (row.end_date) {
                    row.end_date = row.end_date.toISOString().split('T')[0];
                }

                const subjectData = {
                    name: row.name,
                    code: row.code_subject,
                    description: row.description,
                    type: row.type,
                    practice_number: row.practice_number,
                    total_hours: row.total_hours,
                    start_date: row.start_date,
                    end_date: row.end_date,
                    study_plan_id: studyPlan.id
                };

                const subject = await Subject.findOne({
                    where: {
                        code: row.code_subject
                    },
                    transaction: t
                });

                // Crear asignatira (si el codigo no existe en la bd)
                if (!subject) {
                    await Subject.create(subjectData, { transaction: t });
                    rowCreated++;
                } else {// Actualizar datos de la asignatura (si el codigo existe en la bd)
                    await subject.update(subjectData, { transaction: t });
                    rowUpdated++;
                }

            }

            const fileData = {
                name: name,
                upload_date: new Date(),
                file: req.file,
                number_rows: rowCreated + rowUpdated,
                file_type: "Asignaturas",
                user_id: 4 //Cambiar por el usuario que inicio sesion
            };
            await UploadHistory.create(fileData, { transaction: t })

            const commit = await t.commit();

            return res.status(200).json({
                message: "Data was loaded successfully",
                rowCreated: rowCreated,
                rowUpdated: rowUpdated,
                total: rowCreated + rowUpdated
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