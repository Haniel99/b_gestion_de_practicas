import { Includeable, Order, WhereOptions } from "sequelize";


export interface IActionsLazy {
    page: number,
    sort: boolean,
    sort_type: string,
    sort_by: string,
    filter: boolean,
    filters:  string[],
    size: number
}

export interface IOptionesLazy{
    where?: WhereOptions<any>,
    order?: Order,
    offset?: number,
    limit?: number,
    include?: Includeable | Includeable[]
}
