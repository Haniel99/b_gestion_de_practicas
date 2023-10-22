import { Model, DataTypes } from "sequelize";
import sequelize from "../../configs/config";

class Region extends Model {}
Region.init(
  {
    code: DataTypes.INTEGER,
    name: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "region",
    modelName: "Region",
  }
);

export default Region;