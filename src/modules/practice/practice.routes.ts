import { Router } from "express";
import { tokenValidator, upload, valdiateFields } from "../../middlewares";
import { check } from "express-validator";
import { PracticeModule } from "./practice.controller";
import { existPracticeById } from "../../helpers/databasevalidator";
const router = Router();

router.post("/load-data",
  [tokenValidator],
  upload.single("practice-data"),
  PracticeModule.loadData
);

//
router.get("/view/:id",
  [
    tokenValidator,
    check("id").isNumeric(),
    check("id").custom(existPracticeById),
    valdiateFields,
  ],
  PracticeModule.view
);

export { router };
