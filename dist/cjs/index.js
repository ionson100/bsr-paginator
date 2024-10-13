'use strict';

var React = require('react');

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

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  //
  // Note to future-self: No, you can't remove the `toLowerCase()` call.
  // REF: https://github.com/uuidjs/uuid/pull/677#issuecomment-1757351351
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).

var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }
  return getRandomValues(rnds8);
}

var randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native = {
  randomUUID
};

function v4(options, buf, offset) {
  if (native.randomUUID && !buf && !options) {
    return native.randomUUID();
  }
  options = options || {};
  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80;
  return unsafeStringify(rnds);
}

var mySide;
(function (mySide) {
    mySide[mySide["none"] = 0] = "none";
    mySide[mySide["first"] = 1] = "first";
    mySide[mySide["previous"] = 2] = "previous";
    mySide[mySide["next"] = 3] = "next";
    mySide[mySide["last"] = 4] = "last";
})(mySide || (mySide = {}));
var Paginator = /** @class */ (function (_super) {
    __extends(Paginator, _super);
    function Paginator(props) {
        var _this = this;
        var _a, _b;
        _this = _super.call(this, props) || this;
        _this.setClick = false;
        _this.list = [];
        _this.mapPage = new Map();
        _this.isAddMap = false;
        _this.refPaginator = React.createRef();
        _this.pages = 0;
        _this.range = (_a = _this.props.range) !== null && _a !== void 0 ? _a : 4;
        _this.mode = (_b = _this.props.mode) !== null && _b !== void 0 ? _b : 'base';
        _this.isChet = function (n) { return !(n % 2); };
        _this.state = { TotalRows: 0, PageSize: 1, CurrentPage: 1, Range: _this.range, Mode: _this.mode };
        return _this;
    }
    Paginator.prototype.setStatePaginator = function (total, page, size) {
        this.setState({
            CurrentPage: page,
            TotalRows: total,
            PageSize: size,
            Range: this.range,
            Mode: this.mode,
        });
    };
    Paginator.prototype.SetState = function (totalRows, pageSize, currentPage, callback) {
        var _this = this;
        setTimeout(function () {
            _this.setState({
                CurrentPage: currentPage !== null && currentPage !== void 0 ? currentPage : _this.state.CurrentPage,
                PageSize: pageSize !== null && pageSize !== void 0 ? pageSize : _this.state.PageSize,
                TotalRows: totalRows !== null && totalRows !== void 0 ? totalRows : _this.state.TotalRows,
                Range: _this.range,
                Mode: _this.mode,
            }, callback);
        });
    };
    Paginator.prototype.SetRange = function (value, callback) {
        this.range = value;
        this.setState({
            CurrentPage: 1,
            PageSize: this.state.PageSize,
            TotalRows: this.state.TotalRows,
            Range: this.range,
            Mode: this.mode,
        }, callback);
    };
    Paginator.prototype.SetMode = function (value, callback) {
        this.mode = value;
        this.setState({
            CurrentPage: 1,
            PageSize: this.state.PageSize,
            TotalRows: this.state.TotalRows,
            Range: this.range,
            Mode: this.mode,
        }, callback);
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
                },
                get Range() {
                    return THIS.range;
                },
                get Mode() {
                    return THIS.mode;
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    Paginator.prototype.SetCurrentPageAndClick = function (page, callback) {
        if (page > 0) {
            this.setClick = true;
        }
        else {
            throw new Error('Page Purpose. The value must be greater than 0. Your value: ' + page);
        }
        this.setClick = true;
        this.setState({
            CurrentPage: page,
            PageSize: this.state.PageSize,
            TotalRows: this.state.TotalRows,
            Range: this.range
        }, callback);
    };
    Paginator.prototype.Click = function (val, sender) {
        if (this.props.onPageClick) {
            if (this.props.useMoreSends) {
                this.props.onPageClick(val, sender);
            }
            else {
                if (this.state.CurrentPage !== val) {
                    this.props.onPageClick(val, sender);
                }
            }
        }
        this.setStatePaginator(this.state.TotalRows, val, this.state.PageSize);
    };
    Paginator.prototype.renderButton = function () {
        var _this = this;
        this.list.length = 0;
        if (!this.refPaginator.current)
            return;
        this.refPaginator.current.style.display = 'flex';
        if (this.state.CurrentPage <= 0 || this.state.PageSize <= 0 || this.state.TotalRows <= 0) {
            this.refPaginator.current.style.display = 'none';
            return null;
        }
        this.isAddMap = false;
        this.pages = Math.ceil(this.state.TotalRows / this.state.PageSize);
        if (this.state.TotalRows <= this.state.PageSize || this.pages === 1) {
            this.list.length = 0;
            this.refPaginator.current.style.display = 'none';
        }
        var range = this.range;
        if (range <= 3) {
            range = 4;
        }
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
            else if (this.state.CurrentPage <= range - 2) {
                this.mapPage.clear();
                start = 1;
                switch (this.mode) {
                    case "base": {
                        delta = range + 1;
                        break;
                    }
                    case "richBase": {
                        delta = range + 1;
                        break;
                    }
                    case "showEllipsis": {
                        delta = range + 1 + 1;
                        break;
                    }
                    default: {
                        delta = range + 1;
                        break;
                    }
                }
                if (this.pages > range) {
                    appendPointPost = true;
                }
            }
            else if (this.state.CurrentPage <= (this.pages - range + 2)) {
                this.isAddMap = true;
                this.mapPage.clear();
                appendPointPref = true;
                appendPointPost = true;
                switch (this.mode) {
                    case "richBase": {
                        var delRich = Math.floor((range - 2) / 2);
                        start = this.state.CurrentPage - delRich;
                        delta = this.state.CurrentPage + delRich + (this.isChet(range) ? 0 : 1);
                        break;
                    }
                    default: {
                        var delRich = Math.floor((range) / 2);
                        start = this.state.CurrentPage - delRich;
                        delta = this.state.CurrentPage + delRich + (this.isChet(range) ? 0 : 1);
                        break;
                    }
                }
            }
            else {
                this.mapPage.clear();
                var s = this.pages - range + 1;
                appendPointPref = true;
                switch (this.mode) {
                    case "base": {
                        start = s <= 0 ? 1 : s;
                        delta = this.pages + 1;
                        break;
                    }
                    case "showEllipsis": {
                        s = s - 1;
                        start = s <= 0 ? 1 : s;
                        delta = this.pages + 1;
                        break;
                    }
                    default: {
                        start = s <= 0 ? 1 : s;
                        delta = this.pages + 1;
                        break;
                    }
                }
            }
        }
        this.appendButtonSide(mySide.first);
        this.appendButtonSide(mySide.previous);
        if (appendPointPref) {
            this.appendButtonEllipsis();
        }
        if (this.mode === 'richBase' && appendPointPref) {
            this.appendButtonPage(1);
            this.appendButtonEllipsisRichBase();
        }
        var _loop_1 = function (i) {
            if (i - 1 > start && i < delta - 2 && this_1.isAddMap) {
                this_1.mapPage.set(i, {
                    start: start,
                    delta: delta
                });
            }
            var selectClass = '';
            if (this_1.state.CurrentPage === i) {
                selectClass = 'bsr-button-selection';
                if (this_1.setClick) {
                    this_1.setClick = false;
                    setTimeout(function () {
                        if (_this.props.onPageClick) {
                            _this.props.onPageClick(i, undefined);
                        }
                    });
                }
            }
            this_1.appendButtonPage(i, selectClass);
        };
        var this_1 = this;
        for (var i = start; i < delta; i++) {
            _loop_1(i);
        }
        if (this.mode === 'richBase' && appendPointPost) {
            this.appendButtonEllipsisRichBase();
            this.appendButtonPage(this.pages);
        }
        if (appendPointPost) {
            this.appendButtonEllipsis();
        }
        this.appendButtonSide(mySide.next);
        this.appendButtonSide(mySide.last);
        return this.list;
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
        return (React.createElement("div", { style: this.props.style, ref: this.refPaginator, id: this.props.id, className: (_a = this.props.className) !== null && _a !== void 0 ? _a : 'bsr-paginator' }, this.renderButton()));
    };
    Paginator.prototype.appendButtonEllipsis = function () {
        var _a;
        if (this.mode === "showEllipsis") {
            this.list.push(React.createElement("button", { "data-ellipsis": 1, key: v4(), tabIndex: -1, style: this.props.styleEllipsis, className: 'bsr-button-ellipsis' }, (_a = this.props.ellipsis) !== null && _a !== void 0 ? _a : '...'));
        }
    };
    Paginator.prototype.appendButtonEllipsisRichBase = function () {
        var _a;
        this.list.push(React.createElement("button", { key: v4(), tabIndex: -1, style: this.props.styleEllipsis, className: 'bsr-button-ellipsis' }, (_a = this.props.ellipsis) !== null && _a !== void 0 ? _a : '...'));
    };
    Paginator.prototype.appendButtonPage = function (label, classSelected) {
        var _this = this;
        this.list.push(React.createElement("button", { "data-page": label, style: this.props.styleButton, key: v4(), className: 'bsr-button-page ' + classSelected, onClick: function (e) {
                _this.Click(label, e.target);
            } }, label));
    };
    Paginator.prototype.builderStyle = function (pred) {
        var myStyle = this.props.styleButtonNavigate;
        if (pred) {
            if (myStyle) {
                myStyle = __assign(__assign({}, myStyle), { visibility: "hidden" });
            }
            else {
                myStyle = { visibility: "hidden" };
            }
        }
        return myStyle;
    };
    Paginator.prototype.appendButtonSide = function (side) {
        var _this = this;
        switch (side) {
            case mySide.none: {
                return;
            }
            case mySide.first: {
                if (this.props.first) {
                    // eslint-disable-next-line jsx-a11y/no-access-key
                    this.list.push(React.createElement("button", { accessKey: this.props.accessKeyFirst, "data-navigate": 'first', style: this.builderStyle(this.state.CurrentPage <= 1 && this.props.useHidingNavigate), disabled: this.state.CurrentPage <= 1, key: v4(), className: 'bsr-button-navigate', onClick: function (e) {
                            if (_this.state.CurrentPage !== 1) {
                                _this.Click(1, e.target);
                            }
                        } }, this.props.first));
                }
                break;
            }
            case mySide.previous: {
                if (this.props.previous) {
                    // eslint-disable-next-line jsx-a11y/no-access-key
                    this.list.push(React.createElement("button", { accessKey: this.props.accessKeyPrevious, "data-navigate": 'previous', style: this.builderStyle(this.state.CurrentPage <= 1 && this.props.useHidingNavigate), disabled: this.state.CurrentPage <= 1, key: v4(), className: 'bsr-button-navigate', onClick: function (e) {
                            var value = _this.state.CurrentPage - 1;
                            if (value > 0) {
                                _this.Click(value, e.target);
                            }
                        } }, this.props.previous));
                }
                break;
            }
            case mySide.next: {
                if (this.props.next) {
                    // eslint-disable-next-line jsx-a11y/no-access-key
                    this.list.push(React.createElement("button", { accessKey: this.props.accessKeyNext, "data-navigate": 'next', style: this.builderStyle(this.state.CurrentPage === this.pages && this.props.useHidingNavigate), disabled: this.state.CurrentPage === this.pages, key: v4(), className: 'bsr-button-navigate', onClick: function (e) {
                            var value = _this.state.CurrentPage + 1;
                            if (value <= _this.pages) {
                                _this.Click(value, e.target);
                            }
                        } }, this.props.next));
                }
                break;
            }
            case mySide.last: {
                if (this.props.last) {
                    // eslint-disable-next-line jsx-a11y/no-access-key
                    this.list.push(React.createElement("button", { accessKey: this.props.accessKeyLast, "data-navigate": 'last', style: this.builderStyle(this.state.CurrentPage === this.pages && this.props.useHidingNavigate), disabled: this.state.CurrentPage === this.pages, key: v4(), className: 'bsr-button-navigate', onClick: function (e) {
                            _this.Click(_this.pages, e.target);
                        } }, this.props.last));
                }
                break;
            }
        }
    };
    return Paginator;
}(React.Component));

exports.Paginator = Paginator;
