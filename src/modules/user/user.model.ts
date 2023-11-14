import { Model, DataTypes } from "sequelize";
import sequelize from "../../configs/config";
class User extends Model {
  password!: string;
}

User.init(
  {
    name: DataTypes.STRING,
    pat_last_name: DataTypes.STRING,
    mat_last_name: DataTypes.STRING,
    rut: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 8],
          msg: 'The rut must be 8 digits long'
        }
      }
    },
    check_digit: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 1],
          msg: 'The rut must be 1 digits long'
        }
      }
    },
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    verification_code: DataTypes.STRING,
    status: DataTypes.TINYINT,
    creation_date: DataTypes.DATE,
    last_access: DataTypes.DATE,
    rol_id: DataTypes.INTEGER,
    study_plan_id: DataTypes.INTEGER,
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
