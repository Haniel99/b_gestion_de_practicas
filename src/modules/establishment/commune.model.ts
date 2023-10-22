import { Model, DataTypes } from "sequelize";
import sequelize from "../../configs/config";

class Commune extends Model {}
Commune.init(
  {
    code: DataTypes.INTEGER,
    name: DataTypes.STRING,
    province_id: DataTypes.INTEGER
  },
  {
    sequelize,
    tableName: "commune",
    modelName: "Commune",
  }
);

export default Commune;