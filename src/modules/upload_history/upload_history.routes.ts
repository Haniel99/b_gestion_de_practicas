import { Router } from "express";
import { UploadHistoryModule } from "./upload_history.controller";
import { tokenValidator, validateFields, upload } from "../../middlewares";
import { check } from "express-validator";


const router = Router();

router.post("/index-paginado", [

], UploadHistoryModule.indexPaginado);

router.post("/load-students", [
    upload.single("file"),
], UploadHistoryModule.loadStundents);

router.post("/load-establishments", [
    upload.single("file"),
], UploadHistoryModule.loadEstablishment);

router.post("/load-practices", [
    upload.single("file"),
], UploadHistoryModule.loadPractices);

router.post("/load-subjects", [
    upload.single("file"),
], UploadHistoryModule.loadSubjects);

router.post("/load-careers", [
    upload.single("file"),
], UploadHistoryModule.loadCareers);

export { router };