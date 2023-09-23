import { Router, Request, Response } from "express";

const router = Router();

//
router.get("/index", (req: Request, res: Response)=>{
    return res.json({
        response: "Hello"
    });
});

export { router };