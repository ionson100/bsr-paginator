import React, { ReactElement } from "react";
export type PaginatorProperty = {
    id?: string;
    next?: string | ReactElement | undefined | null;
    previous?: string | ReactElement | undefined | null;
    first?: string | ReactElement | undefined | null;
    last?: string | ReactElement | undefined | null;
    ellipsis?: string | ReactElement | undefined | null;
    onButtonClick?: (val: number, pages: number) => void;
    isVisibleSide?: boolean;
    range?: number;
    className?: string;
    useDoubleSending?: boolean;
    style?: React.CSSProperties | undefined;
    styleButton?: React.CSSProperties | undefined;
};
export type ObserverPaginator = {
    TotalRows: number;
    CurrentPage: number;
    PageSize: number;
};
export declare class Paginator extends React.Component<PaginatorProperty, ObserverPaginator> {
    private sdd;
    private pageClick;
    private mapPage;
    private isAddMap;
    private refPaginator;
    private pages;
    private statePosition;
    constructor(props: Readonly<PaginatorProperty>);
    private setStatePaginator;
    get Observer(): {
        InitPaginator?(totalRows: number, pageSize: number, currentPage: number): void;
        PageSize: number;
        TotalRows: number;
        CurrentPage: number;
    };
    private Click;
    private innerLeft;
    private renderLeftSide;
    private innerRight;
    private renderRightSide;
    private renderButton;
    get Paginator(): HTMLDivElement | null;
    render(): React.JSX.Element;
}
