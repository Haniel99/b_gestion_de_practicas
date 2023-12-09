import { Model, DataTypes } from "sequelize";
import sequelize from "../../configs/config";

class UserEstablishment extends Model {}
UserEstablishment.init(
  {
    name: DataTypes.STRING,
    pat_last_name: DataTypes.STRING,
    mat_last_name: DataTypes.STRING,
    rut: DataTypes.STRING,
    check_digit: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    type: DataTypes.STRING,
    establishment_id: DataTypes.INTEGER
  },
  {
    sequelize,
    tableName: "user_establishment",
    modelName: "UserEstablishment",
  }
);

export default UserEstablishment;