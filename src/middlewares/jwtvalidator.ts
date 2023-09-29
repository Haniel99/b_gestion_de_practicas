import { NextFunction,  Response } from "express";
import { verifyToken } from "../helpers/jsonwebtoken";
import { Request } from "../interfaces/express.interfaces";


const tokenValidator = (req: Request, res: Response, next: NextFunction) => {
  try {
    let jwt: string | undefined = req.headers.authorization;
    console.log(jwt);
    if (!jwt) {
      return res.status(400).json({
        status: false,
        message: "No existe token en el encabezado.",
      });
    }
    
    let secretKey: string = process.env.SECRET_KEY || "";

    const  {payload}: any = verifyToken(jwt, secretKey);
    //Verificar existencia del usuario en la base de datos
    //Verificar estado en la base de datos
    console.log(payload);
    req.user = payload;
    next();
} catch (error) {
    return res.status(400).json({
      status: false,
      message: "El token no es valido",
    });
  }
};

export default tokenValidator;
