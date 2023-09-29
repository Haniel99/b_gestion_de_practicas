import { errorHandler } from "../../helpers";
import { Request, Response } from "../../interfaces";
import { Career, Practice } from "../../app/app.associatios";
export class CareerModule  {
    constructor(){}

    static async index(req: Request, res: Response){
        try {
            const carrerData = await Career.findAll();

            let message = carrerData.length!=0?"Successfuly query": "No data found";
            
            return res.status(200).json({
                status: true,
                message: message,
                response: carrerData
            });
        } catch (error) {
            errorHandler(res, error);
        }
    }
    static async careerPractices(req: Request, res: Response){
        try {
            const { id } = req.params;
            const careerPracticesData = await Career.findAll({
                include: [
                    {
                        model: Practice,
                        as: "practices"
                    }
                ]
            })
            
            if(!careerPracticesData){
                return res.status(400).json({
                    message: "No data found",
                    response: []
                })
            }

            return res.status(200).json({
                message: "Successfuly query",
                response: careerPracticesData 
            });
        } catch (error) {
            errorHandler(res,error);
        }
    }
}