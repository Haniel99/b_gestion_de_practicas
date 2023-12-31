import { Model, DataTypes } from "sequelize";
import sequelize from "../../configs/config";

class Practice extends Model {}
Practice.init(
  {
    career_id: DataTypes.INTEGER,
    student_id: DataTypes.INTEGER,
    supervisor_id: DataTypes.INTEGER,
    collaborating_teacher_id: DataTypes.INTEGER,
    workshop_teacher_id: DataTypes.INTEGER,
    subject_id: DataTypes.INTEGER,
    payment_info_id: DataTypes.INTEGER,
    study_plan_id: DataTypes.INTEGER,
    establishment_id: DataTypes.INTEGER
  },
  {
    sequelize,
    tableName: "practice",
    modelName: "Practice",
  }
);

export default Practice;
