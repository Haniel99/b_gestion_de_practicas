import { Router } from "express";
import { CareerModule } from "./career.controller";
import { tokenValidator, valdiateFields } from "../../middlewares";
import { existCareerById } from "../../helpers/databasevalidator";
import { check } from "express-validator";


const router = Router();

router.get("/index", [  ], CareerModule.index);
router.post("/practices/:id", [ 
    /* check("id", "El identificador debe ser de tipo numerico").isNumeric(),
    check("id").custom(existCareerById),
    valdiateFields */
 ], CareerModule.careerPractices );

export { router };