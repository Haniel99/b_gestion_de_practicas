import { Router } from "express";
import { CareerModule } from "./career.controller";
import { tokenValidator } from "../../middlewares";


const router = Router();

router.post('/index', [ tokenValidator ], CareerModule.index);
router.get('/index', [tokenValidator], CareerModule.getIndex);
export { router };