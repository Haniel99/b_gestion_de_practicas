import { IActionsLazy, IOptionesLazy } from "../interfaces/IHelpers/lazytable.interface";
const { Op } = require('sequelize');


const lazyTable = (actions: IActionsLazy): any  => {

    let options: IOptionesLazy = {};
    
    //Definir cuantas filas se van a omitir
    options.offset = (actions.page - 1) * actions.size;
    options.limit = actions.size;

    if (actions.filter || actions.search) {
        const filters = actions.filters
        let conditions = [];

        for(let i = 0; i < filters.length; i++) {
            if (filters[i].column.includes(".")) {
                conditions.push({ [`$${filters[i].column}$`] : { [Op[filters[i].op]] : filters[i].value } })
            } else {
                conditions.push({ [filters[i].column] : { [Op[filters[i].op]] : filters[i].value } })
            }
        }
        
        if(actions.filter){
            options.where = {
                [Op.and] : conditions
            }
        } else {
            options.where = {
                [Op.or] : conditions
            }
        }
    }
    
    return options;
}

export default lazyTable;