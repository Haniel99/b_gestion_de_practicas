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

      console.log("aquii 1")

      const practices = await Practice.findAndCountAll(opts);

      console.log("aquii 2")

      //Filtros
      let filters: any = {};
        filters.practiceNumbers = await getFilterPracticeNumbers();
        filters.subjects = await getFilterSubjects();
        filters.establishments = await getFilterEstablishments();
        filters.studyPlans = await getFilterStudyPlans();

        console.log("aquii 3") 

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
          },

          {
            model: Subject,
            as: "subject",
          },
          {
            model: StudyPlan,
            as: "studyPlan",
          }
        ],
      });

      return res.status(200).json({
        status: true,
        message: "Seccessful query",
        response: queryResult,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  }

  /* static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      console.log("--------------------------");
      console.log(data);
      const practice = await Practice.findByPk(id);

      //Crear profesor colaborador y asociar a practica
      if (data.taller) {
        const workshopTeacher: any = await User.create(data.taller);
        console.log(workshopTeacher);
        await practice?.update({ workshop_teacher_id: workshopTeacher.id });
      }
      //Crear profesor de taller y asociar a practica
      if (data.colaborador) {
        const collaboratingTeacher: any = await User.create(data.colaborador);
        await practice?.update({
          collaborating_teacher_id: collaboratingTeacher.id,
        });
      }

      return res.status(200).json({
        status: true,
        message: "Successfully updated data",
      });
    } catch (error) {
      errorHandler(res, error);
    }
  } */

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
          attributes: [
            "name",
            "type",
            "practice_number"],
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
  }

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
      console.error(error);
      return res.status(500).json({
        msg: "Error en el servidor, comuniquese con el administrador",
        error: error.message,
      });
    }
  }
}
