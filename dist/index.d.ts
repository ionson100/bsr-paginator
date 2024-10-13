import React, { ReactElement } from 'react';

type PaginatorProperty = {
    id?: string;
    next?: string | ReactElement | undefined | null;
    previous?: string | ReactElement | undefined | null;
    first?: string | ReactElement | undefined | null;
    last?: string | ReactElement | undefined | null;
    ellipsis?: string | ReactElement | undefined | null;
    onChange?: (page: number, sender?: HTMLButtonElement) => void;
    isHidingNavigate?: boolean;
    range?: number;
    className?: string;
    isMoreSends?: boolean;
    style?: React.CSSProperties | undefined;
    styleButton?: React.CSSProperties | undefined;
    styleEllipsis?: React.CSSProperties | undefined;
    styleNavigate?: React.CSSProperties | undefined;
    accessKeyFirst?: string | undefined;
    accessKeyPrevious?: string | undefined;
    accessKeyNext?: string | undefined;
    accessKeyLast?: string | undefined;
    mode?: 'base' | 'richBase' | 'showEllipsis';
};
type ObserverPaginator = {
    TotalRows: number;
    CurrentPage: number;
    PageSize: number;
    Range: number;
    Mode: string;
};
declare enum mySide {
    none = 0,
    first = 1,
    previous = 2,
    next = 3,
    last = 4
}
declare class Paginator extends React.Component<PaginatorProperty, ObserverPaginator> {
    private setClick;
    private list;
    private mapPage;
    private isAddMap;
    private refPaginator;
    private pages;
    private range;
    private mode;
    constructor(props: Readonly<PaginatorProperty>);
    private setStatePaginator;
    SetState(totalRows?: number, pageSize?: number, currentPage?: number, callback?: () => void): void;
    SetRange(value: number, callback?: () => void): void;
    SetMode(value: 'base' | 'richBase' | 'showEllipsis', callback?: () => void): void;
    get State(): {
        readonly PageSize: number;
        readonly PagesCount: number;
        readonly TotalRows: number;
        readonly CurrentPage: number;
        readonly Range: number;
        readonly Mode: string;
    };
    SetCurrentPageAndClick(page: number, callback?: () => void): void;
    private Click;
    isChet: (n: number) => boolean;
    private renderButton;
    get Paginator(): HTMLDivElement | null;
    render(): React.JSX.Element;
    appendButtonEllipsis(): void;
    appendButtonEllipsisRichBase(): void;
    appendButtonPage(label: number, classSelected?: string): void;
    builderStyle(pred: false | boolean | undefined): React.CSSProperties | undefined;
    appendButtonSide(side: mySide): void;
}

export { type ObserverPaginator, Paginator, type PaginatorProperty };
