import { Model, DataTypes } from "sequelize";
import sequelize from "../../configs/config";
import Subject from "../practice/subject.model";

class StudyPlan extends Model {
  id?: number;
  cede?: string;
  name?: string;
  year?: number;
  version?: number;
  subjects?: Subject[];
}
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