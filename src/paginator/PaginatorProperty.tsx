
export type EventProperty={
    maxRows: number,
    currentPage: number,
}

export type PaginatorProperty = {
    action?:(event:EventProperty)=>void,
}