import { Career, Commune, Establishment, Payment, Practice, Subject, User } from "../app/app.associatios";
import formatMoney from "./formattomoney";
import formatRut from "./formattorut";

const getDataWorksheet = async (careers: any[]) => {
    try {
        // Lista que tendra la informacion de cada asignatura enviada en la solicitud
        let data: any = [];

        // Obtener los datos para cada carrera y sus asignaturas
        for (const career of careers) {
            const { code, subjects } = career;

            // Iterar por cada codigo de asignatura que tenga la carrera
            for (const codeSubject of subjects) {
                // Obtener los datos de la carrera y su asignatura, y las practicas asociadas a esta asignatura
                const careerData: any = await Career.findAll({
                    attributes: [
                        "id",
                        "code",
                        "name"
                    ],
                    // 
                    where: {
                        code: code
                    },
                    // Incluir modelos relacionados
                    include: [
                        {
                            attributes: [
                                "id",
                            ],
                            model: Practice,
                            as: "practices",
                            // Falta el filtro para obtener unicamente las practicas activas
                            include: [
                                {
                                    attributes: [
                                        "name",
                                        "pat_last_name",
                                        "mat_last_name",
                                        "rut",
                                        "check_digit"
                                    ],
                                    model: User,
                                    as: "student"
                                },
                                {
                                    attributes: [
                                        "name",
                                        "code",
                                        "type",
                                    ],
                                    model: Subject,
                                    as: "subject",
                                    // Filtrar por el codigo de asignatura enviado en la solicitud y que el tipo de practica sea Profesional
                                    where: {
                                        code: codeSubject,
                                        type: 3 // 3: Profesional
                                    },
                                    order: [
                                        ['code', 'ASC']
                                    ],
                                },
                                {
                                    attributes: [
                                        "account_number",
                                        "bank",
                                        "transportation_amount",
                                        "food_amount"
                                    ],
                                    model: Payment,
                                    as: "payment"
                                },
                                {
                                    attributes: [
                                        "name"
                                    ],
                                    model: Establishment,
                                    as: "establishment",
                                    include: [
                                        {
                                            attributes: [
                                                "name"
                                            ],
                                            model: Commune,
                                            as: "commune"
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    order: [
                        ['name', 'ASC']
                    ],
                    raw: true,
                    nest: true,
                })

                // Objeto que tendra los datos necesarios crear una tabla en el excel
                let subjectTable: any = {}
                // Formatear los datos obtenidos y agregar al arreglo data
                careerData.map((item: any, index: number) => {
                    // Agregar el titulo de la tabla
                    if (!subjectTable.title) {
                        subjectTable.title = `CARRERA ${item.code}: ${item.name} - (${item.practices.subject.code}) - ${item.practices.subject.name}`;
                        subjectTable.rows = [];
                        subjectTable.total_transportation = 0;
                        subjectTable.total_food = 0;
                        subjectTable.total = 0;
                    }
                    // Agregar los datos que tendra cada fila
                    subjectTable.rows = [...subjectTable.rows,
                        [
                            index + 1,
                            formatRut(item.practices.student.rut),
                            item.practices.student.check_digit,
                            `${item.practices.student.name} ${item.practices.student.pat_last_name} ${item.practices.student.mat_last_name}`,
                            null,
                            null,
                            item.practices.establishment.name,
                            item.practices.establishment.commune.name,
                            item.practices.payment.account_number,
                            item.practices.payment.bank,
                            item.practices.payment.transportation_amount,
                            item.practices.payment.food_amount,
                            item.practices.payment.transportation_amount + item.practices.payment.food_amount
                        ]                        
                    ]
                    // Sumar totales de la tabla
                    subjectTable.total_transportation += item.practices.payment.transportation_amount;
                    subjectTable.total_food += item.practices.payment.food_amount;
                    subjectTable.total += item.practices.payment.transportation_amount + item.practices.payment.food_amount;
                })
                // Agregar los datos de la tabla al arreglo data que contendra todos los datos de todas las tablas
                data.push(subjectTable)
            }
        }

        return data;
                
    } catch (error) {
        
    }
}

export default getDataWorksheet;