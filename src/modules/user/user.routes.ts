import { Router } from "express";
import { tokenValidator } from "../../middlewares";
import UserModule from "./user.controller";
const router = Router();

//
router.get("/index", [tokenValidator], UserModule.index);
router.get("/view/:id", [tokenValidator]);
router.post("/create", [tokenValidator]);
router.put("/update/:id", [tokenValidator]);
router.delete("/delete/:id", [tokenValidator]);

router.post("/login", []);
router.put("/desactive", []);
export { router };
