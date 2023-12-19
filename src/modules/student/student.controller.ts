import { Request, Response } from "../../interfaces/express.interfaces";
import { Career, EthnicGroup, StudyPlan, User } from "../../app/app.associatios";
import { lazyTable } from "../../helpers";
import sequelize from "../../configs/config"

export default class StudentModule {
    constructor() {}

    static async studentByCoordinator(req: Request, res: Response) {
        try {
            const userId = 2;

            //Obtener los datos de la carrera del coordinador
            const career = await Career.findOne({
                where: {
                    user_id: userId
                }
            })
            //Validar que el coordinador tenga una carrera
            if (!career) {
                return res.status(401).json({
                    message: "Coordinator's career not found"
                });
            }

            let opts = lazyTable(req.body);
            opts.include = [
                {
                    model: EthnicGroup,
                    as: "ethnicGroup"
                },
                {
                    model: StudyPlan,
                    as: "studyPlan"
                },
                {
                    model: Career,
                    as: "careerStudent",
                    where: {
                        id: career.id
                    }
                }
            ]

            const students = await User.findAndCountAll(opts);

            return res.status(200).json({
                message: "Successfuly query",
                response: {
                  count: students.count,
                  rows: students.rows
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
            const { id } = req.params;

            const student = await User.findByPk(id, {
                include: [
                    {
                        model: EthnicGroup,
                        as: "ethnicGroup"
                    },
                    {
                        model: StudyPlan,
                        as: "studyPlan"
                    },
                    {
                        model: Career,
                        as: "careerStudent",
                    }
                ]
            })

            if (!student) {
                return res.status(401).json({
                    msg: "The id does not exist"
                })
            }

            return res.status(200).json({
                msg: "Successfuly query",
                response: student
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