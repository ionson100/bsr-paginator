import React, {ReactElement} from "react";
import './index.css'

export type PaginatorProperty = {
    next?: string | ReactElement | undefined | null
    previous?: string | ReactElement | undefined | null
    first?: string | ReactElement | undefined | null
    last?: string | ReactElement | undefined | null
    onButtonClick?: (val: number) => void
    isVisibleSide?: boolean
}
export type ObserverPaginator = {
    TotalRows: number
    CurrentPage: number
    PageSize: number
}

export class Paginator extends React.Component<PaginatorProperty, ObserverPaginator> {
    private refWrapperPaginator = React.createRef<HTMLDivElement>()

    constructor(props: Readonly<PaginatorProperty>) {
        super(props);
        this.state = {TotalRows: 30, PageSize: 5, CurrentPage: 1};
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
                THIS.setStatePaginator(val, THIS.state.CurrentPage, THIS.state.PageSize)
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
                THIS.setStatePaginator(THIS.state.TotalRows, THIS.state.CurrentPage, val)
            }
        }
    }

    Click(val: number) {
        if (this.props.onButtonClick) {
            this.props.onButtonClick(val)
        }
    }

    innerLeft(list: ReactElement[]) {
        if (this.props.next) {
            list.push(<div className={'bsr-button'} onClick={() => {
                if (this.state.CurrentPage != 1) {
                    this.Click(1)
                }
            }}>
                {this.props.first}
            </div>)
        }
        if (this.props.last) {
            list.push(<div className={'bsr-button'} onClick={() => {
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
            list.push(<div className={'bsr-button'} onClick={() => {
                const e = this.state.CurrentPage + 1
                if (e <= pages) {
                    this.Click(e)
                }
            }}>{this.props.next}</div>)
        }
        if (this.props.last) {
            list.push(<div className={'bsr-button'} onClick={() => {
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
        const pages: number = Math.ceil(this.state.TotalRows / this.state.PageSize)
        if (this.state.TotalRows === 0 || this.state.PageSize === 0 || this.state.TotalRows <= this.state.PageSize || pages === 1) {
            list.length = 0;
            this.refWrapperPaginator.current!.style.display = 'none'
            return null;
        }

        let start = 0
        let delta = 0;
        if (pages <= 3) {
            start = 1
            delta = pages + 1;
        } else if (this.state.CurrentPage <= 3-1) {

            start = 1
            delta = 3 + 1;
        } else if (this.state.CurrentPage >=3&&this.state.CurrentPage<(pages-3)) {


            start = this.state.CurrentPage-1
            delta = this.state.CurrentPage + 3-1;
        }else{
            start = pages-4
            delta=pages+1
        }

        this.renderLeftSide(list)

        //alert(start +' '+ delta)

        for (let i = start; i < delta; i++) {
            let selectClass = ''
            if (this.state.CurrentPage === i) {
                selectClass = ' bsr-button-selection'
            }
            list.push(<div className={'bsr-button' + selectClass} onClick={() => {
                this.Click(i);
            }}>{i}</div>)
        }
        if (pages > 3) {
            list.push(<div className={'bsr-points'}>...</div>)
        }
        this.renderRightSide(list, pages)

        return list


    }


    render() {
        return (
            <div ref={this.refWrapperPaginator} className={'bsr-wrapper-paginator'}>
                <div className={'bsr-inner-paginator'}>
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