import React, {ReactElement} from "react";
import './index.css'

export type PaginatorProperty = {
    id?: string,
    next?: string | ReactElement | undefined | null
    previous?: string | ReactElement | undefined | null
    first?: string | ReactElement | undefined | null
    last?: string | ReactElement | undefined | null
    ellipsis?: string | ReactElement | undefined | null
    onButtonClick?: (val: number, pages: number) => void
    isVisibleSide?: boolean
    range?: number
    className?: string
    useDoubleSending?: boolean

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

export class Paginator extends React.Component<PaginatorProperty, ObserverPaginator> {

    private pageClick = false
    private mapPage = new Map<number, pageState>();
    private isAddMap = false
    private refPaginator = React.createRef<HTMLDivElement>()
    private pages: number = 0

    constructor(props: Readonly<PaginatorProperty>) {
        super(props);
        this.state = {TotalRows: 200, PageSize: 10, CurrentPage: 1};
    }

    private setStatePaginator(total: number, page: number, size: number) {

        this.setState({
            CurrentPage: page,
            TotalRows: total,
            PageSize: size
        })
    }

    public get Observer(): ObserverPaginator {

        const THIS = this;

        return {
            get TotalRows() {
                return THIS.state.TotalRows;
            },
            set TotalRows(val: number) {
                THIS.mapPage.clear()
                if (THIS.state.TotalRows === val) return
                THIS.setStatePaginator(val, 1, THIS.state.PageSize)
            },
            get CurrentPage() {
                return THIS.state.CurrentPage;
            },
            set CurrentPage(val: number) {
                if (val > THIS.pages || val <= 0) {
                    throw new Error('CurrentPage must be greater than 0 and less ' + THIS.pages);
                }
                if (THIS.state.CurrentPage === val) return
                THIS.pageClick = true
                THIS.setStatePaginator(THIS.state.TotalRows, val, THIS.state.PageSize)

            },
            get PageSize() {
                return THIS.state.PageSize
            },
            set PageSize(val: number) {
                THIS.mapPage.clear()
                if (THIS.state.PageSize === val) return
                THIS.setStatePaginator(THIS.state.TotalRows, 1, val)
            },

        }
    }

    private Click(val: number) {
        if (this.props.onButtonClick) {
            if (this.pageClick) {
                this.pageClick = false
                this.props.onButtonClick(val, this.pages)
                return
            }
            if (this.props.useDoubleSending) {
                this.props.onButtonClick(val, this.pages)
            } else {
                if (this.state.CurrentPage !== val) {
                    this.props.onButtonClick(val, this.pages)
                }
            }
        }


    }


    private innerLeft(list: ReactElement[]) {
        if (this.props.first) {
            list.push(<div key={'45545'} className={'bsr-button-side'} onClick={() => {
                if (this.state.CurrentPage !== 1) {
                    this.Click(1)
                }
            }}>
                {this.props.first}
            </div>)
        }

        list.push(<div key={'5656'} className={'bsr-button-side'} onClick={() => {
            const e = this.state.CurrentPage - 1
            if (e > 0) {
                this.Click(e)
            }
        }}>
            {this.props.previous ?? 'Previous'}
        </div>)

    }

    private renderLeftSide(list: ReactElement[]) {
        if (this.props.isVisibleSide??true) {
            this.innerLeft(list)
            return
        }
        if (this.state.CurrentPage > 1) {
            this.innerLeft(list)
        }
    }

    private innerRight(list: ReactElement[], pages: number) {

        list.push(<div key={'we4'} className={'bsr-button-side'} onClick={() => {
            const e = this.state.CurrentPage + 1
            if (e <= pages) {
                this.Click(e)
            }
        }}>{this.props.next ?? 'Next'}</div>)

        if (this.props.last) {
            list.push(<div key={'4356'} className={'bsr-button-side'} onClick={() => {
                this.Click(pages)
            }}>{this.props.last}</div>)
        }
    }

    private renderRightSide(list: ReactElement[], pages: number) {

        if (this.props.isVisibleSide??true) {
            this.innerRight(list, pages)
            return
        }
        if (this.state.CurrentPage !== pages) {
            this.innerRight(list, pages)
        }

    }


    private renderButton() {
        this.isAddMap = false;
        const list: ReactElement[] = []
        this.pages = Math.ceil(this.state.TotalRows / this.state.PageSize)


        if (this.state.TotalRows === 0 || this.state.PageSize === 0 || this.state.TotalRows <= this.state.PageSize || this.pages === 1) {
            list.length = 0;
            this.refPaginator.current!.style.display = 'none'
            return null;
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

            } else if (this.state.CurrentPage >= range && this.state.CurrentPage < (this.pages - range)) {

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
                const s = this.pages - range - 1
                appendPointPref = true;
                start = s === 0 ? 1 : s
                delta = this.pages + 1
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

                if (this.pageClick) {
                    this.Click(i);
                }
            }
            list.push(<button key={`${i}-page`} className={'bsr-button ' + selectClass}
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
    public get Paginator(){
        return this.refPaginator.current
    }


    render() {
        return (
            <div ref={this.refPaginator} id={this.props.id} className={this.props.className ?? 'bsr-wrapper-paginator'}>
                {
                    this.renderButton()
                }
            </div>
        );
    }
}