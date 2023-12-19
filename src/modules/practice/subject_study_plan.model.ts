import { Model, DataTypes } from "sequelize";
import sequelize from "../../configs/config";
import StudyPlan from "../career/study_plan.model";

class SubjectInStudyPlan extends Model {}
SubjectInStudyPlan.init(
  {
    study_plan_id: DataTypes.INTEGER,
    subject_id: DataTypes.INTEGER
  },
  {
    sequelize,
    tableName: "study_plan_subject",
    modelName: "SubjectInStudyPlan",
  }
);

export default SubjectInStudyPlan;