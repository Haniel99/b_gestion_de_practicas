import { Career, Establishment, Practice, StudyPlan, Subject } from "../app/app.associatios";


// Obtener los filtros por numero de practica de una carrera
async function getFilterPracticeNumbers(id: number) {
    const practiceNumbersData: Subject[] = await Subject.findAll({
        attributes: [
            "practice_number",
        ],
        include: [
            {
                model: StudyPlan,
                as: "studyPlans",
                attributes: [],
                include: [
                    {
                        model: Career,
                        as: "careers",
                        attributes: [],
                    },
                ]
            }
        ],
        where: {
            '$studyPlans.careers.id$': id
        },
        order: [
            "practice_number"
        ]
    });
    
    const practiceNumbersFilter = practiceNumbersData
        .map( (item: Subject ) => item.practice_number )
        .filter( (item, index, self) => self.indexOf(item) == index )

    return practiceNumbersFilter;
}

// Obtener filtros por codigo de asignatura con sus respectivos nombres de una carrera
async function getFilterSubjects(id: number) {
    const subjectsFilter: Subject[] = await Subject.findAll({
        attributes: [
            "code",
            "name"
        ],
        include: [
            {
                model: StudyPlan,
                as: "studyPlans",
                attributes: [],
                include: [
                    {
                        model: Career,
                        as: "careers",
                        attributes: [],
                    },
                ]
            }
        ],
        where: {
            '$studyPlans.careers.id$': id
        },
        order: [
            "code"
        ]
    });

    /* const subjectsFilter = subjectsData
        .map( (item: Subject ) => {`${item.name} - ${item.code}`} )
        .filter( (item, index, self) => self.indexOf(item) == index ) */

    return subjectsFilter;
}

// Obtener filtros de establecimientos de las practicas de una carrera
async function getFilterEstablishments(id: number) {
    const establishmentsFilter = await Establishment.findAll({
        attributes: [
            "code",
            "name"
        ],
        include: [
            {
                model: Practice,
                as: "practices",
                attributes: []
            }
        ],
        where: {
            '$practices.career_id$': id
        },
        order: [
            "name"
        ]
    })

    return establishmentsFilter
}

// Obtener filtros de los planes de estudio de las practicas de una carrera
async function getFilterStudyPlans(id: number) {
    const studyPlansFilter = await StudyPlan.findAll({
        attributes: [
            "code",
            "name"
        ],
        include: [
            {
                model: Career,
                as: "careers",
                attributes: []
            }
        ],
        where: {
            '$careers.id$': id
        },
        order: [
            ["year", "DESC"],
            "version"
        ]
    })

    return studyPlansFilter
}

export {
    getFilterPracticeNumbers,
    getFilterSubjects,
    getFilterEstablishments,
    getFilterStudyPlans
};