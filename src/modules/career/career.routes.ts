import { Router } from "express";
import { CareerModule } from "./career.controller";
import { tokenValidator, valdiateFields } from "../../middlewares";
import { existCareerById } from "../../helpers/databasevalidator";
import { check } from "express-validator";


const router = Router();

router.post("/index", [  ], CareerModule.index);

export { router };