import { Model, DataTypes } from "sequelize";
import sequelize from "../../configs/config";

class Career extends Model {
  id?: number;
  cede?: string;
  name?: string;
  sede?: string;
  user?: any;
}
Career.init(
  {
    code: DataTypes.STRING,
    name: DataTypes.STRING,
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
