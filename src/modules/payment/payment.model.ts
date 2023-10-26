import { Model, DataTypes } from 'sequelize';
import sequelize  from "../../configs/config";

class Payment extends Model { }
Payment.init({
    account_number: DataTypes.STRING,
    bank: DataTypes.STRING,
    transportation_amount: DataTypes.INTEGER,
    food_amount: DataTypes.INTEGER
}, {
    sequelize,
    tableName: 'payment_info',
    modelName: 'Payment'
});

export default Payment;