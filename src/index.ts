import "dotenv/config";
import {App} from "./app/app";

const port: any = process.env.PORT || 3100;
const baseName: string = process.env.BASE_NAME || ''; 

const app = new App(parseInt(port), baseName);
app.start();