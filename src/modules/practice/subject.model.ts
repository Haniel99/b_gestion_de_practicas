import { Model, DataTypes } from "sequelize";
import sequelize from "../../configs/config";

class Subject extends Model {}
Subject.init(
  {
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    description: DataTypes.STRING,
    type: DataTypes.STRING,
    practice_number: DataTypes.INTEGER,
    total_hours: DataTypes.INTEGER,
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    study_plan_id: DataTypes.INTEGER
  },
  {
    sequelize,
    tableName: "subject",
    modelName: "Subject",
  }
);

export default Subject;
