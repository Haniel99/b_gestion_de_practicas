import ExcelJS from "exceljs";

const columnName = [
  // Estudiantes
  {
    nombre: "name",
    apellido_paterno: "pat_last_name",
    apellido_materno: "mat_last_name",
    telefono: "phone",
    correo: "email"
  }
];

const excelToJson = async (buffer: Buffer, fileType: number) => {
  let excelTitles: any = [];
  let excelData: any = [];
  
  console.log("hola")
  const workbook = new ExcelJS.Workbook();
  const bufferData = await workbook.xlsx.load(buffer);

  bufferData.eachSheet((worksheet) => {
    /* rowNumber = worksheet.rowCount;
    colNumber = worksheet.columnCount; */
    let readTittles = true;
    worksheet.eachRow((row, rowNumber) => {
      console.log("numero de fila: ", rowNumber )
      // Obtiene los valores de la fila
      let rowValues: any = row.values;
      // Remueve los valores valor nulos de una la fila
      while (rowValues.length > 0 && rowValues[0] === undefined){
        rowValues.shift();
      } 
      console.log("fila:  ",rowValues);
      // Agregamos la primera fila (arreglo de nombres de cada columna) a excelTittle
      if (readTittles) {
        let translations: any = columnName[fileType];
        console.log("traduccion:  ", translations);
        excelTitles = rowValues.map((item: any) => {
          console.log(item, translations[item]);
          return translations[item] || item;
        });
        readTittles = false;
        console.log("fila titulo:  ",excelTitles);

      }
      // Agregamos cada fila como objeto al arreglo excelData 
      else {
          let rowObject: any = {}
          for (let i = 0; i < excelTitles.length; i++) {
              let title = excelTitles[i];
              let value = rowValues[i] ? rowValues[i] : null;
              rowObject[title] = value;
          }
          excelData.push(rowObject);
          console.log("objeto -----: ", excelData)
      }
    });
  });

  return excelData;
};

export default excelToJson;
