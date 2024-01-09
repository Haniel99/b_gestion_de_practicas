//Helpers
import { errorHandler, excelToJson, lazyTable } from "../../helpers";
//Interfaces
import { IUser, IExcel, Request, Response } from "../../interfaces";

import {
  Career,
  Establishment,
  Practice,
  StudyPlan,
  Subject,
  SubjectInStudyPlan,
  User,
} from "../../app/app.associatios";
import { Op } from "sequelize";
import { getFilterPracticeNumbers, getFilterSubjects, getFilterEstablishments, getFilterStudyPlans } from "../../helpers/getfilters";

export class PracticeModule {
  constructor() {}

  static async index(req: Request, res: Response) {
    try {
      let opts = lazyTable(req.body);
      opts.include = [
        {
          model: User,
          as: "student",
          attributes: [
            "name",
            "pat_last_name",
            "mat_last_name",
            "rut",
            "check_digit",
          ],
        },
        {
          model: Subject,
          as: "subject",
          attributes: [
            "code",
            "name",
            "type",
            "practice_number"],
        },
        {
          model: StudyPlan,
          as: "studyPlan",
          attributes: [
            "code",
            "name",
            "year",
            "version"
          ]
        },
        {
          model: Establishment,
          as: "establishment",
          attributes: [
            "code",
            "name"
          ],
        },
      ];

      const practices = await Practice.findAndCountAll(opts);

      //Filtros
      let filters: any = {};
        filters.practiceNumbers = await getFilterPracticeNumbers();
        filters.subjects = await getFilterSubjects();
        filters.establishments = await getFilterEstablishments();
        filters.studyPlans = await getFilterStudyPlans();

      return res.status(200).json({
        message: "Successfuly query",
        response: {
          filters: filters,
          count: practices.count,
          rows: practices.rows
        },
      })

    } catch (error:any) {
      console.error(error);
      return res.status(500).json({
        msg: "Error en el servidor, comuniquese con el administrador",
        error: error.message,
      });
    }
  };

  static async view(req: Request, res: Response) {
    try {
      const { id } = req.params;
      //
      const queryResult: any = await Practice.findByPk(id, {
        include: [
          {
            model: User,
            as: "student",
            attributes: [
              "name",
              "pat_last_name",
              "mat_last_name",
              "rut",
              "phone",
              "address",
              "email",
            ],
            include: [
              {
                model: StudyPlan,
                as: "studyPlan",
              },
            ],
          },
          {
            model: User,
            as: "supervisor",
          },
          {
            model: User,
            as: "collaboratingTeacher",
          },
          {
            model: User,
            as: "workshopteacher",
          },
          {
            model: Establishment,
            as: "establishment",
            attributes: ["name", "code", "address", "phone", "email"],
          },
        ],
      });

      const practice = await Practice.findByPk(id, {
        include: [
          {
            model: Subject,
            as: "subject",
          },
          {
            model: StudyPlan,
            as: "studyPlan",
          },
        ],
      });

      let profesores = [];
      if (queryResult.supervisor) {
        profesores.push({
          type: "Profesor supervisor",
          teacherType: 1,
          data: queryResult.supervisor,
        });
      }

      if (queryResult.workshopteacher) {
        profesores.push({
          type: "Profesor de taller",
          teacherType: 2,
          data: queryResult.workshopteacher,
        });
      }

      if (queryResult.collaboratingTeacher) {
        profesores.push({
          type: "Profesor colaborador",
          teacherType: 3,
          data: queryResult.collaboratingTeacher,
        });
      }
      let establishment: any = [];
      if (queryResult.establishment) {
        establishment.push({
          type: "Datos del establecimiento",
          data: queryResult.establishment,
        });
      }
      return res.json({
        status: true,
        message: "Seccessful query",
        response: [
          [{ type: "Datos del alumno", data: queryResult.student }],
          [{ type: "Datos de practica", data: practice }],
          profesores,
          establishment,
        ],
      });
    } catch (error) {
      errorHandler(res, error);
    }
  }
  
  static async update(req: Request, res: Response) {
    try {
      const practiceId = req.params.id;
      const data = req.body;
      const usuarioId = req.user

      if (data.establishment_id) { //ACTUALIZAR - PRACTICA (ESTABLECIMIENTO)
        //Validar que el establecimiento exista
        const establishment = await Establishment.findByPk(data.establishment_id);
        if (!establishment) {
          return res.status(401).json({
            message: "There is no establishment"
          }); 
        }
        //Actualizar practica
        const practiceUpdated = await Practice.update(data, {
          where: {
            id: practiceId
          }
        })

      } else if (data.supervisor_id || data.collaborating_teacher_id || data.workshop_teacher_id) { //ACTUALIZAR - PRACTICA (PROFESOR IDS)
        //Buscar el primer elemento del objeto
        const teacherId = data[Object.keys(data)[0]];
        //Validar que el profesor pertenezca al coordinador
        const profesor = await User.findOne({
          include: [
            {
              model: Career,
              as: "careers"
            }
          ],
          where: {
            id: teacherId,
            '$careers.user_id$': usuarioId
          }
        });
        if (!profesor) {
          return res.status(401).json({
            message: "The coordinator does not have this teacher registered"
          });
        }
        //Actualizar practica
        const practiceUpdated = await Practice.update(data, {
          where: {
            id: practiceId
          }
        })
      } else {
        return res.status(401).json({
          message: "There is no data to update"
        })
      }
  

      return res.status(200).json({
        msg: "Successfully updated data",
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        msg: "Error en el servidor, comuniquese con el administrador",
        error: error.message,
      });
    }
  }

  static async practicesByCareerId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const parseId = parseInt(id);
           
      let opts = lazyTable(req.body);
      opts.attributes = [
        "id",
      ];
      opts.include = [
        {
          model: User,
          as: "student",
          attributes: [
            "name",
            "pat_last_name",
            "mat_last_name",
            "rut",
            "check_digit",
          ],
        },
        {
          model: Subject,
          as: "subject",
        },
        {
          model: StudyPlan,
          as: "studyPlan",
          attributes: [
            "name",
            "year",
            "version"
          ]
        },
        {
          model: Establishment,
          as: "establishment",
          attributes: ["name"],
        },
      ];

      //Agregar la carrera por la cual se va filtrar, junto con los filtros de opts
      opts.where = {
        ...opts.where,
        career_id: id
      }

      const practices = await Practice.findAndCountAll(opts);

      //Datos de la carrera
      const career = await Career.findByPk(id, {
        attributes: [
          "code",
          "name",
        ]
      });

      //Filtros
      const practiceNumbersFilter = await getFilterPracticeNumbers(parseId);
      const subjectsFilter = await getFilterSubjects(parseId);
      const establishmentsFilter = await getFilterEstablishments(parseId);
      const studyPlansFilter = await getFilterStudyPlans(parseId);
      
      return res.status(200).json({
        message: "Successfuly query",
        response: {
          career: career,
          filters: {
            practice_numbers: practiceNumbersFilter,
            subjects: subjectsFilter,
            establishments: establishmentsFilter,
            study_plans: studyPlansFilter
          },
          count: practices.count,
          rows: practices.rows
        },
      });

    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        msg: "Error en el servidor, comuniquese con el administrador",
        error: error.message,
      });
    }
  };

  static async practicesByCordinatorId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      console.log(req.body);

      //Datos de la carrera a la que pertenece el coordinador
      const career = await Career.findOne({
        attributes: [
          "id",
          "code",
          "name",
        ],
        where: {
          user_id: id
        }
      });
      
      let opts = lazyTable(req.body);
      opts.attributes = [
        "id",
      ];
      opts.include = [
        {
          model: User,
          as: "student",
          attributes: [
            "name",
            "pat_last_name",
            "mat_last_name",
            "rut",
            "check_digit",
          ],
        },
        {
          model: Subject,
          as: "subject",
          attributes: [
            "code",
            "name",
            "type",
            "practice_number"],
        },
        {
          model: StudyPlan,
          as: "studyPlan",
          attributes: [
            "code",
            "name",
            "year",
            "version"
          ]
        },
        {
          model: Establishment,
          as: "establishment",
          attributes: [
            "code",
            "name"
          ],
        },
      ];

      //Agregar la carrera por la cual se va filtrar, junto con los filtros de opts
      opts.where = {
        ...opts.where,
        career_id: career?.id
      }
  
      const practices = await Practice.findAndCountAll(opts);

      let filters: any = {};
      if (career?.id !== undefined) {
        //Filtros
        filters.practiceNumbers = await getFilterPracticeNumbers(career.id);
        filters.subjects = await getFilterSubjects(career.id);
        filters.establishments = await getFilterEstablishments(career.id);
        filters.studyPlans = await getFilterStudyPlans(career.id);
      }

      
      return res.status(200).json({
        message: "Successfuly query",
        response: {
          career: career,
          filters: filters,
          count: practices.count,
          rows: practices.rows
        },
      });

    } catch (error: any) {
      console.log(error)
      errorHandler(res);
    }
  }

  static async deleteEstablishment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const practice: any = await Practice.findByPk(id);
      if (!practice) {
        return res.status(400).send("Id dont exist");
      }

      practice.establishment_id = null;
      await practice.save();
      return res.status(200).json({
        msg: "Successfully updated data",
      });
    } catch (error) {
      errorHandler(res);
    }
  }

  static async deleteTeacher(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body; //Tipo de profesor
      const practice: any = await Practice.findByPk(id);
      if (!practice) {
        return res.status(400).send("Error not found");
      }

      if (data.teacherType == 1) {
        practice.supervisor_id = null;
      }

      if (data.teacherType == 2) {
        practice.workshop_teacher_id = null;
      }

      if (data.teacherType == 3) {
        practice.collaborating_teacher_id = null;
      }
      await practice.save();

      return res.status(200).json({
        msg: "Successfully updated data",
      });
    } catch (error) {
      errorHandler(res);
    }
  }


}
