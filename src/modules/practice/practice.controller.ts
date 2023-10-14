//Helpers
import { errorHandler, excelToJson, lazyTable } from "../../helpers";
//Interfaces
import { IUser, IExcel, Request, Response } from "../../interfaces";

import {
  Career,
  Establishment,
  Practice,
  Subject,
  User,
} from "../../app/app.associatios";

export class PracticeModule {
  constructor() {}

  static async view(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // 
      const queryResult = await Practice.findByPk(id, {
        include: [
          {
            model: Establishment,
            as: "establishment",
          },
          {
            model: User,
            as: "estudent",
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
            as: "workshopteacher"
          },
        ],
      });
      
      return res.status(200).json({
        status: true,
        message: "Seccessful query",
        response: queryResult
      })
    } catch (error) {
      errorHandler(res, error)
    }
  }

  static async update(req: Request, res: Response) {

    try {
      
      const { id } = req.params;
      const data = req.body;
      console.log("--------------------------")
      console.log(data);
      const practice = await Practice.findByPk(id);

      //Crear profesor colaborador y asociar a practica
      if(data.taller) {
        const workshopTeacher: any = await User.create(data.taller);
        console.log(workshopTeacher);
        await practice?.update({ workshop_teacher_id: workshopTeacher.id })
      }
      //Crear profesor de taller y asociar a practica
      if(data.colaborador) {
        const collaboratingTeacher: any = await User.create(data.colaborador);
        await practice?.update({ collaborating_teacher_id: collaboratingTeacher.id })
      }

      return res.status(200).json({
        status: true,
        message: "Successfully updated data"
      })

    } catch (error) {
      errorHandler(res, error);
    }

  }


  static async practicesByCareerId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      let opts = lazyTable(req.body);
      opts.include = [
          {
            model: Practice,
            as: "practices",
            attributes: [
              "id"
            ],
            include: [
              {
                model: Subject,
                as: "subject",
                attributes: [
                  "id",
                  "name",
                  "practice_number"
                ]
              },
              {
                model: User,
                as: "stundent",
                attributes: [
                  "id",
                  "name",
                  "pat_last_name",
                  "mat_last_name",
                  "rut",
                  "check_digit"
                ]
              }
            ]
          }
      ];

      if(opts.where) {
          opts.where.career_id = id;
      } else {
          opts.where = {
              career_id : id
          };
      }
      
      const careerPracticesData = await Practice.findAll(opts);
      const countPractices = await Practice.count(opts);
      const career = await Career.findByPk(id, { attributes: ["name"] });
      
      if(careerPracticesData.length === 0){
          return res.status(404).json({
              message: "No data found",
              response: []
          })
      }
      console.log(careerPracticesData)
      return res.status(200).json({
          message: "Successfuly query",
          response: {
              practices: careerPracticesData,
              count: countPractices,
              career: career}
      });
    } catch (error) {
      errorHandler(res,error);
    }
  }

  static async practicesByCordinatorId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      console.log(id)
      
      const practices = await Career.findOne({
        where: {
          user_id: id
        },
        include: [
          {
            model: Practice,
            as: "practices",
            include: [
              {
                model: Subject,
                as: "subject"
              },
              {
                model: User,
                as: "student"
              },
              {
                model: Establishment,
                as: "establishment"
              }

            ]
          }
        ]
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
