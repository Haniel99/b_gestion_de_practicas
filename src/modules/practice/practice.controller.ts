//Helpers
import { errorHandler, excelToJson } from "../../helpers";
//Interfaces
import { IUser, IExcel, Request, Response } from "../../interfaces";

import {
  Department,
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
      const excelData = await excelToJson(req.file.buffer);
      let practices: IUser[] = [];
      excelData.data.forEach((element: IExcel) => {
         
      });

      const queryResult = await Practice.bulkCreate([]);

      return res.status(200).json({
        status: true,
        message: "file saved successfully",
        response: excelData,
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
            model: Department,
            as: "department",
          },
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
}
