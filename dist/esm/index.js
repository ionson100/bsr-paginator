import React from 'react';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var statePosition;
(function (statePosition) {
    statePosition[statePosition["none"] = -1] = "none";
    statePosition[statePosition["first"] = 0] = "first";
    statePosition[statePosition["last"] = 1] = "last";
})(statePosition || (statePosition = {}));
var Paginator = /** @class */ (function (_super) {
    __extends(Paginator, _super);
    function Paginator(props) {
        var _this = _super.call(this, props) || this;
        _this.mapPage = new Map();
        _this.isAddMap = false;
        _this.refPaginator = React.createRef();
        _this.pages = 0;
        _this.statePosition = statePosition.none;
        _this.state = { TotalRows: 0, PageSize: 1, CurrentPage: 1 };
        return _this;
    }
    Paginator.prototype.setStatePaginator = function (total, page, size) {
        this.setState({
            CurrentPage: page,
            TotalRows: total,
            PageSize: size
        });
    };
    Paginator.prototype.SetState = function (totalRows, pageSize, currentPage, callback) {
        var _this = this;
        setTimeout(function () {
            _this.setState({
                CurrentPage: currentPage !== null && currentPage !== void 0 ? currentPage : _this.state.CurrentPage,
                PageSize: pageSize !== null && pageSize !== void 0 ? pageSize : _this.state.PageSize,
                TotalRows: totalRows !== null && totalRows !== void 0 ? totalRows : _this.state.TotalRows,
            }, callback);
        });
    };
    Object.defineProperty(Paginator.prototype, "State", {
        get: function () {
            var THIS = this;
            return {
                get TotalRows() {
                    return THIS.state.TotalRows;
                },
                get CurrentPage() {
                    return THIS.state.CurrentPage;
                },
                get PageSize() {
                    return THIS.state.PageSize;
                },
                get PagesCount() {
                    return THIS.pages;
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    Paginator.prototype.Click = function (val) {
        if (this.props.onButtonClick) {
            if (this.props.useDoubleSending) {
                this.props.onButtonClick(val, this.pages);
            }
            else {
                if (this.state.CurrentPage !== val) {
                    this.props.onButtonClick(val, this.pages);
                }
            }
        }
        this.setStatePaginator(this.state.TotalRows, val, this.state.PageSize);
    };
    Paginator.prototype.innerLeft = function (list) {
        var _this = this;
        var _a;
        if (this.props.first) {
            list.push(React.createElement("button", { disabled: this.statePosition === statePosition.first, key: '45545', className: 'bsr-button-side', onClick: function () {
                    if (_this.state.CurrentPage !== 1) {
                        _this.Click(1);
                    }
                } }, this.props.first));
        }
        list.push(React.createElement("button", { disabled: this.statePosition === statePosition.first, key: '5656', className: 'bsr-button-side', onClick: function () {
                var e = _this.state.CurrentPage - 1;
                if (e > 0) {
                    _this.Click(e);
                }
            } }, (_a = this.props.previous) !== null && _a !== void 0 ? _a : 'Previous'));
    };
    Paginator.prototype.renderLeftSide = function (list) {
        var _a;
        if ((_a = this.props.isVisibleSide) !== null && _a !== void 0 ? _a : true) {
            this.innerLeft(list);
            return;
        }
        if (this.state.CurrentPage > 1) {
            this.innerLeft(list);
        }
    };
    Paginator.prototype.innerRight = function (list, pages) {
        var _this = this;
        var _a;
        list.push(React.createElement("button", { disabled: this.statePosition === statePosition.last, key: 'we4', className: 'bsr-button-side', onClick: function () {
                var e = _this.state.CurrentPage + 1;
                if (e <= pages) {
                    _this.Click(e);
                }
            } }, (_a = this.props.next) !== null && _a !== void 0 ? _a : 'Next'));
        if (this.props.last) {
            list.push(React.createElement("button", { disabled: this.statePosition === statePosition.last, key: '4356', className: 'bsr-button-side', onClick: function () {
                    _this.Click(pages);
                } }, this.props.last));
        }
    };
    Paginator.prototype.renderRightSide = function (list, pages) {
        var _a;
        if ((_a = this.props.isVisibleSide) !== null && _a !== void 0 ? _a : true) {
            this.innerRight(list, pages);
            return;
        }
        if (this.state.CurrentPage !== pages) {
            this.innerRight(list, pages);
        }
    };
    Paginator.prototype.renderButton = function () {
        var _this = this;
        var _a, _b, _c;
        if (!this.refPaginator.current)
            return;
        this.refPaginator.current.style.display = 'flex';
        if (this.state.CurrentPage <= 0 || this.state.PageSize <= 0 || this.state.TotalRows <= 0) {
            this.refPaginator.current.style.display = 'none';
            return null;
        }
        //alert(this.state.CurrentPage+' '+this.state.PageSize+' '+this.state.TotalRows)
        this.statePosition = statePosition.none;
        this.isAddMap = false;
        var list = [];
        this.pages = Math.ceil(this.state.TotalRows / this.state.PageSize);
        if (this.state.CurrentPage === 1) {
            this.statePosition = statePosition.first;
        }
        if (this.state.CurrentPage === this.pages) {
            this.statePosition = statePosition.last;
        }
        if (this.state.TotalRows <= this.state.PageSize || this.pages === 1) {
            list.length = 0;
            this.refPaginator.current.style.display = 'none';
        }
        var range = (_a = this.props.range) !== null && _a !== void 0 ? _a : 3;
        var start;
        var delta;
        var appendPointPost = false;
        var appendPointPref = false;
        var delS = this.mapPage.get(this.state.CurrentPage);
        if (delS) {
            start = delS.start;
            delta = delS.delta;
            appendPointPref = true;
            appendPointPost = true;
            this.mapPage.clear();
            this.isAddMap = true;
        }
        else {
            if (this.pages <= range) {
                start = 1;
                delta = this.pages + 1;
                this.mapPage.clear();
            }
            else if (this.state.CurrentPage <= range - 1) {
                this.mapPage.clear();
                start = 1;
                delta = range + 1;
                if (this.pages > range) {
                    appendPointPost = true;
                }
            }
            else if (this.state.CurrentPage >= range && this.state.CurrentPage < (this.pages - range + 2)) {
                this.isAddMap = true;
                this.mapPage.clear();
                var del = Math.ceil(range / 2);
                appendPointPref = true;
                appendPointPost = true;
                start = this.state.CurrentPage - del;
                delta = this.state.CurrentPage + range - del;
            }
            else {
                this.mapPage.clear();
                //const del=Math.ceil(range/2)
                var s = this.pages - range + 1;
                appendPointPref = true;
                start = s <= 0 ? 1 : s;
                delta = this.pages + 1;
            }
        }
        this.renderLeftSide(list);
        if (appendPointPref) {
            list.push(React.createElement("div", { key: 'point-prev', className: 'bsr-button-ellipsis' }, (_b = this.props.ellipsis) !== null && _b !== void 0 ? _b : '...'));
        }
        var _loop_1 = function (i) {
            if (i > start && i < delta - 1 && this_1.isAddMap) {
                this_1.mapPage.set(i, {
                    start: start,
                    delta: delta
                });
            }
            var selectClass = '';
            if (this_1.state.CurrentPage === i) {
                selectClass = 'bsr-button-selection';
            }
            list.push(React.createElement("button", { "data-pg": i, style: this_1.props.styleButton, key: "".concat(i, "-page"), className: 'bsr-button ' + selectClass, onClick: function () {
                    _this.Click(i);
                } }, i));
        };
        var this_1 = this;
        for (var i = start; i < delta; i++) {
            _loop_1(i);
        }
        if (appendPointPost) {
            list.push(React.createElement("div", { key: 'point-pres', className: 'bsr-button-ellipsis' }, (_c = this.props.ellipsis) !== null && _c !== void 0 ? _c : '...'));
        }
        this.renderRightSide(list, this.pages);
        return list;
    };
    Object.defineProperty(Paginator.prototype, "Paginator", {
        get: function () {
            return this.refPaginator.current;
        },
        enumerable: false,
        configurable: true
    });
    Paginator.prototype.render = function () {
        var _a;
        return (React.createElement("div", { style: this.props.style, ref: this.refPaginator, id: this.props.id, className: (_a = this.props.className) !== null && _a !== void 0 ? _a : 'bsr-wrapper-paginator' }, this.renderButton()));
    };
    return Paginator;
}(React.Component));

export { Paginator };
