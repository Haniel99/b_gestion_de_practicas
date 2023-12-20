import { Router } from "express";
import { tokenValidator } from "../../middlewares";
import { check } from "express-validator";
import StudentModule from "./student.controller";

const router = Router();

router.post("/students-by-coordinator",
    [tokenValidator],
    StudentModule.studentByCoordinator
);

router.get("/view/:id",
    [tokenValidator],
    StudentModule.view
);
  
export { router };
