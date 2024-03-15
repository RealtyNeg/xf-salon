
var vz = {
    xfversion: "2.4.2",
    xa: { id: 0, username: "", p1: "", p2: "", cnid: 0, jwt: "" },
    xz: {}, xy: {}, xc: {}, xe: {}, xe_a: "", xf_rde: "", xf_rdi: 0, xi: [], xi_z: false,
    a1: "", a2: "", a3: 0, a4: 0, a5: 0, b1: true, ximg: { c: "", a: "" },
    xfm: { a: 0, b: 0, c: 0, ax: [], bx: [], cx: [] },
    q_res: [], q_loc: [], q_mode: "", q_gl_inp: "", q_gl_ent: "", q_gl_pg: 1, q_gl_hdr: "", q_gl_filter: "", q_gl_prefix: "", intervals: null,
    z: 0, e: 0, ex: "",
    loaded: false,

    xhrXF: function (url, callback, a, obj, mode) {
        var xhr = new XMLHttpRequest(); if (!a) { a = "GET"; };
        spinner(true);
        xhr.open(a, url, true);
        xhr.onreadystatechange = function () {
            spinner(false);
            if (xhr.readyState === 4) {
                if (xhr.status === 401) { localStorage.setItem(this.jwtkey, ""); vz.logout(); }
                if (xhr.status === 200 || xhr.status === 202 || xhr.status == 0) {
                    try { callback(xhr.responseText); this.jwt_refresh(); } catch (e) { this.e = -1; this.ex = ("Error! " + e.message); }
                }
                else { this.e = -1; this.ex = ("Error " + xhr.status + " : " + xhr.statusText + " : " + JSON.stringify(xhr.responseText)); }
            }
        };
        xhr.onerror = function () { this.ex = ("** XHR Error **"); };
        xhr.setRequestHeader("Authorization", "Bearer " + window.localStorage.getItem(this.jwtkey));
        xhr.setRequestHeader("xfuser", this.xa.username); xhr.setRequestHeader("xfpg", this.get_xfpg());
        if (a.toUpperCase() == "GET") { xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8'); xhr.send(); }
        if (a.toUpperCase() == "POST") { if (mode) { xhr.send(obj); } else { xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8'); xhr.send(JSON.stringify(obj)); } }
    },


    IsNullOrEmpty: function (val) { return (!(val.length === 0 || !val.trim())) },
    ui_clear: function () { this.xz = {}; this.xy = {}; },

    //login
    unixtimestamp: function () { return Math.floor(Date.now() / 1000); },
    SHA: function (i) {
        function d(a, b) { return a >>> b | a << 32 - b; } var l = Math.pow; var m = l(2, 32); var e = 'length'; var a, c; var r = ''; var f = []; var s = i[e] * 8; var b = this.SHA.h = this.SHA.h || []; var n = this.SHA.k = this.SHA.k || []; var o = n[e]; var t = {}; for (var g = 2; o < 64; g++) if (!t[g]) { for (a = 0; a < 313; a += g) t[a] = g; b[o] = l(g, 0.5) * m | 0, n[o++] = l(g, 0.3333333333333333) * m | 0; } i += '\x80'; while (i[e] % 64 - 56) i += '\0'; for (a = 0; a < i[e]; a++) { if (c = i.charCodeAt(a), c >> 8) return; f[a >> 2] |= c << (3 - a) % 4 * 8; }
        for (f[f[e]] = s / m | 0, f[f[e]] = s, c = 0; c < f[e];) { var h = f.slice(c, c += 16); var w = b; for (b = b.slice(0, 8), a = 0; a < 64; a++) { var y = a + c; var p = h[a - 15], q = h[a - 2]; var j = b[0], k = b[4]; var u = b[7] + (d(k, 6) ^ d(k, 11) ^ d(k, 25)) + (k & b[5] ^ ~k & b[6]) + n[a] + (h[a] = a < 16 ? h[a] : h[a - 16] + (d(p, 7) ^ d(p, 18) ^ p >>> 3) + h[a - 7] + (d(q, 17) ^ d(q, 19) ^ q >>> 10) | 0); var x = (d(j, 2) ^ d(j, 13) ^ d(j, 22)) + (j & b[1] ^ j & b[2] ^ b[1] & b[2]); b = [u + x | 0].concat(b), b[4] = b[4] + u | 0; } for (a = 0; a < 8; a++) b[a] = b[a] + w[a] | 0; } for (a = 0; a < 8; a++) for (c = 3; c + 1; c--) { var v = b[a] >> c * 8 & 255; r += (v < 16 ? 0 : '') + v.toString(16); } return r;
    },

    logout: function () {
        localStorage.setItem(this.jwtkey, ""); localStorage.setItem("xf_rde", ""); localStorage.setItem("xf_usrn", ""); localStorage.setItem("xf_rdi", 0);
        this.xa.id = 0; this.xa.jwt = ""; this.xa.username = ""; this.xa.userfullname = "";
    },
    sign_in: function () {
        var h = this.SHA(this.xa.username.trim().toLowerCase() + this.xa.p1); this.xa.p1 = ""; this.xa.utc = this.unixtimestamp();
        this.xa.hsh = this.SHA(h + this.xa.utc); this.xhrXF("/api/xfsignin", this.sign_in_cb, "POST", this.xa);
    },
    sign_in_cb: function (a) {
        this.xa = JSON.parse(a);
        if (this.xa.id && this.xa.mode == 0 && this.xa.jwt) {
            localStorage.setItem(this.jwtkey, this.xa.jwt); localStorage.setItem("xfjwtexp", Date.now());
            localStorage.setItem("xf_usrn", this.xa.username);
            this.get_entities(); if (typeof ui_init === "function") { ui_init(0); }
        }
    },
    signin_reset: function () {
        this.xa.hsh = this.SHA(this.xa.username.trim().toLowerCase() + this.xa.p1); this.xhrXF("/api/xfsigninreset", this.sign_in_cb, "POST", this.xa);
    },
    jwt_sign_in: function (a) {
        if (!a && localStorage.getItem("xf_usrn") == "anon" || !localStorage.getItem('xf_usrn')) { this.logout(); }
        var j = localStorage.getItem(this.jwtkey); if (j) { this.xhrXF("/api/xfrenewsignin", this.sign_in_cb); }
    },
    jwt_refresh: function (a) {
        var t = localStorage.getItem("xfjwtexp");
        if (t) { if (Date.now() > parseInt(t) + 300000) { localStorage.setItem("xfjwtexp", Date.now()); this.xhrXF("/api/xfrenewsignin", this.sign_in_cb) } }
    },
    jwt_anon: function () { this.xhrXF("/api/xfanonsignin/" + this.xa.cnid, this.sign_in_cb); },
    jwtkey: function () { return "xfjwt_" + window.location.hostname; },
    get_xfpg: function () { var el = document.getElementById("xf_pg"); if (el) { return el.value; } else { return 100; } },

    //app---------------------------------------------------------------------------------------------
    init: function (entity, id, v, f) {
        if (!entity) { return; }; this.z = 0; this.q_res = []; if (id <= 0 || !id) { id = -1; };
        var u = "/api/xf_get/" + entity + "/" + id; if (v || f) { if (!v) { v = "_"; }; if (!f) { f = ""; }; u = u + "/" + v + "/" + f; };
        this.xhrXF(u, this.init_cb);
    },
    init_cb: function (a) {
        var Q = JSON.parse(a); if (Q.z) { this.xz = Q.z; this.xy = Q.y; this.alertraise(Q.z); } else { this.alertraise(Q); }
        this.xhist(); if (!this.xa.jwt) { this.xa.jwt = localStorage.getItem(this.jwtkey); }
        clearInterval(this.intervals); if (this.xz.xf_setinterval > 100) { this.intervals = setInterval(this.xpost, this.xz.xf_setinterval); }
    },
    refresh: function () { this.init(this.xz.xf_entity, this.xz.xf_id); },
    init_cx: function (url) { this.xhrXF(url, this.init_cb); },
    post_cx: function (url, obj) { this.xhrXF(url, this.xpost_cb, "POST", obj); },

    //POST request
    xpost: function (f) {
        if (this.xz.xf_entity) { if (f) { this.xz.xf_f = f }; this.xhrXF(this.posturl(), this.xpost_cb, "POST", this.xz); }
    },
    xpost_cb: function (q) {
        var B = JSON.parse(q); if (typeof xpost_z === "function") { xpost_z(B.z); }
        for (var g in B.z) { this.xz[g] = B.z[g]; }; for (var g in B.y) { this.xy[g] = B.y[g]; }
        this.alertraise(B.z);
    },
    posturl: function () {
        if (this.xz.xf_xu) { return this.xz.xf_xu; }; return "/api/xf_set"
    },

    xhist: function () {
        if (this.xi_z) { this.xi_z = false; return; }
        if ((this.xz.xf_r < 4 && this.xz.xf_id <= 0) || !this.xz.xf_entity) { return; }
        var b = {}; b.x = this.xz.xf_entity; b.i = this.xz.xf_id; var u = window.location.href.split("#")[0] + "#" + b.x + "___" + b.i;
        this.xi.push(b); history.pushState(b, "", "");
    },
    xz_attrs: function (s) {
        var r = []; if (!this.xy.xf_attr) { return r; };
        for (var a in this.xy.xf_attr) {
            var c = this.xy.xf_attr[a]; console.log(c);
            if (this.xy[a] && s) { if (this.xy[a].y || this.xy[a].g !== s) { continue; } };
            r.push(this.xy[c]);
        }
        return r;
    },
    init_xe: function (a, url) { this.xe_a = a; this.xhrXF(url, this.init_xecb); },
    init_xecb: function (a) { var Q = JSON.parse(a); this.xe[this.xe_a] = Q; this.alertraise(Q); },
    post_xe: function (a, url, obj) { this.xe_a = a; this.xhrXF(url, this.init_xecb, "POST", obj); },
    init_preset: function (obj) { delete this.xy.xf_gx; this.xhrXF("/api/xf_presetinstance", this.xpost_cb, "POST", obj); },
    init_newtab: function (uri, e, i, origin) {
        var d = ""; var h = window.location.href;
        if (!origin) { d = h.substring(0, h.lastIndexOf("/")) + "/" + uri } else { d = window.location.origin + "/" + uri; }
        localStorage.setItem("xf_rde", e); localStorage.setItem("xf_rdi", i); window.open(d, '_blank');
    },

    redirect: function (entity, inst, attr, newtab) {
        if (newtab) { this.init_newtab("", entity, inst); return; }
        if (this.xf_rde != this.xz.xf_entity && this.xz.xf_id > 0) { this.xf_rde = this.xz.xf_entity; this.xf_rdi = this.xz.xf_id; }
        if (attr) { var B = {}; B.xf_entity = entity; B[attr] = this.xz.xf_id; this.xz = {}; this.init_preset(B); } else { this.xz = {}; this.init(entity, inst); }
    },
    delete_inst: function () {
        if (this.xz.xf_id > 0) { this.xhrXF("/api/xf_delete/" + this.xz.xf_entity + "/" + this.xz.xf_id, this.alertraiseParse); this.z = 0; }
    },
    clone_inst: function (J) { this.xz.xf_id = -1; if (J) { for (var g in J) { this.xz[g] = J[g]; } } },
    dtfilter: function (dt, txt) {
        var str = ""; if (txt) { str = txt.trim().toLowerCase(); } else { return dt; }
        return dt.filter(function (el) { var s = JSON.stringify(el).toLowerCase(); return (s.indexOf(str) !== -1) });
    },
    setfkmultirecord: function (my_instanceid, my_entityid, my_fkentityid, myfkinstanceid, staticid) {
        if (this.xz.xf_id > 0) {
            this.xhrXF("/api/xf_setfkmultirecord/" + my_instanceid + "/" + my_entityid + "/" + my_fkentityid + "/" + myfkinstanceid + "/" + staticid, this.alertraiseParse); this.z = 0;
        }
        this.xpost();
    },


    // meta
    get_entities: function () { this.xhrXF("/api/xf_entities/" + this.q_gl_prefix, this.get_entities_cb); },
    get_entities_cb: function (a) { this.xf_entities = JSON.parse(a); this.alertraise(this.xf_entities); },
    xfm_list: function () { this.xhrXF("/api/xfm_list", this.xfm_list_cb); },
    xfm_list_cb: function (a) { var q = JSON.parse(a); if (q) { this.xfm.ax = q.ax; this.xfm.bx = q.bx; this.xfm.cx = q.cx; } },
    xfm_fx: function (f) { this.xhrXF("/api/xfm_fx/" + f, this.alertraiseParse); },
    xfm_getsequpdown: function (a, e, i, n) { this.xhrXF("/api/xfm_getsequpdown/" + a + "/" + e + "/" + i + "/" + n, this.alertraiseParse); },

    //query
    xqry: function (qrytxt, qryobj, mode, pg, rowcount) {
        if (!mode) { this.q_mode = "entity"; } else { this.q_mode = mode; };
        if (qryobj) { this.q_gl_ent = qryobj; };
        if (this.xf_entities.length == 0) { this.get_entities(); };
        if (qrytxt) { qrytxt = qrytxt.trim(); } else { this.q_res = []; } if (!rowcount) { rowcount = 25 };
        if (!pg) { pg = 1; }; if (qrytxt == "?") { qrytxt = "_"; };
        if (qryobj && qrytxt) { this.xhrXF("/api/qry_datatable/" + qryobj + "/" + qrytxt + "/" + rowcount + "/" + pg, this.xqry_cb); }
    },
    xqry_cb: function (a) {
        var R = JSON.parse(a); this.q_res = []; this.q_gl_f = ""; if (!this.q_mode) { this.q_mode = "entity"; }
        if (this.q_mode == "entity") { this.q_res = R; };
        if (this.q_mode == "local") { this.q_loc = R; };
    },
    xqry_ext: function (attr, qrytxt) {
        if (qrytxt) { qrytxt = qrytxt.trim(); } else { this.q_res = []; }; if (qrytxt == "?") { qrytxt = "_"; }; this.q_mode = "local";
        if (qrytxt) { this.xhrXF("/api/qry_attribute/" + this.xz.xf_entity + "/" + attr + "/" + qrytxt, this.xqry_cb); }
    },
    xqry_nav: function (a) {
        this.q_gl_inp = ""; this.q_gl_filter = ""; this.q_gl_prefix = ""; this.q_res = [];
        if (this.q_mode == "entity" && a == 0) { this.q_gl_ent = ""; } else { this.init(this.q_gl_ent, a); }
        if (!this.q_gl_ent) { this.q_gl_hdr = "Select"; }
    },
    xfget_b64val: function (e, a, i, f) { if (f) { this.xhrXF("/api/b64files/" + e + "/" + a + "/" + i, this.xfget_b64val_cb); } },
    xfget_b64val_cb: function (q) { var B = JSON.parse(q); for (var i in B) { var a = document.createElement("a"); a.href = B[i].dataurl; a.download = B[i].name; a.click(); } },
    xpost_if: function (a) { if (a) { this.xpost(); } },
    toggle_val: function (currval, newval) {
        if (!currval || currval < 0) { return newval; } else { return newval };
    },
    arrOk: function (A) { if (A === undefined || A.length == 0) { return false; } else { return true; } },
    arr_exists: function (A, v) { if (A) { return A.indexOf(v) === -1 ? false : true } else { return false } },
    arr_toggle: function (A, v) { if (A) { A.indexOf(v) === -1 ? A.push(v) : A.splice(A.indexOf(v), 1) } },
    arr_kvexists: function (A, v) { if (!v) { return false; } for (k in A) { if (A[k].v == v) { return true; } }; return false; },

    arr_push_obj: function (arr, obj) { var c = {}; for (var q in obj) { c[q] = obj[q]; }; arr.push(c); },
    obj_copy: function (a, b) { for (var q in a) { if (b.hasOwnProperty(q)) { b[q] = a[q]; } } },
    csv_split: function (x) { if (x) { return x.split(","); } else { return []; } },
    csv_toggle: function (csv, val) { var arr2 = this.csv_split(csv); this.arr_toggle(arr2, val); return arr2.toString(); },
    csv_exists: function (csv, val) { var arr2 = this.csv_split(csv); return arr2.indexOf(val.toString()) === -1 ? false : true; },
    getfrom_localstorage: function (s) {
        if (localStorage.getItem(s)) { var x = JSON.parse(localStorage.getItem(s)); if (x.xf_entity) { this.xz = x; } }
    },
    is_syscol: function (val) {
        var s = val.toString().toLowerCase(); if (s.endsWith("_tostr") || s.startsWith("xf_") || s == "domain" || s == "rdata_") { return true; }
    },
    is_obj: function (obj) { if (obj) { if (Object.keys(obj).length > 0) { return true; } }; return null; },
    clear_obj: function (A) { Object.keys(A).forEach(key => A[key] = null); },
    rowselect: function (row) { if (row.xf_id && row.xf_entity) { this.init(row.xf_entity, row.xf_id); } },
    objKeys: function (A, idOk) { var B = []; for (var k in A) { if (!this.is_syscol(k)) { B.push(k); } if (idOk && k == "xf_id") { B.push(k); } } return B; },
    ui_sections: function () { return this.xy.xf_gx || { id: "s0", col: "col-12", card: "card mb-4 pt-6" } },
    ui_cols: function () {
        var cols = []; var S = this.ui_sections(); for (var i in S) { if (!this.arr_exists(cols, S[i].col)) { cols.push(S[i].col); } }; return cols;
    },

    //blob
    file_up: function (cx) {
        for (var i = 0; i < cx.target.files.length; i++) {
            var file = cx.target.files[i]; var fR = new FileReader(); fR.name = file.name; fR.size = this.formatBytes(file.size); fR.cxid = cx.target.id;
            fR.onload = (e) => {
                var z = {}; z.name = e.target.name; z.size = e.target.size; z.dataurl = e.target.result;
                var b = {}; for (var c in this.xz[e.target.cxid]) { b[c.name] = false; } if (!b[e.target.name]) { this.xz[e.target.cxid].push(z); }
            }
            fR.readAsDataURL(file);
        }
    },
    file_up_single: function (cx) {
        var file = cx.target.files[0]; var fR = new FileReader(); fR.name = file.name; fR.size = this.formatBytes(file.size); fR.cxid = cx.target.id;
        fR.onload = (e) => { this.xz[e.target.cxid] = e.target.result; }; fR.readAsDataURL(file);
    },
    formatBytes: function (size, d) {
        if (size === 0) return '0 bytes'; var k = 1024; d = d < 0 ? 0 : 2; var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']; var i = Math.floor(Math.log(size) / Math.log(k));
        return parseFloat((size / Math.pow(k, i)).toFixed(d)) + ' ' + sizes[i];
    },
    file_down: function (dataurl, filename) { var a = document.createElement("a"); a.href = dataurl; a.download = filename; a.click(); },
    file_remove: function (b, a) { var i = this.xz[a].indexOf(b); if (i !== -1) { this.xz[a].splice(i, 1); } },
    img_oncanvas: function (cx) {
        if (!(window.File && window.FileReader && window.FileList && window.Blob)) { return false; }
        var canvas_ = document.getElementById("xf_imgoncanvas"); var ctx = canvas_.getContext("2d"); var img = new Image;
        img.onload = function () {
            var iw = img.width; var ih = img.height; var scale = Math.min((1024 / iw), (1024 / ih));
            var iwScaled = iw * scale; var ihScaled = ih * scale; canvas_.width = iwScaled; canvas_.height = ihScaled;
            ctx.drawImage(img, 0, 0, iwScaled, ihScaled);
        }
        var f1 = cx.target.files[0]; this.ximg.c = cx.target.id; this.ximg.a = f1.name; img.src = URL.createObjectURL(f1);
    },
    img_oncanvas_ok: function () {
        var cvs = document.getElementById("xf_imgoncanvas"); var z = {}; z.name = this.ximg.a; z.dataurl = cvs.toDataURL('image/jpeg', 0.9);
        z.size = this.formatBytes(z.dataurl.length); this.xz[this.ximg.c].push(z); this.ximg.a = ""; this.ximg.c = "";
        var context = cvs.getContext('2d'); context.clearRect(0, 0, cvs.width, cvs.height);
    },

    append_log: function (a, b) { var d = new Date().toISOString().substring(0, 16); var c = this.xa.userfullname + " [" + d + "] : " + b; if (a) { a = a + "\r\n" + c } else { a = c }; return a; },
    roundToN: function (num, N) { return +(Math.round(num + "e+" + N) + "e-" + N); },
    timeFromMins: function (mins) { function z(n) { return (n < 10 ? '0' : '') + n; } var h = (mins / 60 | 0) % 24; var m = mins % 60; return z(h) + "h " + z(m) + "m"; },
    timeToStr: function (t) { var ts = t.toString().padStart(4, '0'); return ts.substr(0, 2) + ':' + ts.substr(2, 2); },
    timeToMins: function (t) { var a = t.split(':'); return parseInt(a[0] + a[1]); },
    padNum: function (n, l, p) { if (n.toString().length < l) { n = p + n.toString(); } return n; },
    txtAppend: function (t, a, s) { if (!s) { s = "|"; } if (t) { t = t + s + a; } else { t = a; }; return t; },
    nameFix: function (a) { if (a) { return a.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase(); } },
    dateformatGB: function (a) { var d1 = new Date(a); var f = d1.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'); return f; },
    dateDayOfWk: function (a) { var d1 = new Date(a); return d1.getDay(); },
    decrNum: function (val, decrtill, step) { if (!step) { step = 1; }; var x = val - step; if (x < decrtill) { return decrtill } else { return x } },
    incrNum: function (val, incrtill, step) { if (!step) { step = 1; }; var x = val + step; if (x > incrtill) { return incrtill } else { return x } },
    saveToExcel: function (arr, cols, filename) {
        var Z = []; if (cols && cols.length > 0) { for (A in arr) { var B = {}; for (q in cols) { B[cols[q]] = arr[A][cols[q]]; } Z.push(B); } } else { Z = arr; }
        var wS1 = XLSX.utils.json_to_sheet(Z); if (!filename) { filename = "download"; }
        var wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, wS1, 'data');
        XLSX.writeFile(wb, filename + ".xlsx");
    },
    openWindow: function (link) { if (!link) { link = window.location.href; }; window.open(link, '_blank'); },
    sortTable: function (dT, c, asc) {
        dT.sort(function (a, b) { if (!a[c] || !b[c]) { return asc ? 1 : -1 }; if (a[c] > b[c]) { return asc ? 1 : -1 } else if (a[c] < b[c]) { return asc ? -1 : 1 } return 0; })
    },
    paginate: function (array, page_size, page_number) { return array.slice((page_number - 1) * page_size, page_number * page_size); },
    parseTSVtoArray: function (g) {
        var b = "\t"; var f = new RegExp('(\\' + b + '|\\r?\\n|\\r|^)' + '(?:"([^"]*(?:""[^"]*)*)"|' + '([^"\\' + b + '\\r\\n]*))', 'gi');
        var c = [[]]; var a = null; while (a = f.exec(g.trim())) { var e = a[1]; if (e.length && e != b && c.push([]), a[2]) var d = a[2].replace(new RegExp('""', 'g'), '"'); else var d = a[3]; c[c.length - 1].push(d); } return c;
    },
    parseTSVtoObj: function (A) {
        var q = []; for (var i = 1; i < A.length; i++) { var B = {}; for (var k in A[i]) { B[A[0][k]] = A[i][k]; }; q.push(B); } return q;
    },

    jArrayToCSV: function (d) {
        var c = typeof d != 'object' ? JSON.parse(d) : d; var e = ''; for (var a = 0; a < c.length; a++) {
            var b = ''; for (var f in c[a]) b != '' && (b += ','), b += '"' + c[a][f] + '"'; e += b + '\r\n';
        } return e;
    },
    exportCSVFile: function (jArray, fileName) {
        jArray.unshift(Object.keys(jArray[0])); var f = JSON.stringify(jArray); var g = this.jArrayToCSV(f); var b = (fileName || 'export') + '.csv'; var c = new Blob([g], { type: 'text/csv;charset=utf-8;' }); if (navigator.msSaveBlob) navigator.msSaveBlob(c, b);
        else { var a = document.createElement('a'); if (a.download !== undefined) { var h = URL.createObjectURL(c); a.setAttribute('href', h), a.setAttribute('download', b), a.style.visibility = 'hidden', document.body.appendChild(a), a.click(), document.body.removeChild(a); } }
    },

    str_contains: function (a, b) { if (!b) { return true }; if (a) { if (a.toLowerCase().indexOf(b.toLowerCase()) !== -1) { return true } } else { return false } },
    copyToClipboard: function (a) { var J = JSON.stringify(a); navigator.clipboard.writeText(J); },
    close: function () {
        this.xy.xf_gx = []; this.xz = {}; this.z = 0;
        localStorage.setItem("xf_rde", ""); localStorage.setItem("xf_rdi", 0);
        if (this.intervals) { clearInterval(this.intervals); }
        if (this.xf_rde) { this.init(this.xf_rde, this.xf_rdi); this.xf_rde = ""; this.xf_rdi = 0; }
    },
    closegoback: function () { this.z = 0; this.xz = {}; window.history.back(); },
    alertdismiss: function () { this.e = 0; this.ex = ""; },
    alertraise: function (A) {
        if (!A) { return; }; if (A.xf_e != 0) { this.e = A.xf_e; this.ex = A.xf_ex; if (this.e >= 0) { setTimeout(this.alertdismiss, 2500); } }
    },
    me: function () { return this },
    keyup: function (e) {
        if (e.altKey == true && e.key == "n") { if (this.xz.xf_id) { this.xz.xf_id = -1; } };
    },
    alertraiseParse: function (s) { var R = JSON.parse(s); this.alertraise(R); },
    alerter: function (b) { console.log(b); },
    base64Image: function (base64String) {
        try {
            // Set the base64-encoded string as the image source
            return 'data:image/jpeg;base64,' + base64String;
        } 
        catch (error)
        {
            console.error('Error fetching image:', error);
            return "";
        }
    }
}

