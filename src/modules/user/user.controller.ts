import { Request, Response } from "../../interfaces/express.interfaces";
import errorHandler from "../../helpers/errorhandler";
import { Rol, User } from "../../app/app.associatios";
import { verifyHash } from "../../helpers";
export default class UserModule {
  constructor() {}
  static async index(req: Request, res: Response) {
    try {
      const response = await User.findAll({
        include: [
          {
            model: Rol,
            as: "rol",
          },
        ],
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
      return errorHandler(res, error);
    }
  }

  static async postLogin(req: Request, res: Response) {
    try {
      const { email, pass } = req.body;

      //Validate email
      const resEmail = await User.findOne({
        where: { email: email },
      });
      verifyHash(pass, resEmail!.password);
      if (!resEmail) {
        return res.status(404).json({
          msg: "el correo no existe"
        })
      }

      
    } catch (error) {
      errorHandler(res);
    }
  }
  static async rol(req: Request, res: Response) {
    try {
      let id: any = req.user;
      const user: any = await User.findByPk(id, {
        include: [
          {
            model: Rol,
            as: "rol",
          },
        ],
      });
      return res.json({
        response: user.rol.name,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  }
  static async isCoordinator(req: Request, res: Response) {
    try {
      let id: any = req.user;
      const user: any = await User.findByPk(id, {
        include: [
          {
            model: Rol,
            as: "rol",
          },
        ],
      });
      if (user.rol_id !== 2) {
        return res.json({
          status: false,
          response: user.rol.name,
        });
      }
      return res.json({
        status: true,
        response: user.rol.name,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  }
  static async isAdmin(req: Request, res: Response) {
    try {
      let id: any = req.user;
      const user: any = await User.findByPk(id, {
        include: [
          {
            model: Rol,
            as: "rol",
          },
        ],
      });
      if (user.rol_id !== 1) {
        return res.json({
          status: false,
          response: user.rol.name,
        });
      }
      return res.json({
        status: true,
        response: user.rol.name,
      });
    } catch (error) {
      errorHandler(res, error);
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
      const token = req.user;
      const successMessage = `
        <script>
          window.opener.postMessage({ success: true, token: "${token}" }, '*');
          window.close();
        </script>
      `;
      res.send(successMessage);
    } catch (error) {
      errorHandler(res);
    }
  }
  static async desactive(req: Request, res: Response) {
    try {
    } catch (error) {}
  }
}
