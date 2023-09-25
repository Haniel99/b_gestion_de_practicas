import ExcelJS from "exceljs";

const excelToJson = async (buffer: Buffer) => {
  let jsonData: any = [];
  let columns: any = [];
  let diccionario = {};
  let rowNumber = 0;
  let colNumber = 0;
  const workbook = new ExcelJS.Workbook();
  const bufferData = await workbook.xlsx.load(buffer);

  bufferData.eachSheet((worksheet) => {
    rowNumber = worksheet.rowCount;
    colNumber = worksheet.columnCount;
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber == 1) {
        row.eachCell((cell) => {
          columns.push(cell.value);
        });
      } else {
        row.eachCell((cell, colNumber) => {
          colNumber = colNumber - 1;
          diccionario = {
            ...diccionario,
            [columns[colNumber]]: cell.value,
          };
        });
        jsonData.push(diccionario);
      }
    });
  });

  return {
    row_number: rowNumber,
    column_number: colNumber,
    data: jsonData,
  };
};

export default excelToJson;
