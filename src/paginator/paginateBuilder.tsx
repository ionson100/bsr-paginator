import React, {ReactElement} from "react";

export type PaginatorProperty = {
    id?: string,
    next?: string | ReactElement | undefined | null
    previous?: string | ReactElement | undefined | null
    first?: string | ReactElement | undefined | null
    last?: string | ReactElement | undefined | null
    ellipsis?: string | ReactElement | undefined | null
    onButtonClick?: (page: number, pages: number) => void
    isVisibleSide?: boolean
    range?: number
    className?: string
    useDoubleSending?: boolean
    style?: React.CSSProperties | undefined,
    styleButton?: React.CSSProperties | undefined,


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

export class Paginator extends React.Component<PaginatorProperty, ObserverPaginator> {

    private mapPage = new Map<number, pageState>();
    private isAddMap = false
    private refPaginator = React.createRef<HTMLDivElement>()
    private pages: number = 0
    private statePosition: statePosition = statePosition.none

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
    public SetState(totalRows?: number, pageSize?: number, currentPage?: number, callback?:()=>void): void {

        setTimeout(()=>{
            this.setState({
                CurrentPage: currentPage??this.state.CurrentPage,
                PageSize: pageSize??this.state.PageSize,
                TotalRows: totalRows??this.state.TotalRows,
            },callback);
        })


    }

    public get State():{
        readonly PageSize: number;
        readonly PagesCount: number;
        readonly TotalRows: number;
        readonly CurrentPage: number
    }
    {
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
            get PagesCount(){
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


    private innerLeft(list: ReactElement[]) {
        if (this.props.first) {
            list.push(<button
                disabled={this.statePosition === statePosition.first}
                key={'45545'}
                className={'bsr-button-side'}
                onClick={() => {
                    if (this.state.CurrentPage !== 1) {
                        this.Click(1)
                    }
                }}>
                {this.props.first}
            </button>)
        }

        list.push(<button
            disabled={this.statePosition === statePosition.first}
            key={'5656'}
            className={'bsr-button-side'}
            onClick={() => {
                const e = this.state.CurrentPage - 1
                if (e > 0) {
                    this.Click(e)
                }
            }}>
            {this.props.previous ?? 'Previous'}
        </button>)

    }

    private renderLeftSide(list: ReactElement[]) {
        if (this.props.isVisibleSide ?? true) {
            this.innerLeft(list)
            return
        }
        if (this.state.CurrentPage > 1) {
            this.innerLeft(list)
        }
    }

    private innerRight(list: ReactElement[], pages: number) {


        list.push(<button
            disabled={this.statePosition === statePosition.last}
            key={'we4'}
            className={'bsr-button-side'}
            onClick={() => {
                const e = this.state.CurrentPage + 1
                if (e <= pages) {
                    this.Click(e)
                }
            }}>{this.props.next ?? 'Next'}</button>)

        if (this.props.last) {
            list.push(<button
                disabled={this.statePosition === statePosition.last}
                key={'4356'}
                className={'bsr-button-side'}
                onClick={() => {
                    this.Click(pages)
                }}>{this.props.last}</button>)
        }
    }

    private renderRightSide(list: ReactElement[], pages: number) {

        if (this.props.isVisibleSide ?? true) {
            this.innerRight(list, pages)
            return
        }
        if (this.state.CurrentPage !== pages) {
            this.innerRight(list, pages)
        }

    }


    private renderButton() {
        if (!this.refPaginator.current) return
        this.refPaginator.current!.style.display = 'flex'
        if (this.state.CurrentPage <= 0 || this.state.PageSize <=0 || this.state.TotalRows <= 0) {
            this.refPaginator.current!.style.display = 'none'
            return null;
        }
        //alert(this.state.CurrentPage+' '+this.state.PageSize+' '+this.state.TotalRows)
        this.statePosition = statePosition.none
        this.isAddMap = false;
        const list: ReactElement[] = []
        this.pages = Math.ceil(this.state.TotalRows / this.state.PageSize)
        if (this.state.CurrentPage === 1) {
            this.statePosition = statePosition.first
        }

        if (this.state.CurrentPage === this.pages) {

            this.statePosition = statePosition.last
        }


        if ( this.state.TotalRows <= this.state.PageSize || this.pages === 1) {
            list.length = 0;
            this.refPaginator.current!.style.display = 'none'

        }
        const range = this.props.range ?? 3

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
                delta = range + 1;
                if (this.pages > range) {
                    appendPointPost = true;
                }

            } else if (this.state.CurrentPage >= range && this.state.CurrentPage < (this.pages - range+2)) {

                this.isAddMap = true;
                this.mapPage.clear()


                const del = Math.ceil(range / 2)
                appendPointPref = true;
                appendPointPost = true
                start = this.state.CurrentPage - del
                delta = this.state.CurrentPage + range - del;
            } else {

                this.mapPage.clear()
                //const del=Math.ceil(range/2)
                const s = this.pages - range +1
                appendPointPref = true;
                start = s <= 0 ? 1 : s
                delta = this.pages+1
            }
        }


        this.renderLeftSide(list)

        if (appendPointPref) {
            list.push(<div key={'point-prev'}
                           className={'bsr-button-ellipsis'}>{this.props.ellipsis ?? '...'}</div>)
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
            list.push(<button data-pg={i}
                              style={this.props.styleButton}
                              key={`${i}-page`}
                              className={'bsr-button ' + selectClass}
                              onClick={() => {
                                  this.Click(i);
                              }}>{i}</button>)
        }
        if (appendPointPost) {
            list.push(<div key={'point-pres'}
                           className={'bsr-button-ellipsis'}>{this.props.ellipsis ?? '...'}</div>)
        }
        this.renderRightSide(list, this.pages)

        return list


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
                className={this.props.className ?? 'bsr-wrapper-paginator'}>
                {
                    this.renderButton()
                }
            </div>
        );
    }
}