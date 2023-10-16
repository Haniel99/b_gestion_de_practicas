import { Model, DataTypes } from "sequelize";
import sequelize from "../../configs/config";

class StudyPlan extends Model {}
StudyPlan.init(
  {
    name: DataTypes.STRING, 
    code: DataTypes.STRING,
    year: DataTypes.INTEGER,
    career_id: DataTypes.INTEGER
  },
  {
    sequelize,
    tableName: "study_plan",
    modelName: "StudyPlan",
  }
);

export default StudyPlan;