import { errorHandler, excelToJson, lazyTable } from "../../helpers";
import { Request, Response } from "../../interfaces";
import { Career, Establishment, Practice, User } from "../../app/app.associatios";
import sequelize from "../../configs/config"

export class UploadHistoryModule  {
    constructor(){}

    static async loadData(req: Request, res: Response){
        
        const t = await sequelize.transaction();

        try {
            const { type } = req.body; 

            if (!req.file) {
                return res.status(400).json({
                    message: "No file received"
                })
            }

            const excelData = await excelToJson(req.file.buffer, type);
            let rowCreated = 0;
            let rowUpdated = 0;

            // type = 0: Archivo de estudiantes, type = 1: Archivo de establecimientos
            // type = 2: Archivo de practicas , type = 3: Archivo de asignaturas
            if (type == 0) {
                for (const row of excelData) {
                    const student: any = await User.findOne({
                        where: {
                            rut: row.rut
                        },
                        transaction: t
                    });
                    // No se encontro el estudiante, se crea uno nuevo
                    if (!student) {
                        await User.create(row, { transaction: t });
                        rowCreated++;
                    } else { // Si se encontro el estudiante, se actualizan sus datos
                        await student.update(row, { transaction: t })
                        rowUpdated++;
                    }
                };
            }
            else if (type == 1) {
                for (const row of excelData) {
                    const establishment: any = await Establishment.findOne({
                        where: {
                            code: row.code
                        },
                        transaction: t
                    });
                    // No se encontro el establecimiento, se crea uno nuevo
                    if (!establishment) {
                        await Establishment.create(row, { transaction: t });
                        rowCreated++;
                    } else { // Si se encontro el establecimiento, se actualizan sus datos
                        await establishment.update(row, { transaction: t })
                        rowUpdated++;
                    }
                };        
            } else if (type == 2) {
                
            }

            const commit = await t.commit();

            console.log({
                message: "Data was loaded successfully",
                rowCreated: rowCreated,
                rowUpdated: rowUpdated
            })

            return res.status(200).json({
                message: "Data was loaded successfully",
                rowCreated: rowCreated,
                rowUpdated: rowUpdated
            });

        } catch (error) {
            const rollback = await t.rollback();
            console.error(error);
            return res.status(500).json({
                msg: "Hable con el administrador",
                error 
            });
        }
    }

    static async index(req: Request, res: Response){
        try {
            
        } catch (error) {
            
        }
    }
}