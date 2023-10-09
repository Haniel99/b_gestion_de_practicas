import { Model, DataTypes } from 'sequelize';
import sequelize  from "../../configs/config";

class Rol extends Model { }
Rol.init({
    name: DataTypes.STRING,
}, {
    sequelize,
    tableName: 'rol',
    modelName: 'Rol'
});

export default Rol;