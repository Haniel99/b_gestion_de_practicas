import { Model, DataTypes } from "sequelize";
import sequelize from "../../configs/config";

class StudyPlan extends Model {}
StudyPlan.init(
  {
    code: DataTypes.STRING,
    name: DataTypes.STRING, 
    year: DataTypes.INTEGER,
    version: DataTypes.INTEGER
  },
  {
    sequelize,
    tableName: "study_plan",
    modelName: "StudyPlan",
  }
);

export default StudyPlan;