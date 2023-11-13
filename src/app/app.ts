import express, { Application } from "express";
import cors from "cors";
import { json } from "body-parser";
import { RouterApp } from "./app.router";
import sequelize from "../configs/config";
import {passport} from "../helpers/googleservices";
import session from "express-session";

/**
 *
 */
export class App {
  private readonly baseName: string = "";
  private readonly app: Application = express();
  private port: number;
  private router: RouterApp = new RouterApp();

  /**
   *
   * @param port
   * @param baseName
   */
  constructor(port: number, baseName: string) {
    this.port = port;
    this.baseName = baseName;

    //Se inician los middlewares
    this.middlewares();
    //Se conecta a la base de datos
    this.connectDB();
    //Se inicia el enrutador
    this.loadRouter();
  }
  /**
   *
   */
  private middlewares(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(session({
      secret: 'llavesecretauta',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }
    }));
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  private async connectDB(): Promise<any> {
    try {
      await sequelize.sync({ force: false });
      console.log("Connected to the database successfully.");
    } catch (error) {
      console.log(error);
      throw new Error("Error connecting to database.");
    }
  }
  /**
   *
   */
  private loadRouter(): void {
    this.app.use(`/${this.baseName}`, this.router.getRouter());
  }

  /**
   *
   */
  public start(): void {
    this.app.listen(this.port, () => {
      console.log(
        `The server is running on port: ${this.port}. http://localhost:${this.port} `
      );
    });
  }
}
