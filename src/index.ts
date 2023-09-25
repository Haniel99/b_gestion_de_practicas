import "dotenv/config";
import {App} from "./app/app";

const port: any = process.env.PORT || 3100;
const baseName: string = process.env.API_BASE_NAME || 'api/v1'; 

const app = new App(parseInt(port), baseName);
app.start();