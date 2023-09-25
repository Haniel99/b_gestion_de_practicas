import { Model, DataTypes } from "sequelize";
import sequelize from "../../configs/config"
class Report extends Model {}

Report.init(
    {
        creation_date: DataTypes.DATE
    }, 
    {
        sequelize,
        modelName: "Report",
        tableName: "report"
    }
);

export default Report;
