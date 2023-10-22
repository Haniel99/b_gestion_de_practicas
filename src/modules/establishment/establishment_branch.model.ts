import { Model, DataTypes } from "sequelize";
import sequelize from "../../configs/config";

class EstablishmentBranch extends Model {}
EstablishmentBranch.init(
  {
    establishment_id: DataTypes.INTEGER,
    educational_branch_id: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: "establishment_branch",
    modelName: "EstablishmentBranch",
  }
);

export default EstablishmentBranch;