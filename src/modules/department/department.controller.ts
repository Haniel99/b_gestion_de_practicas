import { errorHandler } from "../../helpers";
import { Request, Response } from "../../interfaces/express.interfaces";
import { Practice,Department,Establishment,User } from "../../app/app.associatios";
import { lazyTable } from "../../helpers";
import { IOptionesLazy } from "../../interfaces/IHelpers/lazytable.interface";

export class DepartmentModule {
  constructor() {}
    static async index(req: Request, res: Response){
        try {
            let options: IOptionesLazy = lazyTable(req.body);
            
            options.include;
            const queryResult = await Department.findOne(options);
        } catch (error) {
            errorHandler(res);
        }
    }
}
