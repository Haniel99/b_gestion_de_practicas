import { errorHandler, excelToJson, lazyTable } from "../../helpers";
import { IUser, Request, Response } from "../../interfaces";
import { Career, Establishment, Practice, StudyPlan, Subject, UploadHistory, User, Commune, EducationalBranch, Payment, EthnicGroup, SubjectInStudyPlan } from "../../app/app.associatios";
import sequelize from "../../configs/config"
import ExcelJS from "exceljs";
const { Op } = require('sequelize');
import { IStudyPlan } from "../../interfaces/IModules/study_plan.interface";
import formatPhone from "../../helpers/formattophone";

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
                //Validar que la carrera existe
                const career = await Career.findOne({
                    where: {
                        code: row.code_career
                    },
                    transaction: t
                })
                if (!career) {
                    throw new Error(`Unknown career code: ${row.code_career}` );
                }

                //Validar que el plan de estudio existe
                const studyPlan: any = await StudyPlan.findOne({
                    where: {
                        code: row.code_study_plan
                    },
                    transaction: t
                });
                if (!studyPlan) {
                    throw new Error(`Unknown study plan code: ${row.code_study_plan}` );
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
                        rut: row.rut_student
                    },
                    transaction: t
                });

                //Obtener los datos del excel del estudiante
                const studentData = {
                    name: row.name_student,
                    pat_last_name: row.pat_last_name_student,
                    mat_last_name: row.mat_last_name_student,
                    rut: row.rut_student,
                    check_digit: row.check_digit_student,
                    phone: formatPhone(row.phone_student),
                    address: row.address_student,
                    email: row.email_student,
                    social_name: row.social_name_student,
                    sex: row.sex_student,
                    study_plan_id: studyPlan.id,
                    ethnic_group_id: ethnicGroup.id,
                    career_id: career.id
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
            
            for (let row of excelData.data) {
                let career = await Career.findOne({
                    where: {
                        code: row.code_career
                    }
                })
                if(!career) {
                    throw new Error(`Career not exist: ${row.code_career}`);
                }

                let student: any = await User.findOne({
                    where: {
                        rut: row.rut_student,
                        study_plan_id: { //Tipo estudiante
                            [Op.ne]: null
                        }
                    },
                    transaction: t
                });
                if (!student) {
                    throw new Error(`Rut not exist: ${row.rut_student}`);
                }

                const subject: any = await Subject.findOne({
                    where: {
                        code: row.code_subject
                    },
                    transaction: t
                });

                if (!subject) {
                    throw new Error(`Unknown subject code: ${row.code_subject}`);
                }

                const practiceData = {
                    student_id: student.id,
                    subject_id: subject.id,
                    career_id: career.id
                };

                //Registrar practica
                const practice = await Practice.create(practiceData, { transaction: t })
                rowCreated++;
            }

            const fileData = {
                name: name,
                upload_date: new Date(),
                file: req.file,
                number_rows: rowCreated,
                file_type: "Practicas",
                user_id: 1 //Cambiar por el usuario que inicio sesion
            };
            await UploadHistory.create(fileData, { transaction: t })

            const commit = await t.commit();

            return res.status(200).json({
                message: "Data was loaded successfully",
                rowCreated: rowCreated,
                total: rowCreated
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
            let listSubject = [];
            
            for (let row of excelData.data) {
                //REGISTRAR - ASIGNATURA
                //Validar que exista el plan de estudio
                const studyPlan = await StudyPlan.findOne({
                    where: {
                        code: row.code_study_plan
                    },
                    transaction: t
                });
                if (!studyPlan) {
                    throw new Error(`Unknown study plan code: ${row.code_study_plan}`);
                }

                //Validar que no exista la asignatura
                let subject: any = await Subject.findOne({
                    where: {
                        code: row.code_subject
                    },
                    transaction: t
                });
                //Obtener los datos de la asignatura desde el excel
                const subjectData = {
                    name: row.name_subject,
                    code: row.code_subject,
                    total_hours: row.hours_subject
                }
                //Registrar asignatura en caso de que no exista
                if (!subject) {
                    subject = await Subject.create(subjectData, { transaction: t });
                    //Crear relacion con plan de estudio
                    await subject.addStudyPlan(studyPlan, { transaction: t });
                    rowCreated++
                } else {//Actualizar datos en caso de que si exista
                    await subject.update(subjectData, { transaction: t });
                    //Verificar si la relacion con el plan de estudio ya esta creada
                    const subjectTableIntermedia = await SubjectInStudyPlan.findOne({
                        where: {
                            study_plan_id: studyPlan.id,
                            subject_id: subject.id
                        }
                    })
                    //Registrar relacion en caso de que no exista
                    if (!subjectTableIntermedia) {
                        await subject.addStudyPlan(studyPlan, { transaction: t });
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
                file_type: "Asignaturas",
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