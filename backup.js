function (t, v) {
    var f = v.f, r = { r: f.call({}), o: {} }, h = function (a, b) { return new RegExp(b, "ig").test(a); }, g, x, j, k, p, n, l, u, o = {}, q, w;
    w = ['ez_21', 'ez_35', 'ez_40', 'c001', 'c002', 'c003'];
    var a = w[0], b = w[1], c = w[2], d = w[3], e = w[4], i = w[5];
    j = ['open', 'unlock', 'release'];
    k = ['red', 'purple', 'blue', 'cyan', 'green', 'lime', 'yellow', 'orange'];
    n = [3, 6, 0, 1, 2, 4, 5, 7, 8, 9];
    p = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
    q = function (s, n) { return s.split('\n').slice(n); };
    g = function (k, s, l, a) {
        if (a === void 0) { a = {}; }
        var r, x, o;
        for (var _i = 0, s_1 = s; _i < s_1.length; _i++) {
            var x_1 = s_1[_i];
            o = Object.assign({}, a, (_a = {}, _a[k] = x_1, _a));
            r = f.call(o);
            x_1 = q(r, -3).join('\n');
            if (h(x_1, l) || h(x_1, 'rmi'))
                return { r: r, o: o };
        }
        return { r: r, o: o, f: 0 };
        var _a;
    };
    l = function (s) {
        for (var _i = 0, w_1 = w; _i < w_1.length; _i++) {
            var l_1 = w_1[_i];
            if (h(s, l_1))
                return l_1;
        }
    };
    u = function (l, o) {
        if (l == a)
            return g(l, j, l, o);
        if (l == b)
            return g('digit', n, l, g(l, j, ['ig'], o).o);
        if (l == c)
            return g('ez_prime', p, l, g(l, j, ['_p'], o).o);
        if (l == d)
            return g('color_digit', n, l, g(l, k, ['_d'], o).o);
        if (l == e)
            return g('c002_complement', k, l, g(l, k, ['2_'], o).o);
        if (l == i)
            return g('c003_triad_2', k, l, g('c003_triad_1', k, ['d_2'], g(l, k, ['_1'], o).o).o);
    };
    do {
        r = u(l(q(r.r, -1)[0]), o);
        o = r.o;
    } while (!/rmi/gi.test(r.r));
    return { msg: r };
}
