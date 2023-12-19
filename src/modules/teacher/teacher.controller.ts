import { Request, Response } from "../../interfaces/express.interfaces";
import { Career, User } from "../../app/app.associatios";
import { lazyTable } from "../../helpers";
import sequelize from "../../configs/config"

export default class TeacherModule {
    constructor() {}
    //Obtener listado de todos los profesores con su coordinador correspondiente
    static async index(req: Request, res: Response) {
        try {
            //Id del coordinador
            const usuarioId = 2

            //Validar que el coordinador tenga asociado una carrera
            const career = await Career.findOne({
                where: {
                    user_id: usuarioId
                }
            })
            if (!career) {
                return res.status(401).json({
                    msg: "There is no assigned career"
                })
            }
            
            let opts = lazyTable(req.body);
            opts.include = [
            ]

        } catch (error: any) {
            console.error(error);
            return res.status(500).json({
            msg: "Error en el servidor, comuniquese con el administrador",
            error: error.message,
            });
        }
    }

    /* static async view(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const teacher = await User.findByPk(id);

            return res.status(200).json({
                msg: "Successfuly query",
                response: teacher
            })

        } catch (error: any) {
            console.error(error);
            return res.status(500).json({
            msg: "Error en el servidor, comuniquese con el administrador",
            error: error.message,
            });
        }
    }
 */
    static async teachersByCoordinator(req: Request, res:Response) {
        try {
            const usuarioId = req.user; //Id del coordinador que inicio sesion

            let opts = lazyTable(req.body);
            opts.include = [
                {
                    attributes: [],
                    model: Career,
                    as: "careers",
                    where: {
                        user_id: usuarioId
                    }
                }
            ]

            const teachers = await User.findAndCountAll(opts);

            return res.status(200).json({
                message: "Successfuly query",
                response: {
                    count: teachers.count,
                    rows: teachers.rows
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

    static async create(req: Request, res: Response) {

        const t = await sequelize.transaction();

        try {
            const id = req.user;
            const profesorData = req.body; //Datos del nuevo profesor
            console.log(id, profesorData);
            //REGISTRAR - PROFESOR
            //Validar que el profesor no exista
            let profesor: any = await User.findOne({
                where: {
                    rut: profesorData.rut
                },
                transaction: t
            })
            //Registrar profesor en caso de que no exista
            if (!profesor) {
                profesor = await User.create(profesorData, { transaction: t });
            } else { //Actualizar datos del profesor en caso de que si exista
                await profesor.update(profesorData, { transaction: t });
            }

            //REGISTRAR - RELACION (PROFESOR-CARRERA)
            //Buscar la carrera del coordinador
            const career = await Career.findOne({
                where: {
                    user_id: id
                },
                transaction: t
            })
            console.log(career);
            //Validar si existe la carrera del coordinador
            if (!career) {
                return res.status(401).json({
                    message: "Coordinator's career not found"
                });
            }
            //Registrar relacion profesor - carrera
            await profesor.addCareer(career, { transaction: t });
            //Guardar estado            
            await t.commit();

            return res.status(200).json({
                msg: "Successfully registered teacher"
            })

        } catch (error: any) {
            await t.rollback();
            console.error(error);
            return res.status(500).json({
            msg: "Error en el servidor, comuniquese con el administrador",
            error: error.message,
            });
        }
    }
}