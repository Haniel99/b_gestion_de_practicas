import { Model, DataTypes } from "sequelize";
import sequelize from "../../configs/config";

class Department extends Model {}

Department.init(
    {
        name: DataTypes.STRING,
        code: DataTypes.INTEGER,
        location: DataTypes.STRING
    },
    {
        sequelize,
        tableName: "department",
        modelName: "Department"
    }
);

export default Department;