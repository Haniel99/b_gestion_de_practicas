import { Request, Response } from "../../interfaces";
import {
  Career,
  Commune,
  Establishment,
  Payment,
  Practice,
  Subject,
  User,
} from "../../app/app.associatios";
import { Op } from "sequelize";
import formatRut from "../../helpers/formattorut";
import ExcelJS from "exceljs";
import formatDate from "../../helpers/formattodate";
import formatMoney from "../../helpers/formattomoney";
import getDataWorksheet from "../../helpers/getdataworksheet";


export class WorksheetModule {
  constructor() {}

static async viewWorksheet(req: Request, res: Response){
    try {
        // Obtener los datos enviados en la solicitud, formato: [ {"code": "201", "subjects": ["SU201", "SU202", ...] }, ... ]
        let dataExcel = await getDataWorksheet(req.body);
    
        return res.status(200).json({
            message: "Successfuly query",
            response: dataExcel
        })
    
    } catch (error: any) {
        console.error(error)
        return res.status(500).json({
            msg: "Error en el servidor, comuniquese con el administrador",
            error: error.message
        });
    }
}

static async generateWorksheet(req: Request, res: Response){
    try {
        
        const dataExcel = await getDataWorksheet(req.body);

        // Creacion del excel (libro y pagina)
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Practicas');

        // Estilos de letra
        const fontStyleBold = {
            size: 12,
            bold: true,
            color: { argb: "000000" },
            name: "Arial"
        };
        const fontStyleNormal = {
            size: 12,
            bold: false,
            color: { argb: "000000" },
            name: "Arial"
        }
        
        // Definir ancho de las columnas
        worksheet.getColumn('A').width = 10;
        worksheet.getColumn('B').width = 4;
        worksheet.getColumn('C').width = 15;
        worksheet.getColumn('D').width = 4;
        worksheet.getColumn('E').width = 45;
        worksheet.getColumn('F').width = 13;
        worksheet.getColumn('G').width = 13;
        worksheet.getColumn('H').width = 45;
        worksheet.getColumn('I').width = 14;
        worksheet.getColumn('J').width = 14;
        worksheet.getColumn('K').width = 14;
        worksheet.getColumn('L').width = 18;
        worksheet.getColumn('M').width = 18;
        worksheet.getColumn('N').width = 18;
        worksheet.getRow(1).height = 25;
        worksheet.getRow(2).height = 25;

        // Creacion del encabezado
        worksheet.mergeCells("B1:N1"); // Combinar celdas
        worksheet.mergeCells("B2:N2"); // Combinar celdas

        const titleCell = worksheet.getCell("B1");
        const subtitleCell = worksheet.getCell("B2");

        titleCell.value = "TITULO";
        titleCell.alignment = { vertical: "middle", horizontal: "center" }
        titleCell.fill = { //Aplicar color de fondo (B1:N1)
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "D0CECE" }
        }
        titleCell.border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        titleCell.font = fontStyleBold;

        subtitleCell.value = "SUBTITULO"; //Aplicar color de fondo (B2:N2)
        subtitleCell.alignment = { vertical: "middle", horizontal: "center" }
        subtitleCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "D0CECE" }
        }
        subtitleCell.border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        subtitleCell.font = fontStyleBold;

        worksheet.addRow([]);
        worksheet.addRow([]);

        // Creacion de las tablas
        let codeOld = "";
        let countRow = 5;
        let lastRow: any;
        const cellAlignment = ["center", "left", "center", "left", "center", "center", "left", "center", "center", "center", "right", "right", "right"];
        dataExcel.forEach((subject: any) => {
            worksheet.addRow([]);
            countRow ++;
            // Crear titulo externo de la tabla
            const title = subject.title.toUpperCase();
            console.log(title)
            worksheet.addRow(["", title]);
            worksheet.mergeCells(`B${countRow}:N${countRow}`)
            // Agregar estilo a la fila
            lastRow = worksheet.lastRow;
            lastRow.eachCell({ includeEmpty: true }, (cell: any) => {
                cell.font = fontStyleBold;
            });
            countRow++
            
            // Crear titulos de la tabla
            const titleTable1 = [null, "ANTECEDENTES PERSONALES", "", "", "", "", "", "", "", "", "", "BENEFICIO"];
            const titleTable2 = ["", "N°", "RUT", "DV", "NOMBRE COMPLETO", "FECHAS", "", "INSTITUCIÓN", "CIUDAD", "N° CUENTA", "BANCO", "LOCOM.", "ALIMEN.", "TOTAL"];
            const titleTable3 = ["", "N°", "RUT", "DV", "NOMBRE COMPLETO", "INICIO", "TERM.", "INSTITUCIÓN", "CIUDAD", "N° CUENTA", "BANCO", "LOCOM.", "ALIMEN.", "TOTAL"];
            
            worksheet.addRow(titleTable1);
            worksheet.mergeCells(`B${countRow}:K${countRow}`);
            worksheet.mergeCells(`L${countRow}:N${countRow}`);
            worksheet.getRow(countRow).height = 25;
            // Agregar estilo a la fila
            lastRow = worksheet.lastRow;
            lastRow.eachCell({ includeEmpty: true }, (cell: any, cellNumber: number) => {
                if (cellNumber > 1) {
                    cell.font = fontStyleBold;
                    cell.alignment = { vertical: "middle", horizontal: "center" };
                    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D0CECE" } };
                    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                }
                if (cellNumber > 11) {
                    cell.numFmt = '$#,##0';
                }
            });
            countRow++

            worksheet.addRow(titleTable2);
            lastRow = worksheet.lastRow;
            lastRow.eachCell({ includeEmpty: true }, (cell: any, cellNumber: number) => {
                if (cellNumber == 6) {
                    cell.font = fontStyleBold;
                    cell.alignment = { vertical: "middle", horizontal: "center" };
                    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                }
            });
            worksheet.addRow(titleTable3);
            worksheet.mergeCells(`B${countRow}:B${countRow + 1}`);
            worksheet.mergeCells(`C${countRow}:C${countRow + 1}`);
            worksheet.mergeCells(`D${countRow}:D${countRow + 1}`);
            worksheet.mergeCells(`E${countRow}:E${countRow + 1}`);
            worksheet.mergeCells(`F${countRow}:G${countRow}`);
            worksheet.mergeCells(`H${countRow}:H${countRow + 1}`);
            worksheet.mergeCells(`I${countRow}:I${countRow + 1}`);
            worksheet.mergeCells(`J${countRow}:J${countRow + 1}`);
            worksheet.mergeCells(`K${countRow}:K${countRow + 1}`);
            worksheet.mergeCells(`L${countRow}:L${countRow + 1}`);
            worksheet.mergeCells(`M${countRow}:M${countRow + 1}`);
            worksheet.mergeCells(`N${countRow}:N${countRow + 1}`);
            lastRow = worksheet.lastRow;
            lastRow.eachCell({ includeEmpty: true }, (cell: any, cellNumber: number) => {
                if (cellNumber > 1) {
                    cell.font = fontStyleBold;
                    cell.alignment = { vertical: "middle", horizontal: "center" };
                    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                }
            });
            countRow += 2

            // Agregar datos de estudiantes
            subject.rows.forEach((row: any, index: number) => {
                worksheet.addRow(["", ...row]);
                lastRow = worksheet.lastRow;
                lastRow.eachCell({ includeEmpty: true }, (cell: any, cellNumber: number) => {
                    if (cellNumber > 1) {
                        cell.font = fontStyleNormal;
                        cell.alignment = { vertical: "middle", horizontal: cellAlignment[cellNumber - 2] };
                        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    }
                    if (cellNumber > 11) {
                        cell.numFmt = '$#,##0';
                    }
                });
                countRow++;

                // Añadir al final de una tabla los totales
                if (index + 1 == subject.rows.length) {
                    const cellTotal1 = [null, null, null, null, null, null, null, null, null, null, null, subject.total_transportation, subject.total_food, subject.total_transportation + subject.total_food];
                    const cellTotal2 = [null, null, null,null, null, null, null, null, null, null, null, null, "TOTAL", subject.total];
                    worksheet.addRow(cellTotal1);
                    lastRow = worksheet.lastRow;
                    lastRow.eachCell({ includeEmpty: false }, (cell: any, cellNumber: number) => {
                        cell.font = fontStyleNormal;
                        cell.alignment = { vertical: "middle", horizontal: "right" };
                        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                        cell.numFmt = '$#,##0';
                    });
                    worksheet.addRow(cellTotal2);
                    lastRow = worksheet.lastRow;
                    lastRow.eachCell({ includeEmpty: false }, (cell: any, cellNumber: number) => {
                        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                        if (cellNumber == 13) {
                            cell.alignment = { vertical: "middle", horizontal: "center" };
                            cell.font = fontStyleBold;
                        } else {
                            cell.alignment = { vertical: "middle", horizontal: "right" };
                            cell.font = fontStyleBold;
                            cell.numFmt = '$#,##0';
                        }
                    });
                    countRow += 2;
                }
            });            
        });
        
          res.setHeader('Content-Type', 'application/vnd.openxmlformats');
          res.setHeader('Content-Disposition', 'attachment; filename=dedede.xlsx');

          const buffer = await workbook.xlsx.writeBuffer();
          res.end(buffer);

    } catch (error: any) {
        console.error(error)
        return res.status(500).json({
            msg: "Error en el servidor, comuniquese con el administrador",
            error: error.message
        });
    }
}

}
