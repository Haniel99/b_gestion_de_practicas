import { Model, DataTypes } from "sequelize";
import sequelize from "../../configs/config";
import StudyPlan from "../career/study_plan.model";

class Subject extends Model {
  id?: number;
  name?: string;
  code?: string;
  type?: string;
  practice_number?: number;
  total_hours?: number;
  studyPlans?: StudyPlan[]
}
Subject.init(
  {
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    type: DataTypes.STRING,
    practice_number: DataTypes.INTEGER,
    total_hours: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: "subject",
    modelName: "Subject",
  }
);

export default Subject;
