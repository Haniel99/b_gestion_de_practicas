import { Router } from "express";
import { tokenValidator, valdiateFields } from "../../middlewares";
import { check } from "express-validator";
import { PracticeModule } from "./practice.controller";
import { existPracticeById } from "../../helpers/databasevalidator";
const router = Router();



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

router.put("/update/:id",
  [
    
  ],
  PracticeModule.update
);

router.get("/practices-coordinator/:id", [], PracticeModule.practicesByCordinatorId)

export { router };
