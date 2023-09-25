import { errorHandler, excelToJson } from "../../helpers";
import { Request, Response } from "../../interfaces/express.interfaces";
import {
  Department,
  Establishment,
  Practice,
  User,
} from "../../app/app.associatios";
import { IUser } from "../../interfaces/IModules/user.interface";
export class PracticeModule {
  constructor() {}

  static async loadData(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: false,
          message: "No se recibio ningun archivo",
        });
      }
      const excelData = await excelToJson(req.file.buffer);
      let practices: any = [];
      excelData.data.forEach((element: any) => {
        //Construir arregle de las practicas
      });

      const queryResult = await Practice.bulkCreate([]);

      return res.status(200).json({
        status: true,
        message: "El archivo se resivio exitosamente",
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
