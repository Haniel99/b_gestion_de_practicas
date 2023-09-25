import { Request as Req, Response } from "express";
import { IUser } from "./IModules/user.interface";

interface Request extends Req {
    user?: IUser,
}

export {
    Request, Response
}