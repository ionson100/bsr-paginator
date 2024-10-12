import React, {ReactElement} from "react";

import {v4 as getKey} from 'uuid';

export type PaginatorProperty = {
    id?: string,
    next?: string | ReactElement | undefined | null
    previous?: string | ReactElement | undefined | null
    first?: string | ReactElement | undefined | null
    last?: string | ReactElement | undefined | null
    ellipsis?: string | ReactElement | undefined | null
    onPageClick?: (page: number, sender?:HTMLButtonElement) => void
    useHidingMove?: boolean
    range?: number
    className?: string
    useMoreSends?: boolean
    style?: React.CSSProperties | undefined,
    styleButton?: React.CSSProperties | undefined,
    styleEllipsis?: React.CSSProperties | undefined,
    styleButtonMove?: React.CSSProperties | undefined,
    accessKeyFirst?: string | undefined,
    accessKeyPrevious?: string | undefined
    accessKeyNext?: string | undefined
    accessKeyLast?: string | undefined



    mode?: 'base' | 'richBase' | 'showEllipsis'


}

export type ObserverPaginator = {
    TotalRows: number
    CurrentPage: number
    PageSize: number
    Range: number
    Mode:string
}

type pageState = {
    start: number
    delta: number
}

enum mySide {
    none, first, previous, next, last
}

export class Paginator extends React.Component<PaginatorProperty, ObserverPaginator> {
    private setClick = false
    private list: ReactElement[] = []
    private mapPage = new Map<number, pageState>();
    private isAddMap = false
    private refPaginator = React.createRef<HTMLDivElement>()
    private pages: number = 0
    private range = this.props.range ?? 4

    private mode: 'base' | 'richBase' | 'showEllipsis' = this.props.mode ?? 'base'

    constructor(props: Readonly<PaginatorProperty>) {
        super(props);
        this.state = {TotalRows: 0, PageSize: 1, CurrentPage: 1, Range: this.range, Mode:this.mode};
    }

    private setStatePaginator(total: number, page: number, size: number) {

        this.setState({
            CurrentPage: page,
            TotalRows: total,
            PageSize: size,
            Range: this.range,
            Mode: this.mode,
        })
    }

    public SetState(totalRows?: number, pageSize?: number, currentPage?: number, callback?: () => void): void {


        setTimeout(() => {
            this.setState({
                CurrentPage: currentPage ?? this.state.CurrentPage,
                PageSize: pageSize ?? this.state.PageSize,
                TotalRows: totalRows ?? this.state.TotalRows,
                Range: this.range,
                Mode: this.mode,
            }, callback);
        })

    }

    public SetRange(value: number, callback?: () => void): void {
        this.range = value
        this.setState({
            CurrentPage: 1,
            PageSize: this.state.PageSize,
            TotalRows: this.state.TotalRows,
            Range: this.range,
            Mode: this.mode,
        }, callback);
    }
    public SetMode(value: 'base' | 'richBase' | 'showEllipsis', callback?: () => void): void {
        this.mode = value
        this.setState({
            CurrentPage: 1,
            PageSize: this.state.PageSize,
            TotalRows: this.state.TotalRows,
            Range: this.range,
            Mode: this.mode,
        }, callback);
    }

    public get State(): {
        readonly PageSize: number;
        readonly PagesCount: number;
        readonly TotalRows: number;
        readonly CurrentPage: number
        readonly Range: number
        readonly Mode:string
    } {
        const THIS = this;
        return {
            get TotalRows() {
                return THIS.state.TotalRows;
            },
            get CurrentPage() {
                return THIS.state.CurrentPage;
            },
            get PageSize() {
                return THIS.state.PageSize
            },
            get PagesCount() {
                return THIS.pages
            },
            get Range() {
                return THIS.range
            },
            get Mode() {
                return THIS.mode
            }
        }
    }

    public SetCurrentPageAndClick(page: number, callback?: () => void): void {
        if (page > 0) {
            this.setClick = true
        } else {
            throw new Error('Page Purpose. The value must be greater than 0. Your value: ' + page)
        }
        this.setClick = true
        this.setState({
            CurrentPage: page,
            PageSize: this.state.PageSize,
            TotalRows: this.state.TotalRows,
            Range: this.range
        }, callback);
    }

    private Click(val: number,sender:HTMLButtonElement) {
        if (this.props.onPageClick) {

            if (this.props.useMoreSends) {
                this.props.onPageClick(val,sender)
            } else {
                if (this.state.CurrentPage !== val) {
                    this.props.onPageClick(val,sender)
                }
            }
        }
        this.setStatePaginator(this.state.TotalRows, val, this.state.PageSize)
    }

    isChet = (n: number) => !(n % 2);

    private renderButton() {

        this.list.length = 0;
        if (!this.refPaginator.current) return

        this.refPaginator.current!.style.display = 'flex'

        if (this.state.CurrentPage <= 0 || this.state.PageSize <= 0 || this.state.TotalRows <= 0) {
            this.refPaginator.current!.style.display = 'none'
            return null;
        }

        this.isAddMap = false;

        this.pages = Math.ceil(this.state.TotalRows / this.state.PageSize)

        if (this.state.TotalRows <= this.state.PageSize || this.pages === 1) {
            this.list.length = 0;
            this.refPaginator.current!.style.display = 'none'
        }

        let range = this.range

        if (range <= 3) {
            range = 4;
        }

        let start: number

        let delta: number;

        let appendPointPost = false;

        let appendPointPref = false;

        const delS = this.mapPage.get(this.state.CurrentPage)



        if (delS) {
            start = delS.start
            delta = delS.delta;
            appendPointPref = true;
            appendPointPost = true
            this.mapPage.clear();
            this.isAddMap = true

        } else {
            if (this.pages <= range) {
                start = 1
                delta = this.pages + 1;
                this.mapPage.clear()

            } else if (this.state.CurrentPage <= range - 1) {
                this.mapPage.clear()

                start = 1
                switch (this.mode) {
                    case "base": {
                        delta = range + 1;
                        break
                    }
                    case "richBase": {
                        delta = range + 1;
                        break
                    }
                    case "showEllipsis": {
                        delta = range + 1 + 1;
                        break
                    }

                    default: {
                        delta = range + 1;
                        break
                    }
                }
                if (this.pages > range) {
                    appendPointPost = true;
                }

            } else if (this.state.CurrentPage <= (this.pages - range + 2)) {

                this.isAddMap = true;
                this.mapPage.clear()
                appendPointPref = true;
                appendPointPost = true
                switch (this.mode) {
                    case "richBase": {
                        const delRich = Math.floor((range - 2) / 2)
                        start = this.state.CurrentPage - delRich
                        delta = this.state.CurrentPage + delRich + (this.isChet(range) ? 0 : 1);
                        break
                    }
                    default: {
                        const delRich = Math.floor((range) / 2)
                        start = this.state.CurrentPage - delRich
                        delta = this.state.CurrentPage + delRich + (this.isChet(range) ? 0 : 1);
                        break
                    }
                }

            } else {

                this.mapPage.clear()
                let s = this.pages - range + 1
                appendPointPref = true;

                switch (this.mode) {
                    case "base": {
                        start = s <= 0 ? 1 : s
                        delta = this.pages + 1
                        break
                    }
                    case "showEllipsis": {
                        s = s - 1;
                        start = s <= 0 ? 1 : s
                        delta = this.pages + 1
                        break
                    }
                    default : {
                        start = s <= 0 ? 1 : s
                        delta = this.pages + 1
                        break
                    }
                }
            }
        }

        this.appendButtonSide(mySide.first)

        this.appendButtonSide(mySide.previous)

        if (appendPointPref) {
            this.appendButtonEllipsis()
        }

        if (this.mode === 'richBase' && appendPointPref) {
            this.appendButtonPage(1)
            this.appendButtonEllipsisRichBase()
        }

        for (let i = start; i < delta; i++) {

            if (i-1 > start && i < delta - 2 && this.isAddMap) {

                this.mapPage.set(i, {
                    start: start,
                    delta: delta
                })
            }
            let selectClass = ''
            if (this.state.CurrentPage === i) {
                selectClass = 'bsr-button-selection'

                if (this.setClick) {
                    this.setClick = false
                    setTimeout(() => {
                        if (this.props.onPageClick) {
                            this.props.onPageClick(i,undefined)
                        }
                    })
                }
            }
            this.appendButtonPage(i, selectClass)
        }

        if (this.mode === 'richBase' && appendPointPost) {
            this.appendButtonEllipsisRichBase()
            this.appendButtonPage(this.pages)
        }

        if (appendPointPost) {
            this.appendButtonEllipsis()
        }

        this.appendButtonSide(mySide.next)

        this.appendButtonSide(mySide.last)

        return this.list

    }

    public get Paginator() {
        return this.refPaginator.current
    }

    render() {
        return (
            <div
                style={this.props.style}
                ref={this.refPaginator}
                id={this.props.id}
                className={this.props.className ?? 'bsr-paginator'}>
                {
                    this.renderButton()
                }
            </div>
        );
    }

    appendButtonEllipsis() {
        if (this.mode === "showEllipsis") {
            this.list.push(<button
                data-ellipsis={1}
                key={getKey()}
                tabIndex={-1}
                style={this.props.styleEllipsis}
                className={'bsr-button-ellipsis'}>{this.props.ellipsis ?? '...'}</button>)
        }
    }

    appendButtonEllipsisRichBase() {

        this.list.push(<button
            key={getKey()}
            tabIndex={-1}
            style={this.props.styleEllipsis}
            className={'bsr-button-ellipsis'}>{this.props.ellipsis ?? '...'}</button>)
    }

    appendButtonPage(label: number, classSelected?: string) {
        this.list.push(<button data-page={label}
                               style={this.props.styleButton}
                               key={getKey()}
                               className={'bsr-button-page ' + classSelected}
                               onClick={(e) => {
                                   this.Click(label,e.target as HTMLButtonElement);
                               }}>{label}</button>)
    }

    builderStyle(pred: false | boolean | undefined): React.CSSProperties | undefined {
        let myStyle = this.props.styleButtonMove;
        if (pred) {
            if (myStyle) {
                myStyle = {...myStyle, ...{visibility: "hidden"}}
            } else {
                myStyle = {visibility: "hidden"}
            }

        }
        return myStyle;
    }

    appendButtonSide(side: mySide) {
        switch (side) {
            case mySide.none: {
                return
            }
            case mySide.first: {
                if (this.props.first) {

                    // eslint-disable-next-line jsx-a11y/no-access-key
                    this.list.push(<button
                        accessKey={this.props.accessKeyFirst}
                        data-move={'first'}
                        style={this.builderStyle(this.state.CurrentPage <= 1 && this.props.useHidingMove)}
                        disabled={this.state.CurrentPage <= 1}
                        key={getKey()}
                        className={'bsr-button-move'}
                        onClick={(e) => {
                            if (this.state.CurrentPage !== 1) {
                                this.Click(1,e.target as HTMLButtonElement)
                            }
                        }}
                    >{this.props.first}</button>)
                }
                break
            }
            case mySide.previous: {
                if (this.props.previous) {
                    // eslint-disable-next-line jsx-a11y/no-access-key
                    this.list.push(<button
                        accessKey={this.props.accessKeyPrevious}
                        data-move={'previous'}
                        style={this.builderStyle(this.state.CurrentPage <= 1 && this.props.useHidingMove)}
                        disabled={this.state.CurrentPage <= 1}
                        key={getKey()}
                        className={'bsr-button-move'}
                        onClick={(e) => {

                            const value = this.state.CurrentPage - 1
                            if (value > 0) {
                                this.Click(value,e.target as HTMLButtonElement)
                            }
                        }}
                    >{this.props.previous}</button>)
                }
                break
            }
            case mySide.next: {
                if (this.props.next) {
                    // eslint-disable-next-line jsx-a11y/no-access-key
                    this.list.push(<button
                        accessKey={this.props.accessKeyNext}
                        data-move={'next'}
                        style={this.builderStyle(this.state.CurrentPage === this.pages && this.props.useHidingMove)}
                        disabled={this.state.CurrentPage === this.pages}
                        key={getKey()}
                        className={'bsr-button-move'}
                        onClick={(e) => {
                            const value = this.state.CurrentPage + 1
                            if (value <= this.pages) {
                                this.Click(value,e.target as HTMLButtonElement)
                            }
                        }}
                    >{this.props.next}</button>)
                }
                break
            }
            case mySide.last: {
                if (this.props.last) {
                    // eslint-disable-next-line jsx-a11y/no-access-key
                    this.list.push(<button
                        accessKey={this.props.accessKeyLast}
                        data-move={'last'}
                        style={this.builderStyle(this.state.CurrentPage === this.pages && this.props.useHidingMove)}
                        disabled={this.state.CurrentPage === this.pages}
                        key={getKey()}
                        className={'bsr-button-move'}
                        onClick={(e) => {
                            this.Click(this.pages,e.target as HTMLButtonElement)
                        }}
                    >{this.props.last}</button>)
                }
                break
            }
        }
    }
}