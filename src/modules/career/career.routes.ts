import { Router } from "express";
import { CareerModule } from "./career.controller";
import { tokenValidator } from "../../middlewares";

const router = Router();

router.get("/index", [  ], CareerModule.index);
router.get("/career-practice/:id", [  ], CareerModule.careerPractices );

export { router };