import { Router, RequestHandler } from "express";
import { tokenValidator, validateFields } from "../../middlewares";
import { check } from "express-validator";
import { PracticeModule } from "./practice.controller";
import { existPracticeById } from "../../helpers/databasevalidator";
const router = Router();



/*
router.put("/update/:id",
[
  
],
PracticeModule.update
);
*/

router.post("/index",
  [

  ],
  PracticeModule.index
);

router.get("/view/:id",
  [
    /* tokenValidator,
    check("id").isNumeric(),
    check("id").custom(existPracticeById),
    validateFields, */
  ],
  PracticeModule.view
);

router.post("/practices-coordinator/:id",
  [],
  PracticeModule.practicesByCordinatorId
);
  
  router.post("/practices-career/:id",
  [],
  PracticeModule.practicesByCareerId
);
  
  export { router };
