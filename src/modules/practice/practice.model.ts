import { Model, DataTypes } from "sequelize";
import sequelize from "../../configs/config";

class Practice extends Model {}

Practice.init(
  {
    code: DataTypes.STRING,
    status: DataTypes.STRING,
    type: DataTypes.STRING,
    practice_number: DataTypes.INTEGER,
    practice_subject: DataTypes.STRING,
    subject_code: DataTypes.INTEGER,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    total_hours: DataTypes.INTEGER,
    career_id: DataTypes.INTEGER,
    student_id: DataTypes.INTEGER,
    supervisor_id: DataTypes.INTEGER,
    collaborating_teacher_id: DataTypes.INTEGER,
    workshop_teacher_id: DataTypes.INTEGER,
    establishment_id: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: "practice",
    modelName: "Practice",
  }
);

export default Practice;
