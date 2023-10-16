import ExcelJS from "exceljs";

const translations = [
  // Estudiantes
  {
    NOMBRE: "name",
    APELLIDO_PATERNO: "pat_last_name",
    APELLIDO_MATERNO: "mat_last_name",
    RUT: "rut",
    DV: "check_digit",
    TELEFONO: "phone",
    CORREO: "email",
    DIRECCION: "address",
    CODIGO_PLAN_ESTUDIO: "study_plan"
  },
  // Establecimientos
  {
    nombre: "name",
    codigo: "code",
    direccion: "address"
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
    NOMBRE: "name",
    CODIGO_ASIGNATURA: "code_subject",
    DESCRIPCION:"description",
    NUMERO_PRACTICA: "practice_number",
    TOTAL_HORAS: "total_hours",
    FECHA_INICIO: "start_date",
    FECHA_TERMINO: "end_date",
    CODIGO_PLAN_ESTUDIO: "code_study_plan",
  }
];

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

  bufferData.eachSheet((worksheet) => {
    numberRows = worksheet.rowCount
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
              let value = rowValues[i] ? rowValues[i] : null;
              rowObject[title] = value;
          }
          excelData.push(rowObject);
      }
    });
  });

  return {
    data: excelData,
    numberRows: numberRows - 1
  };
};

export default excelToJson;
