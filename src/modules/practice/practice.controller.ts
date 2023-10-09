//Helpers
import { errorHandler, excelToJson } from "../../helpers";
//Interfaces
import { IUser, IExcel, Request, Response } from "../../interfaces";

import {
  Establishment,
  Practice,
  User,
} from "../../app/app.associatios";

export class PracticeModule {
  constructor() {}

  static async loadData(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: false,
          message: "No file received",
        });
      }
      //const excelData = await excelToJson(req.file.buffer);
      /* let practices: IUser[] = [];
      excelData.data.forEach((element: IExcel) => {
         
      });

      const queryResult = await Practice.bulkCreate([]); */

      return res.status(200).json({
        status: true,
        message: "file saved successfully",
        //response: excelData,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  }

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

  static async excelPracticesData(req: Request, res: Response) {
    try {
      
    } catch (error) {
      
    }
  }

}
