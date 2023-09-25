import { Request, Response } from "../../interfaces/express.interfaces";
import errorHandler from "../../helpers/errorhandler";
import { Rol, User } from "../../app/app.associatios";

export default class UserModule {
  constructor() {}
  static async index(req: Request, res: Response) {
    try {
      
      const response = await User.findAll({
        include: [
            {
                model: Rol,
                as: "rol"
            }
        ]
      });
      if (!response) {
        return res.status(200).json({
          status: false,
          message: "No se encontraron registros en la base de datos",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Respuesta exitosa.",
        response: response,
      });
    } catch (error) {
      //Manejador de errores
      return errorHandler(
        res,
        error
      );
    }
  }

  static async view(req: Request, res: Response) {
    try {
        
    } catch (error) {
        errorHandler(res, error);
    }
  }

  static async create(req: Request, res: Response) {
    try {
    } catch (error) {}
  }

  static async update(req: Request, res: Response) {
    try {
    } catch (error) {}
  }

  static async destroy(req: Request, res: Response) {
    try {
    } catch (error) {}
  }

  static async login(req: Request, res: Response) {
    try {
    } catch (error) {}
  }
  static async desactive(req: Request, res: Response) {
    try {
    } catch (error) {}
  }
}
