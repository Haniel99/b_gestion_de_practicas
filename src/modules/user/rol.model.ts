import {
    Model,
    DataTypes
} from 'sequelize';
import sequelize  from "../../configs/config";

class Rol extends Model { }
Rol.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    //estado: DataTypes.INTEGER,
}, {
    sequelize,
    tableName: 'rol',
    modelName: 'Rol'
});
export default Rol;