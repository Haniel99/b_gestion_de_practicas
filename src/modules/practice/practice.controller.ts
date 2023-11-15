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

export class PracticeModule {
  constructor() {}

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
            include: [
              {
                model: StudyPlan,
                as: "studyPlan",
              },
            ],
          },
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

  static async update(req: Request, res: Response) {
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
  }

  /*   where: {
          [Op.and]: [
            {
              '$practices.student.name$': {
                [Op.substring]: "a"
              }
            }
          ]
        }, */
  /* where: { [Op.and]: [ { name: { [Op.substring]: "his" } } ] }, */

  static async practicesByCareerId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      let opts = lazyTable(req.body);
      opts.attributes = ["id", "status"];
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
          attributes: ["name", "type", "practice_number"],
          include: [
            {
              model: StudyPlan,
              as: "studyPlan",
              attributes: ["year"],
            },
          ],
        },
        {
          model: Establishment,
          as: "establishment",
          attributes: ["name"],
        },
      ];

      const career: any = await Career.findByPk(id, {
        attributes: ["id", "name", "code"],
        include: [
          {
            model: StudyPlan,
            as: "studyPlans",
            attributes: [
              "name",
              "year"
            ]
          }
        ],
      });

      const subjects: any = await Subject.findAll({
        attributes: ["practice_number"],
        include: [
          {
            model: StudyPlan,
            as: "studyPlan",
            attributes: [],
            where: { career_id: id }
          }
        ],
        group: [ "practice_number" ],
        order: [
          ["practice_number", "ASC"]
        ]
      })

      if (opts.where) {
        opts.where.career_id = id;
        opts.where.status = 1;
      } else {
        opts.where = {
          career_id: id,
          status: 1,
        };
      }

      const practices = await Practice.findAndCountAll(opts);

      // Formatear planes de estudio y numeros de practicas
      let studyPlansData: any = [];
      studyPlansData = career.studyPlans.map((item: any) => (item.name))
      let numbersPracticesData: any = []
      numbersPracticesData = subjects.map((item: any) => (item.practice_number))

        


      return res.status(200).json({
        message: "Successfuly query",
        response: {
          career: {
            id: career.id,
            name: career.name,
            code: career.code
          },
          studyPlans: studyPlansData,
          numbersPractices: numbersPracticesData,
          count: practices.count,
          rows: practices.rows,
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

      console.log(id);

      const practices = await Career.findOne({
        where: {
          user_id: id,
        },
        include: [
          {
            model: Practice,
            as: "practices",
            include: [
              {
                model: Subject,
                as: "subject",
              },
              {
                model: User,
                as: "student",
              },
              {
                model: Establishment,
                as: "establishment",
              },
            ],
          },
        ],
      });

      return res.status(200).json({
        status: true,
        message: "file saved successfully",
        response: practices,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  }
}
