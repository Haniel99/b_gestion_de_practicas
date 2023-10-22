import { Model, DataTypes } from "sequelize";
import sequelize from "../../configs/config";

class Establishment extends Model {}
Establishment.init(
  {
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    fax: DataTypes.STRING,
    email: DataTypes.STRING,
    dependence: DataTypes.TINYINT,
    commune_id: DataTypes.INTEGER
  },
  {
    sequelize,
    tableName: "establishment",
    modelName: "Establishment",
  }
);

export default Establishment;
