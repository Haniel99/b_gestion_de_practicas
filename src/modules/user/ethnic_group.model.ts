import { Model, DataTypes } from 'sequelize';
import sequelize  from "../../configs/config";

class EthnicGroup extends Model { }
EthnicGroup.init({
    code: DataTypes.STRING,
    name: DataTypes.STRING,
}, {
    sequelize,
    tableName: 'ethnic_group',
    modelName: 'EthnicGroup'
});

export default EthnicGroup;