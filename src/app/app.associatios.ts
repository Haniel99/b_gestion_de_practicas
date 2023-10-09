import User from "../modules/user/user.model";
import Rol from "../modules/user/rol.model";
import Establishment from "../modules/establishment/establishment.model";
import Practice from "../modules/practice/practice.model";
import Subject from "../modules/practice/subject.model";
import Payment from "../modules/payment/payment.model";
import UploadHistory from "../modules/upload_history/upload_history.model";
import Career from "../modules/career/career.model";
import StudyPlan from "../modules/career/study_plan.model";

// Relacion rol - usuario (1-n)
Rol.hasMany(User, { foreignKey: "rol_id", as: "users" });
User.belongsTo(Rol, { foreignKey: "rol_id", as: "rol" });

// Relacion usuario - upload_history (1-n)
User.hasMany(UploadHistory, { foreignKey: "user_id", as: "uploadHistory" });
UploadHistory.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Relacion usuario (coordinador) - carrera (1-1)
Career.belongsTo(User, { foreignKey: "user_id", as: "coordinator" })
User.hasOne(Career, { foreignKey: "user_id", as: "career" })

// Relacion usuario (estudiante) - practica (1-n)
User.hasMany(Practice, { foreignKey: "student_id", as: "studentPractices" });
Practice.belongsTo(User, { foreignKey: "student_id", as: "student" });

// Relacion plan de estudio - usuario (estudiante) (1-n)
StudyPlan.hasMany(User, { foreignKey: "study_plan_id", as: "stundents" });
User.belongsTo(StudyPlan, { foreignKey: "study_plan_id", as: "studyPlan" });

// Relacion usaurio (supervisor) - practica (1-n)
User.hasMany(Practice, { foreignKey: "supervisor_id", as: "supervisorPractices" });
Practice.belongsTo(User, { foreignKey: "supervisor_id", as: "supervisor" });

// Relacion usuario (p. colaborador) - practica (1-n)
User.hasMany(Practice, { foreignKey: "collaborating_teacher_id", as: "collaboratingTeacherPractices" });
Practice.belongsTo(User, { foreignKey: "collaborating_teacher_id", as: "collaboratingTeacher" });

// Relacion usuario (p. taller) - practica (1-n)
User.hasMany(Practice, { foreignKey: "workshop_teacher_id", as: "workshopTeacherPractices" });
Practice.belongsTo(User, { foreignKey: "workshop_teacher_id", as: "workshopteacher" });

// Relacion establecimiento - practica (1-n)
Establishment.hasMany(Practice, { foreignKey: "establishment_id", as: "practices" });
Practice.belongsTo(Establishment, { foreignKey: "establishment_id", as: "establishment" });

// Relacion bonos - practicas (1-n)
Payment.hasMany(Practice, { foreignKey: "payment_info_id", as: "practices" });
Practice.belongsTo(Payment, { foreignKey: "payment_info_id", as: "payment" });

// Relacion carrera - practica (1-n)
Career.hasMany(Practice, { foreignKey: "career_id", as: "practices" });
Practice.belongsTo(Career, { foreignKey: "career_id", as: "career" });

// Relacion asignatura - practica (1-n)
Subject.hasMany(Practice, { foreignKey: "subject_id", as: "practices" });
Practice.belongsTo(Subject, { foreignKey: "subject_id", as: "subject" });

// Relacion plan de estudio - asignatura (1-n)
StudyPlan.hasMany(Subject, { foreignKey: "study_plan_id", as: "subjects" });
Subject.belongsTo(StudyPlan, { foreignKey: "study_plan_id", as: "studyPlan" });


export {
  User,
  Rol,
  Establishment,
  Practice,
  Subject,
  Payment,
  UploadHistory,
  Career,
  StudyPlan
};
