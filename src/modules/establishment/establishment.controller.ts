import { errorHandler, lazyTable } from "../../helpers";
import { Request, Response } from "../../interfaces";
import {
  Career,
  Commune,
  EducationalBranch,
  Establishment,
  Practice,
  StudyPlan,
  User,
  UserEstablishment,
} from "../../app/app.associatios";
import sequelize from "sequelize";

export class EstablishmentModule {
  constructor() {}

  static async index(req: Request, res: Response) {
    try {
        let opts = lazyTable(req.body);
        opts.include = [
            {
                model: EducationalBranch,
                as: "educationalBranchs"
            },
            {
                model: UserEstablishment,
                as: "users"
            },
            {
                model: Commune,
                as: "commune"
            }
        ]
        const establishments = await Establishment.findAndCountAll(opts);

        return res.status(200).json({
            message: "Successfuly query",
            response: {
                count: establishments.count,
                rows: establishments.rows
              },
        })

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            msg: "Error en el servidor, comuniquese con el administrador",
            error: error.message,
        });
    }
  }

  static async view(req: Request, res: Response) {
    try {
        const id = req.params.id;

        const establishment = await Establishment.findOne({
            include: [
                {
                    model: EducationalBranch,
                    as: "educationalBranchs"
                },
                {
                    model: UserEstablishment,
                    as: "users"
                },
                {
                    model: Commune,
                    as: "commune"
                }
            ],
            where: {
                id: id
            }
        });

        if (!establishment) {
            return res.status(401).json({
                msg: "The id does not exist"
            })
        }

        return res.status(200).json({
            message: "Successfuly query",
            response: establishment
        })

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            msg: "Error en el servidor, comuniquese con el administrador",
            error: error.message,
        });
    }
  }
}
