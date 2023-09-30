import User from "../modules/user/user.model";
import Rol from "../modules/user/rol.model";
import Department from "../modules/department/department.model";
import Establishment from "../modules/establishment/establishment.model";
import Practice from "../modules/practice/practice.model";
import UploadHistory from "../modules/practice/upload_history.model";
import Career from "../modules/career/career.model";
Rol.hasMany(User, { foreignKey: "rol_id", as: "users" });
User.belongsTo(Rol, { foreignKey: "rol_id", as: "rol" });

Department.hasMany(User, { foreignKey: "department_id", as: "users" });
User.belongsTo(Department, { foreignKey: "department_id", as: "department" });

User.hasMany(Practice, { foreignKey: "student_id", as: "studentPractices" });
Practice.belongsTo(User, { foreignKey: "student_id", as: "student" });

User.hasMany(Practice, {
  foreignKey: "supervisor_id",
  as: "supervisorPractices",
});
Practice.belongsTo(User, { foreignKey: "supervisor_id", as: "supervisor" });

User.hasMany(Practice, {
  foreignKey: "collaborating_teacher_id",
  as: "collaboratingTeacherPractices",
});
Practice.belongsTo(User, {
  foreignKey: "collaborating_teacher_id",
  as: "collaboratingTeacher",
});

User.hasMany(Practice, {
  foreignKey: "workshop_teacher_id",
  as: "workshopTeacherPractices",
});
Practice.belongsTo(User, {
  foreignKey: "workshop_teacher_id",
  as: "workshopteacher",
});

Establishment.hasMany(Practice, {
  foreignKey: "establishment_id",
  as: "practitioners",
});
Practice.belongsTo(Establishment, {
  foreignKey: "establishment_id",
  as: "establishment",
});

Career.hasMany(Practice, { foreignKey: "career_id", as: "practices" });
Practice.belongsTo(Career, { foreignKey: "career_id", as: "career" });

User.hasMany(UploadHistory, { foreignKey: "user_id", as: "uploadHistories" });
UploadHistory.belongsTo(User, { foreignKey: "user_id", as: "user" });

Career.belongsTo(User, {
  foreignKey: "user_id",
  as: "coordinator"
})
User.hasOne(Career, {
  foreignKey: "user_id",
  as: "career"
})

export {
  User,
  Rol,
  Practice,
  Department,
  Establishment,
  UploadHistory,
  Career,
};
