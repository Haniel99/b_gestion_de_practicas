import { Model, DataTypes } from "sequelize";
import sequelize from "../../configs/config";
class User extends Model {}

User.init(
  {
    name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    rut: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    address: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    account_type: DataTypes.INTEGER,
    verification_code: DataTypes.STRING,
    status: DataTypes.INTEGER,
    creation_date: DataTypes.DATE,
    last_access: DataTypes.DATE,
    department_id: DataTypes.INTEGER,
    rol_id: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: "user",
    modelName: "User",
  }
);

User.prototype.toJSON = function () {
  var values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

export default User;
