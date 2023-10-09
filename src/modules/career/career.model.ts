import { Model, DataTypes } from "sequelize";
import sequelize from "../../configs/config";

class Career extends Model {}
Career.init(
  {
    name: DataTypes.STRING, 
    code: DataTypes.STRING,
    sede: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  },
  {
    sequelize,
    tableName: "career",
    modelName: "Career",
  }
);

export default Career;
