import { Router } from "express";
import { tokenValidator } from "../../middlewares";
import { check } from "express-validator";
import { EstablishmentModule } from "./establishment.controller";
const router = Router();

router.post("/index",
    [],
    EstablishmentModule.index
);

router.get("/view/:id",
    [],
    EstablishmentModule.view
);

router.post("/create-user/:id",
    [],
    EstablishmentModule.createUser
);

router.post("/update-user/:id",
    [],
    EstablishmentModule.updateUser
);

router.post("/delete-user/:id",
    [],
    EstablishmentModule.updateUser
);

  export { router };
