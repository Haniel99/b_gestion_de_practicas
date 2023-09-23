import { Router } from "express";
import { routes } from "../modules/module.routes";
export class RouterApp{
    private router = Router();
    constructor(){
        //Se cargan las rutas
        this.loadRoutes();
    }
    
    private loadRoutes(){
        routes.forEach((moduleName) => {
            const path: string = `../modules/${moduleName}/${moduleName}.routes`;
            import(path).then((r) => {
              this.router.use(`/${moduleName}`, r.router);
            });
          });
    }
    public getRouter(){
        return this.router;
    }
}