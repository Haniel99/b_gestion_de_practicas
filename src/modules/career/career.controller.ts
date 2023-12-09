import { errorHandler, lazyTable } from "../../helpers";
import { Request, Response } from "../../interfaces";
import {
  Career,
  Establishment,
  Practice,
  StudyPlan,
  User,
} from "../../app/app.associatios";
import sequelize from "sequelize";

export class CareerModule {
  constructor() {}

  static async index(req: Request, res: Response) {
    try {
      const opts = lazyTable(req.body);

      opts.attributes = {
        include: [
          [
            sequelize.literal(
              "(SELECT COUNT(*) FROM practice WHERE practice.career_id = career.id)"
            ),
            "practicesCount",
          ],
        ],
      };
      opts.include = [
        {
          model: Practice,
          as: "practices",
          attributes: [],
        },
        {
          model: User,
          as: "coordinator",
          attributes: ["name", "pat_last_name", "mat_last_name"],
        },
      ];
      opts.distinct = true;

      const careers = await Career.findAndCountAll(opts);

      if (!careers.rows) {
        return res.status(404).json({
          message: "No data found",
        });
      }

      return res.status(200).json({
        message: "Data was loaded successfully",
        response: careers,
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        msg: "Error en el servidor, comuniquese con el administrador",
        error: error.message,
      });
    }
  }
  static async getIndex(req: Request, res: Response){
    try {
      const career = await Career.findAll();
      return res.json({
        response: career
      });
    } catch (error) {
      errorHandler(res);
    }
  }
}
