import React, { ReactElement } from "react";
export type PaginatorProperty = {
    id?: string;
    next?: string | ReactElement | undefined | null;
    previous?: string | ReactElement | undefined | null;
    first?: string | ReactElement | undefined | null;
    last?: string | ReactElement | undefined | null;
    ellipsis?: string | ReactElement | undefined | null;
    onButtonClick?: (page: number, pages: number) => void;
    useHidingSides?: boolean;
    range?: number;
    className?: string;
    useDoubleSending?: boolean;
    style?: React.CSSProperties | undefined;
    styleButton?: React.CSSProperties | undefined;
    mode?: 'base' | 'richBase' | 'showEllipsis';
};
export type ObserverPaginator = {
    TotalRows: number;
    CurrentPage: number;
    PageSize: number;
};
declare enum mySide {
    none = 0,
    first = 1,
    previous = 2,
    next = 3,
    last = 4
}
export declare class Paginator extends React.Component<PaginatorProperty, ObserverPaginator> {
    private MyState;
    private list;
    private mapPage;
    private isAddMap;
    private refPaginator;
    private pages;
    private statePosition;
    private mode;
    constructor(props: Readonly<PaginatorProperty>);
    private setStatePaginator;
    SetState(totalRows?: number, pageSize?: number, currentPage?: number, callback?: () => void): void;
    get State(): {
        readonly PageSize: number;
        readonly PagesCount: number;
        readonly TotalRows: number;
        readonly CurrentPage: number;
    };
    private Click;
    isChet: (n: number) => boolean;
    private renderButton;
    get Paginator(): HTMLDivElement | null;
    render(): React.JSX.Element;
    appendButtonEllipsis(): void;
    appendButtonEllipsisRichBase(): void;
    appendButtonPage(label: number, classSelected?: string): void;
    appendButtonSide(side: mySide): void;
}
export {};
