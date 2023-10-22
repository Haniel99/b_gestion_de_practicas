import { Model, DataTypes } from "sequelize";
import sequelize from "../../configs/config";

class Province extends Model {}
Province.init(
  {
    code: DataTypes.INTEGER,
    name: DataTypes.STRING,
    region_id: DataTypes.INTEGER
  },
  {
    sequelize,
    tableName: "province",
    modelName: "Province",
  }
);

export default Province;