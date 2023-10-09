import { Model, DataTypes } from "sequelize";
import sequelize from "../../configs/config";

class Establishment extends Model {}
Establishment.init(
  {
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    address: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "establishment",
    modelName: "Establishment",
  }
);

export default Establishment;
