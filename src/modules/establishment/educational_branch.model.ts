import { Model, DataTypes } from "sequelize";
import sequelize from "../../configs/config";

class EducationalBranch extends Model {}
EducationalBranch.init(
  {
    code: DataTypes.STRING,
    name: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "educational_branch",
    modelName: "EducationalBranch",
  }
);

export default EducationalBranch;
