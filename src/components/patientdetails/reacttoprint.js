"use strict";

import $ from 'jquery';
var print_title="";
function _interopDefault(e) {
    return e && "object" == typeof e && "default" in e ? e.default : e
}
var React = _interopDefault(require("react")),
    reactDom = require("react-dom"),
    propTypes = _interopDefault(require("prop-types")),
    classCallCheck = function(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    },
    createClass = function() {
        function e(e, t) {
            for (var r = 0; r < t.length; r++) {
                var n = t[r];
                n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
            }
        }
        return function(t, r, n) {
            return r && e(t.prototype, r), n && e(t, n), t
        }
    }(),
    inherits = function(e, t) {
        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
        e.prototype = Object.create(t && t.prototype, {
            constructor: {
                value: e,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
    },
    possibleConstructorReturn = function(e, t) {
        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !t || "object" != typeof t && "function" != typeof t ? e : t
    },
    toConsumableArray = function(e) {
        if (Array.isArray(e)) {
            for (var t = 0, r = Array(e.length); t < e.length; t++) r[t] = e[t];
            return r
        }
        return Array.from(e)
    },
    ReactToPrint = function(e) {
        function t() {
            var e, r, n, o;
            classCallCheck(this, t);
            for (var i = arguments.length, a = Array(i), l = 0; l < i; l++) a[l] = arguments[l];
            return r = n = possibleConstructorReturn(this, (e = t.__proto__ || Object.getPrototypeOf(t)).call.apply(e, [this].concat(a))), n.handlePrint = function() {
                var e = n.props,
                    t = e.content,
                    r = e.copyStyles,
                    o = (e.onAfterPrint, document.createElement("iframe"));
                    print_title=n.props;
                o.style.position = "absolute", o.style.top = "-1000px", o.style.left = "-1000px";
                var i = t(),
                    a = reactDom.findDOMNode(i),
                    l = document.querySelectorAll('link[rel="stylesheet"]');
                n.linkTotal = l.length, n.linkLoaded = 0;
                var c = function(e) {
                    n.linkLoaded++, n.linkLoaded === n.linkTotal && n.triggerPrint(o)
                };

                o.onload = function() {

                    if (window.navigator && window.navigator.userAgent.indexOf('Trident/7.0') > -1) {
                        o.onload = null;
                    }
                    var e = o.contentDocument || o.contentWindow.document;

                    e.open(), e.write('<h1>'+print_title && print_title.printHeading +'</h1>' + a.outerHTML), e.close();
                    var t = e.createElement("style");

                    if (t.appendChild(e.createTextNode("@page { size: auto;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }")), e.head.appendChild(t), !1 !== r) {
                        var n = document.querySelectorAll('style, link[rel="stylesheet"]'),
                            i = "";

                        if ([].concat(toConsumableArray(n)).forEach(function(t) {
                                if ("STYLE" === t.tagName) {
                                    if (t.sheet)
                                        for (var r = 0; r < t.sheet.cssRules.length; r++) i += t.sheet.cssRules[r].cssText + "\r\n"
                                } else {
                                    var n = e.createElement(t.tagName);
                                    [].concat(toConsumableArray(t.attributes)).forEach(function(e) {
                                        n.setAttribute(e.nodeName, e.nodeValue)
                                    }), n.onload = c.bind(null, "link"), n.onerror = c.bind(null, "link"), e.head.appendChild(n)
                                }
                            }), i.length) {
                            var l = e.createElement("style");
                            l.setAttribute("id", "react-to-print"), l.appendChild(e.createTextNode(i)), e.head.appendChild(l)
                        }
                    }
                },document.body.appendChild(o);
            }, o = r, possibleConstructorReturn(n, o)
        }
        return inherits(t, e), createClass(t, [{
            key: "triggerPrint",
            value: function(e) {
                var t = this;


                this.props.onBeforePrint && this.props.onBeforePrint(), setTimeout(function() {
                    var dd = e.contentDocument.body;
                    //window.jQuery(`<h5 className="modal-title c-p'>${t.props.printHeading}</h5>`).prependTo($('.printPagePadding'));
                    e.contentWindow.focus(), e.contentWindow.print(),t.removeWindow(e)
                }, 500)
            }
        }, {
            key: "removeWindow",
            value: function(e) {
                setTimeout(function() {
                    e.parentNode.removeChild(e)
                }, 1500)
            }
        }, {
            key: "render",
            value: function() {
                var e = this;
                return React.cloneElement(this.props.trigger(), {
                    ref: function(t) {
                        return e.triggerRef = t
                    },
                    onClick: this.handlePrint
                })
            }
        }]), t
    }(React.Component);
ReactToPrint.defaultProps = {
    copyStyles: !0,
    closeAfterPrint: !0,
    bodyClass: "yu"
}, module.exports = ReactToPrint;
//# sourceMappingURL=index.js.map