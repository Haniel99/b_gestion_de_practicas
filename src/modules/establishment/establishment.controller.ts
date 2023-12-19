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

        const establishment = await Establishment.findByPk(id, {
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

  static async createUser(req: Request, res: Response) {
    try {
        const id = req.params.id;
        let data = req.body;
        data = {
            ...data,
            establishmen_id: id
        }
        const user = await UserEstablishment.create(data);

        return res.status(200).json({
            message: "Successfully registered user",
        })
        

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            msg: "Error en el servidor, comuniquese con el administrador",
            error: error.message,
        });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
        const id = req.params.id;
        let data = req.body;

        const user = await UserEstablishment.update(data, {
            where: {
                id: id
            }
        });

        return res.status(200).json({
            message: "Successfully updated user",
        })
        

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            msg: "Error en el servidor, comuniquese con el administrador",
            error: error.message,
        });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
        const id = req.params.id;

        const user = await UserEstablishment.destroy({
            where: {
                id: id
            }
        });

        return res.status(200).json({
            message: "Successfully deleted user",
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
