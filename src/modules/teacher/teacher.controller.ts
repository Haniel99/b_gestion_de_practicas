import { Request, Response } from "../../interfaces/express.interfaces";
import { Career, User } from "../../app/app.associatios";
import { lazyTable } from "../../helpers";

export default class TeacherModule {
    constructor() {}
    static async index(req: Request, res: Response) {
        try {
            //Id del coordinador
            const id = 2

            const career = await Career.findOne({
                where: {
                    user_id: id
                }
            })

            if (!career) {
                return res.status(401).json({
                    msg: "There is no assigned career"
                })
            }
            
            let opts = lazyTable(req.body);
            opts.attributes = [
                "id",
                "name",
                "pat_last_name",
                "mat_last_name",
                "rut",
                "check_digit",
                "phone",
                "address",
                "email",
                "type_teacher"
            ]

            

            
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({
            msg: "Error en el servidor, comuniquese con el administrador",
            error: error.message,
            });
        }
    }
}