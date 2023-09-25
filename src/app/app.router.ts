import { Router } from "express";
import { routes } from "../modules/module.routes";
export class RouterApp {
  private router = Router();
  constructor() {
    //Se cargan las rutas
    this.loadRoutes();
  }

  private loadRoutes() {
    try {
      routes.forEach((moduleName) => {
        const path: string = `../modules/${moduleName}/${moduleName}.routes`;
        import(path).then((r) => {
          this.router.use(`/${moduleName}`, r.router);
        });
      });
    } catch (error) {
      console.log(error);
      throw new Error(
        "Asegurese de que los nombres de los modulos coincidan con la lista de rutas"
      );
    }
  }
  public getRouter() {
    return this.router;
  }
}
