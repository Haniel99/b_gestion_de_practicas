import ExcelJS from "exceljs";
const moment = require('moment');
require('moment/locale/es');

const translations = [
  // Estudiantes
  {
    PNA_NOM: "name_student",
    PNA_APAT: "pat_last_name_student",
    PNA_AMAT: "mat_last_name_student",
    PER_NRUT: "rut_student",
    PER_DRUT: "check_digit_student",
    PER_CELULAR: "phone_student",
    PER_EMAIL: "email_student",
    PLA_CODIGO: "code_study_plan",
    CAR_COD_CARRERA: "code_career",
    SEX_COD: "sex_student",
    PNS_NOMBRE_SOCIAL: "social_name_student",
    PET_ETNIA: "code_ethnic",
    PET_NOMBRE: "name_ethnic",
    DIRECCION: "address_student"
  },
  // Establecimientos
  {
    LOCAL_EDUCACIONAL: "code_establishment",
    NOMBRE_OFICIAL: "name_establishment",
    CODIGO_REGION: "code_region",
    CODIGO_COMUNA: "code_commune",
    FONO_PRINCIPAL: "phone_establishment",
    FAX: "fax_establishment",
    EMAIL: "email_establishment",
    DIRECCION: "address_establishment",
    RAMA_EDUCACIONAL: "code_educational_branch",
    DEPENDENCIA: "dependence_establishment",
  },
  // Practicas
  {
    NOMBRE_ESTUDIANTE: "name_student",
    APELLIDO_PATERNO_ESTUDIANTE: "pat_last_name_student",
    APELLIDO_MATERNO_ESTUDIANTE: "mat_last_name_student",
    RUT_ESTUDIANTE: "rut_student",
    DV_ESTUDIANTE: "check_digit_student",
    CODIGO_PLAN_ESTUDIO: "code_study_plan",
    CODIGO_PRACTICA: "code_practice",
    ESTADO: "status",
    FECHA_INICIO_PRACTICA: "start_date",
    FECHA_TERMINO_PRACTICA: "end_date",
    CODIGO_ASIGNATURA: "code_subject",
    CODIGO_ESTABLECIMIENTO: "code_establishment",
    NOMBRE_SUPERVISOR: "name_supervisor",
    APELLIDO_PATERNO_SUPERVISOR: "pat_last_name_supervisor",
    APELLIDO_MATERNO_SUPERVISOR: "mat_last_name_supervisor",
    RUT_SUPERVISOR: "rut_supervisor",
    DV_SUPERVISOR: "check_digit_supervisor",
  },
  // Asignaturas
  {
    ASI_CODIGO: "code_subject",
    ASI_NOMBRE: "name_subject",
    ASI_HORAS_SEMESTRAL: "hours_subject",
    PLA_CODIGO: "code_study_plan",
    FLU_SEMESTRE: "semestre_subject",
    FLU_POSICION_MALLA: "posicion_malla_subject"
  },
  //Carreras y planes de estudio
  {
    CAR_COD_CARRERA: "code_career",
    NOMBRE_CARRERA: "name_career",
    SEDE: "sede_career",
    PLA_CODIGO: "code_study_plan",
    PLA_ANIO: "year_study_plan",
    PLA_VERSION: "version_study_plan"
  }
];

moment.locale('es');

const excelToJson = async (buffer: Buffer, fileType: number) => {
  let excelTitles: any = [];
  let excelData: any = [];
  let numberRows = 0;
  
  const workbook = new ExcelJS.Workbook();
  const bufferData = await workbook.xlsx.load(buffer);

  //Validacion del formato del excel de acuerdo al tipo seleccionado
  const firstSheet = bufferData.getWorksheet(1);
  const firstRow: any = firstSheet.getRow(1);
  let firstRowValues: any = firstRow.values;
  while (firstRowValues.length > 0 && firstRowValues[0] === undefined){
    firstRowValues.shift();
  }
  
  let titles: any = translations[fileType];
  // Validacion que el numero de columnas sea el requerido
  if (firstRowValues.length != Object.keys(titles).length) {
    return [];
  }
  // Validando que el nombre de las columnas sea el correcto
  let validColumn = true;
  excelTitles = firstRowValues.map((item: string) => {
    // Cambiamos el nombre de las columnas igual a la bd
    if (titles[item.toUpperCase()]) {
      return titles[item.toUpperCase()];
    } else {
      validColumn = false;
      return null;
    }
  });
  // Verificamos la validacion
  if (!validColumn) return [];

  bufferData.eachSheet((worksheet, worksheetNumber) => {
    if (worksheetNumber == 1) {
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          // Obtiene los valores de la fila
          let rowValues: any = row.values;
          // Remueve los valores valor nulos de una la fila
          while (rowValues.length > 0 && rowValues[0] === undefined){
            rowValues.shift();
          }
          // Agregamos cada fila como objeto al arreglo excelData 
          let rowObject: any = {}
          for (let i = 0; i < excelTitles.length; i++) {
              let title = excelTitles[i];
              let value = rowValues[i] != null? rowValues[i] : null;

              if (title === 'address_establishment' && moment(value, moment.ISO_8601, true).isValid()) {
                value = value.toISOString().split('T')[0];
                value = moment(value).format('DD [de] MMMM [#]YYYY');
                value = value.toUpperCase();
              }

              rowObject[title] = value;
          }
          excelData.push(rowObject);
          numberRows++
        }
      });
    }
  });

  return {
    data: excelData,
    numberRows: numberRows
  };
};

export default excelToJson;
