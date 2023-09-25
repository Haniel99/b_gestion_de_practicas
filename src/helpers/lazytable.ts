import { IActionsLazy, IOptionesLazy } from "../interfaces/IHelpers/lazytable.interface";



const lazyTable = (actions: IActionsLazy, all: boolean = false): any  => {
    if (all) {
        return null
    }
    let options: IOptionesLazy = {};
    
    options.offset = (actions.page-1)*actions.size;
    

}

export default lazyTable;