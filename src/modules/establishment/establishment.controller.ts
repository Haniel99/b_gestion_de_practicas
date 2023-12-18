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

export class EstablishmentModule {
  constructor() {}

  static async index(req: Request, res: Response) {
    try {
        let opts = lazyTable(req.body);
        opts.include = [
            
        ]
    } catch (error) {
        
    }
  }
}
