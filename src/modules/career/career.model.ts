import { Model, DataTypes } from "sequelize";
import sequelize from "../../configs/config";
class Career extends Model {}
Career.init(
  {
    name: DataTypes.STRING, 
    code_regular_plan: DataTypes.INTEGER,
    code_procecution: DataTypes.INTEGER,
    address: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  },
  {
    sequelize,
    tableName: "career",
    modelName: "Career",
  }
);

export default Career;
