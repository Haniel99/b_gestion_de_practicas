import { Router, RequestHandler } from "express";
import { tokenValidator, validateFields } from "../../middlewares";
import { check } from "express-validator";
import { PracticeModule } from "./practice.controller";
import { existPracticeById } from "../../helpers/databasevalidator";
const router = Router();

router.put("/update/:id", [tokenValidator], PracticeModule.update);

router.post("/index", [tokenValidator], PracticeModule.index);

router.get("/view/:id", [tokenValidator], PracticeModule.view);

router.post(
  "/practices-coordinator/:id",
  [tokenValidator],
  PracticeModule.practicesByCordinatorId
);

router.post(
  "/practices-career/:id",
  [tokenValidator],
  PracticeModule.practicesByCareerId
);

export { router };
