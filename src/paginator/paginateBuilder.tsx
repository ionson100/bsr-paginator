import React, {ReactElement} from "react";
import './index.css'

export type PaginatorProperty = {
    next?: string | ReactElement | undefined | null
    previous?: string | ReactElement | undefined | null
    first?: string | ReactElement | undefined | null
    last?: string | ReactElement | undefined | null
    ellipsis?: string | ReactElement | undefined | null
    onButtonClick?: (val: number,pages:number) => void
    isVisibleSide?: boolean
    range?: number
    classNameButton?: string
    classNameButtonSelectted?: string
    classNameEllipsis?: string
    classNamePoint?: string
    className?: string

}
export type ObserverPaginator = {
    TotalRows: number
    CurrentPage: number
    PageSize: number

}

export class Paginator extends React.Component<PaginatorProperty, ObserverPaginator> {
    private refWrapperPaginator = React.createRef<HTMLDivElement>()
    private pages:number=0

    constructor(props: Readonly<PaginatorProperty>) {
        super(props);
        this.state = {TotalRows: 200, PageSize: 20, CurrentPage: 1};
    }

    setStatePaginator(total: number, page: number, size: number) {
        this.setState({
            CurrentPage: page,
            TotalRows: total,
            PageSize: size
        })
    }

    get Observer(): ObserverPaginator {

        const THIS = this;

        return {
            get TotalRows() {
                return THIS.state.TotalRows;
            },
            set TotalRows(val: number) {
                THIS.setStatePaginator(val, 1, THIS.state.PageSize)
            },
            get CurrentPage() {
                return THIS.state.CurrentPage;
            },
            set CurrentPage(val: number) {
                THIS.setStatePaginator(THIS.state.TotalRows, val, THIS.state.PageSize)
            },
            get PageSize() {
                return THIS.state.PageSize
            },
            set PageSize(val: number) {
                THIS.setStatePaginator(THIS.state.TotalRows, 1, val)
            },

        }
    }

    Click(val: number) {
        if (this.props.onButtonClick) {
            this.props.onButtonClick(val,this.pages)
        }
    }


    innerLeft(list: ReactElement[]) {
        if (this.props.next) {
            list.push(<div className={this.props.classNameEllipsis ?? 'bsr-button-side'} onClick={() => {
                if (this.state.CurrentPage != 1) {
                    this.Click(1)
                }
            }}>
                {this.props.first}
            </div>)
        }
        if (this.props.last) {
            list.push(<div className={this.props.classNameEllipsis ?? 'bsr-button-side'} onClick={() => {
                const e = this.state.CurrentPage - 1
                if (e > 0) {
                    this.Click(e)
                }
            }}>
                {this.props.previous}
            </div>)
        }
    }

    renderLeftSide(list: ReactElement[]) {
        if (this.props.isVisibleSide) {
            this.innerLeft(list)
            return
        }
        if (this.state.CurrentPage > 1) {
            this.innerLeft(list)
        }
    }

    innerRight(list: ReactElement[], pages: number) {
        if (this.props.next) {
            list.push(<div className={this.props.classNameEllipsis ?? 'bsr-button-side'} onClick={() => {
                const e = this.state.CurrentPage + 1
                if (e <= pages) {
                    this.Click(e)
                }
            }}>{this.props.next}</div>)
        }
        if (this.props.last) {
            list.push(<div className={this.props.classNameEllipsis ?? 'bsr-button-side'} onClick={() => {
                this.Click(pages)
            }}>{this.props.last}</div>)
        }
    }

    renderRightSide(list: ReactElement[], pages: number) {

        if (this.props.isVisibleSide) {
            this.innerRight(list, pages)
            return
        }
        if (this.state.CurrentPage != pages) {
            this.innerRight(list, pages)
        }

    }

    renderButton() {
        const list: ReactElement[] = []
        this.pages = Math.ceil(this.state.TotalRows / this.state.PageSize)

        if (this.state.TotalRows === 0 || this.state.PageSize === 0 || this.state.TotalRows <= this.state.PageSize || this.pages === 1) {
            list.length = 0;
            this.refWrapperPaginator.current!.style.display = 'none'
            return null;
        }
        const range = this.props.range ?? 3

        let start: number
        let delta: number;
        let appendPointPost = false;
        let appendPointPref = false;
        if (this.pages <= range) {
            start = 1
            delta = this.pages + 1;

        } else if (this.state.CurrentPage <= range - 1) {


            start = 1
            delta = range + 1;
            if (this.pages > range) {
                appendPointPost = true;
            }

        } else if (this.state.CurrentPage >= range && this.state.CurrentPage < (this.pages - range)) {

            const del=Math.ceil(range/2)
            appendPointPref = true;
            appendPointPost = true
            start = this.state.CurrentPage - del
            delta = this.state.CurrentPage + range - del;
        } else {
            //const del=Math.ceil(range/2)
            const s=this.pages - range - 1
            appendPointPref = true;
            start = s===0?1:s
            delta = this.pages + 1
        }

        this.renderLeftSide(list)

        if (appendPointPref) {
            list.push(<div
                className={this.props.classNameEllipsis ?? 'bsr-button-ellipsis'}>{this.props.ellipsis ?? '...'}</div>)
        }

        for (let i = start; i < delta; i++) {
            let selectClass = ''
            if (this.state.CurrentPage === i) {
                selectClass = this.props.classNameButtonSelectted ?? 'bsr-button-selection'
            }
            list.push(<div className={this.props.classNameButton ?? 'bsr-button ' + selectClass} onClick={() => {
                this.Click(i);
            }}>{i}</div>)
        }
        if (appendPointPost) {
            list.push(<div
                className={this.props.classNameEllipsis ?? 'bsr-button-ellipsis'}>{this.props.ellipsis ?? '...'}</div>)
        }
        this.renderRightSide(list, this.pages)

        return list


    }


    render() {
        return (
            <div ref={this.refWrapperPaginator} className={'bsr-wrapper-paginator'}>
                <div className={this.props.className ?? 'bsr-inner-paginator'}>
                    {
                        this.renderButton()?.map(a => {
                            return a;
                        })
                    }
                </div>
            </div>
        );
    }
}