import { Router, Request, Response, NextFunction } from "express";
import { tokenValidator } from "../../middlewares";
const router = Router();
import { passport } from "../../helpers/googleservices";
import UserModule from "./user.controller";
//
router.get("/index", tokenValidator, (req: Request, res: Response) => {
  res.send("ss");
});
router.get("/view/:id", [tokenValidator]);
router.post("/create", [tokenValidator]);
router.put("/update/:id", [tokenValidator]);
router.delete("/delete/:id", [tokenValidator]);

router.post('/login', UserModule.postLogin);

router.get(
  "/login",
  passport.authenticate("google", {
    session: false,
    scope: ["email", "profile"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "failture",
  }),
  UserModule.login
);

router.get("/auth/google/failture", async (req: Request, res: Response) => {
  const successMessage = `
    <script>
      window.opener.postMessage({ success: false}, '*');
      window.close();
    </script>
  `;
  res.send(successMessage);
});

router.get("/is-admin", tokenValidator, UserModule.isAdmin);
router.get("/is-coordinator", tokenValidator, UserModule.isCoordinator);
router.get("/rol",tokenValidator,UserModule.rol );
router.put("/desactive", []);
export { router };
