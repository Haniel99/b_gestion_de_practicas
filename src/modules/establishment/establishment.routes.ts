import { Router } from "express";
import { tokenValidator } from "../../middlewares";
import { check } from "express-validator";
import { EstablishmentModule } from "./establishment.controller";
const router = Router();

router.post("/index",
    [tokenValidator],
    EstablishmentModule.index
);

router.get("/view/:id",
    [tokenValidator],
    EstablishmentModule.view
);
router.get("/view-utp/:id", [ tokenValidator], EstablishmentModule.viewUTP);
router.post("/create-user/:id",
    [tokenValidator],
    EstablishmentModule.createUser
);

router.put("/update-user/:id",
    [tokenValidator],
    EstablishmentModule.updateUser
);

router.post("/delete-user/:id",
    [tokenValidator],
    EstablishmentModule.updateUser
);

  export { router };
