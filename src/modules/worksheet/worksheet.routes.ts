import { Router } from "express";
import { WorksheetModule } from "./worksheet.controller";
import { tokenValidator, valdiateFields, upload } from "../../middlewares";
import { check } from "express-validator";


const router = Router();

router.post("/generate-worksheet", [], WorksheetModule.generateWorksheet)

export { router };