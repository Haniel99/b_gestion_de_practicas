import { Router } from "express";
const router = Router();
import {DepartmentModule} from "./department.controller";

//Retorna un total de 20 departamentos
router.get("/index-lazy",[], DepartmentModule.index);
router.get("/view/:id", []);
export { router };
