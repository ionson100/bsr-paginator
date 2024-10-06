
export type EventProperty={
    totalRows: number,
    rowsPageCount:number
    currentPage: number,
}
 export type PropertyBox={
    action?:(event:EventProperty)=>void|undefined
    event?:(start:number,finish:number,page:number)=>void,
}


export type PaginatorProperty = {
    box:PropertyBox,
}