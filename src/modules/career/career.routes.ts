import { Router } from "express";
import { CareerModule } from "./career.controller";
import { tokenValidator, validateFields } from "../../middlewares";
import { existCareerById } from "../../helpers/databasevalidator";
import { check } from "express-validator";


const router = Router();

router.post('/index', [ tokenValidator ], CareerModule.index);

export { router };