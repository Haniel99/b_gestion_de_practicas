import db from "./keys";
import { Sequelize } from "sequelize";
//Configuracion para la conexion a la base de datos
const { database } = db;
const sequelize = new Sequelize(
  database.database,
  database.username,
  database.password,
  {
    host: database.host,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      dateStrings: true,
      typeCast: function (field: any, next: any) {
        if (
          field.type === "DATETIME" ||
          field.type === "TIMESTAMP" ||
          field.type === "DATE"
        ) {
          return field.string();
        }
        return next();
      },
    },
    timezone: new Date().getTimezoneOffset() == 180 ? "-03:00" : "-04:00",
    define: {
      freezeTableName: true,
      timestamps: false,
      underscored: true,
    },
  }
);

export  default sequelize;