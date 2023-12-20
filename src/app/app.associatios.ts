import User from "../modules/user/user.model";
import Rol from "../modules/user/rol.model";
import Establishment from "../modules/establishment/establishment.model";
import Practice from "../modules/practice/practice.model";
import Subject from "../modules/practice/subject.model";
import Payment from "../modules/payment/payment.model";
import UploadHistory from "../modules/upload_history/upload_history.model";
import Career from "../modules/career/career.model";
import StudyPlan from "../modules/career/study_plan.model";
import EducationalBranch from "../modules/establishment/educational_branch.model";
import Commune from "../modules/establishment/commune.model";
import Province from "../modules/establishment/province.model";
import Region from "../modules/establishment/region.model";
import EthnicGroup from "../modules/user/ethnic_group.model";
import UserEstablishment from "../modules/establishment/user_establishment.model";
import SubjectInStudyPlan from "../modules/practice/subject_study_plan.model";

// Relacion rol - usuario (1-n)
Rol.hasMany(User, { foreignKey: "rol_id", as: "users" });
User.belongsTo(Rol, { foreignKey: "rol_id", as: "rol" });

// Relacion usuario - upload_history (1-n)
User.hasMany(UploadHistory, { foreignKey: "user_id", as: "uploadHistory" });
UploadHistory.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Relacion usuario (coordinador) - carrera (1-1)
Career.belongsTo(User, { foreignKey: "user_id", as: "coordinator" })
User.hasOne(Career, { foreignKey: "user_id", as: "careerCoordinator" })

// Relacion carrera - usuario (estudiantes) (1-N)
Career.hasMany(User, { foreignKey: "career_id", as: "students" })
User.belongsTo(Career, { foreignKey: "career_id", as: "careerStudent" })

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

// Relacion establecimiento - rama educacional (n-m)
Establishment.belongsToMany(EducationalBranch, { through: "establishment_branch", foreignKey: "establishment_id", as: "educationalBranchs" });
EducationalBranch.belongsToMany(Establishment, { through: "establishment_branch", foreignKey: "educational_branch_id", as: "establishments" });

// Relacion bonos - practicas (1-n)
Payment.hasMany(Practice, { foreignKey: "payment_info_id", as: "practices" });
Practice.belongsTo(Payment, { foreignKey: "payment_info_id", as: "payment" });

// Relacion carrera - practica (1-n)
Career.hasMany(Practice, { foreignKey: "career_id", as: "practices" });
Practice.belongsTo(Career, { foreignKey: "career_id", as: "career" });

// Relacion asignatura - practica (1-n)
Subject.hasMany(Practice, { foreignKey: "subject_id", as: "practices" });
Practice.belongsTo(Subject, { foreignKey: "subject_id", as: "subject" });

// Relacion plan de estudio - asignatura (n-m)
StudyPlan.belongsToMany(Subject, { through: SubjectInStudyPlan, foreignKey: "study_plan_id", as: "subjects" });
Subject.belongsToMany(StudyPlan, { through: SubjectInStudyPlan, foreignKey: "subject_id", as: "studyPlans" });

//Relaciones tabla intermedia
Subject.hasMany(SubjectInStudyPlan, { foreignKey: "subject_id", as: "subjects" });
SubjectInStudyPlan.belongsTo(Subject, { foreignKey: "subject_id", as: "subject" });

StudyPlan.hasMany(SubjectInStudyPlan, { foreignKey: "study_plan_id", as: "studyPlans" });
SubjectInStudyPlan.belongsTo(StudyPlan, { foreignKey: "study_plan_id", as: "studyPlan" });

// Relacion carrera - plan de estudio (n-m)
Career.belongsToMany(StudyPlan, { through: "career_study_plan", foreignKey: "career_id", as: "studyPlans" });
StudyPlan.belongsToMany(Career, { through: "career_study_plan", foreignKey: "study_plan_id", as: "careers" });

// Relacion comuna - establecimiento (1-n)
Commune.hasMany(Establishment, { foreignKey: "commune_id", as: "establishments" });
Establishment.belongsTo(Commune, { foreignKey: "commune_id", as: "commune" });

// Relacion provincia - comuna (1-n)
Province.hasMany(Commune, { foreignKey: "province_id", as: "communes" });
Commune.belongsTo(Province, { foreignKey: "province_id", as: "province" });

// Relacion region - provincia (1-n)
Region.hasMany(Province, { foreignKey: "region_id", as: "provinces" });
Province.belongsTo(Region, { foreignKey: "region_id", as: "region" });

// Relacion plan de estudio - practice (1-n)
StudyPlan.hasMany(Practice, { foreignKey: "study_plan_id", as: "practices" });
Practice.belongsTo(StudyPlan, { foreignKey: "study_plan_id", as: "studyPlan" });

// Relacion grupo étnico - usuario (estudiante) (1-n)
EthnicGroup.hasMany(User, { foreignKey: "ethnic_group_id", as: "students" });
User.belongsTo(EthnicGroup, { foreignKey: "ethnic_group_id", as: "ethnicGroup" });

// Relacion establecimiento - usuario del establecimiento (1-n)
Establishment.hasMany(UserEstablishment, { foreignKey: "establishment_id", as: "users" });
UserEstablishment.belongsTo(Establishment, { foreignKey: "establishment_id", as: "establishment" });

// Relacion usuario (profesores) - carrera (n-m)
User.belongsToMany(Career, { through: "teacher_in_career", foreignKey: "user_id", as: "careers" });
Career.belongsToMany(User, { through: "teacher_in_career", foreignKey: "career_id", as: "teachers" });

export {
  User,
  Rol,
  Establishment,
  Practice,
  Subject,
  Payment,
  UploadHistory,
  Career,
  StudyPlan,
  EducationalBranch,
  Commune,
  Province,
  Region,
  EthnicGroup,
  UserEstablishment,
  SubjectInStudyPlan
};