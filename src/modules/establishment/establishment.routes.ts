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

router.post("/create-user/:id",
    [tokenValidator],
    EstablishmentModule.createUser
);

router.post("/update-user/:id",
    [tokenValidator],
    EstablishmentModule.updateUser
);

router.post("/delete-user/:id",
    [tokenValidator],
    EstablishmentModule.updateUser
);

  export { router };
