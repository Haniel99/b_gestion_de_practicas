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

  export { router };
