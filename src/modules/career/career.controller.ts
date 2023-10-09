import { errorHandler, lazyTable } from "../../helpers";
import { Request, Response } from "../../interfaces";
import { Career, Establishment, Practice, User } from "../../app/app.associatios";
import sequelize from "sequelize";
export class CareerModule  {
    constructor(){}

    static async index(req: Request, res: Response){
        try {
            const prueba = await User.findAll();
            console.log("aprobadooooooooooooooooooooooooooooooooooo")
            const carrerData = await Career.findAll({
                attributes: {
                    include: [
                        [sequelize.fn("COUNT", sequelize.col("practices.id")), "total_practices"]
                    ]
                },
                include: [
                    {
                        model: Practice,
                        as: "practices",
                        attributes: []
                    },
                    {
                        model: User,
                        as: "coordinator",
                        attributes: [
                            "name",
                            "last_name"
                        ]
                    }
                ],
                group: [
                    "Career.id"
                ]
            });

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
            let options = lazyTable(req.body);
            console.log('------------------------------------')
            console.log(req.body)
            console.log(id)
            options.include = [
                {
                    model: User,
                    as: "student",
                    attributes: [
                        "id",
                        "name",
                        "last_name",
                        "rut"
                    ]
                },
                {
                    model: Establishment,
                    as: "establishment",
                    attributes: [
                        "id",
                        "name"
                    ]
                }
            ];

            if(options.where) {
                options.where.career_id = id;
            } else {
                options.where = {
                    career_id : id
                };
            }
            
            const careerPracticesData = await Practice.findAll(options);
            const countPractices = await Practice.count(options);
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
}