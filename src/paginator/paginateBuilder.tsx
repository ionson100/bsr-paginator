import React, {CSSProperties, ReactElement} from "react";

import {v4 as uuidv4} from 'uuid';

export type PaginatorProperty = {
    id?: string,
    next?: string | ReactElement | undefined | null
    previous?: string | ReactElement | undefined | null
    first?: string | ReactElement | undefined | null
    last?: string | ReactElement | undefined | null
    ellipsis?: string | ReactElement | undefined | null
    onButtonClick?: (page: number, pages: number) => void
    useHidingSides?: boolean
    range?: number
    className?: string
    useDoubleSending?: boolean
    style?: React.CSSProperties | undefined,
    styleButton?: React.CSSProperties | undefined,
    mode?: 'base' | 'richBase' | 'showEllipsis'


}
export type ObserverPaginator = {
    TotalRows: number
    CurrentPage: number
    PageSize: number
}
type pageState = {
    start: number
    delta: number
}

enum statePosition {
    none = -1, first = 0, last
}

enum myState {
    none, first, middle, finish
}

enum mySide {
    none, first, previous, next, last
}

export class Paginator extends React.Component<PaginatorProperty, ObserverPaginator> {
    private MyState: myState = myState.none
    private list: ReactElement[] = []
    private mapPage = new Map<number, pageState>();
    private isAddMap = false
    private refPaginator = React.createRef<HTMLDivElement>()
    private pages: number = 0
    private statePosition: statePosition = statePosition.none
    private mode: 'base' | 'richBase' | 'showEllipsis' = this.props.mode ?? 'base'

    constructor(props: Readonly<PaginatorProperty>) {
        super(props);
        this.state = {TotalRows: 0, PageSize: 1, CurrentPage: 1};
    }

    private setStatePaginator(total: number, page: number, size: number) {

        this.setState({
            CurrentPage: page,
            TotalRows: total,
            PageSize: size
        })
    }

    public SetState(totalRows?: number, pageSize?: number, currentPage?: number, callback?: () => void): void {

        setTimeout(() => {
            this.setState({
                CurrentPage: currentPage ?? this.state.CurrentPage,
                PageSize: pageSize ?? this.state.PageSize,
                TotalRows: totalRows ?? this.state.TotalRows,
            }, callback);
        })


    }

    public get State(): {
        readonly PageSize: number;
        readonly PagesCount: number;
        readonly TotalRows: number;
        readonly CurrentPage: number
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
            }
        }
    }

    private Click(val: number) {
        if (this.props.onButtonClick) {

            if (this.props.useDoubleSending) {
                this.props.onButtonClick(val, this.pages)
            } else {
                if (this.state.CurrentPage !== val) {
                    this.props.onButtonClick(val, this.pages)
                }
            }
        }
        this.setStatePaginator(this.state.TotalRows, val, this.state.PageSize)
    }

   isChet = (n:number) => !(n % 2);

    private renderButton() {

        this.list.length = 0;
        if (!this.refPaginator.current) return
        this.refPaginator.current!.style.display = 'flex'
        if (this.state.CurrentPage <= 0 || this.state.PageSize <= 0 || this.state.TotalRows <= 0) {
            this.refPaginator.current!.style.display = 'none'
            return null;
        }
        //alert(this.state.CurrentPage+' '+this.state.PageSize+' '+this.state.TotalRows)
        this.statePosition = statePosition.none
        this.isAddMap = false;

        this.pages = Math.ceil(this.state.TotalRows / this.state.PageSize)
        if (this.state.CurrentPage === 1) {
            this.statePosition = statePosition.first
        }

        if (this.state.CurrentPage === this.pages) {

            this.statePosition = statePosition.last
        }


        if (this.state.TotalRows <= this.state.PageSize || this.pages === 1) {
            this.list.length = 0;
            this.refPaginator.current!.style.display = 'none'

        }
        let range = this.props.range??4
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
            this.MyState = myState.none

        } else {
            if (this.pages <= range) {
                start = 1
                delta = this.pages + 1;
                this.mapPage.clear()

            } else if (this.state.CurrentPage <= range - 2) {
                this.mapPage.clear()

                start = 1
                switch (this.mode) {
                    case "base": {
                        delta = range + 1;
                        break
                    }
                    case "richBase": {
                        delta = range + 1 ;
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
                this.MyState = myState.first

            } else if (this.state.CurrentPage <= (this.pages - range + 2)) {

                this.isAddMap = true;
                this.mapPage.clear()
                const del = Math.ceil(range / 2)
                appendPointPref = true;
                appendPointPost = true
                switch (this.mode){
                    case "richBase":{
                        const delRich = Math.floor((range-2)/2)

                        start = this.state.CurrentPage - delRich
                        delta = this.state.CurrentPage + delRich+(this.isChet(range)?0:1);
                        break
                    }
                    default:{
                        start = this.state.CurrentPage - del
                        delta = this.state.CurrentPage + range - del;
                        break
                    }
                }


                this.MyState = myState.middle
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


                this.MyState = myState.finish
            }
        }

        this.appendButtonSide(mySide.first)
        this.appendButtonSide(mySide.previous)



        if (appendPointPref) {
            this.appendButtonEllipsis()
        }
        if(this.mode==='richBase'&&appendPointPref){
            this.appendButtonPage(1)
            this.appendButtonEllipsisRichBase()
        }


        for (let i = start; i < delta; i++) {
            if (i > start && i < delta - 1 && this.isAddMap) {
                this.mapPage.set(i, {
                    start: start,
                    delta: delta
                })
            }
            let selectClass = ''
            if (this.state.CurrentPage === i) {
                selectClass = 'bsr-button-selection'

            }
            this.appendButtonPage(i, selectClass)
        }
        if(this.mode==='richBase'&&appendPointPost){
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
            this.list.push(<button key={uuidv4()}
                                   className={'bsr-button-ellipsis'}>{this.props.ellipsis ?? '...'}</button>)
        }
    }

    appendButtonEllipsisRichBase() {

        this.list.push(<button key={'sdsd'+uuidv4()}
                               className={'bsr-button-ellipsis'}>{this.props.ellipsis ?? '...'}</button>)
    }

    appendButtonPage(label: number, classSelected?: string) {
        this.list.push(<button data-pg={label}
                               style={this.props.styleButton}
                               key={uuidv4()}
                               className={'bsr-button ' + classSelected}
                               onClick={() => {
                                   this.Click(label);
                               }}>{label}</button>)
    }

    appendButtonSide(side: mySide) {
        switch (side) {
            case mySide.none: {
                return
            }
            case mySide.first: {
                if (this.props.first) {
                    let myStyle: CSSProperties|undefined =undefined;
                    if(this.state.CurrentPage <= 1&&this.props.useHidingSides){
                        myStyle={visibility:"hidden"}
                    }
                    this.list.push(<button
                        style={myStyle}
                        disabled={this.state.CurrentPage <= 1}
                        key={uuidv4()}
                        className={'bsr-button-side'}
                        onClick={() => {
                            if (this.state.CurrentPage !== 1) {
                                this.Click(1)
                            }
                        }}
                    >{this.props.first}</button>)
                }
                break
            }
            case mySide.previous: {
                if (this.props.previous) {
                    let myStyle: CSSProperties|undefined =undefined;
                    if(this.state.CurrentPage <= 1&&this.props.useHidingSides){
                        myStyle={visibility:"hidden"}
                    }
                    this.list.push(<button
                        style={myStyle}
                        disabled={this.state.CurrentPage <= 1}
                        key={uuidv4()}
                        className={'bsr-button-side'}
                        onClick={() => {

                            const e = this.state.CurrentPage - 1
                            if (e > 0) {
                                this.Click(e)
                            }
                        }}
                    >{this.props.previous}</button>)
                }
                break
            }
            case mySide.next: {
                if (this.props.next) {

                    let myStyle: CSSProperties|undefined =undefined;
                    if(this.state.CurrentPage === this.pages&&this.props.useHidingSides){
                        myStyle={visibility:"hidden"}
                    }


                    this.list.push(<button
                        style={myStyle}
                        disabled={this.state.CurrentPage === this.pages}
                        key={uuidv4()}
                        className={'bsr-button-side'}
                        onClick={() => {
                            const e = this.state.CurrentPage + 1
                            if (e <= this.pages) {
                                this.Click(e)
                            }
                        }}
                    >{this.props.next}</button>)
                }
                break
            }
            case mySide.last: {
                if (this.props.last) {
                    let myStyle: CSSProperties|undefined =undefined;
                    if(this.state.CurrentPage === this.pages&&this.props.useHidingSides){
                        myStyle={visibility:"hidden"}
                    }

                    this.list.push(<button
                        style={myStyle}
                        disabled={this.state.CurrentPage === this.pages}
                        key={uuidv4()}
                        className={'bsr-button-side'}
                        onClick={() => {
                            this.Click(this.pages)
                        }}
                    >{this.props.last}</button>)
                }
                break
            }
        }
    }
}