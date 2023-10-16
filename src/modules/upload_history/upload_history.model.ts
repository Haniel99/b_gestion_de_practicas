import { Model, DataTypes } from "sequelize";
import sequelize from "../../configs/config";

class UploadHistory extends Model {}

UploadHistory.init(
  {
    name: DataTypes.STRING,
    upload_date: DataTypes.DATE,
    file:  DataTypes.BLOB("long"),
    number_rows: DataTypes.INTEGER,
    file_type: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: "upload_history",
    modelName: "UploadHistory",
  }
);

export default UploadHistory;
