import { errorHandler, excelToJson, lazyTable } from "../../helpers";
import { IUser, Request, Response } from "../../interfaces";
import { Career, Establishment, Practice, StudyPlan, Subject, UploadHistory, User, Commune, EducationalBranch, Payment, EthnicGroup } from "../../app/app.associatios";
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

    static async loadStudents(req: Request, res: Response){

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
            
            for (let row of excelData.data) {
                //Validar que el plan de estudio existe
                const studyPlan: any = await StudyPlan.findOne({
                    where: {
                        code: row.code_study_plan
                    },
                    transaction: t
                });
                if (!studyPlan) {
                    throw new Error(`Unknown study plan code: ${row.study_plan}` );
                }
                //REGISTRAR - ETNIA
                //Validar que el grupo etnico exista
                let ethnicGroup: any = await EthnicGroup.findOne({
                    where: {
                        code: row.code_ethnic
                    },
                    transaction: t
                })
                //Obtener datos del excel del grupo etnico
                const ethnicGroupData = {
                    code: row.code_ethnic,
                    name: row.name_ethnic
                }
                //Registrar grupo etnico en caso de que no exista
                if (!ethnicGroup) {
                    ethnicGroup = await EthnicGroup.create(ethnicGroupData, { transaction: t });
                } else { //Actualizar datos del grupo etnico en caso de que si exista
                    ethnicGroup.update(ethnicGroupData, { transaction: t });
                }
                
                //REGISTRAR - ESTUDIANTE
                //Validar que el estudiante no existe
                const student: any = await User.findOne({
                    where: {
                        rut: row.rut
                    },
                    transaction: t
                });

                //Obtener los datos del excel del estudiante
                const studentData = {
                    name: row.name_student,
                    pat_last_name: row.pat_last_name_student,
                    mat_lat_name: row.mat_last_name_student,
                    rut: row.rut_student,
                    check_digit: row.check_digit_student,
                    phone: row.phone_student,
                    address: row.address_student,
                    email: row.email_student,
                    social_name: row.social_name,
                    sex: row.sex_student,
                    study_plan_id: studyPlan.id,
                    ethnic_group: ethnicGroup.id
                }
                //Registrar estudiante en caso de que no exista
                if (!student) {
                    const studentCreated = await User.create(studentData, { transaction: t });
                    rowCreated++;
                } else {// Actualizar datos del estudiante en caso de que si exista
                    await student.update(studentData, { transaction: t })
                }
            }
            
            //REGISTRAR - ARCHIVO IMPORTADO
            //Obtener datos del archivo
            const fileData = {
                name: name,
                upload_date: new Date(),
                file: req.file,
                number_rows: excelData.numberRows,
                file_type: "Estudiantes",
                user_id: 1 //Cambiar por el usuario que inicio sesion
            };
            //Registrar archivo importado
            const file = await UploadHistory.create(fileData, { transaction: t });
            //Guardar estado
            const commit = await t.commit();


            return res.status(200).json({
                message: "Data was loaded successfully",
                rowCreated: rowCreated,
                total: excelData.numberRows,
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
            let lastEstablishment = null;
            let listCodesEstablishment : number[] = [];
            
            for (let row of excelData.data) {
                if (row.code_region == 15) {
                    //REGISTRAR - ESTABLECIMIENTO
                    //Validar que exista la comuna
                    const commune: any = await Commune.findOne({
                        where: {
                            code: row.code_commune
                        },
                        transaction: t
                    })
                    if (!commune) {
                        throw new Error(`Unknown commune code: ${row.code_commune}`);
                    }
                    //Validar que el establecimiento no existe
                    let establishment: any = await Establishment.findOne({
                        where: {
                            code: row.code_establishment
                        },
                        transaction: t
                    })
                    //Obtener los datos del establecimiento desde el excel
                    const establishmentData = {
                        code: row.code_establishment,
                        name: row.name_establishment,
                        address: row.address_establishment,
                        phone: row.phone_establishment,
                        fax: row.fax_establishment,
                        email: row.email_establishment,
                        dependence: row.dependence_establishment,
                        commune_id: commune.id
                    }
                    //Registrar establecimiento en caso de que no exista
                    if (!establishment) {
                        establishment = await Establishment.create(establishmentData, { transaction: t });
                        rowCreated++;
                    } else { // Actualizar datos del establecimiento en caso de que si exista
                        //Validar si el establecimiento ya fue actualizado anteriormente
                        if (row.code_establishment != lastEstablishment) {
                            await establishment.update(establishmentData, { transaction: t });
                            lastEstablishment = row.code_establishment;
                        }
                    }
                    
                    //REGISTRAR - RAMAS EDUCACIONALES
                    //Validar que exista la rama educacional
                    const educational_branch: any = await EducationalBranch.findOne({
                        where: {
                            code: row.code_educational_branch
                        },
                        transaction: t
                    })
                    if (!educational_branch) {
                        throw new Error(`Unknown educational branch code: ${row.educational_branch}`);
                    }
                    //Eliminar las ramas educacionales anteriores relacionadas con el establecimiento (solo una vez)
                    if (listCodesEstablishment.includes(row.code_establishment)) {
                        //Eliminar las ramas educacionales
                        await establishment.removeEducationalBranchs({ transaction: t });
                        //Registrar nueva rama eduacacional
                        await establishment.addEducationalBranch(educational_branch, { transaction: t });                        
                        listCodesEstablishment.push(row.code_establishment);
                    } else { //Si ya se eliminaron las ramas anteriores agregar la nueva rama directamente
                        await establishment.addEducationalBranch(educational_branch, { transaction: t });                        
                    }
                }
            }

            //REGISTRAR - ARCHIVO IMPORTADO
            //Obtener datos del archivo
            const fileData = {
                name: name,
                upload_date: new Date(),
                file: req.file,
                number_rows: excelData.numberRows,
                file_type: "Establecimientos",
                user_id: 1 //Cambiar por el usuario que inicio sesion
            };
            //Registrar archivo importado
            const file = await UploadHistory.create(fileData, { transaction: t });
            //Guardar estado
            const commit = await t.commit();


            return res.status(200).json({
                message: "Data was loaded successfully",
                rowCreated: rowCreated,
                total: excelData.numberRows,
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
                }

            }

            const fileData = {
                name: name,
                upload_date: new Date(),
                file: req.file,
                number_rows: rowCreated,
                file_type: "Asignaturas",
                user_id: 4 //Cambiar por el usuario que inicio sesion
            };
            await UploadHistory.create(fileData, { transaction: t })

            const commit = await t.commit();

            return res.status(200).json({
                message: "Data was loaded successfully",
                rowCreated: rowCreated,
                total: rowCreated
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

    static async loadCareers(req: Request, res: Response) {

        const t = await sequelize.transaction();

        try {
            const { type, name } = req.body;

            if (!req.file) {
                return res.status(400).json({
                    message: "No file received"
                })
            }

            if (type != 4) {
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
            let lastCareer = null;
            let lastStudyPlan = null;
            
            for (let row of excelData.data) {
                //REGISTRAR - CARRERA
                //Validar que la carrera no existe
                const career: any = await Career.findOne({
                    where: {
                        code: row.code_career
                    },
                    transaction: t
                })
                
                //Obtener los datos del excel de la carrera
                const careerData = {
                    code: row.code_career,
                    name: row.name_career,
                    sede: row.sede_career,
                }
                //Registrar carrera en caso de que no exista
                if (!career) {
                    //Registrar carrera
                    const careerCreated = await Career.create(careerData, { transaction: t });
                } else { //Actualizar datos de la carrera en caso de que si exista
                    //Validar si la carrera ya fue actualizada anteriormente
                    if (row.code_career != lastCareer) {
                        //Actualizar carrera
                        await career.update(careerData, { transaction: t });
                        lastCareer = row.code_career;
                    }
                }
                
                //REGISTRAR - PLAN DE ESTUDIO
                //Validar que no exista el plan de estudio
                const studyPlan: any = await StudyPlan.findOne({
                    where: {
                        code: row.code_study_plan
                    },
                    transaction: t
                })
                
                //Obtener los datos del excel del plan de estudio
                const studyPlanData = {
                    code: row.code_study_plan,
                    name: `Plan ${row.year_study_plan} v${row.version_study_plan}`,
                    year: row.year_study_plan,
                    version: row.version_study_plan
                }
                //Registrar plan de estudio en caso
                if (!studyPlan) {
                    //Registrar plan de estudio
                    const studyPlanCreated: any = await StudyPlan.create(studyPlanData, { transaction: t });
                    //Buscar la carrera creada
                    const careerCreated = await Career.findOne({
                        where: {
                            code: row.code_career
                        },
                        transaction: t
                    })
                    //Registrar la relacion entre carrera y el plan de estudio
                    await studyPlanCreated.addCareer(careerCreated, { transaction: t });
                    rowCreated++
                } else { //Actualizar datos del plan de estudio en caso de que si exista
                    //Validar si el plan de estudio ya fue actualizado anteriormente
                    if (row.code_study_plan != lastStudyPlan) {
                        //Actualizar plan de estudio
                        await studyPlan.update(studyPlanData, { transaction: t })
                        lastStudyPlan = row.code_study_plan;
                    }
                }
            }

            //REGISTRAR - ARCHIVO IMPORTADO
            //Obtener datos del archivo
            const fileData = {
                name: name,
                upload_date: new Date(),
                file: req.file,
                number_rows: excelData.numberRows,
                file_type: "Carreras",
                user_id: 1 //Cambiar por el usuario que inicio sesion
            };
            //Registrar archivo importado
            const file = await UploadHistory.create(fileData, { transaction: t });
            //Guardar estado
            const commit = await t.commit();


            return res.status(200).json({
                message: "Data was loaded successfully",
                rowCreated: rowCreated,
                total: excelData.numberRows,
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