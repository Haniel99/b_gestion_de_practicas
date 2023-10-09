import { Router } from "express";
import { UploadHistoryModule } from "./upload_history.controller";
import { tokenValidator, valdiateFields, upload } from "../../middlewares";
import { existCareerById } from "../../helpers/databasevalidator";
import { check } from "express-validator";


const router = Router();

router.post("/load-data", [ 
    upload.single("file"),
 ], UploadHistoryModule.loadData);


export { router };