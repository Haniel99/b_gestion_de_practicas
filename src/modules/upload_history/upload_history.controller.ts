import { errorHandler, excelToJson, lazyTable } from "../../helpers";
import { Request, Response } from "../../interfaces";
import { Career, Establishment, Practice, User } from "../../app/app.associatios";
import sequelize from "sequelize";

export class UploadHistoryModule  {
    constructor(){}

    static async loadData(req: Request, res: Response){
        try {
            const { type } = req.body; 

            if (!req.file) {
                return res.status(400).json({
                    message: "No file received"
                })
            }

            const excelData = await excelToJson(req.file.buffer, type);
            let counter = 0;
            
            if (type == 0) {
                for (const element of excelData) {
                    const student: any = await User.findOne({
                        where: {
                            rut: element.rut
                        }
                    });
                    if (!student) {
                        await User.create(element);
                        counter++;
                    }   
                };
            }
            else if (type == 1) {
                for (const element of excelData) {
                    const establishment: any = await Establishment.findOne({
                        where: {
                            code: element.code
                        }
                    });
                    if (!establishment) {
                        await Establishment.create(element);
                        counter++;
                    } else {
                        await Establishment.update(establishment.id, element);
                    }
                };             
            } else {
                
            }

            return res.status(200).json({
                message: "Data was loaded successfully",
                rowCreated: counter
            });


        } catch (error) {
            
        }
    }

    static async index(req: Request, res: Response){
        try {
            
        } catch (error) {
            
        }
    }
}