var ppvue = function (e) {
    "use strict";
    const t = Object.assign,
        n = Object.prototype.hasOwnProperty,
        s = (e, t) => n.call(e, t),
        r = Array.isArray,
        i = e => "[object Map]" === a(e),
        o = e => "[object Date]" === a(e),
        c = e => "string" == typeof e,
        l = e => "symbol" == typeof e,
        f = e => null !== e && "object" == typeof e,
        u = Object.prototype.toString,
        a = e => u.call(e),
        p = e => c(e) && "NaN" !== e && "-" !== e[0] && "" + parseInt(e, 10) === e,
        h = e => {
            const t = Object.create(null);
            return n => t[n] || (t[n] = e(n))
        },
        d = /-(\w)/g,
        m = h((e => e.replace(d, ((e, t) => t ? t.toUpperCase() : "")))),
        g = /\B([A-Z])/g,
        v = h((e => e.replace(g, "-$1").toLowerCase())),
        y = e => {
            const t = c(e) ? Number(e) : NaN;
            return isNaN(t) ? e : t
        };

    function b(e) {
        if (r(e)) {
            const t = {};
            for (let n = 0; n < e.length; n++) {
                const s = e[n],
                    r = c(s) ? $(s) : b(s);
                if (r)
                    for (const e in r) t[e] = r[e]
            }
            return t
        }
        return c(e) || f(e) ? e : void 0
    }
    const _ = /;(?![^(]*\))/g,
        w = /:([^]+)/,
        x = /\/\*[^]*?\*\//g;

    function $(e) {
        const t = {};
        return e.replace(x, "").split(_).forEach((e => {
            if (e) {
                const n = e.split(w);
                n.length > 1 && (t[n[0].trim()] = n[1].trim())
            }
        })), t
    }

    function k(e) {
        let t = "";
        if (c(e)) t = e;
        else if (r(e))
            for (let n = 0; n < e.length; n++) {
                const s = k(e[n]);
                s && (t += s + " ")
            } else if (f(e))
            for (const n in e) e[n] && (t += n + " ");
        return t.trim()
    }

    function S(e, t) {
        if (e === t) return !0;
        let n = o(e),
            s = o(t);
        if (n || s) return !(!n || !s) && e.getTime() === t.getTime();
        if (n = l(e), s = l(t), n || s) return e === t;
        if (n = r(e), s = r(t), n || s) return !(!n || !s) && function (e, t) {
            if (e.length !== t.length) return !1;
            let n = !0;
            for (let s = 0; n && s < e.length; s++) n = S(e[s], t[s]);
            return n
        }(e, t);
        if (n = f(e), s = f(t), n || s) {
            if (!n || !s) return !1;
            if (Object.keys(e).length !== Object.keys(t).length) return !1;
            for (const n in e) {
                const s = e.hasOwnProperty(n),
                    r = t.hasOwnProperty(n);
                if (s && !r || !s && r || !S(e[n], t[n])) return !1
            }
        }
        return String(e) === String(t)
    }

    function O(e, t) {
        return e.findIndex((e => S(e, t)))
    }

    function E(e, t) {
        t && t.active && t.effects.push(e)
    }
    const j = e => {
        const t = new Set(e);
        return t.w = 0, t.n = 0, t
    },
        A = e => (e.w & C) > 0,
        N = e => (e.n & C) > 0,
        P = new WeakMap;
    let R = 0,
        C = 1;
    let T;
    const M = Symbol(""),
        B = Symbol("");
    class L {
        constructor(e, t = null, n) {
            this.fn = e, this.scheduler = t, this.active = !0, this.deps = [], this.parent = void 0, E(this, n)
        }
        run() {
            if (!this.active) return this.fn();
            let e = T,
                t = K;
            for (; e;) {
                if (e === this) return;
                e = e.parent
            }
            try {
                return this.parent = T, T = this, K = !0, C = 1 << ++R, R <= 30 ? (({
                    deps: e
                }) => {
                    if (e.length)
                        for (let t = 0; t < e.length; t++) e[t].w |= C
                })(this) : W(this), this.fn()
            } finally {
                R <= 30 && (e => {
                    const {
                        deps: t
                    } = e;
                    if (t.length) {
                        let n = 0;
                        for (let s = 0; s < t.length; s++) {
                            const r = t[s];
                            A(r) && !N(r) ? r.delete(e) : t[n++] = r, r.w &= ~C, r.n &= ~C
                        }
                        t.length = n
                    }
                })(this), C = 1 << --R, T = this.parent, K = t, this.parent = void 0, this.deferStop && this.stop()
            }
        }
        stop() {
            T === this ? this.deferStop = !0 : this.active && (W(this), this.onStop && this.onStop(), this.active = !1)
        }
    }

    function W(e) {
        const {
            deps: t
        } = e;
        if (t.length) {
            for (let n = 0; n < t.length; n++) t[n].delete(e);
            t.length = 0
        }
    }

    function I(e) {
        e.effect.stop()
    }
    let K = !0;
    const V = [];

    function z(e, t, n) {
        if (K && T) {
            let t = P.get(e);
            t || P.set(e, t = new Map);
            let s = t.get(n);
            s || t.set(n, s = j()),
                function (e, t) {
                    let n = !1;
                    R <= 30 ? N(e) || (e.n |= C, n = !A(e)) : n = !e.has(T), n && (e.add(T), T.deps.push(e))
                }(s)
        }
    }

    function F(e, t, n, s, o, c) {
        const l = P.get(e);
        if (!l) return;
        let f = [];
        if ("clear" === t) f = [...l.values()];
        else if ("length" === n && r(e)) {
            const e = Number(s);
            l.forEach(((t, n) => {
                ("length" === n || n >= e) && f.push(t)
            }))
        } else switch (void 0 !== n && f.push(l.get(n)), t) {
            case "add":
                r(e) ? p(n) && f.push(l.get("length")) : (f.push(l.get(M)), i(e) && f.push(l.get(B)));
                break;
            case "delete":
                r(e) || (f.push(l.get(M)), i(e) && f.push(l.get(B)));
                break;
            case "set":
                i(e) && f.push(l.get(M))
        }
        if (1 === f.length) f[0] && H(f[0]);
        else {
            const e = [];
            for (const t of f) t && e.push(...t);
            H(j(e))
        }
    }

    function H(e, t) {
        const n = r(e) ? e : [...e];
        for (const s of n) s.computed && J(s);
        for (const s of n) s.computed || J(s)
    }

    function J(e, t) {
        (e !== T || e.allowRecurse) && (e.scheduler ? e.scheduler() : e.run())
    }
    const Z = function (e, t) {
        const n = Object.create(null),
            s = e.split(",");
        for (let r = 0; r < s.length; r++) n[s[r]] = !0;
        return t ? e => !!n[e.toLowerCase()] : e => !!n[e]
    }("__proto__,__v_isRef,__isVue"),
        q = new Set(Object.getOwnPropertyNames(Symbol).filter((e => "arguments" !== e && "caller" !== e)).map((e => Symbol[e])).filter(l)),
        D = X(),
        G = X(!0),
        U = function () {
            const e = {};
            return ["includes", "indexOf", "lastIndexOf"].forEach((t => {
                e[t] = function (...e) {
                    const n = fe(this);
                    for (let t = 0, r = this.length; t < r; t++) z(n, 0, t + "");
                    const s = n[t](...e);
                    return -1 === s || !1 === s ? n[t](...e.map(fe)) : s
                }
            })), ["push", "pop", "shift", "unshift", "splice"].forEach((t => {
                e[t] = function (...e) {
                    V.push(K), K = !1;
                    const n = fe(this)[t].apply(this, e);
                    return function () {
                        const e = V.pop();
                        K = void 0 === e || e
                    }(), n
                }
            })), e
        }();

    function Q(e) {
        const t = fe(this);
        return z(t, 0, e), t.hasOwnProperty(e)
    }

    function X(e = !1, t = !1) {
        return function (n, i, o) {
            if ("__v_isReactive" === i) return !e;
            if ("__v_isReadonly" === i) return e;
            if ("__v_isShallow" === i) return t;
            if ("__v_raw" === i && o === (e ? t ? re : se : t ? ne : te).get(n)) return n;
            const c = r(n);
            if (!e) {
                if (c && s(U, i)) return Reflect.get(U, i, o);
               // if ("hasOwnProperty" === i) return Q  --sanil
            }
            const u = Reflect.get(n, i, o);
            return (l(i) ? q.has(i) : Z(i)) || (e || z(n, 0, i), t) ? u : ue(u) ? c && p(i) ? u : u.value : f(u) ? e ? function (e) {
                return ce(e, !0, ee, null, se)
            }(u) : oe(u) : u
        }
    }


    const Y = {
        get: D,
        set: function (e = !1) {
            return function (t, n, i, o) {
                let c = t[n];
                if (le(c) && ue(c) && !ue(i)) return !1;
                if (!e && (! function (e) {
                    return !(!e || !e.__v_isShallow)
                }(i) && !le(i) && (c = fe(c), i = fe(i)), !r(t) && ue(c) && !ue(i))) return c.value = i, !0;
                const l = r(t) && p(n) ? Number(n) < t.length : s(t, n),
                    f = Reflect.set(t, n, i, o);
                return t === fe(o) && (l ? ((e, t) => !Object.is(e, t))(i, c) && F(t, "set", n, i) : F(t, "add", n, i)), f
            }
        }(),
        deleteProperty: function (e, t) {
            const n = s(e, t);
            e[t];
            const r = Reflect.deleteProperty(e, t);
            return r && n && F(e, "delete", t, void 0), r
        },
        has: function (e, t) {
            const n = Reflect.has(e, t);
            return (!l(t) || !q.has(t)) && z(e, 0, t), n
        },
        ownKeys: function (e) {
            return z(e, 0, r(e) ? "length" : M), Reflect.ownKeys(e)
        }
    },
        ee = {
            get: G,
            set: (e, t) => !0,
            deleteProperty: (e, t) => !0
        },
        te = new WeakMap,
        ne = new WeakMap,
        se = new WeakMap,
        re = new WeakMap;

    function ie(e) {
        return e.__v_skip || !Object.isExtensible(e) ? 0 : function (e) {
            switch (e) {
                case "Object":
                case "Array":
                    return 1;
                case "Map":
                case "Set":
                case "WeakMap":
                case "WeakSet":
                    return 2;
                default:
                    return 0
            }
        }((e => a(e).slice(8, -1))(e))
    }

    function oe(e) {
        return le(e) ? e : ce(e, !1, Y, null, te)
    }

    function ce(e, t, n, s, r) {
        if (!f(e) || e.__v_raw && (!t || !e.__v_isReactive)) return e;
        const i = r.get(e);
        if (i) return i;
        const o = ie(e);
        if (0 === o) return e;
        const c = new Proxy(e, 2 === o ? s : n);
        return r.set(e, c), c
    }

    function le(e) {
        return !(!e || !e.__v_isReadonly)
    }

    function fe(e) {
        const t = e && e.__v_raw;
        return t ? fe(t) : e
    }

    function ue(e) {
        return !(!e || !0 !== e.__v_isRef)
    }
    let ae = !1;
    const pe = [],
        he = Promise.resolve(),
        de = e => he.then(e),
        me = e => {
            pe.includes(e) || pe.push(e), ae || (ae = !0, de(ge))
        },
        ge = () => {
            for (const e of pe) e();
            pe.length = 0, ae = !1
        },
        ve = /^(spellcheck|draggable|form|list|type)$/,
        ye = ({
            el: e,
            get: t,
            effect: n,
            arg: s,
            modifiers: r
        }) => {
            let i;
            "class" === s && (e._class = e.className), n((() => {
                let n = t();
                if (s) null != r && r.camel && (s = m(s)), be(e, s, n, i);
                else {
                    for (const t in n) be(e, t, n[t], i && i[t]);
                    for (const t in i) (!n || !(t in n)) && be(e, t, null)
                }
                i = n
            }))
        },
        be = (e, t, n, s) => {
            if ("class" === t) e.setAttribute("class", k(e._class ? [e._class, n] : n) || "");
            else if ("style" === t) {
                n = b(n);
                const {
                    style: t
                } = e;
                if (n)
                    if (c(n)) n !== s && (t.cssText = n);
                    else {
                        for (const e in n) we(t, e, n[e]);
                        if (s && !c(s))
                            for (const e in s) null == n[e] && we(t, e, "")
                    }
                else e.removeAttribute("style")
            } else e instanceof SVGElement || !(t in e) || ve.test(t) ? "true-value" === t ? e._trueValue = n : "false-value" === t ? e._falseValue = n : null != n ? e.setAttribute(t, n) : e.removeAttribute(t) : (e[t] = n, "value" === t && (e._value = n))
        },
        _e = /\s*!important$/,
        we = (e, t, n) => {
            r(n) ? n.forEach((n => we(e, t, n))) : t.startsWith("--") ? e.setProperty(t, n) : _e.test(n) ? e.setProperty(v(t), n.replace(_e, ""), "important") : e[t] = n
        },
        xe = (e, t) => {
            const n = e.getAttribute(t);
            return null != n && e.removeAttribute(t), n
        },
        $e = (e, t, n, s) => {
            e.addEventListener(t, n, s)
        },
        ke = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/,
        Se = ["ctrl", "shift", "alt", "meta"],
        Oe = {
            stop: e => e.stopPropagation(),
            prevent: e => e.preventDefault(),
            self: e => e.target !== e.currentTarget,
            ctrl: e => !e.ctrlKey,
            shift: e => !e.shiftKey,
            alt: e => !e.altKey,
            meta: e => !e.metaKey,
            left: e => "button" in e && 0 !== e.button,
            middle: e => "button" in e && 1 !== e.button,
            right: e => "button" in e && 2 !== e.button,
            exact: (e, t) => Se.some((n => e[`${n}Key`] && !t[n]))
        },
        Ee = ({
            el: e,
            get: t,
            exp: n,
            arg: s,
            modifiers: r
        }) => {
            if (!s) return;
            let i = ke.test(n) ? t(`(e => ${n}(e))`) : t(`($event => { ${n} })`);
            if ("vue:mounted" !== s) {
                if ("vue:unmounted" === s) return () => i();
                if (r) {
                    "click" === s && (r.right && (s = "contextmenu"), r.middle && (s = "mouseup"));
                    const e = i;
                    i = t => {
                        if (!("key" in t) || v(t.key) in r) {
                            for (const e in r) {
                                const n = Oe[e];
                                if (n && n(t, r)) return
                            }
                            return e(t)
                        }
                    }
                }
                $e(e, s, i, r)
            } else de(i)
        },
        je = ({
            el: e,
            get: t,
            effect: n
        }) => {
            n((() => {
                e.textContent = Ae(t())
            }))
        },
        Ae = e => null == e ? "" : f(e) ? JSON.stringify(e, null, 2) : String(e),
        Ne = e => "_value" in e ? e._value : e.value,
        Pe = (e, t) => {
            const n = t ? "_trueValue" : "_falseValue";
            return n in e ? e[n] : t
        },
        Re = e => {
            e.target.composing = !0
        },
        Ce = e => {
            const t = e.target;
            t.composing && (t.composing = !1, Te(t, "input"))
        },
        Te = (e, t) => {
            const n = document.createEvent("HTMLEvents");
            n.initEvent(t, !0, !0), e.dispatchEvent(n)
        },
        Me = Object.create(null),
        Be = (e, t, n) => Le(e, `return(${t})`, n),
        Le = (e, t, n) => {
            const s = Me[t] || (Me[t] = We(t));
            try {
                return s(e, n)
            } catch (r) {
                console.error(r)
            }
        },
        We = e => {
            try {
                return new Function("$data", "$el", `with($data){${e}}`)
            } catch (t) {
                return console.error(`${t.message} in expression: ${e}`), () => { }
            }
        },
        Ie = {
            bind: ye,
            on: Ee,
            show: ({
                el: e,
                get: t,
                effect: n
            }) => {
                const s = e.style.display;
                n((() => {
                    e.style.display = t() ? s : "none"
                }))
            },
            text: je,
            html: ({
                el: e,
                get: t,
                effect: n
            }) => {
                n((() => {
                    e.innerHTML = t()
                }))
            },
            model: ({
                el: e,
                exp: t,
                get: n,
                effect: s,
                modifiers: i
            }) => {
                const o = e.type,
                    c = n(`(val) => { ${t} = val }`),
                    {
                        trim: l,
                        number: f = "number" === o
                    } = i || {};
                if ("SELECT" === e.tagName) {
                    const t = e;
                    $e(e, "change", (() => {
                        const e = Array.prototype.filter.call(t.options, (e => e.selected)).map((e => f ? y(Ne(e)) : Ne(e)));
                        c(t.multiple ? e : e[0])
                    })), s((() => {
                        const e = n(),
                            s = t.multiple;
                        for (let n = 0, i = t.options.length; n < i; n++) {
                            const i = t.options[n],
                                o = Ne(i);
                            if (s) r(e) ? i.selected = O(e, o) > -1 : i.selected = e.has(o);
                            else if (S(Ne(i), e)) return void (t.selectedIndex !== n && (t.selectedIndex = n))
                        } !s && -1 !== t.selectedIndex && (t.selectedIndex = -1)
                    }))
                } else if ("checkbox" === o) {
                    let t;
                    $e(e, "change", (() => {
                        const t = n(),
                            s = e.checked;
                        if (r(t)) {
                            const n = Ne(e),
                                r = O(t, n),
                                i = -1 !== r;
                            if (s && !i) c(t.concat(n));
                            else if (!s && i) {
                                const e = [...t];
                                e.splice(r, 1), c(e)
                            }
                        } else c(Pe(e, s))
                    })), s((() => {
                        const s = n();
                        r(s) ? e.checked = O(s, Ne(e)) > -1 : s !== t && (e.checked = S(s, Pe(e, !0))), t = s
                    }))
                } else if ("radio" === o) {
                    let t;
                    $e(e, "change", (() => {
                        c(Ne(e))
                    })), s((() => {
                        const s = n();
                        s !== t && (e.checked = S(s, Ne(e)))
                    }))
                } else {
                    const t = e => l ? e.trim() : f ? y(e) : e;
                    $e(e, "compositionstart", Re), $e(e, "compositionend", Ce), $e(e, null != i && i.lazy ? "change" : "input", (() => {
                        e.composing || c(t(e.value))
                    })), l && $e(e, "change", (() => {
                        e.value = e.value.trim()
                    })), s((() => {
                        if (e.composing) return;
                        const s = e.value,
                            r = n();
                        document.activeElement === e && t(s) === r || s !== r && (e.value = r)
                    }))
                }
            },
            effect: ({
                el: e,
                ctx: t,
                exp: n,
                effect: s
            }) => {
                de((() => s((() => Le(t.scope, n, e)))))
            }
        },
        Ke = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/,
        Ve = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/,
        ze = /^\(|\)$/g,
        Fe = /^[{[]\s*((?:[\w_$]+\s*,?\s*)+)[\]}]$/,
        He = (e, t, n) => {
            const s = t.match(Ke);
            if (!s) return;
            const i = e.nextSibling,
                o = e.parentElement,
                c = new Text("");
            o.insertBefore(c, e), o.removeChild(e);
            const l = s[2].trim();
            let u, a, p, h, d = s[1].trim().replace(ze, "").trim(),
                m = !1,
                g = "key",
                v = e.getAttribute(g) || e.getAttribute(g = ":key") || e.getAttribute(g = "v-bind:key");
            v && (e.removeAttribute(g), "key" === g && (v = JSON.stringify(v))), (h = d.match(Ve)) && (d = d.replace(Ve, "").trim(), a = h[1].trim(), h[2] && (p = h[2].trim())), (h = d.match(Fe)) && (u = h[1].split(",").map((e => e.trim())), m = "[" === d[0]);
            let y, b, _, w = !1;
            const x = (e, t, s, r) => {
                const i = {};
                u ? u.forEach(((e, n) => i[e] = t[m ? n : e])) : i[d] = t, r ? (a && (i[a] = r), p && (i[p] = s)) : a && (i[a] = s);
                const o = tt(n, i),
                    c = v ? Be(o.scope, v) : s;
                return e.set(c, s), o.key = c, o
            },
                $ = (t, n) => {
                    const s = new st(e, t);
                    return s.key = t.key, s.insert(o, n), s
                };
            return n.effect((() => {
                const e = Be(n.scope, l),
                    t = _;
                if ([b, _] = (e => {
                    const t = new Map,
                        n = [];
                    if (r(e))
                        for (let s = 0; s < e.length; s++) n.push(x(t, e[s], s));
                    else if ("number" == typeof e)
                        for (let s = 0; s < e; s++) n.push(x(t, s + 1, s));
                    else if (f(e)) {
                        let s = 0;
                        for (const r in e) n.push(x(t, e[r], s++, r))
                    }
                    return [n, t]
                })(e), w) {
                    for (let t = 0; t < y.length; t++) _.has(y[t].key) || y[t].remove();
                    const e = [];
                    let n, s, r = b.length;
                    for (; r--;) {
                        const i = b[r],
                            l = t.get(i.key);
                        let f;
                        null == l ? f = $(i, n ? n.el : c) : (f = y[l], Object.assign(f.ctx.scope, i.scope), l !== r && (y[l + 1] !== n || s === n) && (s = f, f.insert(o, n ? n.el : c))), e.unshift(n = f)
                    }
                    y = e
                } else y = b.map((e => $(e, c))), w = !0
            })), i
        },
        Je = ({
            el: e,
            ctx: {
                scope: {
                    $refs: t
                }
            },
            get: n,
            effect: s
        }) => {
            let r;
            return s((() => {
                const s = n();
                t[s] = e, r && s !== r && delete t[r], r = s
            })), () => {
                r && delete t[r]
            }
        },
        Ze = /^(?:v-|:|@)/,
        qe = /\.([\w-]+)/g;
    let De = !1;
    const Ge = (e, t) => {
        const n = e.nodeType;
        if (1 === n) {
            const n = e;
            if (n.hasAttribute("v-pre")) return;
            let s;
            if (xe(n, "v-cloak"), s = xe(n, "v-if")) return ((e, t, n) => {
                const s = e.parentElement,
                    r = new Comment("v-if");
                s.insertBefore(r, e);
                const i = [{
                    exp: t,
                    el: e
                }];
                let o, c;
                for (;
                    (o = e.nextElementSibling) && (c = null, "" === xe(o, "v-else") || (c = xe(o, "v-else-if")));) s.removeChild(o), i.push({
                        exp: c,
                        el: o
                    });
                const l = e.nextSibling;
                s.removeChild(e);
                let f, u = -1;
                const a = () => {
                    f && (s.insertBefore(r, f.el), f.remove(), f = void 0)
                };
                return n.effect((() => {
                    for (let e = 0; e < i.length; e++) {
                        const {
                            exp: t,
                            el: o
                        } = i[e];
                        if (!t || Be(n.scope, t)) return void (e !== u && (a(), f = new st(o, n), f.insert(s, r), s.removeChild(r), u = e))
                    }
                    u = -1, a()
                })), l
            })(n, s, t);
            if (s = xe(n, "v-for")) return He(n, s, t);
            if ((s = xe(n, "v-scope")) || "" === s) {
                const e = s ? Be(t.scope, s) : {};
                t = tt(t, e), e.$template && Ye(n, e.$template)
            }
            const r = null != xe(n, "v-once");
            r && (De = !0), (s = xe(n, "ref")) && Xe(n, Je, `"${s}"`, t), Ue(n, t);
            const i = [];
            for (const {
                name: e,
                value: o
            }
                of [...n.attributes]) Ze.test(e) && "v-cloak" !== e && ("v-model" === e ? i.unshift([e, o]) : "@" === e[0] || /^v-on\b/.test(e) ? i.push([e, o]) : Qe(n, e, o, t));
            for (const [e, o] of i) Qe(n, e, o, t);
            r && (De = !1)
        } else if (3 === n) {
            const n = e.data;
            if (n.includes(t.delimiters[0])) {
                let s, r = [],
                    i = 0;
                for (; s = t.delimitersRE.exec(n);) {
                    const e = n.slice(i, s.index);
                    e && r.push(JSON.stringify(e)), r.push(`$s(${s[1]})`), i = s.index + s[0].length
                }
                i < n.length && r.push(JSON.stringify(n.slice(i))), Xe(e, je, r.join("+"), t)
            }
        } else 11 === n && Ue(e, t)
    },
        Ue = (e, t) => {
            let n = e.firstChild;
            for (; n;) n = Ge(n, t) || n.nextSibling
        },
        Qe = (e, t, n, s) => {
            let r, i, o;
            if (":" === (t = t.replace(qe, ((e, t) => ((o || (o = {}))[t] = !0, ""))))[0]) r = ye, i = t.slice(1);
            else if ("@" === t[0]) r = Ee, i = t.slice(1);
            else {
                const e = t.indexOf(":"),
                    n = e > 0 ? t.slice(2, e) : t.slice(2);
                r = Ie[n] || s.dirs[n], i = e > 0 ? t.slice(e + 1) : void 0
            }
            r && (r === ye && "ref" === i && (r = Je), Xe(e, r, n, s, i, o), e.removeAttribute(t))
        },
        Xe = (e, t, n, s, r, i) => {
            const o = t({
                el: e,
                get: (t = n) => Be(s.scope, t, e),
                effect: s.effect,
                ctx: s,
                exp: n,
                arg: r,
                modifiers: i
            });
            o && s.cleanups.push(o)
        },
        Ye = (e, t) => {
            if ("#" !== t[0]) e.innerHTML = t;
            else {
                const n = document.querySelector(t);
                e.appendChild(n.content.cloneNode(!0))
            }
        },
        et = e => {
            const n = {
                delimiters: ["{{", "}}"],
                delimitersRE: /\{\{([^]+?)\}\}/g,
                ...e,
                scope: e ? e.scope : oe({}),
                dirs: e ? e.dirs : {},
                effects: [],
                blocks: [],
                cleanups: [],
                effect: e => {
                    if (De) return me(e), e;
                    const s = function (e, n) {
                        e.effect && (e = e.effect.fn);
                        const s = new L(e);
                        n && (t(s, n), n.scope && E(s, n.scope)), (!n || !n.lazy) && s.run();
                        const r = s.run.bind(s);
                        return r.effect = s, r
                    }(e, {
                        scheduler: () => me(s)
                    });
                    return n.effects.push(s), s
                }
            };
            return n
        },
        tt = (e, t = {}) => {
            const n = e.scope,
                s = Object.create(n);
            Object.defineProperties(s, Object.getOwnPropertyDescriptors(t)), s.$refs = Object.create(n.$refs);
            const r = oe(new Proxy(s, {
                set: (e, t, s, i) => i !== r || e.hasOwnProperty(t) ? Reflect.set(e, t, s, i) : Reflect.set(n, t, s)
            }));
            return nt(r), {
                ...e,
                scope: r
            }
        },
        nt = e => {
            for (const t of Object.keys(e)) "function" == typeof e[t] && (e[t] = e[t].bind(e))
        };
    class st {
        get el() {
            return this.start || this.template
        }
        constructor(e, t, n = !1) {
            this.isFragment = e instanceof HTMLTemplateElement, n ? this.template = e : this.isFragment ? this.template = e.content.cloneNode(!0) : this.template = e.cloneNode(!0), n ? this.ctx = t : (this.parentCtx = t, t.blocks.push(this), this.ctx = et(t)), Ge(this.template, this.ctx)
        }
        insert(e, t = null) {
            if (this.isFragment)
                if (this.start) {
                    let n, s = this.start;
                    for (; s && (n = s.nextSibling, e.insertBefore(s, t), s !== this.end);) s = n
                } else this.start = new Text(""), this.end = new Text(""), e.insertBefore(this.end, t), e.insertBefore(this.start, this.end), e.insertBefore(this.template, this.end);
            else e.insertBefore(this.template, t)
        }
        remove() {
            if (this.parentCtx && ((e, t) => {
                const n = e.indexOf(t);
                n > -1 && e.splice(n, 1)
            })(this.parentCtx.blocks, this), this.start) {
                const e = this.start.parentNode;
                let t, n = this.start;
                for (; n && (t = n.nextSibling, e.removeChild(n), n !== this.end);) n = t
            } else this.template.parentNode.removeChild(this.template);
            this.teardown()
        }
        teardown() {
            this.ctx.blocks.forEach((e => {
                e.teardown()
            })), this.ctx.effects.forEach(I), this.ctx.cleanups.forEach((e => e()))
        }
    }
    const rt = e => e.replace(/[-.*+?^${}()|[\]\/\\]/g, "\\$&"),
        it = e => {
            const t = et();
            if (e && (t.scope = oe(e), nt(t.scope), e.$delimiters)) {
                const [n, s] = t.delimiters = e.$delimiters;
                t.delimitersRE = new RegExp(rt(n) + "([^]+?)" + rt(s), "g")
            }
            let n;
            return t.scope.$s = Ae, t.scope.$nextTick = de, t.scope.$refs = Object.create(null), {
                directive(e, n) {
                    return n ? (t.dirs[e] = n, this) : t.dirs[e]
                },
                mount(e) {
                    if ("string" == typeof e && !(e = document.querySelector(e))) return;
                    let s;
                    return s = (e = e || document.documentElement).hasAttribute("v-scope") ? [e] : [...e.querySelectorAll("[v-scope]")].filter((e => !e.matches("[v-scope] [v-scope]"))), s.length || (s = [e]), n = s.map((e => new st(e, t, !0))), t.scope
                },
                unmount() {
                    n.forEach((e => e.teardown()))
                }
            }
        },
        ot = document.currentScript;
    return ot && ot.hasAttribute("init") && it().mount(), e.createApp = it, e.nextTick = de, e.reactive = oe, Object.defineProperties(e, {
        __esModule: {
            value: !0
        },
        [Symbol.toStringTag]: {
            value: "Module"
        }
    }), e
}({});