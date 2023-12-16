import { Router } from "express";
import { tokenValidator } from "../../middlewares";
import { check } from "express-validator";
import TeacherModule from "./teacher.controller";

const router = Router();

router.post("/index",
    [],
    TeacherModule.index
);
  
  export { router };
