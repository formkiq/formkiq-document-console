/*! For license information please see formkiq-client-sdk-es6.js.LICENSE.txt */
!(function (t, e) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = e())
    : 'function' == typeof define && define.amd
    ? define([], e)
    : 'object' == typeof exports
    ? (exports['formkiq-client-sdk'] = e())
    : (t['formkiq-client-sdk'] = e());
})(self, function () {
  return (() => {
    var t = {
        677: (t, e, n) => {
          'use strict';
          Object.defineProperty(e, '__esModule', { value: !0 }),
            (e.RawSha256 = void 0);
          var i = n(870),
            r = (function () {
              function t() {
                (this.state = Int32Array.from(i.INIT)),
                  (this.temp = new Int32Array(64)),
                  (this.buffer = new Uint8Array(64)),
                  (this.bufferLength = 0),
                  (this.bytesHashed = 0),
                  (this.finished = !1);
              }
              return (
                (t.prototype.update = function (t) {
                  if (this.finished)
                    throw new Error(
                      'Attempted to update an already finished hash.'
                    );
                  var e = 0,
                    n = t.byteLength;
                  if (
                    ((this.bytesHashed += n),
                    8 * this.bytesHashed > i.MAX_HASHABLE_LENGTH)
                  )
                    throw new Error('Cannot hash more than 2^53 - 1 bits');
                  for (; n > 0; )
                    (this.buffer[this.bufferLength++] = t[e++]),
                      n--,
                      this.bufferLength === i.BLOCK_SIZE &&
                        (this.hashBuffer(), (this.bufferLength = 0));
                }),
                (t.prototype.digest = function () {
                  if (!this.finished) {
                    var t = 8 * this.bytesHashed,
                      e = new DataView(
                        this.buffer.buffer,
                        this.buffer.byteOffset,
                        this.buffer.byteLength
                      ),
                      n = this.bufferLength;
                    if (
                      (e.setUint8(this.bufferLength++, 128),
                      n % i.BLOCK_SIZE >= i.BLOCK_SIZE - 8)
                    ) {
                      for (var r = this.bufferLength; r < i.BLOCK_SIZE; r++)
                        e.setUint8(r, 0);
                      this.hashBuffer(), (this.bufferLength = 0);
                    }
                    for (r = this.bufferLength; r < i.BLOCK_SIZE - 8; r++)
                      e.setUint8(r, 0);
                    e.setUint32(
                      i.BLOCK_SIZE - 8,
                      Math.floor(t / 4294967296),
                      !0
                    ),
                      e.setUint32(i.BLOCK_SIZE - 4, t),
                      this.hashBuffer(),
                      (this.finished = !0);
                  }
                  var s = new Uint8Array(i.DIGEST_LENGTH);
                  for (r = 0; r < 8; r++)
                    (s[4 * r] = (this.state[r] >>> 24) & 255),
                      (s[4 * r + 1] = (this.state[r] >>> 16) & 255),
                      (s[4 * r + 2] = (this.state[r] >>> 8) & 255),
                      (s[4 * r + 3] = (this.state[r] >>> 0) & 255);
                  return s;
                }),
                (t.prototype.hashBuffer = function () {
                  for (
                    var t = this.buffer,
                      e = this.state,
                      n = e[0],
                      r = e[1],
                      s = e[2],
                      o = e[3],
                      a = e[4],
                      u = e[5],
                      c = e[6],
                      l = e[7],
                      h = 0;
                    h < i.BLOCK_SIZE;
                    h++
                  ) {
                    if (h < 16)
                      this.temp[h] =
                        ((255 & t[4 * h]) << 24) |
                        ((255 & t[4 * h + 1]) << 16) |
                        ((255 & t[4 * h + 2]) << 8) |
                        (255 & t[4 * h + 3]);
                    else {
                      var f = this.temp[h - 2],
                        p =
                          ((f >>> 17) | (f << 15)) ^
                          ((f >>> 19) | (f << 13)) ^
                          (f >>> 10),
                        d =
                          (((f = this.temp[h - 15]) >>> 7) | (f << 25)) ^
                          ((f >>> 18) | (f << 14)) ^
                          (f >>> 3);
                      this.temp[h] =
                        ((p + this.temp[h - 7]) | 0) +
                        ((d + this.temp[h - 16]) | 0);
                    }
                    var g =
                        ((((((a >>> 6) | (a << 26)) ^
                          ((a >>> 11) | (a << 21)) ^
                          ((a >>> 25) | (a << 7))) +
                          ((a & u) ^ (~a & c))) |
                          0) +
                          ((l + ((i.KEY[h] + this.temp[h]) | 0)) | 0)) |
                        0,
                      v =
                        ((((n >>> 2) | (n << 30)) ^
                          ((n >>> 13) | (n << 19)) ^
                          ((n >>> 22) | (n << 10))) +
                          ((n & r) ^ (n & s) ^ (r & s))) |
                        0;
                    (l = c),
                      (c = u),
                      (u = a),
                      (a = (o + g) | 0),
                      (o = s),
                      (s = r),
                      (r = n),
                      (n = (g + v) | 0);
                  }
                  (e[0] += n),
                    (e[1] += r),
                    (e[2] += s),
                    (e[3] += o),
                    (e[4] += a),
                    (e[5] += u),
                    (e[6] += c),
                    (e[7] += l);
                }),
                t
              );
            })();
          e.RawSha256 = r;
        },
        870: (t, e) => {
          'use strict';
          Object.defineProperty(e, '__esModule', { value: !0 }),
            (e.MAX_HASHABLE_LENGTH =
              e.INIT =
              e.KEY =
              e.DIGEST_LENGTH =
              e.BLOCK_SIZE =
                void 0),
            (e.BLOCK_SIZE = 64),
            (e.DIGEST_LENGTH = 32),
            (e.KEY = new Uint32Array([
              1116352408, 1899447441, 3049323471, 3921009573, 961987163,
              1508970993, 2453635748, 2870763221, 3624381080, 310598401,
              607225278, 1426881987, 1925078388, 2162078206, 2614888103,
              3248222580, 3835390401, 4022224774, 264347078, 604807628,
              770255983, 1249150122, 1555081692, 1996064986, 2554220882,
              2821834349, 2952996808, 3210313671, 3336571891, 3584528711,
              113926993, 338241895, 666307205, 773529912, 1294757372,
              1396182291, 1695183700, 1986661051, 2177026350, 2456956037,
              2730485921, 2820302411, 3259730800, 3345764771, 3516065817,
              3600352804, 4094571909, 275423344, 430227734, 506948616,
              659060556, 883997877, 958139571, 1322822218, 1537002063,
              1747873779, 1955562222, 2024104815, 2227730452, 2361852424,
              2428436474, 2756734187, 3204031479, 3329325298,
            ])),
            (e.INIT = [
              1779033703, 3144134277, 1013904242, 2773480762, 1359893119,
              2600822924, 528734635, 1541459225,
            ]),
            (e.MAX_HASHABLE_LENGTH = Math.pow(2, 53) - 1);
        },
        226: (t, e, n) => {
          'use strict';
          Object.defineProperty(e, '__esModule', { value: !0 }),
            (0, n(8).__exportStar)(n(977), e);
        },
        977: (t, e, n) => {
          'use strict';
          Object.defineProperty(e, '__esModule', { value: !0 }),
            (e.Sha256 = void 0);
          var i = n(8),
            r = n(870),
            s = n(677),
            o = n(511),
            a = (function () {
              function t(t) {
                if (((this.hash = new s.RawSha256()), t)) {
                  this.outer = new s.RawSha256();
                  var e = (function (t) {
                      var e = (0, o.convertToBuffer)(t);
                      if (e.byteLength > r.BLOCK_SIZE) {
                        var n = new s.RawSha256();
                        n.update(e), (e = n.digest());
                      }
                      var i = new Uint8Array(r.BLOCK_SIZE);
                      return i.set(e), i;
                    })(t),
                    n = new Uint8Array(r.BLOCK_SIZE);
                  n.set(e);
                  for (var i = 0; i < r.BLOCK_SIZE; i++)
                    (e[i] ^= 54), (n[i] ^= 92);
                  for (
                    this.hash.update(e), this.outer.update(n), i = 0;
                    i < e.byteLength;
                    i++
                  )
                    e[i] = 0;
                }
              }
              return (
                (t.prototype.update = function (t) {
                  if (!(0, o.isEmptyData)(t) && !this.error)
                    try {
                      this.hash.update((0, o.convertToBuffer)(t));
                    } catch (t) {
                      this.error = t;
                    }
                }),
                (t.prototype.digestSync = function () {
                  if (this.error) throw this.error;
                  return this.outer
                    ? (this.outer.finished ||
                        this.outer.update(this.hash.digest()),
                      this.outer.digest())
                    : this.hash.digest();
                }),
                (t.prototype.digest = function () {
                  return (0, i.__awaiter)(this, void 0, void 0, function () {
                    return (0, i.__generator)(this, function (t) {
                      return [2, this.digestSync()];
                    });
                  });
                }),
                t
              );
            })();
          e.Sha256 = a;
        },
        293: (t, e, n) => {
          'use strict';
          Object.defineProperty(e, '__esModule', { value: !0 }),
            (e.convertToBuffer = void 0);
          var i = n(305),
            r =
              'undefined' != typeof Buffer && Buffer.from
                ? function (t) {
                    return Buffer.from(t, 'utf8');
                  }
                : i.fromUtf8;
          e.convertToBuffer = function (t) {
            return t instanceof Uint8Array
              ? t
              : 'string' == typeof t
              ? r(t)
              : ArrayBuffer.isView(t)
              ? new Uint8Array(
                  t.buffer,
                  t.byteOffset,
                  t.byteLength / Uint8Array.BYTES_PER_ELEMENT
                )
              : new Uint8Array(t);
          };
        },
        511: (t, e, n) => {
          'use strict';
          Object.defineProperty(e, '__esModule', { value: !0 }),
            (e.uint32ArrayFrom =
              e.numToUint8 =
              e.isEmptyData =
              e.convertToBuffer =
                void 0);
          var i = n(293);
          Object.defineProperty(e, 'convertToBuffer', {
            enumerable: !0,
            get: function () {
              return i.convertToBuffer;
            },
          });
          var r = n(113);
          Object.defineProperty(e, 'isEmptyData', {
            enumerable: !0,
            get: function () {
              return r.isEmptyData;
            },
          });
          var s = n(653);
          Object.defineProperty(e, 'numToUint8', {
            enumerable: !0,
            get: function () {
              return s.numToUint8;
            },
          });
          var o = n(150);
          Object.defineProperty(e, 'uint32ArrayFrom', {
            enumerable: !0,
            get: function () {
              return o.uint32ArrayFrom;
            },
          });
        },
        113: (t, e) => {
          'use strict';
          Object.defineProperty(e, '__esModule', { value: !0 }),
            (e.isEmptyData = void 0),
            (e.isEmptyData = function (t) {
              return 'string' == typeof t ? 0 === t.length : 0 === t.byteLength;
            });
        },
        653: (t, e) => {
          'use strict';
          Object.defineProperty(e, '__esModule', { value: !0 }),
            (e.numToUint8 = void 0),
            (e.numToUint8 = function (t) {
              return new Uint8Array([
                (4278190080 & t) >> 24,
                (16711680 & t) >> 16,
                (65280 & t) >> 8,
                255 & t,
              ]);
            });
        },
        150: (t, e) => {
          'use strict';
          Object.defineProperty(e, '__esModule', { value: !0 }),
            (e.uint32ArrayFrom = void 0),
            (e.uint32ArrayFrom = function (t) {
              if (!Array.from) {
                for (var e = new Uint32Array(t.length); 0 < t.length; )
                  e[0] = t[0];
                return e;
              }
              return Uint32Array.from(t);
            });
        },
        305: (t, e, n) => {
          'use strict';
          n.r(e), n.d(e, { fromUtf8: () => i, toUtf8: () => r });
          var i = function (t) {
              return 'function' == typeof TextEncoder
                ? (function (t) {
                    return new TextEncoder().encode(t);
                  })(t)
                : (function (t) {
                    for (var e = [], n = 0, i = t.length; n < i; n++) {
                      var r = t.charCodeAt(n);
                      if (r < 128) e.push(r);
                      else if (r < 2048) e.push((r >> 6) | 192, (63 & r) | 128);
                      else if (
                        n + 1 < t.length &&
                        55296 == (64512 & r) &&
                        56320 == (64512 & t.charCodeAt(n + 1))
                      ) {
                        var s =
                          65536 +
                          ((1023 & r) << 10) +
                          (1023 & t.charCodeAt(++n));
                        e.push(
                          (s >> 18) | 240,
                          ((s >> 12) & 63) | 128,
                          ((s >> 6) & 63) | 128,
                          (63 & s) | 128
                        );
                      } else
                        e.push(
                          (r >> 12) | 224,
                          ((r >> 6) & 63) | 128,
                          (63 & r) | 128
                        );
                    }
                    return Uint8Array.from(e);
                  })(t);
            },
            r = function (t) {
              return 'function' == typeof TextDecoder
                ? (function (t) {
                    return new TextDecoder('utf-8').decode(t);
                  })(t)
                : (function (t) {
                    for (var e = '', n = 0, i = t.length; n < i; n++) {
                      var r = t[n];
                      if (r < 128) e += String.fromCharCode(r);
                      else if (192 <= r && r < 224) {
                        var s = t[++n];
                        e += String.fromCharCode(((31 & r) << 6) | (63 & s));
                      } else if (240 <= r && r < 365) {
                        var o =
                          '%' +
                          [r, t[++n], t[++n], t[++n]]
                            .map(function (t) {
                              return t.toString(16);
                            })
                            .join('%');
                        e += decodeURIComponent(o);
                      } else
                        e += String.fromCharCode(
                          ((15 & r) << 12) |
                            ((63 & t[++n]) << 6) |
                            (63 & t[++n])
                        );
                    }
                    return e;
                  })(t);
            };
        },
        951: (t) => {
          function e(t, e, n, i, r, s, o) {
            try {
              var a = t[s](o),
                u = a.value;
            } catch (t) {
              return void n(t);
            }
            a.done ? e(u) : Promise.resolve(u).then(i, r);
          }
          t.exports = function (t) {
            return function () {
              var n = this,
                i = arguments;
              return new Promise(function (r, s) {
                var o = t.apply(n, i);
                function a(t) {
                  e(o, r, s, a, u, 'next', t);
                }
                function u(t) {
                  e(o, r, s, a, u, 'throw', t);
                }
                a(void 0);
              });
            };
          };
        },
        159: (t) => {
          t.exports = function (t, e) {
            if (!(t instanceof e))
              throw new TypeError('Cannot call a class as a function');
          };
        },
        306: (t) => {
          function e(t, e) {
            for (var n = 0; n < e.length; n++) {
              var i = e[n];
              (i.enumerable = i.enumerable || !1),
                (i.configurable = !0),
                'value' in i && (i.writable = !0),
                Object.defineProperty(t, i.key, i);
            }
          }
          t.exports = function (t, n, i) {
            return n && e(t.prototype, n), i && e(t, i), t;
          };
        },
        177: (t) => {
          t.exports = function (t, e, n) {
            return (
              e in t
                ? Object.defineProperty(t, e, {
                    value: n,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (t[e] = n),
              t
            );
          };
        },
        814: (t) => {
          function e(n) {
            return (
              'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
                ? (t.exports = e =
                    function (t) {
                      return typeof t;
                    })
                : (t.exports = e =
                    function (t) {
                      return t &&
                        'function' == typeof Symbol &&
                        t.constructor === Symbol &&
                        t !== Symbol.prototype
                        ? 'symbol'
                        : typeof t;
                    }),
              e(n)
            );
          }
          t.exports = e;
        },
        195: (t, e, n) => {
          t.exports = n(236);
        },
        48: (t, e, n) => {
          'use strict';
          var i = n(943),
            r = n(405),
            s = n(577);
          function o() {
            return u.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
          }
          function a(t, e) {
            if (o() < e) throw new RangeError('Invalid typed array length');
            return (
              u.TYPED_ARRAY_SUPPORT
                ? ((t = new Uint8Array(e)).__proto__ = u.prototype)
                : (null === t && (t = new u(e)), (t.length = e)),
              t
            );
          }
          function u(t, e, n) {
            if (!(u.TYPED_ARRAY_SUPPORT || this instanceof u))
              return new u(t, e, n);
            if ('number' == typeof t) {
              if ('string' == typeof e)
                throw new Error(
                  'If encoding is specified then the first argument must be a string'
                );
              return h(this, t);
            }
            return c(this, t, e, n);
          }
          function c(t, e, n, i) {
            if ('number' == typeof e)
              throw new TypeError('"value" argument must not be a number');
            return 'undefined' != typeof ArrayBuffer && e instanceof ArrayBuffer
              ? (function (t, e, n, i) {
                  if ((e.byteLength, n < 0 || e.byteLength < n))
                    throw new RangeError("'offset' is out of bounds");
                  if (e.byteLength < n + (i || 0))
                    throw new RangeError("'length' is out of bounds");
                  return (
                    (e =
                      void 0 === n && void 0 === i
                        ? new Uint8Array(e)
                        : void 0 === i
                        ? new Uint8Array(e, n)
                        : new Uint8Array(e, n, i)),
                    u.TYPED_ARRAY_SUPPORT
                      ? ((t = e).__proto__ = u.prototype)
                      : (t = f(t, e)),
                    t
                  );
                })(t, e, n, i)
              : 'string' == typeof e
              ? (function (t, e, n) {
                  if (
                    (('string' == typeof n && '' !== n) || (n = 'utf8'),
                    !u.isEncoding(n))
                  )
                    throw new TypeError(
                      '"encoding" must be a valid string encoding'
                    );
                  var i = 0 | d(e, n),
                    r = (t = a(t, i)).write(e, n);
                  return r !== i && (t = t.slice(0, r)), t;
                })(t, e, n)
              : (function (t, e) {
                  if (u.isBuffer(e)) {
                    var n = 0 | p(e.length);
                    return 0 === (t = a(t, n)).length || e.copy(t, 0, 0, n), t;
                  }
                  if (e) {
                    if (
                      ('undefined' != typeof ArrayBuffer &&
                        e.buffer instanceof ArrayBuffer) ||
                      'length' in e
                    )
                      return 'number' != typeof e.length || (i = e.length) != i
                        ? a(t, 0)
                        : f(t, e);
                    if ('Buffer' === e.type && s(e.data)) return f(t, e.data);
                  }
                  var i;
                  throw new TypeError(
                    'First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.'
                  );
                })(t, e);
          }
          function l(t) {
            if ('number' != typeof t)
              throw new TypeError('"size" argument must be a number');
            if (t < 0)
              throw new RangeError('"size" argument must not be negative');
          }
          function h(t, e) {
            if (
              (l(e), (t = a(t, e < 0 ? 0 : 0 | p(e))), !u.TYPED_ARRAY_SUPPORT)
            )
              for (var n = 0; n < e; ++n) t[n] = 0;
            return t;
          }
          function f(t, e) {
            var n = e.length < 0 ? 0 : 0 | p(e.length);
            t = a(t, n);
            for (var i = 0; i < n; i += 1) t[i] = 255 & e[i];
            return t;
          }
          function p(t) {
            if (t >= o())
              throw new RangeError(
                'Attempt to allocate Buffer larger than maximum size: 0x' +
                  o().toString(16) +
                  ' bytes'
              );
            return 0 | t;
          }
          function d(t, e) {
            if (u.isBuffer(t)) return t.length;
            if (
              'undefined' != typeof ArrayBuffer &&
              'function' == typeof ArrayBuffer.isView &&
              (ArrayBuffer.isView(t) || t instanceof ArrayBuffer)
            )
              return t.byteLength;
            'string' != typeof t && (t = '' + t);
            var n = t.length;
            if (0 === n) return 0;
            for (var i = !1; ; )
              switch (e) {
                case 'ascii':
                case 'latin1':
                case 'binary':
                  return n;
                case 'utf8':
                case 'utf-8':
                case void 0:
                  return K(t).length;
                case 'ucs2':
                case 'ucs-2':
                case 'utf16le':
                case 'utf-16le':
                  return 2 * n;
                case 'hex':
                  return n >>> 1;
                case 'base64':
                  return V(t).length;
                default:
                  if (i) return K(t).length;
                  (e = ('' + e).toLowerCase()), (i = !0);
              }
          }
          function g(t, e, n) {
            var i = !1;
            if (((void 0 === e || e < 0) && (e = 0), e > this.length))
              return '';
            if (
              ((void 0 === n || n > this.length) && (n = this.length), n <= 0)
            )
              return '';
            if ((n >>>= 0) <= (e >>>= 0)) return '';
            for (t || (t = 'utf8'); ; )
              switch (t) {
                case 'hex':
                  return D(this, e, n);
                case 'utf8':
                case 'utf-8':
                  return E(this, e, n);
                case 'ascii':
                  return I(this, e, n);
                case 'latin1':
                case 'binary':
                  return x(this, e, n);
                case 'base64':
                  return T(this, e, n);
                case 'ucs2':
                case 'ucs-2':
                case 'utf16le':
                case 'utf-16le':
                  return P(this, e, n);
                default:
                  if (i) throw new TypeError('Unknown encoding: ' + t);
                  (t = (t + '').toLowerCase()), (i = !0);
              }
          }
          function v(t, e, n) {
            var i = t[e];
            (t[e] = t[n]), (t[n] = i);
          }
          function y(t, e, n, i, r) {
            if (0 === t.length) return -1;
            if (
              ('string' == typeof n
                ? ((i = n), (n = 0))
                : n > 2147483647
                ? (n = 2147483647)
                : n < -2147483648 && (n = -2147483648),
              (n = +n),
              isNaN(n) && (n = r ? 0 : t.length - 1),
              n < 0 && (n = t.length + n),
              n >= t.length)
            ) {
              if (r) return -1;
              n = t.length - 1;
            } else if (n < 0) {
              if (!r) return -1;
              n = 0;
            }
            if (('string' == typeof e && (e = u.from(e, i)), u.isBuffer(e)))
              return 0 === e.length ? -1 : m(t, e, n, i, r);
            if ('number' == typeof e)
              return (
                (e &= 255),
                u.TYPED_ARRAY_SUPPORT &&
                'function' == typeof Uint8Array.prototype.indexOf
                  ? r
                    ? Uint8Array.prototype.indexOf.call(t, e, n)
                    : Uint8Array.prototype.lastIndexOf.call(t, e, n)
                  : m(t, [e], n, i, r)
              );
            throw new TypeError('val must be string, number or Buffer');
          }
          function m(t, e, n, i, r) {
            var s,
              o = 1,
              a = t.length,
              u = e.length;
            if (
              void 0 !== i &&
              ('ucs2' === (i = String(i).toLowerCase()) ||
                'ucs-2' === i ||
                'utf16le' === i ||
                'utf-16le' === i)
            ) {
              if (t.length < 2 || e.length < 2) return -1;
              (o = 2), (a /= 2), (u /= 2), (n /= 2);
            }
            function c(t, e) {
              return 1 === o ? t[e] : t.readUInt16BE(e * o);
            }
            if (r) {
              var l = -1;
              for (s = n; s < a; s++)
                if (c(t, s) === c(e, -1 === l ? 0 : s - l)) {
                  if ((-1 === l && (l = s), s - l + 1 === u)) return l * o;
                } else -1 !== l && (s -= s - l), (l = -1);
            } else
              for (n + u > a && (n = a - u), s = n; s >= 0; s--) {
                for (var h = !0, f = 0; f < u; f++)
                  if (c(t, s + f) !== c(e, f)) {
                    h = !1;
                    break;
                  }
                if (h) return s;
              }
            return -1;
          }
          function C(t, e, n, i) {
            n = Number(n) || 0;
            var r = t.length - n;
            i ? (i = Number(i)) > r && (i = r) : (i = r);
            var s = e.length;
            if (s % 2 != 0) throw new TypeError('Invalid hex string');
            i > s / 2 && (i = s / 2);
            for (var o = 0; o < i; ++o) {
              var a = parseInt(e.substr(2 * o, 2), 16);
              if (isNaN(a)) return o;
              t[n + o] = a;
            }
            return o;
          }
          function w(t, e, n, i) {
            return q(K(e, t.length - n), t, n, i);
          }
          function b(t, e, n, i) {
            return q(
              (function (t) {
                for (var e = [], n = 0; n < t.length; ++n)
                  e.push(255 & t.charCodeAt(n));
                return e;
              })(e),
              t,
              n,
              i
            );
          }
          function S(t, e, n, i) {
            return b(t, e, n, i);
          }
          function A(t, e, n, i) {
            return q(V(e), t, n, i);
          }
          function k(t, e, n, i) {
            return q(
              (function (t, e) {
                for (
                  var n, i, r, s = [], o = 0;
                  o < t.length && !((e -= 2) < 0);
                  ++o
                )
                  (i = (n = t.charCodeAt(o)) >> 8),
                    (r = n % 256),
                    s.push(r),
                    s.push(i);
                return s;
              })(e, t.length - n),
              t,
              n,
              i
            );
          }
          function T(t, e, n) {
            return 0 === e && n === t.length
              ? i.fromByteArray(t)
              : i.fromByteArray(t.slice(e, n));
          }
          function E(t, e, n) {
            n = Math.min(t.length, n);
            for (var i = [], r = e; r < n; ) {
              var s,
                o,
                a,
                u,
                c = t[r],
                l = null,
                h = c > 239 ? 4 : c > 223 ? 3 : c > 191 ? 2 : 1;
              if (r + h <= n)
                switch (h) {
                  case 1:
                    c < 128 && (l = c);
                    break;
                  case 2:
                    128 == (192 & (s = t[r + 1])) &&
                      (u = ((31 & c) << 6) | (63 & s)) > 127 &&
                      (l = u);
                    break;
                  case 3:
                    (s = t[r + 1]),
                      (o = t[r + 2]),
                      128 == (192 & s) &&
                        128 == (192 & o) &&
                        (u = ((15 & c) << 12) | ((63 & s) << 6) | (63 & o)) >
                          2047 &&
                        (u < 55296 || u > 57343) &&
                        (l = u);
                    break;
                  case 4:
                    (s = t[r + 1]),
                      (o = t[r + 2]),
                      (a = t[r + 3]),
                      128 == (192 & s) &&
                        128 == (192 & o) &&
                        128 == (192 & a) &&
                        (u =
                          ((15 & c) << 18) |
                          ((63 & s) << 12) |
                          ((63 & o) << 6) |
                          (63 & a)) > 65535 &&
                        u < 1114112 &&
                        (l = u);
                }
              null === l
                ? ((l = 65533), (h = 1))
                : l > 65535 &&
                  ((l -= 65536),
                  i.push(((l >>> 10) & 1023) | 55296),
                  (l = 56320 | (1023 & l))),
                i.push(l),
                (r += h);
            }
            return (function (t) {
              var e = t.length;
              if (e <= U) return String.fromCharCode.apply(String, t);
              for (var n = '', i = 0; i < e; )
                n += String.fromCharCode.apply(String, t.slice(i, (i += U)));
              return n;
            })(i);
          }
          (e.lW = u),
            (e.h2 = 50),
            (u.TYPED_ARRAY_SUPPORT =
              void 0 !== n.g.TYPED_ARRAY_SUPPORT
                ? n.g.TYPED_ARRAY_SUPPORT
                : (function () {
                    try {
                      var t = new Uint8Array(1);
                      return (
                        (t.__proto__ = {
                          __proto__: Uint8Array.prototype,
                          foo: function () {
                            return 42;
                          },
                        }),
                        42 === t.foo() &&
                          'function' == typeof t.subarray &&
                          0 === t.subarray(1, 1).byteLength
                      );
                    } catch (t) {
                      return !1;
                    }
                  })()),
            o(),
            (u.poolSize = 8192),
            (u._augment = function (t) {
              return (t.__proto__ = u.prototype), t;
            }),
            (u.from = function (t, e, n) {
              return c(null, t, e, n);
            }),
            u.TYPED_ARRAY_SUPPORT &&
              ((u.prototype.__proto__ = Uint8Array.prototype),
              (u.__proto__ = Uint8Array),
              'undefined' != typeof Symbol &&
                Symbol.species &&
                u[Symbol.species] === u &&
                Object.defineProperty(u, Symbol.species, {
                  value: null,
                  configurable: !0,
                })),
            (u.alloc = function (t, e, n) {
              return (function (t, e, n, i) {
                return (
                  l(e),
                  e <= 0
                    ? a(t, e)
                    : void 0 !== n
                    ? 'string' == typeof i
                      ? a(t, e).fill(n, i)
                      : a(t, e).fill(n)
                    : a(t, e)
                );
              })(null, t, e, n);
            }),
            (u.allocUnsafe = function (t) {
              return h(null, t);
            }),
            (u.allocUnsafeSlow = function (t) {
              return h(null, t);
            }),
            (u.isBuffer = function (t) {
              return !(null == t || !t._isBuffer);
            }),
            (u.compare = function (t, e) {
              if (!u.isBuffer(t) || !u.isBuffer(e))
                throw new TypeError('Arguments must be Buffers');
              if (t === e) return 0;
              for (
                var n = t.length, i = e.length, r = 0, s = Math.min(n, i);
                r < s;
                ++r
              )
                if (t[r] !== e[r]) {
                  (n = t[r]), (i = e[r]);
                  break;
                }
              return n < i ? -1 : i < n ? 1 : 0;
            }),
            (u.isEncoding = function (t) {
              switch (String(t).toLowerCase()) {
                case 'hex':
                case 'utf8':
                case 'utf-8':
                case 'ascii':
                case 'latin1':
                case 'binary':
                case 'base64':
                case 'ucs2':
                case 'ucs-2':
                case 'utf16le':
                case 'utf-16le':
                  return !0;
                default:
                  return !1;
              }
            }),
            (u.concat = function (t, e) {
              if (!s(t))
                throw new TypeError(
                  '"list" argument must be an Array of Buffers'
                );
              if (0 === t.length) return u.alloc(0);
              var n;
              if (void 0 === e)
                for (e = 0, n = 0; n < t.length; ++n) e += t[n].length;
              var i = u.allocUnsafe(e),
                r = 0;
              for (n = 0; n < t.length; ++n) {
                var o = t[n];
                if (!u.isBuffer(o))
                  throw new TypeError(
                    '"list" argument must be an Array of Buffers'
                  );
                o.copy(i, r), (r += o.length);
              }
              return i;
            }),
            (u.byteLength = d),
            (u.prototype._isBuffer = !0),
            (u.prototype.swap16 = function () {
              var t = this.length;
              if (t % 2 != 0)
                throw new RangeError(
                  'Buffer size must be a multiple of 16-bits'
                );
              for (var e = 0; e < t; e += 2) v(this, e, e + 1);
              return this;
            }),
            (u.prototype.swap32 = function () {
              var t = this.length;
              if (t % 4 != 0)
                throw new RangeError(
                  'Buffer size must be a multiple of 32-bits'
                );
              for (var e = 0; e < t; e += 4)
                v(this, e, e + 3), v(this, e + 1, e + 2);
              return this;
            }),
            (u.prototype.swap64 = function () {
              var t = this.length;
              if (t % 8 != 0)
                throw new RangeError(
                  'Buffer size must be a multiple of 64-bits'
                );
              for (var e = 0; e < t; e += 8)
                v(this, e, e + 7),
                  v(this, e + 1, e + 6),
                  v(this, e + 2, e + 5),
                  v(this, e + 3, e + 4);
              return this;
            }),
            (u.prototype.toString = function () {
              var t = 0 | this.length;
              return 0 === t
                ? ''
                : 0 === arguments.length
                ? E(this, 0, t)
                : g.apply(this, arguments);
            }),
            (u.prototype.equals = function (t) {
              if (!u.isBuffer(t))
                throw new TypeError('Argument must be a Buffer');
              return this === t || 0 === u.compare(this, t);
            }),
            (u.prototype.inspect = function () {
              var t = '',
                n = e.h2;
              return (
                this.length > 0 &&
                  ((t = this.toString('hex', 0, n).match(/.{2}/g).join(' ')),
                  this.length > n && (t += ' ... ')),
                '<Buffer ' + t + '>'
              );
            }),
            (u.prototype.compare = function (t, e, n, i, r) {
              if (!u.isBuffer(t))
                throw new TypeError('Argument must be a Buffer');
              if (
                (void 0 === e && (e = 0),
                void 0 === n && (n = t ? t.length : 0),
                void 0 === i && (i = 0),
                void 0 === r && (r = this.length),
                e < 0 || n > t.length || i < 0 || r > this.length)
              )
                throw new RangeError('out of range index');
              if (i >= r && e >= n) return 0;
              if (i >= r) return -1;
              if (e >= n) return 1;
              if (this === t) return 0;
              for (
                var s = (r >>>= 0) - (i >>>= 0),
                  o = (n >>>= 0) - (e >>>= 0),
                  a = Math.min(s, o),
                  c = this.slice(i, r),
                  l = t.slice(e, n),
                  h = 0;
                h < a;
                ++h
              )
                if (c[h] !== l[h]) {
                  (s = c[h]), (o = l[h]);
                  break;
                }
              return s < o ? -1 : o < s ? 1 : 0;
            }),
            (u.prototype.includes = function (t, e, n) {
              return -1 !== this.indexOf(t, e, n);
            }),
            (u.prototype.indexOf = function (t, e, n) {
              return y(this, t, e, n, !0);
            }),
            (u.prototype.lastIndexOf = function (t, e, n) {
              return y(this, t, e, n, !1);
            }),
            (u.prototype.write = function (t, e, n, i) {
              if (void 0 === e) (i = 'utf8'), (n = this.length), (e = 0);
              else if (void 0 === n && 'string' == typeof e)
                (i = e), (n = this.length), (e = 0);
              else {
                if (!isFinite(e))
                  throw new Error(
                    'Buffer.write(string, encoding, offset[, length]) is no longer supported'
                  );
                (e |= 0),
                  isFinite(n)
                    ? ((n |= 0), void 0 === i && (i = 'utf8'))
                    : ((i = n), (n = void 0));
              }
              var r = this.length - e;
              if (
                ((void 0 === n || n > r) && (n = r),
                (t.length > 0 && (n < 0 || e < 0)) || e > this.length)
              )
                throw new RangeError('Attempt to write outside buffer bounds');
              i || (i = 'utf8');
              for (var s = !1; ; )
                switch (i) {
                  case 'hex':
                    return C(this, t, e, n);
                  case 'utf8':
                  case 'utf-8':
                    return w(this, t, e, n);
                  case 'ascii':
                    return b(this, t, e, n);
                  case 'latin1':
                  case 'binary':
                    return S(this, t, e, n);
                  case 'base64':
                    return A(this, t, e, n);
                  case 'ucs2':
                  case 'ucs-2':
                  case 'utf16le':
                  case 'utf-16le':
                    return k(this, t, e, n);
                  default:
                    if (s) throw new TypeError('Unknown encoding: ' + i);
                    (i = ('' + i).toLowerCase()), (s = !0);
                }
            }),
            (u.prototype.toJSON = function () {
              return {
                type: 'Buffer',
                data: Array.prototype.slice.call(this._arr || this, 0),
              };
            });
          var U = 4096;
          function I(t, e, n) {
            var i = '';
            n = Math.min(t.length, n);
            for (var r = e; r < n; ++r) i += String.fromCharCode(127 & t[r]);
            return i;
          }
          function x(t, e, n) {
            var i = '';
            n = Math.min(t.length, n);
            for (var r = e; r < n; ++r) i += String.fromCharCode(t[r]);
            return i;
          }
          function D(t, e, n) {
            var i,
              r = t.length;
            (!e || e < 0) && (e = 0), (!n || n < 0 || n > r) && (n = r);
            for (var s = '', o = e; o < n; ++o)
              s += (i = t[o]) < 16 ? '0' + i.toString(16) : i.toString(16);
            return s;
          }
          function P(t, e, n) {
            for (var i = t.slice(e, n), r = '', s = 0; s < i.length; s += 2)
              r += String.fromCharCode(i[s] + 256 * i[s + 1]);
            return r;
          }
          function R(t, e, n) {
            if (t % 1 != 0 || t < 0) throw new RangeError('offset is not uint');
            if (t + e > n)
              throw new RangeError('Trying to access beyond buffer length');
          }
          function O(t, e, n, i, r, s) {
            if (!u.isBuffer(t))
              throw new TypeError(
                '"buffer" argument must be a Buffer instance'
              );
            if (e > r || e < s)
              throw new RangeError('"value" argument is out of bounds');
            if (n + i > t.length) throw new RangeError('Index out of range');
          }
          function _(t, e, n, i) {
            e < 0 && (e = 65535 + e + 1);
            for (var r = 0, s = Math.min(t.length - n, 2); r < s; ++r)
              t[n + r] =
                (e & (255 << (8 * (i ? r : 1 - r)))) >>> (8 * (i ? r : 1 - r));
          }
          function N(t, e, n, i) {
            e < 0 && (e = 4294967295 + e + 1);
            for (var r = 0, s = Math.min(t.length - n, 4); r < s; ++r)
              t[n + r] = (e >>> (8 * (i ? r : 3 - r))) & 255;
          }
          function F(t, e, n, i, r, s) {
            if (n + i > t.length) throw new RangeError('Index out of range');
            if (n < 0) throw new RangeError('Index out of range');
          }
          function B(t, e, n, i, s) {
            return s || F(t, 0, n, 4), r.write(t, e, n, i, 23, 4), n + 4;
          }
          function M(t, e, n, i, s) {
            return s || F(t, 0, n, 8), r.write(t, e, n, i, 52, 8), n + 8;
          }
          (u.prototype.slice = function (t, e) {
            var n,
              i = this.length;
            if (
              ((t = ~~t) < 0 ? (t += i) < 0 && (t = 0) : t > i && (t = i),
              (e = void 0 === e ? i : ~~e) < 0
                ? (e += i) < 0 && (e = 0)
                : e > i && (e = i),
              e < t && (e = t),
              u.TYPED_ARRAY_SUPPORT)
            )
              (n = this.subarray(t, e)).__proto__ = u.prototype;
            else {
              var r = e - t;
              n = new u(r, void 0);
              for (var s = 0; s < r; ++s) n[s] = this[s + t];
            }
            return n;
          }),
            (u.prototype.readUIntLE = function (t, e, n) {
              (t |= 0), (e |= 0), n || R(t, e, this.length);
              for (var i = this[t], r = 1, s = 0; ++s < e && (r *= 256); )
                i += this[t + s] * r;
              return i;
            }),
            (u.prototype.readUIntBE = function (t, e, n) {
              (t |= 0), (e |= 0), n || R(t, e, this.length);
              for (var i = this[t + --e], r = 1; e > 0 && (r *= 256); )
                i += this[t + --e] * r;
              return i;
            }),
            (u.prototype.readUInt8 = function (t, e) {
              return e || R(t, 1, this.length), this[t];
            }),
            (u.prototype.readUInt16LE = function (t, e) {
              return e || R(t, 2, this.length), this[t] | (this[t + 1] << 8);
            }),
            (u.prototype.readUInt16BE = function (t, e) {
              return e || R(t, 2, this.length), (this[t] << 8) | this[t + 1];
            }),
            (u.prototype.readUInt32LE = function (t, e) {
              return (
                e || R(t, 4, this.length),
                (this[t] | (this[t + 1] << 8) | (this[t + 2] << 16)) +
                  16777216 * this[t + 3]
              );
            }),
            (u.prototype.readUInt32BE = function (t, e) {
              return (
                e || R(t, 4, this.length),
                16777216 * this[t] +
                  ((this[t + 1] << 16) | (this[t + 2] << 8) | this[t + 3])
              );
            }),
            (u.prototype.readIntLE = function (t, e, n) {
              (t |= 0), (e |= 0), n || R(t, e, this.length);
              for (var i = this[t], r = 1, s = 0; ++s < e && (r *= 256); )
                i += this[t + s] * r;
              return i >= (r *= 128) && (i -= Math.pow(2, 8 * e)), i;
            }),
            (u.prototype.readIntBE = function (t, e, n) {
              (t |= 0), (e |= 0), n || R(t, e, this.length);
              for (var i = e, r = 1, s = this[t + --i]; i > 0 && (r *= 256); )
                s += this[t + --i] * r;
              return s >= (r *= 128) && (s -= Math.pow(2, 8 * e)), s;
            }),
            (u.prototype.readInt8 = function (t, e) {
              return (
                e || R(t, 1, this.length),
                128 & this[t] ? -1 * (255 - this[t] + 1) : this[t]
              );
            }),
            (u.prototype.readInt16LE = function (t, e) {
              e || R(t, 2, this.length);
              var n = this[t] | (this[t + 1] << 8);
              return 32768 & n ? 4294901760 | n : n;
            }),
            (u.prototype.readInt16BE = function (t, e) {
              e || R(t, 2, this.length);
              var n = this[t + 1] | (this[t] << 8);
              return 32768 & n ? 4294901760 | n : n;
            }),
            (u.prototype.readInt32LE = function (t, e) {
              return (
                e || R(t, 4, this.length),
                this[t] |
                  (this[t + 1] << 8) |
                  (this[t + 2] << 16) |
                  (this[t + 3] << 24)
              );
            }),
            (u.prototype.readInt32BE = function (t, e) {
              return (
                e || R(t, 4, this.length),
                (this[t] << 24) |
                  (this[t + 1] << 16) |
                  (this[t + 2] << 8) |
                  this[t + 3]
              );
            }),
            (u.prototype.readFloatLE = function (t, e) {
              return e || R(t, 4, this.length), r.read(this, t, !0, 23, 4);
            }),
            (u.prototype.readFloatBE = function (t, e) {
              return e || R(t, 4, this.length), r.read(this, t, !1, 23, 4);
            }),
            (u.prototype.readDoubleLE = function (t, e) {
              return e || R(t, 8, this.length), r.read(this, t, !0, 52, 8);
            }),
            (u.prototype.readDoubleBE = function (t, e) {
              return e || R(t, 8, this.length), r.read(this, t, !1, 52, 8);
            }),
            (u.prototype.writeUIntLE = function (t, e, n, i) {
              (t = +t),
                (e |= 0),
                (n |= 0),
                i || O(this, t, e, n, Math.pow(2, 8 * n) - 1, 0);
              var r = 1,
                s = 0;
              for (this[e] = 255 & t; ++s < n && (r *= 256); )
                this[e + s] = (t / r) & 255;
              return e + n;
            }),
            (u.prototype.writeUIntBE = function (t, e, n, i) {
              (t = +t),
                (e |= 0),
                (n |= 0),
                i || O(this, t, e, n, Math.pow(2, 8 * n) - 1, 0);
              var r = n - 1,
                s = 1;
              for (this[e + r] = 255 & t; --r >= 0 && (s *= 256); )
                this[e + r] = (t / s) & 255;
              return e + n;
            }),
            (u.prototype.writeUInt8 = function (t, e, n) {
              return (
                (t = +t),
                (e |= 0),
                n || O(this, t, e, 1, 255, 0),
                u.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)),
                (this[e] = 255 & t),
                e + 1
              );
            }),
            (u.prototype.writeUInt16LE = function (t, e, n) {
              return (
                (t = +t),
                (e |= 0),
                n || O(this, t, e, 2, 65535, 0),
                u.TYPED_ARRAY_SUPPORT
                  ? ((this[e] = 255 & t), (this[e + 1] = t >>> 8))
                  : _(this, t, e, !0),
                e + 2
              );
            }),
            (u.prototype.writeUInt16BE = function (t, e, n) {
              return (
                (t = +t),
                (e |= 0),
                n || O(this, t, e, 2, 65535, 0),
                u.TYPED_ARRAY_SUPPORT
                  ? ((this[e] = t >>> 8), (this[e + 1] = 255 & t))
                  : _(this, t, e, !1),
                e + 2
              );
            }),
            (u.prototype.writeUInt32LE = function (t, e, n) {
              return (
                (t = +t),
                (e |= 0),
                n || O(this, t, e, 4, 4294967295, 0),
                u.TYPED_ARRAY_SUPPORT
                  ? ((this[e + 3] = t >>> 24),
                    (this[e + 2] = t >>> 16),
                    (this[e + 1] = t >>> 8),
                    (this[e] = 255 & t))
                  : N(this, t, e, !0),
                e + 4
              );
            }),
            (u.prototype.writeUInt32BE = function (t, e, n) {
              return (
                (t = +t),
                (e |= 0),
                n || O(this, t, e, 4, 4294967295, 0),
                u.TYPED_ARRAY_SUPPORT
                  ? ((this[e] = t >>> 24),
                    (this[e + 1] = t >>> 16),
                    (this[e + 2] = t >>> 8),
                    (this[e + 3] = 255 & t))
                  : N(this, t, e, !1),
                e + 4
              );
            }),
            (u.prototype.writeIntLE = function (t, e, n, i) {
              if (((t = +t), (e |= 0), !i)) {
                var r = Math.pow(2, 8 * n - 1);
                O(this, t, e, n, r - 1, -r);
              }
              var s = 0,
                o = 1,
                a = 0;
              for (this[e] = 255 & t; ++s < n && (o *= 256); )
                t < 0 && 0 === a && 0 !== this[e + s - 1] && (a = 1),
                  (this[e + s] = (((t / o) >> 0) - a) & 255);
              return e + n;
            }),
            (u.prototype.writeIntBE = function (t, e, n, i) {
              if (((t = +t), (e |= 0), !i)) {
                var r = Math.pow(2, 8 * n - 1);
                O(this, t, e, n, r - 1, -r);
              }
              var s = n - 1,
                o = 1,
                a = 0;
              for (this[e + s] = 255 & t; --s >= 0 && (o *= 256); )
                t < 0 && 0 === a && 0 !== this[e + s + 1] && (a = 1),
                  (this[e + s] = (((t / o) >> 0) - a) & 255);
              return e + n;
            }),
            (u.prototype.writeInt8 = function (t, e, n) {
              return (
                (t = +t),
                (e |= 0),
                n || O(this, t, e, 1, 127, -128),
                u.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)),
                t < 0 && (t = 255 + t + 1),
                (this[e] = 255 & t),
                e + 1
              );
            }),
            (u.prototype.writeInt16LE = function (t, e, n) {
              return (
                (t = +t),
                (e |= 0),
                n || O(this, t, e, 2, 32767, -32768),
                u.TYPED_ARRAY_SUPPORT
                  ? ((this[e] = 255 & t), (this[e + 1] = t >>> 8))
                  : _(this, t, e, !0),
                e + 2
              );
            }),
            (u.prototype.writeInt16BE = function (t, e, n) {
              return (
                (t = +t),
                (e |= 0),
                n || O(this, t, e, 2, 32767, -32768),
                u.TYPED_ARRAY_SUPPORT
                  ? ((this[e] = t >>> 8), (this[e + 1] = 255 & t))
                  : _(this, t, e, !1),
                e + 2
              );
            }),
            (u.prototype.writeInt32LE = function (t, e, n) {
              return (
                (t = +t),
                (e |= 0),
                n || O(this, t, e, 4, 2147483647, -2147483648),
                u.TYPED_ARRAY_SUPPORT
                  ? ((this[e] = 255 & t),
                    (this[e + 1] = t >>> 8),
                    (this[e + 2] = t >>> 16),
                    (this[e + 3] = t >>> 24))
                  : N(this, t, e, !0),
                e + 4
              );
            }),
            (u.prototype.writeInt32BE = function (t, e, n) {
              return (
                (t = +t),
                (e |= 0),
                n || O(this, t, e, 4, 2147483647, -2147483648),
                t < 0 && (t = 4294967295 + t + 1),
                u.TYPED_ARRAY_SUPPORT
                  ? ((this[e] = t >>> 24),
                    (this[e + 1] = t >>> 16),
                    (this[e + 2] = t >>> 8),
                    (this[e + 3] = 255 & t))
                  : N(this, t, e, !1),
                e + 4
              );
            }),
            (u.prototype.writeFloatLE = function (t, e, n) {
              return B(this, t, e, !0, n);
            }),
            (u.prototype.writeFloatBE = function (t, e, n) {
              return B(this, t, e, !1, n);
            }),
            (u.prototype.writeDoubleLE = function (t, e, n) {
              return M(this, t, e, !0, n);
            }),
            (u.prototype.writeDoubleBE = function (t, e, n) {
              return M(this, t, e, !1, n);
            }),
            (u.prototype.copy = function (t, e, n, i) {
              if (
                (n || (n = 0),
                i || 0 === i || (i = this.length),
                e >= t.length && (e = t.length),
                e || (e = 0),
                i > 0 && i < n && (i = n),
                i === n)
              )
                return 0;
              if (0 === t.length || 0 === this.length) return 0;
              if (e < 0) throw new RangeError('targetStart out of bounds');
              if (n < 0 || n >= this.length)
                throw new RangeError('sourceStart out of bounds');
              if (i < 0) throw new RangeError('sourceEnd out of bounds');
              i > this.length && (i = this.length),
                t.length - e < i - n && (i = t.length - e + n);
              var r,
                s = i - n;
              if (this === t && n < e && e < i)
                for (r = s - 1; r >= 0; --r) t[r + e] = this[r + n];
              else if (s < 1e3 || !u.TYPED_ARRAY_SUPPORT)
                for (r = 0; r < s; ++r) t[r + e] = this[r + n];
              else Uint8Array.prototype.set.call(t, this.subarray(n, n + s), e);
              return s;
            }),
            (u.prototype.fill = function (t, e, n, i) {
              if ('string' == typeof t) {
                if (
                  ('string' == typeof e
                    ? ((i = e), (e = 0), (n = this.length))
                    : 'string' == typeof n && ((i = n), (n = this.length)),
                  1 === t.length)
                ) {
                  var r = t.charCodeAt(0);
                  r < 256 && (t = r);
                }
                if (void 0 !== i && 'string' != typeof i)
                  throw new TypeError('encoding must be a string');
                if ('string' == typeof i && !u.isEncoding(i))
                  throw new TypeError('Unknown encoding: ' + i);
              } else 'number' == typeof t && (t &= 255);
              if (e < 0 || this.length < e || this.length < n)
                throw new RangeError('Out of range index');
              if (n <= e) return this;
              var s;
              if (
                ((e >>>= 0),
                (n = void 0 === n ? this.length : n >>> 0),
                t || (t = 0),
                'number' == typeof t)
              )
                for (s = e; s < n; ++s) this[s] = t;
              else {
                var o = u.isBuffer(t) ? t : K(new u(t, i).toString()),
                  a = o.length;
                for (s = 0; s < n - e; ++s) this[s + e] = o[s % a];
              }
              return this;
            });
          var L = /[^+\/0-9A-Za-z-_]/g;
          function K(t, e) {
            var n;
            e = e || 1 / 0;
            for (var i = t.length, r = null, s = [], o = 0; o < i; ++o) {
              if ((n = t.charCodeAt(o)) > 55295 && n < 57344) {
                if (!r) {
                  if (n > 56319) {
                    (e -= 3) > -1 && s.push(239, 191, 189);
                    continue;
                  }
                  if (o + 1 === i) {
                    (e -= 3) > -1 && s.push(239, 191, 189);
                    continue;
                  }
                  r = n;
                  continue;
                }
                if (n < 56320) {
                  (e -= 3) > -1 && s.push(239, 191, 189), (r = n);
                  continue;
                }
                n = 65536 + (((r - 55296) << 10) | (n - 56320));
              } else r && (e -= 3) > -1 && s.push(239, 191, 189);
              if (((r = null), n < 128)) {
                if ((e -= 1) < 0) break;
                s.push(n);
              } else if (n < 2048) {
                if ((e -= 2) < 0) break;
                s.push((n >> 6) | 192, (63 & n) | 128);
              } else if (n < 65536) {
                if ((e -= 3) < 0) break;
                s.push((n >> 12) | 224, ((n >> 6) & 63) | 128, (63 & n) | 128);
              } else {
                if (!(n < 1114112)) throw new Error('Invalid code point');
                if ((e -= 4) < 0) break;
                s.push(
                  (n >> 18) | 240,
                  ((n >> 12) & 63) | 128,
                  ((n >> 6) & 63) | 128,
                  (63 & n) | 128
                );
              }
            }
            return s;
          }
          function V(t) {
            return i.toByteArray(
              (function (t) {
                if (
                  (t = (function (t) {
                    return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, '');
                  })(t).replace(L, '')).length < 2
                )
                  return '';
                for (; t.length % 4 != 0; ) t += '=';
                return t;
              })(t)
            );
          }
          function q(t, e, n, i) {
            for (var r = 0; r < i && !(r + n >= e.length || r >= t.length); ++r)
              e[r + n] = t[r];
            return r;
          }
        },
        943: (t, e) => {
          'use strict';
          (e.byteLength = function (t) {
            var e = u(t),
              n = e[0],
              i = e[1];
            return (3 * (n + i)) / 4 - i;
          }),
            (e.toByteArray = function (t) {
              var e,
                n,
                s = u(t),
                o = s[0],
                a = s[1],
                c = new r(
                  (function (t, e, n) {
                    return (3 * (e + n)) / 4 - n;
                  })(0, o, a)
                ),
                l = 0,
                h = a > 0 ? o - 4 : o;
              for (n = 0; n < h; n += 4)
                (e =
                  (i[t.charCodeAt(n)] << 18) |
                  (i[t.charCodeAt(n + 1)] << 12) |
                  (i[t.charCodeAt(n + 2)] << 6) |
                  i[t.charCodeAt(n + 3)]),
                  (c[l++] = (e >> 16) & 255),
                  (c[l++] = (e >> 8) & 255),
                  (c[l++] = 255 & e);
              return (
                2 === a &&
                  ((e =
                    (i[t.charCodeAt(n)] << 2) | (i[t.charCodeAt(n + 1)] >> 4)),
                  (c[l++] = 255 & e)),
                1 === a &&
                  ((e =
                    (i[t.charCodeAt(n)] << 10) |
                    (i[t.charCodeAt(n + 1)] << 4) |
                    (i[t.charCodeAt(n + 2)] >> 2)),
                  (c[l++] = (e >> 8) & 255),
                  (c[l++] = 255 & e)),
                c
              );
            }),
            (e.fromByteArray = function (t) {
              for (
                var e,
                  i = t.length,
                  r = i % 3,
                  s = [],
                  o = 16383,
                  a = 0,
                  u = i - r;
                a < u;
                a += o
              )
                s.push(c(t, a, a + o > u ? u : a + o));
              return (
                1 === r
                  ? ((e = t[i - 1]),
                    s.push(n[e >> 2] + n[(e << 4) & 63] + '=='))
                  : 2 === r &&
                    ((e = (t[i - 2] << 8) + t[i - 1]),
                    s.push(
                      n[e >> 10] + n[(e >> 4) & 63] + n[(e << 2) & 63] + '='
                    )),
                s.join('')
              );
            });
          for (
            var n = [],
              i = [],
              r = 'undefined' != typeof Uint8Array ? Uint8Array : Array,
              s =
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
              o = 0,
              a = s.length;
            o < a;
            ++o
          )
            (n[o] = s[o]), (i[s.charCodeAt(o)] = o);
          function u(t) {
            var e = t.length;
            if (e % 4 > 0)
              throw new Error('Invalid string. Length must be a multiple of 4');
            var n = t.indexOf('=');
            return -1 === n && (n = e), [n, n === e ? 0 : 4 - (n % 4)];
          }
          function c(t, e, i) {
            for (var r, s, o = [], a = e; a < i; a += 3)
              (r =
                ((t[a] << 16) & 16711680) +
                ((t[a + 1] << 8) & 65280) +
                (255 & t[a + 2])),
                o.push(
                  n[((s = r) >> 18) & 63] +
                    n[(s >> 12) & 63] +
                    n[(s >> 6) & 63] +
                    n[63 & s]
                );
            return o.join('');
          }
          (i['-'.charCodeAt(0)] = 62), (i['_'.charCodeAt(0)] = 63);
        },
        405: (t, e) => {
          (e.read = function (t, e, n, i, r) {
            var s,
              o,
              a = 8 * r - i - 1,
              u = (1 << a) - 1,
              c = u >> 1,
              l = -7,
              h = n ? r - 1 : 0,
              f = n ? -1 : 1,
              p = t[e + h];
            for (
              h += f, s = p & ((1 << -l) - 1), p >>= -l, l += a;
              l > 0;
              s = 256 * s + t[e + h], h += f, l -= 8
            );
            for (
              o = s & ((1 << -l) - 1), s >>= -l, l += i;
              l > 0;
              o = 256 * o + t[e + h], h += f, l -= 8
            );
            if (0 === s) s = 1 - c;
            else {
              if (s === u) return o ? NaN : (1 / 0) * (p ? -1 : 1);
              (o += Math.pow(2, i)), (s -= c);
            }
            return (p ? -1 : 1) * o * Math.pow(2, s - i);
          }),
            (e.write = function (t, e, n, i, r, s) {
              var o,
                a,
                u,
                c = 8 * s - r - 1,
                l = (1 << c) - 1,
                h = l >> 1,
                f = 23 === r ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                p = i ? 0 : s - 1,
                d = i ? 1 : -1,
                g = e < 0 || (0 === e && 1 / e < 0) ? 1 : 0;
              for (
                e = Math.abs(e),
                  isNaN(e) || e === 1 / 0
                    ? ((a = isNaN(e) ? 1 : 0), (o = l))
                    : ((o = Math.floor(Math.log(e) / Math.LN2)),
                      e * (u = Math.pow(2, -o)) < 1 && (o--, (u *= 2)),
                      (e += o + h >= 1 ? f / u : f * Math.pow(2, 1 - h)) * u >=
                        2 && (o++, (u /= 2)),
                      o + h >= l
                        ? ((a = 0), (o = l))
                        : o + h >= 1
                        ? ((a = (e * u - 1) * Math.pow(2, r)), (o += h))
                        : ((a = e * Math.pow(2, h - 1) * Math.pow(2, r)),
                          (o = 0)));
                r >= 8;
                t[n + p] = 255 & a, p += d, a /= 256, r -= 8
              );
              for (
                o = (o << r) | a, c += r;
                c > 0;
                t[n + p] = 255 & o, p += d, o /= 256, c -= 8
              );
              t[n + p - d] |= 128 * g;
            });
        },
        577: (t) => {
          var e = {}.toString;
          t.exports =
            Array.isArray ||
            function (t) {
              return '[object Array]' == e.call(t);
            };
        },
        313: (t, e, n) => {
          t.exports = window.fetch || (window.fetch = n(772).default || n(772));
        },
        736: (t, e, n) => {
          var i, r;
          function s(t) {
            return (
              (s =
                'function' == typeof Symbol &&
                'symbol' == typeof Symbol.iterator
                  ? function (t) {
                      return typeof t;
                    }
                  : function (t) {
                      return t &&
                        'function' == typeof Symbol &&
                        t.constructor === Symbol &&
                        t !== Symbol.prototype
                        ? 'symbol'
                        : typeof t;
                    }),
              s(t)
            );
          }
          !(function (o) {
            var a;
            if (
              (void 0 ===
                (r = 'function' == typeof (i = o) ? i.call(e, n, e, t) : i) ||
                (t.exports = r),
              (a = !0),
              'object' === s(e) && ((t.exports = o()), (a = !0)),
              !a)
            ) {
              var u = window.Cookies,
                c = (window.Cookies = o());
              c.noConflict = function () {
                return (window.Cookies = u), c;
              };
            }
          })(function () {
            function t() {
              for (var t = 0, e = {}; t < arguments.length; t++) {
                var n = arguments[t];
                for (var i in n) e[i] = n[i];
              }
              return e;
            }
            function e(t) {
              return t.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
            }
            return (function n(i) {
              function r() {}
              function s(e, n, s) {
                if ('undefined' != typeof document) {
                  'number' ==
                    typeof (s = t({ path: '/' }, r.defaults, s)).expires &&
                    (s.expires = new Date(1 * new Date() + 864e5 * s.expires)),
                    (s.expires = s.expires ? s.expires.toUTCString() : '');
                  try {
                    var o = JSON.stringify(n);
                    /^[\{\[]/.test(o) && (n = o);
                  } catch (t) {}
                  (n = i.write
                    ? i.write(n, e)
                    : encodeURIComponent(String(n)).replace(
                        /%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,
                        decodeURIComponent
                      )),
                    (e = encodeURIComponent(String(e))
                      .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
                      .replace(/[\(\)]/g, escape));
                  var a = '';
                  for (var u in s)
                    s[u] &&
                      ((a += '; ' + u),
                      !0 !== s[u] && (a += '=' + s[u].split(';')[0]));
                  return (document.cookie = e + '=' + n + a);
                }
              }
              function o(t, n) {
                if ('undefined' != typeof document) {
                  for (
                    var r = {},
                      s = document.cookie ? document.cookie.split('; ') : [],
                      o = 0;
                    o < s.length;
                    o++
                  ) {
                    var a = s[o].split('='),
                      u = a.slice(1).join('=');
                    n || '"' !== u.charAt(0) || (u = u.slice(1, -1));
                    try {
                      var c = e(a[0]);
                      if (((u = (i.read || i)(u, c) || e(u)), n))
                        try {
                          u = JSON.parse(u);
                        } catch (t) {}
                      if (((r[c] = u), t === c)) break;
                    } catch (t) {}
                  }
                  return t ? r[t] : r;
                }
              }
              return (
                (r.set = s),
                (r.get = function (t) {
                  return o(t, !1);
                }),
                (r.getJSON = function (t) {
                  return o(t, !0);
                }),
                (r.remove = function (e, n) {
                  s(e, '', t(n, { expires: -1 }));
                }),
                (r.defaults = {}),
                (r.withConverter = n),
                r
              );
            })(function () {});
          });
        },
        236: (t, e, n) => {
          function i(t) {
            return (
              (i =
                'function' == typeof Symbol &&
                'symbol' == typeof Symbol.iterator
                  ? function (t) {
                      return typeof t;
                    }
                  : function (t) {
                      return t &&
                        'function' == typeof Symbol &&
                        t.constructor === Symbol &&
                        t !== Symbol.prototype
                        ? 'symbol'
                        : typeof t;
                    }),
              i(t)
            );
          }
          var r = (function (t) {
            'use strict';
            var e,
              n = Object.prototype,
              r = n.hasOwnProperty,
              s = 'function' == typeof Symbol ? Symbol : {},
              o = s.iterator || '@@iterator',
              a = s.asyncIterator || '@@asyncIterator',
              u = s.toStringTag || '@@toStringTag';
            function c(t, e, n) {
              return (
                Object.defineProperty(t, e, {
                  value: n,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                }),
                t[e]
              );
            }
            try {
              c({}, '');
            } catch (t) {
              c = function (t, e, n) {
                return (t[e] = n);
              };
            }
            function l(t, e, n, i) {
              var r = e && e.prototype instanceof y ? e : y,
                s = Object.create(r.prototype),
                o = new x(i || []);
              return (
                (s._invoke = (function (t, e, n) {
                  var i = f;
                  return function (r, s) {
                    if (i === d)
                      throw new Error('Generator is already running');
                    if (i === g) {
                      if ('throw' === r) throw s;
                      return P();
                    }
                    for (n.method = r, n.arg = s; ; ) {
                      var o = n.delegate;
                      if (o) {
                        var a = E(o, n);
                        if (a) {
                          if (a === v) continue;
                          return a;
                        }
                      }
                      if ('next' === n.method) n.sent = n._sent = n.arg;
                      else if ('throw' === n.method) {
                        if (i === f) throw ((i = g), n.arg);
                        n.dispatchException(n.arg);
                      } else 'return' === n.method && n.abrupt('return', n.arg);
                      i = d;
                      var u = h(t, e, n);
                      if ('normal' === u.type) {
                        if (((i = n.done ? g : p), u.arg === v)) continue;
                        return { value: u.arg, done: n.done };
                      }
                      'throw' === u.type &&
                        ((i = g), (n.method = 'throw'), (n.arg = u.arg));
                    }
                  };
                })(t, n, o)),
                s
              );
            }
            function h(t, e, n) {
              try {
                return { type: 'normal', arg: t.call(e, n) };
              } catch (t) {
                return { type: 'throw', arg: t };
              }
            }
            t.wrap = l;
            var f = 'suspendedStart',
              p = 'suspendedYield',
              d = 'executing',
              g = 'completed',
              v = {};
            function y() {}
            function m() {}
            function C() {}
            var w = {};
            w[o] = function () {
              return this;
            };
            var b = Object.getPrototypeOf,
              S = b && b(b(D([])));
            S && S !== n && r.call(S, o) && (w = S);
            var A = (C.prototype = y.prototype = Object.create(w));
            function k(t) {
              ['next', 'throw', 'return'].forEach(function (e) {
                c(t, e, function (t) {
                  return this._invoke(e, t);
                });
              });
            }
            function T(t, e) {
              function n(s, o, a, u) {
                var c = h(t[s], t, o);
                if ('throw' !== c.type) {
                  var l = c.arg,
                    f = l.value;
                  return f && 'object' === i(f) && r.call(f, '__await')
                    ? e.resolve(f.__await).then(
                        function (t) {
                          n('next', t, a, u);
                        },
                        function (t) {
                          n('throw', t, a, u);
                        }
                      )
                    : e.resolve(f).then(
                        function (t) {
                          (l.value = t), a(l);
                        },
                        function (t) {
                          return n('throw', t, a, u);
                        }
                      );
                }
                u(c.arg);
              }
              var s;
              this._invoke = function (t, i) {
                function r() {
                  return new e(function (e, r) {
                    n(t, i, e, r);
                  });
                }
                return (s = s ? s.then(r, r) : r());
              };
            }
            function E(t, n) {
              var i = t.iterator[n.method];
              if (i === e) {
                if (((n.delegate = null), 'throw' === n.method)) {
                  if (
                    t.iterator.return &&
                    ((n.method = 'return'),
                    (n.arg = e),
                    E(t, n),
                    'throw' === n.method)
                  )
                    return v;
                  (n.method = 'throw'),
                    (n.arg = new TypeError(
                      "The iterator does not provide a 'throw' method"
                    ));
                }
                return v;
              }
              var r = h(i, t.iterator, n.arg);
              if ('throw' === r.type)
                return (
                  (n.method = 'throw'), (n.arg = r.arg), (n.delegate = null), v
                );
              var s = r.arg;
              return s
                ? s.done
                  ? ((n[t.resultName] = s.value),
                    (n.next = t.nextLoc),
                    'return' !== n.method && ((n.method = 'next'), (n.arg = e)),
                    (n.delegate = null),
                    v)
                  : s
                : ((n.method = 'throw'),
                  (n.arg = new TypeError('iterator result is not an object')),
                  (n.delegate = null),
                  v);
            }
            function U(t) {
              var e = { tryLoc: t[0] };
              1 in t && (e.catchLoc = t[1]),
                2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
                this.tryEntries.push(e);
            }
            function I(t) {
              var e = t.completion || {};
              (e.type = 'normal'), delete e.arg, (t.completion = e);
            }
            function x(t) {
              (this.tryEntries = [{ tryLoc: 'root' }]),
                t.forEach(U, this),
                this.reset(!0);
            }
            function D(t) {
              if (t) {
                var n = t[o];
                if (n) return n.call(t);
                if ('function' == typeof t.next) return t;
                if (!isNaN(t.length)) {
                  var i = -1,
                    s = function n() {
                      for (; ++i < t.length; )
                        if (r.call(t, i))
                          return (n.value = t[i]), (n.done = !1), n;
                      return (n.value = e), (n.done = !0), n;
                    };
                  return (s.next = s);
                }
              }
              return { next: P };
            }
            function P() {
              return { value: e, done: !0 };
            }
            return (
              (m.prototype = A.constructor = C),
              (C.constructor = m),
              (m.displayName = c(C, u, 'GeneratorFunction')),
              (t.isGeneratorFunction = function (t) {
                var e = 'function' == typeof t && t.constructor;
                return (
                  !!e &&
                  (e === m || 'GeneratorFunction' === (e.displayName || e.name))
                );
              }),
              (t.mark = function (t) {
                return (
                  Object.setPrototypeOf
                    ? Object.setPrototypeOf(t, C)
                    : ((t.__proto__ = C), c(t, u, 'GeneratorFunction')),
                  (t.prototype = Object.create(A)),
                  t
                );
              }),
              (t.awrap = function (t) {
                return { __await: t };
              }),
              k(T.prototype),
              (T.prototype[a] = function () {
                return this;
              }),
              (t.AsyncIterator = T),
              (t.async = function (e, n, i, r, s) {
                void 0 === s && (s = Promise);
                var o = new T(l(e, n, i, r), s);
                return t.isGeneratorFunction(n)
                  ? o
                  : o.next().then(function (t) {
                      return t.done ? t.value : o.next();
                    });
              }),
              k(A),
              c(A, u, 'Generator'),
              (A[o] = function () {
                return this;
              }),
              (A.toString = function () {
                return '[object Generator]';
              }),
              (t.keys = function (t) {
                var e = [];
                for (var n in t) e.push(n);
                return (
                  e.reverse(),
                  function n() {
                    for (; e.length; ) {
                      var i = e.pop();
                      if (i in t) return (n.value = i), (n.done = !1), n;
                    }
                    return (n.done = !0), n;
                  }
                );
              }),
              (t.values = D),
              (x.prototype = {
                constructor: x,
                reset: function (t) {
                  if (
                    ((this.prev = 0),
                    (this.next = 0),
                    (this.sent = this._sent = e),
                    (this.done = !1),
                    (this.delegate = null),
                    (this.method = 'next'),
                    (this.arg = e),
                    this.tryEntries.forEach(I),
                    !t)
                  )
                    for (var n in this)
                      't' === n.charAt(0) &&
                        r.call(this, n) &&
                        !isNaN(+n.slice(1)) &&
                        (this[n] = e);
                },
                stop: function () {
                  this.done = !0;
                  var t = this.tryEntries[0].completion;
                  if ('throw' === t.type) throw t.arg;
                  return this.rval;
                },
                dispatchException: function (t) {
                  if (this.done) throw t;
                  var n = this;
                  function i(i, r) {
                    return (
                      (a.type = 'throw'),
                      (a.arg = t),
                      (n.next = i),
                      r && ((n.method = 'next'), (n.arg = e)),
                      !!r
                    );
                  }
                  for (var s = this.tryEntries.length - 1; s >= 0; --s) {
                    var o = this.tryEntries[s],
                      a = o.completion;
                    if ('root' === o.tryLoc) return i('end');
                    if (o.tryLoc <= this.prev) {
                      var u = r.call(o, 'catchLoc'),
                        c = r.call(o, 'finallyLoc');
                      if (u && c) {
                        if (this.prev < o.catchLoc) return i(o.catchLoc, !0);
                        if (this.prev < o.finallyLoc) return i(o.finallyLoc);
                      } else if (u) {
                        if (this.prev < o.catchLoc) return i(o.catchLoc, !0);
                      } else {
                        if (!c)
                          throw new Error(
                            'try statement without catch or finally'
                          );
                        if (this.prev < o.finallyLoc) return i(o.finallyLoc);
                      }
                    }
                  }
                },
                abrupt: function (t, e) {
                  for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                    var i = this.tryEntries[n];
                    if (
                      i.tryLoc <= this.prev &&
                      r.call(i, 'finallyLoc') &&
                      this.prev < i.finallyLoc
                    ) {
                      var s = i;
                      break;
                    }
                  }
                  s &&
                    ('break' === t || 'continue' === t) &&
                    s.tryLoc <= e &&
                    e <= s.finallyLoc &&
                    (s = null);
                  var o = s ? s.completion : {};
                  return (
                    (o.type = t),
                    (o.arg = e),
                    s
                      ? ((this.method = 'next'), (this.next = s.finallyLoc), v)
                      : this.complete(o)
                  );
                },
                complete: function (t, e) {
                  if ('throw' === t.type) throw t.arg;
                  return (
                    'break' === t.type || 'continue' === t.type
                      ? (this.next = t.arg)
                      : 'return' === t.type
                      ? ((this.rval = this.arg = t.arg),
                        (this.method = 'return'),
                        (this.next = 'end'))
                      : 'normal' === t.type && e && (this.next = e),
                    v
                  );
                },
                finish: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var n = this.tryEntries[e];
                    if (n.finallyLoc === t)
                      return this.complete(n.completion, n.afterLoc), I(n), v;
                  }
                },
                catch: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var n = this.tryEntries[e];
                    if (n.tryLoc === t) {
                      var i = n.completion;
                      if ('throw' === i.type) {
                        var r = i.arg;
                        I(n);
                      }
                      return r;
                    }
                  }
                  throw new Error('illegal catch attempt');
                },
                delegateYield: function (t, n, i) {
                  return (
                    (this.delegate = {
                      iterator: D(t),
                      resultName: n,
                      nextLoc: i,
                    }),
                    'next' === this.method && (this.arg = e),
                    v
                  );
                },
              }),
              t
            );
          })('object' === i((t = n.nmd(t))) ? t.exports : {});
          try {
            regeneratorRuntime = r;
          } catch (t) {
            Function('r', 'regeneratorRuntime = r')(r);
          }
        },
        8: (t, e, n) => {
          'use strict';
          function i(t) {
            return (
              (i =
                'function' == typeof Symbol &&
                'symbol' == typeof Symbol.iterator
                  ? function (t) {
                      return typeof t;
                    }
                  : function (t) {
                      return t &&
                        'function' == typeof Symbol &&
                        t.constructor === Symbol &&
                        t !== Symbol.prototype
                        ? 'symbol'
                        : typeof t;
                    }),
              i(t)
            );
          }
          n.r(e),
            n.d(e, {
              __extends: () => s,
              __assign: () => o,
              __rest: () => a,
              __decorate: () => u,
              __param: () => c,
              __metadata: () => l,
              __awaiter: () => h,
              __generator: () => f,
              __createBinding: () => p,
              __exportStar: () => d,
              __values: () => g,
              __read: () => v,
              __spread: () => y,
              __spreadArrays: () => m,
              __await: () => C,
              __asyncGenerator: () => w,
              __asyncDelegator: () => b,
              __asyncValues: () => S,
              __makeTemplateObject: () => A,
              __importStar: () => k,
              __importDefault: () => T,
              __classPrivateFieldGet: () => E,
              __classPrivateFieldSet: () => U,
            });
          var r = function (t, e) {
            return (
              (r =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (t, e) {
                    t.__proto__ = e;
                  }) ||
                function (t, e) {
                  for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                }),
              r(t, e)
            );
          };
          function s(t, e) {
            function n() {
              this.constructor = t;
            }
            r(t, e),
              (t.prototype =
                null === e
                  ? Object.create(e)
                  : ((n.prototype = e.prototype), new n()));
          }
          var o = function () {
            return (
              (o =
                Object.assign ||
                function (t) {
                  for (var e, n = 1, i = arguments.length; n < i; n++)
                    for (var r in (e = arguments[n]))
                      Object.prototype.hasOwnProperty.call(e, r) &&
                        (t[r] = e[r]);
                  return t;
                }),
              o.apply(this, arguments)
            );
          };
          function a(t, e) {
            var n = {};
            for (var i in t)
              Object.prototype.hasOwnProperty.call(t, i) &&
                e.indexOf(i) < 0 &&
                (n[i] = t[i]);
            if (
              null != t &&
              'function' == typeof Object.getOwnPropertySymbols
            ) {
              var r = 0;
              for (i = Object.getOwnPropertySymbols(t); r < i.length; r++)
                e.indexOf(i[r]) < 0 &&
                  Object.prototype.propertyIsEnumerable.call(t, i[r]) &&
                  (n[i[r]] = t[i[r]]);
            }
            return n;
          }
          function u(t, e, n, r) {
            var s,
              o = arguments.length,
              a =
                o < 3
                  ? e
                  : null === r
                  ? (r = Object.getOwnPropertyDescriptor(e, n))
                  : r;
            if (
              'object' ===
                ('undefined' == typeof Reflect ? 'undefined' : i(Reflect)) &&
              'function' == typeof Reflect.decorate
            )
              a = Reflect.decorate(t, e, n, r);
            else
              for (var u = t.length - 1; u >= 0; u--)
                (s = t[u]) &&
                  (a = (o < 3 ? s(a) : o > 3 ? s(e, n, a) : s(e, n)) || a);
            return o > 3 && a && Object.defineProperty(e, n, a), a;
          }
          function c(t, e) {
            return function (n, i) {
              e(n, i, t);
            };
          }
          function l(t, e) {
            if (
              'object' ===
                ('undefined' == typeof Reflect ? 'undefined' : i(Reflect)) &&
              'function' == typeof Reflect.metadata
            )
              return Reflect.metadata(t, e);
          }
          function h(t, e, n, i) {
            return new (n || (n = Promise))(function (r, s) {
              function o(t) {
                try {
                  u(i.next(t));
                } catch (t) {
                  s(t);
                }
              }
              function a(t) {
                try {
                  u(i.throw(t));
                } catch (t) {
                  s(t);
                }
              }
              function u(t) {
                var e;
                t.done
                  ? r(t.value)
                  : ((e = t.value),
                    e instanceof n
                      ? e
                      : new n(function (t) {
                          t(e);
                        })).then(o, a);
              }
              u((i = i.apply(t, e || [])).next());
            });
          }
          function f(t, e) {
            var n,
              i,
              r,
              s,
              o = {
                label: 0,
                sent: function () {
                  if (1 & r[0]) throw r[1];
                  return r[1];
                },
                trys: [],
                ops: [],
              };
            return (
              (s = { next: a(0), throw: a(1), return: a(2) }),
              'function' == typeof Symbol &&
                (s[Symbol.iterator] = function () {
                  return this;
                }),
              s
            );
            function a(s) {
              return function (a) {
                return (function (s) {
                  if (n) throw new TypeError('Generator is already executing.');
                  for (; o; )
                    try {
                      if (
                        ((n = 1),
                        i &&
                          (r =
                            2 & s[0]
                              ? i.return
                              : s[0]
                              ? i.throw || ((r = i.return) && r.call(i), 0)
                              : i.next) &&
                          !(r = r.call(i, s[1])).done)
                      )
                        return r;
                      switch (((i = 0), r && (s = [2 & s[0], r.value]), s[0])) {
                        case 0:
                        case 1:
                          r = s;
                          break;
                        case 4:
                          return o.label++, { value: s[1], done: !1 };
                        case 5:
                          o.label++, (i = s[1]), (s = [0]);
                          continue;
                        case 7:
                          (s = o.ops.pop()), o.trys.pop();
                          continue;
                        default:
                          if (
                            !(
                              (r =
                                (r = o.trys).length > 0 && r[r.length - 1]) ||
                              (6 !== s[0] && 2 !== s[0])
                            )
                          ) {
                            o = 0;
                            continue;
                          }
                          if (
                            3 === s[0] &&
                            (!r || (s[1] > r[0] && s[1] < r[3]))
                          ) {
                            o.label = s[1];
                            break;
                          }
                          if (6 === s[0] && o.label < r[1]) {
                            (o.label = r[1]), (r = s);
                            break;
                          }
                          if (r && o.label < r[2]) {
                            (o.label = r[2]), o.ops.push(s);
                            break;
                          }
                          r[2] && o.ops.pop(), o.trys.pop();
                          continue;
                      }
                      s = e.call(t, o);
                    } catch (t) {
                      (s = [6, t]), (i = 0);
                    } finally {
                      n = r = 0;
                    }
                  if (5 & s[0]) throw s[1];
                  return { value: s[0] ? s[1] : void 0, done: !0 };
                })([s, a]);
              };
            }
          }
          function p(t, e, n, i) {
            void 0 === i && (i = n), (t[i] = e[n]);
          }
          function d(t, e) {
            for (var n in t)
              'default' === n || e.hasOwnProperty(n) || (e[n] = t[n]);
          }
          function g(t) {
            var e = 'function' == typeof Symbol && Symbol.iterator,
              n = e && t[e],
              i = 0;
            if (n) return n.call(t);
            if (t && 'number' == typeof t.length)
              return {
                next: function () {
                  return (
                    t && i >= t.length && (t = void 0),
                    { value: t && t[i++], done: !t }
                  );
                },
              };
            throw new TypeError(
              e ? 'Object is not iterable.' : 'Symbol.iterator is not defined.'
            );
          }
          function v(t, e) {
            var n = 'function' == typeof Symbol && t[Symbol.iterator];
            if (!n) return t;
            var i,
              r,
              s = n.call(t),
              o = [];
            try {
              for (; (void 0 === e || e-- > 0) && !(i = s.next()).done; )
                o.push(i.value);
            } catch (t) {
              r = { error: t };
            } finally {
              try {
                i && !i.done && (n = s.return) && n.call(s);
              } finally {
                if (r) throw r.error;
              }
            }
            return o;
          }
          function y() {
            for (var t = [], e = 0; e < arguments.length; e++)
              t = t.concat(v(arguments[e]));
            return t;
          }
          function m() {
            for (var t = 0, e = 0, n = arguments.length; e < n; e++)
              t += arguments[e].length;
            var i = Array(t),
              r = 0;
            for (e = 0; e < n; e++)
              for (var s = arguments[e], o = 0, a = s.length; o < a; o++, r++)
                i[r] = s[o];
            return i;
          }
          function C(t) {
            return this instanceof C ? ((this.v = t), this) : new C(t);
          }
          function w(t, e, n) {
            if (!Symbol.asyncIterator)
              throw new TypeError('Symbol.asyncIterator is not defined.');
            var i,
              r = n.apply(t, e || []),
              s = [];
            return (
              (i = {}),
              o('next'),
              o('throw'),
              o('return'),
              (i[Symbol.asyncIterator] = function () {
                return this;
              }),
              i
            );
            function o(t) {
              r[t] &&
                (i[t] = function (e) {
                  return new Promise(function (n, i) {
                    s.push([t, e, n, i]) > 1 || a(t, e);
                  });
                });
            }
            function a(t, e) {
              try {
                (n = r[t](e)).value instanceof C
                  ? Promise.resolve(n.value.v).then(u, c)
                  : l(s[0][2], n);
              } catch (t) {
                l(s[0][3], t);
              }
              var n;
            }
            function u(t) {
              a('next', t);
            }
            function c(t) {
              a('throw', t);
            }
            function l(t, e) {
              t(e), s.shift(), s.length && a(s[0][0], s[0][1]);
            }
          }
          function b(t) {
            var e, n;
            return (
              (e = {}),
              i('next'),
              i('throw', function (t) {
                throw t;
              }),
              i('return'),
              (e[Symbol.iterator] = function () {
                return this;
              }),
              e
            );
            function i(i, r) {
              e[i] = t[i]
                ? function (e) {
                    return (n = !n)
                      ? { value: C(t[i](e)), done: 'return' === i }
                      : r
                      ? r(e)
                      : e;
                  }
                : r;
            }
          }
          function S(t) {
            if (!Symbol.asyncIterator)
              throw new TypeError('Symbol.asyncIterator is not defined.');
            var e,
              n = t[Symbol.asyncIterator];
            return n
              ? n.call(t)
              : ((t = g(t)),
                (e = {}),
                i('next'),
                i('throw'),
                i('return'),
                (e[Symbol.asyncIterator] = function () {
                  return this;
                }),
                e);
            function i(n) {
              e[n] =
                t[n] &&
                function (e) {
                  return new Promise(function (i, r) {
                    !(function (t, e, n, i) {
                      Promise.resolve(i).then(function (e) {
                        t({ value: e, done: n });
                      }, e);
                    })(i, r, (e = t[n](e)).done, e.value);
                  });
                };
            }
          }
          function A(t, e) {
            return (
              Object.defineProperty
                ? Object.defineProperty(t, 'raw', { value: e })
                : (t.raw = e),
              t
            );
          }
          function k(t) {
            if (t && t.__esModule) return t;
            var e = {};
            if (null != t)
              for (var n in t)
                Object.hasOwnProperty.call(t, n) && (e[n] = t[n]);
            return (e.default = t), e;
          }
          function T(t) {
            return t && t.__esModule ? t : { default: t };
          }
          function E(t, e) {
            if (!e.has(t))
              throw new TypeError(
                'attempted to get private field on non-instance'
              );
            return e.get(t);
          }
          function U(t, e, n) {
            if (!e.has(t))
              throw new TypeError(
                'attempted to set private field on non-instance'
              );
            return e.set(t, n), n;
          }
        },
        63: (t, e, n) => {
          'use strict';
          n.d(e, { FormkiqClient: () => Dt });
          var i,
            r = n(195),
            s = n.n(r),
            o = n(951),
            a = n.n(o),
            u = n(159),
            c = n.n(u),
            l = n(306),
            h = n.n(l),
            f = n(814),
            p = n.n(f),
            d = n(177),
            g = n.n(d),
            v = (function () {
              function t(t) {
                var e = t || {},
                  n = e.ValidationData,
                  i = e.Username,
                  r = e.Password,
                  s = e.AuthParameters,
                  o = e.ClientMetadata;
                (this.validationData = n || {}),
                  (this.authParameters = s || {}),
                  (this.clientMetadata = o || {}),
                  (this.username = i),
                  (this.password = r);
              }
              var e = t.prototype;
              return (
                (e.getUsername = function () {
                  return this.username;
                }),
                (e.getPassword = function () {
                  return this.password;
                }),
                (e.getValidationData = function () {
                  return this.validationData;
                }),
                (e.getAuthParameters = function () {
                  return this.authParameters;
                }),
                (e.getClientMetadata = function () {
                  return this.clientMetadata;
                }),
                t
              );
            })(),
            y = n(48);
          if (
            ('undefined' != typeof window &&
              window.crypto &&
              (i = window.crypto),
            !i &&
              'undefined' != typeof window &&
              window.msCrypto &&
              (i = window.msCrypto),
            !i && void 0 !== n.g && n.g.crypto && (i = n.g.crypto),
            !i)
          )
            try {
              i = n(906);
            } catch (t) {}
          function m() {
            if (i) {
              if ('function' == typeof i.getRandomValues)
                try {
                  return i.getRandomValues(new Uint32Array(1))[0];
                } catch (t) {}
              if ('function' == typeof i.randomBytes)
                try {
                  return i.randomBytes(4).readInt32LE();
                } catch (t) {}
            }
            throw new Error(
              'Native crypto module could not be used to get secure random number.'
            );
          }
          var C = (function () {
              function t(t, e) {
                (t = this.words = t || []),
                  (this.sigBytes = null != e ? e : 4 * t.length);
              }
              var e = t.prototype;
              return (
                (e.random = function (e) {
                  for (var n = [], i = 0; i < e; i += 4) n.push(m());
                  return new t(n, e);
                }),
                (e.toString = function () {
                  return (function (t) {
                    for (
                      var e = t.words, n = t.sigBytes, i = [], r = 0;
                      r < n;
                      r++
                    ) {
                      var s = (e[r >>> 2] >>> (24 - (r % 4) * 8)) & 255;
                      i.push((s >>> 4).toString(16)),
                        i.push((15 & s).toString(16));
                    }
                    return i.join('');
                  })(this);
                }),
                t
              );
            })(),
            w = n(226);
          const b = S;
          function S(t, e) {
            null != t && this.fromString(t, e);
          }
          function A() {
            return new S(null);
          }
          var k,
            T = 'undefined' != typeof navigator;
          T && 'Microsoft Internet Explorer' == navigator.appName
            ? ((S.prototype.am = function (t, e, n, i, r, s) {
                for (var o = 32767 & e, a = e >> 15; --s >= 0; ) {
                  var u = 32767 & this[t],
                    c = this[t++] >> 15,
                    l = a * u + c * o;
                  (r =
                    ((u =
                      o * u + ((32767 & l) << 15) + n[i] + (1073741823 & r)) >>>
                      30) +
                    (l >>> 15) +
                    a * c +
                    (r >>> 30)),
                    (n[i++] = 1073741823 & u);
                }
                return r;
              }),
              (k = 30))
            : T && 'Netscape' != navigator.appName
            ? ((S.prototype.am = function (t, e, n, i, r, s) {
                for (; --s >= 0; ) {
                  var o = e * this[t++] + n[i] + r;
                  (r = Math.floor(o / 67108864)), (n[i++] = 67108863 & o);
                }
                return r;
              }),
              (k = 26))
            : ((S.prototype.am = function (t, e, n, i, r, s) {
                for (var o = 16383 & e, a = e >> 14; --s >= 0; ) {
                  var u = 16383 & this[t],
                    c = this[t++] >> 14,
                    l = a * u + c * o;
                  (r =
                    ((u = o * u + ((16383 & l) << 14) + n[i] + r) >> 28) +
                    (l >> 14) +
                    a * c),
                    (n[i++] = 268435455 & u);
                }
                return r;
              }),
              (k = 28)),
            (S.prototype.DB = k),
            (S.prototype.DM = (1 << k) - 1),
            (S.prototype.DV = 1 << k),
            (S.prototype.FV = Math.pow(2, 52)),
            (S.prototype.F1 = 52 - k),
            (S.prototype.F2 = 2 * k - 52);
          var E,
            U,
            I = new Array();
          for (E = '0'.charCodeAt(0), U = 0; U <= 9; ++U) I[E++] = U;
          for (E = 'a'.charCodeAt(0), U = 10; U < 36; ++U) I[E++] = U;
          for (E = 'A'.charCodeAt(0), U = 10; U < 36; ++U) I[E++] = U;
          function x(t) {
            return '0123456789abcdefghijklmnopqrstuvwxyz'.charAt(t);
          }
          function D(t, e) {
            var n = I[t.charCodeAt(e)];
            return null == n ? -1 : n;
          }
          function P(t) {
            var e = A();
            return e.fromInt(t), e;
          }
          function R(t) {
            var e,
              n = 1;
            return (
              0 != (e = t >>> 16) && ((t = e), (n += 16)),
              0 != (e = t >> 8) && ((t = e), (n += 8)),
              0 != (e = t >> 4) && ((t = e), (n += 4)),
              0 != (e = t >> 2) && ((t = e), (n += 2)),
              0 != (e = t >> 1) && ((t = e), (n += 1)),
              n
            );
          }
          function O(t) {
            (this.m = t),
              (this.mp = t.invDigit()),
              (this.mpl = 32767 & this.mp),
              (this.mph = this.mp >> 15),
              (this.um = (1 << (t.DB - 15)) - 1),
              (this.mt2 = 2 * t.t);
          }
          function _(t) {
            return y.lW.from(new C().random(t).toString(), 'hex');
          }
          (O.prototype.convert = function (t) {
            var e = A();
            return (
              t.abs().dlShiftTo(this.m.t, e),
              e.divRemTo(this.m, null, e),
              t.s < 0 && e.compareTo(S.ZERO) > 0 && this.m.subTo(e, e),
              e
            );
          }),
            (O.prototype.revert = function (t) {
              var e = A();
              return t.copyTo(e), this.reduce(e), e;
            }),
            (O.prototype.reduce = function (t) {
              for (; t.t <= this.mt2; ) t[t.t++] = 0;
              for (var e = 0; e < this.m.t; ++e) {
                var n = 32767 & t[e],
                  i =
                    (n * this.mpl +
                      (((n * this.mph + (t[e] >> 15) * this.mpl) & this.um) <<
                        15)) &
                    t.DM;
                for (
                  t[(n = e + this.m.t)] += this.m.am(0, i, t, e, 0, this.m.t);
                  t[n] >= t.DV;

                )
                  (t[n] -= t.DV), t[++n]++;
              }
              t.clamp(),
                t.drShiftTo(this.m.t, t),
                t.compareTo(this.m) >= 0 && t.subTo(this.m, t);
            }),
            (O.prototype.mulTo = function (t, e, n) {
              t.multiplyTo(e, n), this.reduce(n);
            }),
            (O.prototype.sqrTo = function (t, e) {
              t.squareTo(e), this.reduce(e);
            }),
            (S.prototype.copyTo = function (t) {
              for (var e = this.t - 1; e >= 0; --e) t[e] = this[e];
              (t.t = this.t), (t.s = this.s);
            }),
            (S.prototype.fromInt = function (t) {
              (this.t = 1),
                (this.s = t < 0 ? -1 : 0),
                t > 0
                  ? (this[0] = t)
                  : t < -1
                  ? (this[0] = t + this.DV)
                  : (this.t = 0);
            }),
            (S.prototype.fromString = function (t, e) {
              var n;
              if (16 == e) n = 4;
              else if (8 == e) n = 3;
              else if (2 == e) n = 1;
              else if (32 == e) n = 5;
              else {
                if (4 != e)
                  throw new Error('Only radix 2, 4, 8, 16, 32 are supported');
                n = 2;
              }
              (this.t = 0), (this.s = 0);
              for (var i = t.length, r = !1, s = 0; --i >= 0; ) {
                var o = D(t, i);
                o < 0
                  ? '-' == t.charAt(i) && (r = !0)
                  : ((r = !1),
                    0 == s
                      ? (this[this.t++] = o)
                      : s + n > this.DB
                      ? ((this[this.t - 1] |=
                          (o & ((1 << (this.DB - s)) - 1)) << s),
                        (this[this.t++] = o >> (this.DB - s)))
                      : (this[this.t - 1] |= o << s),
                    (s += n) >= this.DB && (s -= this.DB));
              }
              this.clamp(), r && S.ZERO.subTo(this, this);
            }),
            (S.prototype.clamp = function () {
              for (
                var t = this.s & this.DM;
                this.t > 0 && this[this.t - 1] == t;

              )
                --this.t;
            }),
            (S.prototype.dlShiftTo = function (t, e) {
              var n;
              for (n = this.t - 1; n >= 0; --n) e[n + t] = this[n];
              for (n = t - 1; n >= 0; --n) e[n] = 0;
              (e.t = this.t + t), (e.s = this.s);
            }),
            (S.prototype.drShiftTo = function (t, e) {
              for (var n = t; n < this.t; ++n) e[n - t] = this[n];
              (e.t = Math.max(this.t - t, 0)), (e.s = this.s);
            }),
            (S.prototype.lShiftTo = function (t, e) {
              var n,
                i = t % this.DB,
                r = this.DB - i,
                s = (1 << r) - 1,
                o = Math.floor(t / this.DB),
                a = (this.s << i) & this.DM;
              for (n = this.t - 1; n >= 0; --n)
                (e[n + o + 1] = (this[n] >> r) | a), (a = (this[n] & s) << i);
              for (n = o - 1; n >= 0; --n) e[n] = 0;
              (e[o] = a), (e.t = this.t + o + 1), (e.s = this.s), e.clamp();
            }),
            (S.prototype.rShiftTo = function (t, e) {
              e.s = this.s;
              var n = Math.floor(t / this.DB);
              if (n >= this.t) e.t = 0;
              else {
                var i = t % this.DB,
                  r = this.DB - i,
                  s = (1 << i) - 1;
                e[0] = this[n] >> i;
                for (var o = n + 1; o < this.t; ++o)
                  (e[o - n - 1] |= (this[o] & s) << r),
                    (e[o - n] = this[o] >> i);
                i > 0 && (e[this.t - n - 1] |= (this.s & s) << r),
                  (e.t = this.t - n),
                  e.clamp();
              }
            }),
            (S.prototype.subTo = function (t, e) {
              for (var n = 0, i = 0, r = Math.min(t.t, this.t); n < r; )
                (i += this[n] - t[n]), (e[n++] = i & this.DM), (i >>= this.DB);
              if (t.t < this.t) {
                for (i -= t.s; n < this.t; )
                  (i += this[n]), (e[n++] = i & this.DM), (i >>= this.DB);
                i += this.s;
              } else {
                for (i += this.s; n < t.t; )
                  (i -= t[n]), (e[n++] = i & this.DM), (i >>= this.DB);
                i -= t.s;
              }
              (e.s = i < 0 ? -1 : 0),
                i < -1 ? (e[n++] = this.DV + i) : i > 0 && (e[n++] = i),
                (e.t = n),
                e.clamp();
            }),
            (S.prototype.multiplyTo = function (t, e) {
              var n = this.abs(),
                i = t.abs(),
                r = n.t;
              for (e.t = r + i.t; --r >= 0; ) e[r] = 0;
              for (r = 0; r < i.t; ++r)
                e[r + n.t] = n.am(0, i[r], e, r, 0, n.t);
              (e.s = 0), e.clamp(), this.s != t.s && S.ZERO.subTo(e, e);
            }),
            (S.prototype.squareTo = function (t) {
              for (var e = this.abs(), n = (t.t = 2 * e.t); --n >= 0; )
                t[n] = 0;
              for (n = 0; n < e.t - 1; ++n) {
                var i = e.am(n, e[n], t, 2 * n, 0, 1);
                (t[n + e.t] += e.am(
                  n + 1,
                  2 * e[n],
                  t,
                  2 * n + 1,
                  i,
                  e.t - n - 1
                )) >= e.DV && ((t[n + e.t] -= e.DV), (t[n + e.t + 1] = 1));
              }
              t.t > 0 && (t[t.t - 1] += e.am(n, e[n], t, 2 * n, 0, 1)),
                (t.s = 0),
                t.clamp();
            }),
            (S.prototype.divRemTo = function (t, e, n) {
              var i = t.abs();
              if (!(i.t <= 0)) {
                var r = this.abs();
                if (r.t < i.t)
                  return (
                    null != e && e.fromInt(0),
                    void (null != n && this.copyTo(n))
                  );
                null == n && (n = A());
                var s = A(),
                  o = this.s,
                  a = t.s,
                  u = this.DB - R(i[i.t - 1]);
                u > 0
                  ? (i.lShiftTo(u, s), r.lShiftTo(u, n))
                  : (i.copyTo(s), r.copyTo(n));
                var c = s.t,
                  l = s[c - 1];
                if (0 != l) {
                  var h =
                      l * (1 << this.F1) + (c > 1 ? s[c - 2] >> this.F2 : 0),
                    f = this.FV / h,
                    p = (1 << this.F1) / h,
                    d = 1 << this.F2,
                    g = n.t,
                    v = g - c,
                    y = null == e ? A() : e;
                  for (
                    s.dlShiftTo(v, y),
                      n.compareTo(y) >= 0 && ((n[n.t++] = 1), n.subTo(y, n)),
                      S.ONE.dlShiftTo(c, y),
                      y.subTo(s, s);
                    s.t < c;

                  )
                    s[s.t++] = 0;
                  for (; --v >= 0; ) {
                    var m =
                      n[--g] == l
                        ? this.DM
                        : Math.floor(n[g] * f + (n[g - 1] + d) * p);
                    if ((n[g] += s.am(0, m, n, v, 0, c)) < m)
                      for (s.dlShiftTo(v, y), n.subTo(y, n); n[g] < --m; )
                        n.subTo(y, n);
                  }
                  null != e &&
                    (n.drShiftTo(c, e), o != a && S.ZERO.subTo(e, e)),
                    (n.t = c),
                    n.clamp(),
                    u > 0 && n.rShiftTo(u, n),
                    o < 0 && S.ZERO.subTo(n, n);
                }
              }
            }),
            (S.prototype.invDigit = function () {
              if (this.t < 1) return 0;
              var t = this[0];
              if (0 == (1 & t)) return 0;
              var e = 3 & t;
              return (e =
                ((e =
                  ((e =
                    ((e = (e * (2 - (15 & t) * e)) & 15) *
                      (2 - (255 & t) * e)) &
                    255) *
                    (2 - (((65535 & t) * e) & 65535))) &
                  65535) *
                  (2 - ((t * e) % this.DV))) %
                this.DV) > 0
                ? this.DV - e
                : -e;
            }),
            (S.prototype.addTo = function (t, e) {
              for (var n = 0, i = 0, r = Math.min(t.t, this.t); n < r; )
                (i += this[n] + t[n]), (e[n++] = i & this.DM), (i >>= this.DB);
              if (t.t < this.t) {
                for (i += t.s; n < this.t; )
                  (i += this[n]), (e[n++] = i & this.DM), (i >>= this.DB);
                i += this.s;
              } else {
                for (i += this.s; n < t.t; )
                  (i += t[n]), (e[n++] = i & this.DM), (i >>= this.DB);
                i += t.s;
              }
              (e.s = i < 0 ? -1 : 0),
                i > 0 ? (e[n++] = i) : i < -1 && (e[n++] = this.DV + i),
                (e.t = n),
                e.clamp();
            }),
            (S.prototype.toString = function (t) {
              if (this.s < 0) return '-' + this.negate().toString(t);
              var e;
              if (16 == t) e = 4;
              else if (8 == t) e = 3;
              else if (2 == t) e = 1;
              else if (32 == t) e = 5;
              else {
                if (4 != t)
                  throw new Error('Only radix 2, 4, 8, 16, 32 are supported');
                e = 2;
              }
              var n,
                i = (1 << e) - 1,
                r = !1,
                s = '',
                o = this.t,
                a = this.DB - ((o * this.DB) % e);
              if (o-- > 0)
                for (
                  a < this.DB &&
                  (n = this[o] >> a) > 0 &&
                  ((r = !0), (s = x(n)));
                  o >= 0;

                )
                  a < e
                    ? ((n = (this[o] & ((1 << a) - 1)) << (e - a)),
                      (n |= this[--o] >> (a += this.DB - e)))
                    : ((n = (this[o] >> (a -= e)) & i),
                      a <= 0 && ((a += this.DB), --o)),
                    n > 0 && (r = !0),
                    r && (s += x(n));
              return r ? s : '0';
            }),
            (S.prototype.negate = function () {
              var t = A();
              return S.ZERO.subTo(this, t), t;
            }),
            (S.prototype.abs = function () {
              return this.s < 0 ? this.negate() : this;
            }),
            (S.prototype.compareTo = function (t) {
              var e = this.s - t.s;
              if (0 != e) return e;
              var n = this.t;
              if (0 != (e = n - t.t)) return this.s < 0 ? -e : e;
              for (; --n >= 0; ) if (0 != (e = this[n] - t[n])) return e;
              return 0;
            }),
            (S.prototype.bitLength = function () {
              return this.t <= 0
                ? 0
                : this.DB * (this.t - 1) +
                    R(this[this.t - 1] ^ (this.s & this.DM));
            }),
            (S.prototype.mod = function (t) {
              var e = A();
              return (
                this.abs().divRemTo(t, null, e),
                this.s < 0 && e.compareTo(S.ZERO) > 0 && t.subTo(e, e),
                e
              );
            }),
            (S.prototype.equals = function (t) {
              return 0 == this.compareTo(t);
            }),
            (S.prototype.add = function (t) {
              var e = A();
              return this.addTo(t, e), e;
            }),
            (S.prototype.subtract = function (t) {
              var e = A();
              return this.subTo(t, e), e;
            }),
            (S.prototype.multiply = function (t) {
              var e = A();
              return this.multiplyTo(t, e), e;
            }),
            (S.prototype.divide = function (t) {
              var e = A();
              return this.divRemTo(t, e, null), e;
            }),
            (S.prototype.modPow = function (t, e, n) {
              var i,
                r = t.bitLength(),
                s = P(1),
                o = new O(e);
              if (r <= 0) return s;
              i = r < 18 ? 1 : r < 48 ? 3 : r < 144 ? 4 : r < 768 ? 5 : 6;
              var a = new Array(),
                u = 3,
                c = i - 1,
                l = (1 << i) - 1;
              if (((a[1] = o.convert(this)), i > 1)) {
                var h = A();
                for (o.sqrTo(a[1], h); u <= l; )
                  (a[u] = A()), o.mulTo(h, a[u - 2], a[u]), (u += 2);
              }
              var f,
                p,
                d = t.t - 1,
                g = !0,
                v = A();
              for (r = R(t[d]) - 1; d >= 0; ) {
                for (
                  r >= c
                    ? (f = (t[d] >> (r - c)) & l)
                    : ((f = (t[d] & ((1 << (r + 1)) - 1)) << (c - r)),
                      d > 0 && (f |= t[d - 1] >> (this.DB + r - c))),
                    u = i;
                  0 == (1 & f);

                )
                  (f >>= 1), --u;
                if (((r -= u) < 0 && ((r += this.DB), --d), g))
                  a[f].copyTo(s), (g = !1);
                else {
                  for (; u > 1; ) o.sqrTo(s, v), o.sqrTo(v, s), (u -= 2);
                  u > 0 ? o.sqrTo(s, v) : ((p = s), (s = v), (v = p)),
                    o.mulTo(v, a[f], s);
                }
                for (; d >= 0 && 0 == (t[d] & (1 << r)); )
                  o.sqrTo(s, v),
                    (p = s),
                    (s = v),
                    (v = p),
                    --r < 0 && ((r = this.DB - 1), --d);
              }
              var y = o.revert(s);
              return n(null, y), y;
            }),
            (S.ZERO = P(0)),
            (S.ONE = P(1));
          var N = /^[89a-f]/i,
            F = (function () {
              function t(t) {
                (this.N = new b(
                  'FFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA18217C32905E462E36CE3BE39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9DE2BCBF6955817183995497CEA956AE515D2261898FA051015728E5A8AAAC42DAD33170D04507A33A85521ABDF1CBA64ECFB850458DBEF0A8AEA71575D060C7DB3970F85A6E1E4C7ABF5AE8CDB0933D71E8C94E04A25619DCEE3D2261AD2EE6BF12FFA06D98A0864D87602733EC86A64521F2B18177B200CBBE117577A615D6C770988C0BAD946E208E24FA074E5AB3143DB5BFCE0FD108E4B82D120A93AD2CAFFFFFFFFFFFFFFFF',
                  16
                )),
                  (this.g = new b('2', 16)),
                  (this.k = new b(
                    this.hexHash(
                      '' + this.padHex(this.N) + this.padHex(this.g)
                    ),
                    16
                  )),
                  (this.smallAValue = this.generateRandomSmallA()),
                  this.getLargeAValue(function () {}),
                  (this.infoBits = y.lW.from('Caldera Derived Key', 'utf8')),
                  (this.poolName = t);
              }
              var e = t.prototype;
              return (
                (e.getSmallAValue = function () {
                  return this.smallAValue;
                }),
                (e.getLargeAValue = function (t) {
                  var e = this;
                  this.largeAValue
                    ? t(null, this.largeAValue)
                    : this.calculateA(this.smallAValue, function (n, i) {
                        n && t(n, null),
                          (e.largeAValue = i),
                          t(null, e.largeAValue);
                      });
                }),
                (e.generateRandomSmallA = function () {
                  var t = _(128).toString('hex');
                  return new b(t, 16);
                }),
                (e.generateRandomString = function () {
                  return _(40).toString('base64');
                }),
                (e.getRandomPassword = function () {
                  return this.randomPassword;
                }),
                (e.getSaltDevices = function () {
                  return this.SaltToHashDevices;
                }),
                (e.getVerifierDevices = function () {
                  return this.verifierDevices;
                }),
                (e.generateHashDevice = function (t, e, n) {
                  var i = this;
                  this.randomPassword = this.generateRandomString();
                  var r = '' + t + e + ':' + this.randomPassword,
                    s = this.hash(r),
                    o = _(16).toString('hex');
                  (this.SaltToHashDevices = this.padHex(new b(o, 16))),
                    this.g.modPow(
                      new b(this.hexHash(this.SaltToHashDevices + s), 16),
                      this.N,
                      function (t, e) {
                        t && n(t, null),
                          (i.verifierDevices = i.padHex(e)),
                          n(null, null);
                      }
                    );
                }),
                (e.calculateA = function (t, e) {
                  var n = this;
                  this.g.modPow(t, this.N, function (t, i) {
                    t && e(t, null),
                      i.mod(n.N).equals(b.ZERO) &&
                        e(
                          new Error('Illegal paramater. A mod N cannot be 0.'),
                          null
                        ),
                      e(null, i);
                  });
                }),
                (e.calculateU = function (t, e) {
                  return (
                    (this.UHexHash = this.hexHash(
                      this.padHex(t) + this.padHex(e)
                    )),
                    new b(this.UHexHash, 16)
                  );
                }),
                (e.hash = function (t) {
                  var e = new w.Sha256();
                  e.update(t);
                  var n = e.digestSync(),
                    i = y.lW.from(n).toString('hex');
                  return new Array(64 - i.length).join('0') + i;
                }),
                (e.hexHash = function (t) {
                  return this.hash(y.lW.from(t, 'hex'));
                }),
                (e.computehkdf = function (t, e) {
                  var n = y.lW.concat([
                      this.infoBits,
                      y.lW.from(String.fromCharCode(1), 'utf8'),
                    ]),
                    i = new w.Sha256(e);
                  i.update(t);
                  var r = i.digestSync(),
                    s = new w.Sha256(r);
                  return s.update(n), s.digestSync().slice(0, 16);
                }),
                (e.getPasswordAuthenticationKey = function (t, e, n, i, r) {
                  var s = this;
                  if (n.mod(this.N).equals(b.ZERO))
                    throw new Error('B cannot be zero.');
                  if (
                    ((this.UValue = this.calculateU(this.largeAValue, n)),
                    this.UValue.equals(b.ZERO))
                  )
                    throw new Error('U cannot be zero.');
                  var o = '' + this.poolName + t + ':' + e,
                    a = this.hash(o),
                    u = new b(this.hexHash(this.padHex(i) + a), 16);
                  this.calculateS(u, n, function (t, e) {
                    t && r(t, null);
                    var n = s.computehkdf(
                      y.lW.from(s.padHex(e), 'hex'),
                      y.lW.from(s.padHex(s.UValue), 'hex')
                    );
                    r(null, n);
                  });
                }),
                (e.calculateS = function (t, e, n) {
                  var i = this;
                  this.g.modPow(t, this.N, function (r, s) {
                    r && n(r, null),
                      e
                        .subtract(i.k.multiply(s))
                        .modPow(
                          i.smallAValue.add(i.UValue.multiply(t)),
                          i.N,
                          function (t, e) {
                            t && n(t, null), n(null, e.mod(i.N));
                          }
                        );
                  });
                }),
                (e.getNewPasswordRequiredChallengeUserAttributePrefix =
                  function () {
                    return 'userAttributes.';
                  }),
                (e.padHex = function (t) {
                  if (!(t instanceof b)) throw new Error('Not a BigInteger');
                  var e = t.compareTo(b.ZERO) < 0,
                    n = t.abs().toString(16);
                  if (
                    ((n = n.length % 2 != 0 ? '0' + n : n),
                    (n = N.test(n) ? '00' + n : n),
                    e)
                  ) {
                    var i = n
                      .split('')
                      .map(function (t) {
                        var e = 15 & ~parseInt(t, 16);
                        return '0123456789ABCDEF'.charAt(e);
                      })
                      .join('');
                    (n = new b(i, 16).add(b.ONE).toString(16))
                      .toUpperCase()
                      .startsWith('FF8') && (n = n.substring(2));
                  }
                  return n;
                }),
                t
              );
            })(),
            B = (function () {
              function t(t) {
                (this.jwtToken = t || ''),
                  (this.payload = this.decodePayload());
              }
              var e = t.prototype;
              return (
                (e.getJwtToken = function () {
                  return this.jwtToken;
                }),
                (e.getExpiration = function () {
                  return this.payload.exp;
                }),
                (e.getIssuedAt = function () {
                  return this.payload.iat;
                }),
                (e.decodePayload = function () {
                  var t = this.jwtToken.split('.')[1];
                  try {
                    return JSON.parse(y.lW.from(t, 'base64').toString('utf8'));
                  } catch (t) {
                    return {};
                  }
                }),
                t
              );
            })();
          function M(t, e) {
            return (
              (M = Object.setPrototypeOf
                ? Object.setPrototypeOf.bind()
                : function (t, e) {
                    return (t.__proto__ = e), t;
                  }),
              M(t, e)
            );
          }
          var L = (function (t) {
            var e, n;
            function i(e) {
              var n = (void 0 === e ? {} : e).AccessToken;
              return t.call(this, n || '') || this;
            }
            return (
              (n = t),
              ((e = i).prototype = Object.create(n.prototype)),
              (e.prototype.constructor = e),
              M(e, n),
              i
            );
          })(B);
          function K(t, e) {
            return (
              (K = Object.setPrototypeOf
                ? Object.setPrototypeOf.bind()
                : function (t, e) {
                    return (t.__proto__ = e), t;
                  }),
              K(t, e)
            );
          }
          var V = (function (t) {
              var e, n;
              function i(e) {
                var n = (void 0 === e ? {} : e).IdToken;
                return t.call(this, n || '') || this;
              }
              return (
                (n = t),
                ((e = i).prototype = Object.create(n.prototype)),
                (e.prototype.constructor = e),
                K(e, n),
                i
              );
            })(B),
            q = (function () {
              function t(t) {
                var e = (void 0 === t ? {} : t).RefreshToken;
                this.token = e || '';
              }
              return (
                (t.prototype.getToken = function () {
                  return this.token;
                }),
                t
              );
            })(),
            j = 'aws-amplify/5.0.4',
            J = {
              userAgent: j + ' js',
              product: '',
              navigator: null,
              isReactNative: !1,
            };
          'undefined' != typeof navigator &&
            navigator.product &&
            ((J.product = navigator.product || ''),
            (J.navigator = navigator || null),
            'ReactNative' === navigator.product
              ? ((J.userAgent = j + ' react-native'), (J.isReactNative = !0))
              : ((J.userAgent = j + ' js'), (J.isReactNative = !1)));
          var Q = (function () {
              function t(t) {
                var e = void 0 === t ? {} : t,
                  n = e.IdToken,
                  i = e.RefreshToken,
                  r = e.AccessToken,
                  s = e.ClockDrift;
                if (null == r || null == n)
                  throw new Error('Id token and Access Token must be present.');
                (this.idToken = n),
                  (this.refreshToken = i),
                  (this.accessToken = r),
                  (this.clockDrift =
                    void 0 === s ? this.calculateClockDrift() : s);
              }
              var e = t.prototype;
              return (
                (e.getIdToken = function () {
                  return this.idToken;
                }),
                (e.getRefreshToken = function () {
                  return this.refreshToken;
                }),
                (e.getAccessToken = function () {
                  return this.accessToken;
                }),
                (e.getClockDrift = function () {
                  return this.clockDrift;
                }),
                (e.calculateClockDrift = function () {
                  return (
                    Math.floor(new Date() / 1e3) -
                    Math.min(
                      this.accessToken.getIssuedAt(),
                      this.idToken.getIssuedAt()
                    )
                  );
                }),
                (e.isValid = function () {
                  var t = Math.floor(new Date() / 1e3) - this.clockDrift;
                  return (
                    t < this.accessToken.getExpiration() &&
                    t < this.idToken.getExpiration()
                  );
                }),
                t
              );
            })(),
            G = [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec',
            ],
            W = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            H = (function () {
              function t() {}
              return (
                (t.prototype.getNowString = function () {
                  var t = new Date(),
                    e = W[t.getUTCDay()],
                    n = G[t.getUTCMonth()],
                    i = t.getUTCDate(),
                    r = t.getUTCHours();
                  r < 10 && (r = '0' + r);
                  var s = t.getUTCMinutes();
                  s < 10 && (s = '0' + s);
                  var o = t.getUTCSeconds();
                  return (
                    o < 10 && (o = '0' + o),
                    e +
                      ' ' +
                      n +
                      ' ' +
                      i +
                      ' ' +
                      r +
                      ':' +
                      s +
                      ':' +
                      o +
                      ' UTC ' +
                      t.getUTCFullYear()
                  );
                }),
                t
              );
            })(),
            Y = (function () {
              function t(t) {
                var e = void 0 === t ? {} : t,
                  n = e.Name,
                  i = e.Value;
                (this.Name = n || ''), (this.Value = i || '');
              }
              var e = t.prototype;
              return (
                (e.getValue = function () {
                  return this.Value;
                }),
                (e.setValue = function (t) {
                  return (this.Value = t), this;
                }),
                (e.getName = function () {
                  return this.Name;
                }),
                (e.setName = function (t) {
                  return (this.Name = t), this;
                }),
                (e.toString = function () {
                  return JSON.stringify(this);
                }),
                (e.toJSON = function () {
                  return { Name: this.Name, Value: this.Value };
                }),
                t
              );
            })(),
            Z = {},
            z = (function () {
              function t() {}
              return (
                (t.setItem = function (t, e) {
                  return (Z[t] = e), Z[t];
                }),
                (t.getItem = function (t) {
                  return Object.prototype.hasOwnProperty.call(Z, t)
                    ? Z[t]
                    : void 0;
                }),
                (t.removeItem = function (t) {
                  return delete Z[t];
                }),
                (t.clear = function () {
                  return (Z = {});
                }),
                t
              );
            })(),
            X = (function () {
              function t() {
                try {
                  (this.storageWindow = window.localStorage),
                    this.storageWindow.setItem('aws.cognito.test-ls', 1),
                    this.storageWindow.removeItem('aws.cognito.test-ls');
                } catch (t) {
                  this.storageWindow = z;
                }
              }
              return (
                (t.prototype.getStorage = function () {
                  return this.storageWindow;
                }),
                t
              );
            })(),
            $ =
              'undefined' != typeof navigator
                ? J.isReactNative
                  ? 'react-native'
                  : navigator.userAgent
                : 'nodejs',
            tt = (function () {
              function t(t) {
                if (null == t || null == t.Username || null == t.Pool)
                  throw new Error(
                    'Username and Pool information are required.'
                  );
                (this.username = t.Username || ''),
                  (this.pool = t.Pool),
                  (this.Session = null),
                  (this.client = t.Pool.client),
                  (this.signInUserSession = null),
                  (this.authenticationFlowType = 'USER_SRP_AUTH'),
                  (this.storage = t.Storage || new X().getStorage()),
                  (this.keyPrefix =
                    'CognitoIdentityServiceProvider.' +
                    this.pool.getClientId()),
                  (this.userDataKey =
                    this.keyPrefix + '.' + this.username + '.userData');
              }
              var e = t.prototype;
              return (
                (e.setSignInUserSession = function (t) {
                  this.clearCachedUserData(),
                    (this.signInUserSession = t),
                    this.cacheTokens();
                }),
                (e.getSignInUserSession = function () {
                  return this.signInUserSession;
                }),
                (e.getUsername = function () {
                  return this.username;
                }),
                (e.getAuthenticationFlowType = function () {
                  return this.authenticationFlowType;
                }),
                (e.setAuthenticationFlowType = function (t) {
                  this.authenticationFlowType = t;
                }),
                (e.initiateAuth = function (t, e) {
                  var n = this,
                    i = t.getAuthParameters();
                  i.USERNAME = this.username;
                  var r =
                      0 !== Object.keys(t.getValidationData()).length
                        ? t.getValidationData()
                        : t.getClientMetadata(),
                    s = {
                      AuthFlow: 'CUSTOM_AUTH',
                      ClientId: this.pool.getClientId(),
                      AuthParameters: i,
                      ClientMetadata: r,
                    };
                  this.getUserContextData() &&
                    (s.UserContextData = this.getUserContextData()),
                    this.client.request('InitiateAuth', s, function (t, i) {
                      if (t) return e.onFailure(t);
                      var r = i.ChallengeName,
                        s = i.ChallengeParameters;
                      return 'CUSTOM_CHALLENGE' === r
                        ? ((n.Session = i.Session), e.customChallenge(s))
                        : ((n.signInUserSession = n.getCognitoUserSession(
                            i.AuthenticationResult
                          )),
                          n.cacheTokens(),
                          e.onSuccess(n.signInUserSession));
                    });
                }),
                (e.authenticateUser = function (t, e) {
                  return 'USER_PASSWORD_AUTH' === this.authenticationFlowType
                    ? this.authenticateUserPlainUsernamePassword(t, e)
                    : 'USER_SRP_AUTH' === this.authenticationFlowType ||
                      'CUSTOM_AUTH' === this.authenticationFlowType
                    ? this.authenticateUserDefaultAuth(t, e)
                    : e.onFailure(
                        new Error('Authentication flow type is invalid.')
                      );
                }),
                (e.authenticateUserDefaultAuth = function (t, e) {
                  var n,
                    i,
                    r = this,
                    s = new F(this.pool.getUserPoolName()),
                    o = new H(),
                    a = {};
                  null != this.deviceKey && (a.DEVICE_KEY = this.deviceKey),
                    (a.USERNAME = this.username),
                    s.getLargeAValue(function (u, c) {
                      u && e.onFailure(u),
                        (a.SRP_A = c.toString(16)),
                        'CUSTOM_AUTH' === r.authenticationFlowType &&
                          (a.CHALLENGE_NAME = 'SRP_A');
                      var l =
                          0 !== Object.keys(t.getValidationData()).length
                            ? t.getValidationData()
                            : t.getClientMetadata(),
                        h = {
                          AuthFlow: r.authenticationFlowType,
                          ClientId: r.pool.getClientId(),
                          AuthParameters: a,
                          ClientMetadata: l,
                        };
                      r.getUserContextData(r.username) &&
                        (h.UserContextData = r.getUserContextData(r.username)),
                        r.client.request('InitiateAuth', h, function (a, u) {
                          if (a) return e.onFailure(a);
                          var c = u.ChallengeParameters;
                          (r.username = c.USER_ID_FOR_SRP),
                            (r.userDataKey =
                              r.keyPrefix + '.' + r.username + '.userData'),
                            (n = new b(c.SRP_B, 16)),
                            (i = new b(c.SALT, 16)),
                            r.getCachedDeviceKeyAndPassword(),
                            s.getPasswordAuthenticationKey(
                              r.username,
                              t.getPassword(),
                              n,
                              i,
                              function (t, n) {
                                t && e.onFailure(t);
                                var i = o.getNowString(),
                                  a = y.lW.concat([
                                    y.lW.from(r.pool.getUserPoolName(), 'utf8'),
                                    y.lW.from(r.username, 'utf8'),
                                    y.lW.from(c.SECRET_BLOCK, 'base64'),
                                    y.lW.from(i, 'utf8'),
                                  ]),
                                  h = new w.Sha256(n);
                                h.update(a);
                                var f = h.digestSync(),
                                  p = y.lW.from(f).toString('base64'),
                                  d = {};
                                (d.USERNAME = r.username),
                                  (d.PASSWORD_CLAIM_SECRET_BLOCK =
                                    c.SECRET_BLOCK),
                                  (d.TIMESTAMP = i),
                                  (d.PASSWORD_CLAIM_SIGNATURE = p),
                                  null != r.deviceKey &&
                                    (d.DEVICE_KEY = r.deviceKey);
                                var g = {
                                  ChallengeName: 'PASSWORD_VERIFIER',
                                  ClientId: r.pool.getClientId(),
                                  ChallengeResponses: d,
                                  Session: u.Session,
                                  ClientMetadata: l,
                                };
                                r.getUserContextData() &&
                                  (g.UserContextData = r.getUserContextData()),
                                  (function t(e, n) {
                                    return r.client.request(
                                      'RespondToAuthChallenge',
                                      e,
                                      function (i, s) {
                                        return i &&
                                          'ResourceNotFoundException' ===
                                            i.code &&
                                          -1 !==
                                            i.message
                                              .toLowerCase()
                                              .indexOf('device')
                                          ? ((d.DEVICE_KEY = null),
                                            (r.deviceKey = null),
                                            (r.randomPassword = null),
                                            (r.deviceGroupKey = null),
                                            r.clearCachedDeviceKeyAndPassword(),
                                            t(e, n))
                                          : n(i, s);
                                      }
                                    );
                                  })(g, function (t, n) {
                                    return t
                                      ? e.onFailure(t)
                                      : r.authenticateUserInternal(n, s, e);
                                  });
                              }
                            );
                        });
                    });
                }),
                (e.authenticateUserPlainUsernamePassword = function (t, e) {
                  var n = this,
                    i = {};
                  if (
                    ((i.USERNAME = this.username),
                    (i.PASSWORD = t.getPassword()),
                    i.PASSWORD)
                  ) {
                    var r = new F(this.pool.getUserPoolName());
                    this.getCachedDeviceKeyAndPassword(),
                      null != this.deviceKey && (i.DEVICE_KEY = this.deviceKey);
                    var s =
                        0 !== Object.keys(t.getValidationData()).length
                          ? t.getValidationData()
                          : t.getClientMetadata(),
                      o = {
                        AuthFlow: 'USER_PASSWORD_AUTH',
                        ClientId: this.pool.getClientId(),
                        AuthParameters: i,
                        ClientMetadata: s,
                      };
                    this.getUserContextData(this.username) &&
                      (o.UserContextData = this.getUserContextData(
                        this.username
                      )),
                      this.client.request('InitiateAuth', o, function (t, i) {
                        return t
                          ? e.onFailure(t)
                          : n.authenticateUserInternal(i, r, e);
                      });
                  } else
                    e.onFailure(new Error('PASSWORD parameter is required'));
                }),
                (e.authenticateUserInternal = function (t, e, n) {
                  var i = this,
                    r = t.ChallengeName,
                    s = t.ChallengeParameters;
                  if ('SMS_MFA' === r)
                    return (this.Session = t.Session), n.mfaRequired(r, s);
                  if ('SELECT_MFA_TYPE' === r)
                    return (this.Session = t.Session), n.selectMFAType(r, s);
                  if ('MFA_SETUP' === r)
                    return (this.Session = t.Session), n.mfaSetup(r, s);
                  if ('SOFTWARE_TOKEN_MFA' === r)
                    return (this.Session = t.Session), n.totpRequired(r, s);
                  if ('CUSTOM_CHALLENGE' === r)
                    return (this.Session = t.Session), n.customChallenge(s);
                  if ('NEW_PASSWORD_REQUIRED' === r) {
                    this.Session = t.Session;
                    var o = null,
                      a = null,
                      u = [],
                      c =
                        e.getNewPasswordRequiredChallengeUserAttributePrefix();
                    if (
                      (s &&
                        ((o = JSON.parse(t.ChallengeParameters.userAttributes)),
                        (a = JSON.parse(
                          t.ChallengeParameters.requiredAttributes
                        ))),
                      a)
                    )
                      for (var l = 0; l < a.length; l++)
                        u[l] = a[l].substr(c.length);
                    return n.newPasswordRequired(o, u);
                  }
                  if ('DEVICE_SRP_AUTH' === r)
                    return (
                      (this.Session = t.Session), void this.getDeviceResponse(n)
                    );
                  (this.signInUserSession = this.getCognitoUserSession(
                    t.AuthenticationResult
                  )),
                    (this.challengeName = r),
                    this.cacheTokens();
                  var h = t.AuthenticationResult.NewDeviceMetadata;
                  if (null == h) return n.onSuccess(this.signInUserSession);
                  e.generateHashDevice(
                    t.AuthenticationResult.NewDeviceMetadata.DeviceGroupKey,
                    t.AuthenticationResult.NewDeviceMetadata.DeviceKey,
                    function (r) {
                      if (r) return n.onFailure(r);
                      var s = {
                        Salt: y.lW
                          .from(e.getSaltDevices(), 'hex')
                          .toString('base64'),
                        PasswordVerifier: y.lW
                          .from(e.getVerifierDevices(), 'hex')
                          .toString('base64'),
                      };
                      (i.verifierDevices = s.PasswordVerifier),
                        (i.deviceGroupKey = h.DeviceGroupKey),
                        (i.randomPassword = e.getRandomPassword()),
                        i.client.request(
                          'ConfirmDevice',
                          {
                            DeviceKey: h.DeviceKey,
                            AccessToken: i.signInUserSession
                              .getAccessToken()
                              .getJwtToken(),
                            DeviceSecretVerifierConfig: s,
                            DeviceName: $,
                          },
                          function (e, r) {
                            return e
                              ? n.onFailure(e)
                              : ((i.deviceKey =
                                  t.AuthenticationResult.NewDeviceMetadata.DeviceKey),
                                i.cacheDeviceKeyAndPassword(),
                                !0 === r.UserConfirmationNecessary
                                  ? n.onSuccess(
                                      i.signInUserSession,
                                      r.UserConfirmationNecessary
                                    )
                                  : n.onSuccess(i.signInUserSession));
                          }
                        );
                    }
                  );
                }),
                (e.completeNewPasswordChallenge = function (t, e, n, i) {
                  var r = this;
                  if (!t)
                    return n.onFailure(new Error('New password is required.'));
                  var s = new F(this.pool.getUserPoolName()),
                    o = s.getNewPasswordRequiredChallengeUserAttributePrefix(),
                    a = {};
                  e &&
                    Object.keys(e).forEach(function (t) {
                      a[o + t] = e[t];
                    }),
                    (a.NEW_PASSWORD = t),
                    (a.USERNAME = this.username);
                  var u = {
                    ChallengeName: 'NEW_PASSWORD_REQUIRED',
                    ClientId: this.pool.getClientId(),
                    ChallengeResponses: a,
                    Session: this.Session,
                    ClientMetadata: i,
                  };
                  this.getUserContextData() &&
                    (u.UserContextData = this.getUserContextData()),
                    this.client.request(
                      'RespondToAuthChallenge',
                      u,
                      function (t, e) {
                        return t
                          ? n.onFailure(t)
                          : r.authenticateUserInternal(e, s, n);
                      }
                    );
                }),
                (e.getDeviceResponse = function (t, e) {
                  var n = this,
                    i = new F(this.deviceGroupKey),
                    r = new H(),
                    s = {};
                  (s.USERNAME = this.username),
                    (s.DEVICE_KEY = this.deviceKey),
                    i.getLargeAValue(function (o, a) {
                      o && t.onFailure(o), (s.SRP_A = a.toString(16));
                      var u = {
                        ChallengeName: 'DEVICE_SRP_AUTH',
                        ClientId: n.pool.getClientId(),
                        ChallengeResponses: s,
                        ClientMetadata: e,
                        Session: n.Session,
                      };
                      n.getUserContextData() &&
                        (u.UserContextData = n.getUserContextData()),
                        n.client.request(
                          'RespondToAuthChallenge',
                          u,
                          function (e, s) {
                            if (e) return t.onFailure(e);
                            var o = s.ChallengeParameters,
                              a = new b(o.SRP_B, 16),
                              u = new b(o.SALT, 16);
                            i.getPasswordAuthenticationKey(
                              n.deviceKey,
                              n.randomPassword,
                              a,
                              u,
                              function (e, i) {
                                if (e) return t.onFailure(e);
                                var a = r.getNowString(),
                                  u = y.lW.concat([
                                    y.lW.from(n.deviceGroupKey, 'utf8'),
                                    y.lW.from(n.deviceKey, 'utf8'),
                                    y.lW.from(o.SECRET_BLOCK, 'base64'),
                                    y.lW.from(a, 'utf8'),
                                  ]),
                                  c = new w.Sha256(i);
                                c.update(u);
                                var l = c.digestSync(),
                                  h = y.lW.from(l).toString('base64'),
                                  f = {};
                                (f.USERNAME = n.username),
                                  (f.PASSWORD_CLAIM_SECRET_BLOCK =
                                    o.SECRET_BLOCK),
                                  (f.TIMESTAMP = a),
                                  (f.PASSWORD_CLAIM_SIGNATURE = h),
                                  (f.DEVICE_KEY = n.deviceKey);
                                var p = {
                                  ChallengeName: 'DEVICE_PASSWORD_VERIFIER',
                                  ClientId: n.pool.getClientId(),
                                  ChallengeResponses: f,
                                  Session: s.Session,
                                };
                                n.getUserContextData() &&
                                  (p.UserContextData = n.getUserContextData()),
                                  n.client.request(
                                    'RespondToAuthChallenge',
                                    p,
                                    function (e, i) {
                                      return e
                                        ? t.onFailure(e)
                                        : ((n.signInUserSession =
                                            n.getCognitoUserSession(
                                              i.AuthenticationResult
                                            )),
                                          n.cacheTokens(),
                                          t.onSuccess(n.signInUserSession));
                                    }
                                  );
                              }
                            );
                          }
                        );
                    });
                }),
                (e.confirmRegistration = function (t, e, n, i) {
                  var r = {
                    ClientId: this.pool.getClientId(),
                    ConfirmationCode: t,
                    Username: this.username,
                    ForceAliasCreation: e,
                    ClientMetadata: i,
                  };
                  this.getUserContextData() &&
                    (r.UserContextData = this.getUserContextData()),
                    this.client.request('ConfirmSignUp', r, function (t) {
                      return t ? n(t, null) : n(null, 'SUCCESS');
                    });
                }),
                (e.sendCustomChallengeAnswer = function (t, e, n) {
                  var i = this,
                    r = {};
                  (r.USERNAME = this.username), (r.ANSWER = t);
                  var s = new F(this.pool.getUserPoolName());
                  this.getCachedDeviceKeyAndPassword(),
                    null != this.deviceKey && (r.DEVICE_KEY = this.deviceKey);
                  var o = {
                    ChallengeName: 'CUSTOM_CHALLENGE',
                    ChallengeResponses: r,
                    ClientId: this.pool.getClientId(),
                    Session: this.Session,
                    ClientMetadata: n,
                  };
                  this.getUserContextData() &&
                    (o.UserContextData = this.getUserContextData()),
                    this.client.request(
                      'RespondToAuthChallenge',
                      o,
                      function (t, n) {
                        return t
                          ? e.onFailure(t)
                          : i.authenticateUserInternal(n, s, e);
                      }
                    );
                }),
                (e.sendMFACode = function (t, e, n, i) {
                  var r = this,
                    s = {};
                  (s.USERNAME = this.username), (s.SMS_MFA_CODE = t);
                  var o = n || 'SMS_MFA';
                  'SOFTWARE_TOKEN_MFA' === o && (s.SOFTWARE_TOKEN_MFA_CODE = t),
                    null != this.deviceKey && (s.DEVICE_KEY = this.deviceKey);
                  var a = {
                    ChallengeName: o,
                    ChallengeResponses: s,
                    ClientId: this.pool.getClientId(),
                    Session: this.Session,
                    ClientMetadata: i,
                  };
                  this.getUserContextData() &&
                    (a.UserContextData = this.getUserContextData()),
                    this.client.request(
                      'RespondToAuthChallenge',
                      a,
                      function (t, n) {
                        if (t) return e.onFailure(t);
                        if ('DEVICE_SRP_AUTH' !== n.ChallengeName) {
                          if (
                            ((r.signInUserSession = r.getCognitoUserSession(
                              n.AuthenticationResult
                            )),
                            r.cacheTokens(),
                            null == n.AuthenticationResult.NewDeviceMetadata)
                          )
                            return e.onSuccess(r.signInUserSession);
                          var i = new F(r.pool.getUserPoolName());
                          i.generateHashDevice(
                            n.AuthenticationResult.NewDeviceMetadata
                              .DeviceGroupKey,
                            n.AuthenticationResult.NewDeviceMetadata.DeviceKey,
                            function (t) {
                              if (t) return e.onFailure(t);
                              var s = {
                                Salt: y.lW
                                  .from(i.getSaltDevices(), 'hex')
                                  .toString('base64'),
                                PasswordVerifier: y.lW
                                  .from(i.getVerifierDevices(), 'hex')
                                  .toString('base64'),
                              };
                              (r.verifierDevices = s.PasswordVerifier),
                                (r.deviceGroupKey =
                                  n.AuthenticationResult.NewDeviceMetadata.DeviceGroupKey),
                                (r.randomPassword = i.getRandomPassword()),
                                r.client.request(
                                  'ConfirmDevice',
                                  {
                                    DeviceKey:
                                      n.AuthenticationResult.NewDeviceMetadata
                                        .DeviceKey,
                                    AccessToken: r.signInUserSession
                                      .getAccessToken()
                                      .getJwtToken(),
                                    DeviceSecretVerifierConfig: s,
                                    DeviceName: $,
                                  },
                                  function (t, i) {
                                    return t
                                      ? e.onFailure(t)
                                      : ((r.deviceKey =
                                          n.AuthenticationResult.NewDeviceMetadata.DeviceKey),
                                        r.cacheDeviceKeyAndPassword(),
                                        !0 === i.UserConfirmationNecessary
                                          ? e.onSuccess(
                                              r.signInUserSession,
                                              i.UserConfirmationNecessary
                                            )
                                          : e.onSuccess(r.signInUserSession));
                                  }
                                );
                            }
                          );
                        } else r.getDeviceResponse(e);
                      }
                    );
                }),
                (e.changePassword = function (t, e, n, i) {
                  if (
                    null == this.signInUserSession ||
                    !this.signInUserSession.isValid()
                  )
                    return n(new Error('User is not authenticated'), null);
                  this.client.request(
                    'ChangePassword',
                    {
                      PreviousPassword: t,
                      ProposedPassword: e,
                      AccessToken: this.signInUserSession
                        .getAccessToken()
                        .getJwtToken(),
                      ClientMetadata: i,
                    },
                    function (t) {
                      return t ? n(t, null) : n(null, 'SUCCESS');
                    }
                  );
                }),
                (e.enableMFA = function (t) {
                  if (
                    null == this.signInUserSession ||
                    !this.signInUserSession.isValid()
                  )
                    return t(new Error('User is not authenticated'), null);
                  var e = [];
                  e.push({
                    DeliveryMedium: 'SMS',
                    AttributeName: 'phone_number',
                  }),
                    this.client.request(
                      'SetUserSettings',
                      {
                        MFAOptions: e,
                        AccessToken: this.signInUserSession
                          .getAccessToken()
                          .getJwtToken(),
                      },
                      function (e) {
                        return e ? t(e, null) : t(null, 'SUCCESS');
                      }
                    );
                }),
                (e.setUserMfaPreference = function (t, e, n) {
                  if (
                    null == this.signInUserSession ||
                    !this.signInUserSession.isValid()
                  )
                    return n(new Error('User is not authenticated'), null);
                  this.client.request(
                    'SetUserMFAPreference',
                    {
                      SMSMfaSettings: t,
                      SoftwareTokenMfaSettings: e,
                      AccessToken: this.signInUserSession
                        .getAccessToken()
                        .getJwtToken(),
                    },
                    function (t) {
                      return t ? n(t, null) : n(null, 'SUCCESS');
                    }
                  );
                }),
                (e.disableMFA = function (t) {
                  if (
                    null == this.signInUserSession ||
                    !this.signInUserSession.isValid()
                  )
                    return t(new Error('User is not authenticated'), null);
                  this.client.request(
                    'SetUserSettings',
                    {
                      MFAOptions: [],
                      AccessToken: this.signInUserSession
                        .getAccessToken()
                        .getJwtToken(),
                    },
                    function (e) {
                      return e ? t(e, null) : t(null, 'SUCCESS');
                    }
                  );
                }),
                (e.deleteUser = function (t, e) {
                  var n = this;
                  if (
                    null == this.signInUserSession ||
                    !this.signInUserSession.isValid()
                  )
                    return t(new Error('User is not authenticated'), null);
                  this.client.request(
                    'DeleteUser',
                    {
                      AccessToken: this.signInUserSession
                        .getAccessToken()
                        .getJwtToken(),
                      ClientMetadata: e,
                    },
                    function (e) {
                      return e
                        ? t(e, null)
                        : (n.clearCachedUser(), t(null, 'SUCCESS'));
                    }
                  );
                }),
                (e.updateAttributes = function (t, e, n) {
                  var i = this;
                  if (
                    null == this.signInUserSession ||
                    !this.signInUserSession.isValid()
                  )
                    return e(new Error('User is not authenticated'), null);
                  this.client.request(
                    'UpdateUserAttributes',
                    {
                      AccessToken: this.signInUserSession
                        .getAccessToken()
                        .getJwtToken(),
                      UserAttributes: t,
                      ClientMetadata: n,
                    },
                    function (t, n) {
                      return t
                        ? e(t, null)
                        : i.getUserData(
                            function () {
                              return e(null, 'SUCCESS', n);
                            },
                            { bypassCache: !0 }
                          );
                    }
                  );
                }),
                (e.getUserAttributes = function (t) {
                  if (
                    null == this.signInUserSession ||
                    !this.signInUserSession.isValid()
                  )
                    return t(new Error('User is not authenticated'), null);
                  this.client.request(
                    'GetUser',
                    {
                      AccessToken: this.signInUserSession
                        .getAccessToken()
                        .getJwtToken(),
                    },
                    function (e, n) {
                      if (e) return t(e, null);
                      for (
                        var i = [], r = 0;
                        r < n.UserAttributes.length;
                        r++
                      ) {
                        var s = {
                            Name: n.UserAttributes[r].Name,
                            Value: n.UserAttributes[r].Value,
                          },
                          o = new Y(s);
                        i.push(o);
                      }
                      return t(null, i);
                    }
                  );
                }),
                (e.getMFAOptions = function (t) {
                  if (
                    null == this.signInUserSession ||
                    !this.signInUserSession.isValid()
                  )
                    return t(new Error('User is not authenticated'), null);
                  this.client.request(
                    'GetUser',
                    {
                      AccessToken: this.signInUserSession
                        .getAccessToken()
                        .getJwtToken(),
                    },
                    function (e, n) {
                      return e ? t(e, null) : t(null, n.MFAOptions);
                    }
                  );
                }),
                (e.createGetUserRequest = function () {
                  return this.client.promisifyRequest('GetUser', {
                    AccessToken: this.signInUserSession
                      .getAccessToken()
                      .getJwtToken(),
                  });
                }),
                (e.refreshSessionIfPossible = function (t) {
                  var e = this;
                  return (
                    void 0 === t && (t = {}),
                    new Promise(function (n) {
                      var i = e.signInUserSession.getRefreshToken();
                      i && i.getToken()
                        ? e.refreshSession(i, n, t.clientMetadata)
                        : n();
                    })
                  );
                }),
                (e.getUserData = function (t, e) {
                  var n = this;
                  if (
                    null == this.signInUserSession ||
                    !this.signInUserSession.isValid()
                  )
                    return (
                      this.clearCachedUserData(),
                      t(new Error('User is not authenticated'), null)
                    );
                  var i = this.getUserDataFromCache();
                  if (i)
                    if (this.isFetchUserDataAndTokenRequired(e))
                      this.fetchUserData()
                        .then(function (t) {
                          return n
                            .refreshSessionIfPossible(e)
                            .then(function () {
                              return t;
                            });
                        })
                        .then(function (e) {
                          return t(null, e);
                        })
                        .catch(t);
                    else
                      try {
                        return void t(null, JSON.parse(i));
                      } catch (e) {
                        return this.clearCachedUserData(), void t(e, null);
                      }
                  else
                    this.fetchUserData()
                      .then(function (e) {
                        t(null, e);
                      })
                      .catch(t);
                }),
                (e.getUserDataFromCache = function () {
                  return this.storage.getItem(this.userDataKey);
                }),
                (e.isFetchUserDataAndTokenRequired = function (t) {
                  var e = (t || {}).bypassCache;
                  return void 0 !== e && e;
                }),
                (e.fetchUserData = function () {
                  var t = this;
                  return this.createGetUserRequest().then(function (e) {
                    return t.cacheUserData(e), e;
                  });
                }),
                (e.deleteAttributes = function (t, e) {
                  var n = this;
                  if (
                    null == this.signInUserSession ||
                    !this.signInUserSession.isValid()
                  )
                    return e(new Error('User is not authenticated'), null);
                  this.client.request(
                    'DeleteUserAttributes',
                    {
                      UserAttributeNames: t,
                      AccessToken: this.signInUserSession
                        .getAccessToken()
                        .getJwtToken(),
                    },
                    function (t) {
                      return t
                        ? e(t, null)
                        : n.getUserData(
                            function () {
                              return e(null, 'SUCCESS');
                            },
                            { bypassCache: !0 }
                          );
                    }
                  );
                }),
                (e.resendConfirmationCode = function (t, e) {
                  var n = {
                    ClientId: this.pool.getClientId(),
                    Username: this.username,
                    ClientMetadata: e,
                  };
                  this.client.request(
                    'ResendConfirmationCode',
                    n,
                    function (e, n) {
                      return e ? t(e, null) : t(null, n);
                    }
                  );
                }),
                (e.getSession = function (t, e) {
                  if ((void 0 === e && (e = {}), null == this.username))
                    return t(
                      new Error(
                        'Username is null. Cannot retrieve a new session'
                      ),
                      null
                    );
                  if (
                    null != this.signInUserSession &&
                    this.signInUserSession.isValid()
                  )
                    return t(null, this.signInUserSession);
                  var n =
                      'CognitoIdentityServiceProvider.' +
                      this.pool.getClientId() +
                      '.' +
                      this.username,
                    i = n + '.idToken',
                    r = n + '.accessToken',
                    s = n + '.refreshToken',
                    o = n + '.clockDrift';
                  if (this.storage.getItem(i)) {
                    var a = new V({ IdToken: this.storage.getItem(i) }),
                      u = new L({ AccessToken: this.storage.getItem(r) }),
                      c = new q({ RefreshToken: this.storage.getItem(s) }),
                      l = parseInt(this.storage.getItem(o), 0) || 0,
                      h = new Q({
                        IdToken: a,
                        AccessToken: u,
                        RefreshToken: c,
                        ClockDrift: l,
                      });
                    if (h.isValid())
                      return (
                        (this.signInUserSession = h),
                        t(null, this.signInUserSession)
                      );
                    if (!c.getToken())
                      return t(
                        new Error(
                          'Cannot retrieve a new session. Please authenticate.'
                        ),
                        null
                      );
                    this.refreshSession(c, t, e.clientMetadata);
                  } else
                    t(
                      new Error(
                        'Local storage is missing an ID Token, Please authenticate'
                      ),
                      null
                    );
                }),
                (e.refreshSession = function (t, e, n) {
                  var i = this,
                    r = this.pool.wrapRefreshSessionCallback
                      ? this.pool.wrapRefreshSessionCallback(e)
                      : e,
                    s = {};
                  s.REFRESH_TOKEN = t.getToken();
                  var o =
                      'CognitoIdentityServiceProvider.' +
                      this.pool.getClientId(),
                    a = o + '.LastAuthUser';
                  if (this.storage.getItem(a)) {
                    this.username = this.storage.getItem(a);
                    var u = o + '.' + this.username + '.deviceKey';
                    (this.deviceKey = this.storage.getItem(u)),
                      (s.DEVICE_KEY = this.deviceKey);
                  }
                  var c = {
                    ClientId: this.pool.getClientId(),
                    AuthFlow: 'REFRESH_TOKEN_AUTH',
                    AuthParameters: s,
                    ClientMetadata: n,
                  };
                  this.getUserContextData() &&
                    (c.UserContextData = this.getUserContextData()),
                    this.client.request('InitiateAuth', c, function (e, n) {
                      if (e)
                        return (
                          'NotAuthorizedException' === e.code &&
                            i.clearCachedUser(),
                          r(e, null)
                        );
                      if (n) {
                        var s = n.AuthenticationResult;
                        return (
                          Object.prototype.hasOwnProperty.call(
                            s,
                            'RefreshToken'
                          ) || (s.RefreshToken = t.getToken()),
                          (i.signInUserSession = i.getCognitoUserSession(s)),
                          i.cacheTokens(),
                          r(null, i.signInUserSession)
                        );
                      }
                    });
                }),
                (e.cacheTokens = function () {
                  var t =
                      'CognitoIdentityServiceProvider.' +
                      this.pool.getClientId(),
                    e = t + '.' + this.username + '.idToken',
                    n = t + '.' + this.username + '.accessToken',
                    i = t + '.' + this.username + '.refreshToken',
                    r = t + '.' + this.username + '.clockDrift',
                    s = t + '.LastAuthUser';
                  this.storage.setItem(
                    e,
                    this.signInUserSession.getIdToken().getJwtToken()
                  ),
                    this.storage.setItem(
                      n,
                      this.signInUserSession.getAccessToken().getJwtToken()
                    ),
                    this.storage.setItem(
                      i,
                      this.signInUserSession.getRefreshToken().getToken()
                    ),
                    this.storage.setItem(
                      r,
                      '' + this.signInUserSession.getClockDrift()
                    ),
                    this.storage.setItem(s, this.username);
                }),
                (e.cacheUserData = function (t) {
                  this.storage.setItem(this.userDataKey, JSON.stringify(t));
                }),
                (e.clearCachedUserData = function () {
                  this.storage.removeItem(this.userDataKey);
                }),
                (e.clearCachedUser = function () {
                  this.clearCachedTokens(), this.clearCachedUserData();
                }),
                (e.cacheDeviceKeyAndPassword = function () {
                  var t =
                      'CognitoIdentityServiceProvider.' +
                      this.pool.getClientId() +
                      '.' +
                      this.username,
                    e = t + '.deviceKey',
                    n = t + '.randomPasswordKey',
                    i = t + '.deviceGroupKey';
                  this.storage.setItem(e, this.deviceKey),
                    this.storage.setItem(n, this.randomPassword),
                    this.storage.setItem(i, this.deviceGroupKey);
                }),
                (e.getCachedDeviceKeyAndPassword = function () {
                  var t =
                      'CognitoIdentityServiceProvider.' +
                      this.pool.getClientId() +
                      '.' +
                      this.username,
                    e = t + '.deviceKey',
                    n = t + '.randomPasswordKey',
                    i = t + '.deviceGroupKey';
                  this.storage.getItem(e) &&
                    ((this.deviceKey = this.storage.getItem(e)),
                    (this.randomPassword = this.storage.getItem(n)),
                    (this.deviceGroupKey = this.storage.getItem(i)));
                }),
                (e.clearCachedDeviceKeyAndPassword = function () {
                  var t =
                      'CognitoIdentityServiceProvider.' +
                      this.pool.getClientId() +
                      '.' +
                      this.username,
                    e = t + '.deviceKey',
                    n = t + '.randomPasswordKey',
                    i = t + '.deviceGroupKey';
                  this.storage.removeItem(e),
                    this.storage.removeItem(n),
                    this.storage.removeItem(i);
                }),
                (e.clearCachedTokens = function () {
                  var t =
                      'CognitoIdentityServiceProvider.' +
                      this.pool.getClientId(),
                    e = t + '.' + this.username + '.idToken',
                    n = t + '.' + this.username + '.accessToken',
                    i = t + '.' + this.username + '.refreshToken',
                    r = t + '.LastAuthUser',
                    s = t + '.' + this.username + '.clockDrift';
                  this.storage.removeItem(e),
                    this.storage.removeItem(n),
                    this.storage.removeItem(i),
                    this.storage.removeItem(r),
                    this.storage.removeItem(s);
                }),
                (e.getCognitoUserSession = function (t) {
                  var e = new V(t),
                    n = new L(t),
                    i = new q(t);
                  return new Q({ IdToken: e, AccessToken: n, RefreshToken: i });
                }),
                (e.forgotPassword = function (t, e) {
                  var n = {
                    ClientId: this.pool.getClientId(),
                    Username: this.username,
                    ClientMetadata: e,
                  };
                  this.getUserContextData() &&
                    (n.UserContextData = this.getUserContextData()),
                    this.client.request('ForgotPassword', n, function (e, n) {
                      return e
                        ? t.onFailure(e)
                        : 'function' == typeof t.inputVerificationCode
                        ? t.inputVerificationCode(n)
                        : t.onSuccess(n);
                    });
                }),
                (e.confirmPassword = function (t, e, n, i) {
                  var r = {
                    ClientId: this.pool.getClientId(),
                    Username: this.username,
                    ConfirmationCode: t,
                    Password: e,
                    ClientMetadata: i,
                  };
                  this.getUserContextData() &&
                    (r.UserContextData = this.getUserContextData()),
                    this.client.request(
                      'ConfirmForgotPassword',
                      r,
                      function (t) {
                        return t ? n.onFailure(t) : n.onSuccess('SUCCESS');
                      }
                    );
                }),
                (e.getAttributeVerificationCode = function (t, e, n) {
                  if (
                    null == this.signInUserSession ||
                    !this.signInUserSession.isValid()
                  )
                    return e.onFailure(new Error('User is not authenticated'));
                  this.client.request(
                    'GetUserAttributeVerificationCode',
                    {
                      AttributeName: t,
                      AccessToken: this.signInUserSession
                        .getAccessToken()
                        .getJwtToken(),
                      ClientMetadata: n,
                    },
                    function (t, n) {
                      return t
                        ? e.onFailure(t)
                        : 'function' == typeof e.inputVerificationCode
                        ? e.inputVerificationCode(n)
                        : e.onSuccess('SUCCESS');
                    }
                  );
                }),
                (e.verifyAttribute = function (t, e, n) {
                  if (
                    null == this.signInUserSession ||
                    !this.signInUserSession.isValid()
                  )
                    return n.onFailure(new Error('User is not authenticated'));
                  this.client.request(
                    'VerifyUserAttribute',
                    {
                      AttributeName: t,
                      Code: e,
                      AccessToken: this.signInUserSession
                        .getAccessToken()
                        .getJwtToken(),
                    },
                    function (t) {
                      return t ? n.onFailure(t) : n.onSuccess('SUCCESS');
                    }
                  );
                }),
                (e.getDevice = function (t) {
                  if (
                    null == this.signInUserSession ||
                    !this.signInUserSession.isValid()
                  )
                    return t.onFailure(new Error('User is not authenticated'));
                  this.client.request(
                    'GetDevice',
                    {
                      AccessToken: this.signInUserSession
                        .getAccessToken()
                        .getJwtToken(),
                      DeviceKey: this.deviceKey,
                    },
                    function (e, n) {
                      return e ? t.onFailure(e) : t.onSuccess(n);
                    }
                  );
                }),
                (e.forgetSpecificDevice = function (t, e) {
                  if (
                    null == this.signInUserSession ||
                    !this.signInUserSession.isValid()
                  )
                    return e.onFailure(new Error('User is not authenticated'));
                  this.client.request(
                    'ForgetDevice',
                    {
                      AccessToken: this.signInUserSession
                        .getAccessToken()
                        .getJwtToken(),
                      DeviceKey: t,
                    },
                    function (t) {
                      return t ? e.onFailure(t) : e.onSuccess('SUCCESS');
                    }
                  );
                }),
                (e.forgetDevice = function (t) {
                  var e = this;
                  this.forgetSpecificDevice(this.deviceKey, {
                    onFailure: t.onFailure,
                    onSuccess: function (n) {
                      return (
                        (e.deviceKey = null),
                        (e.deviceGroupKey = null),
                        (e.randomPassword = null),
                        e.clearCachedDeviceKeyAndPassword(),
                        t.onSuccess(n)
                      );
                    },
                  });
                }),
                (e.setDeviceStatusRemembered = function (t) {
                  if (
                    null == this.signInUserSession ||
                    !this.signInUserSession.isValid()
                  )
                    return t.onFailure(new Error('User is not authenticated'));
                  this.client.request(
                    'UpdateDeviceStatus',
                    {
                      AccessToken: this.signInUserSession
                        .getAccessToken()
                        .getJwtToken(),
                      DeviceKey: this.deviceKey,
                      DeviceRememberedStatus: 'remembered',
                    },
                    function (e) {
                      return e ? t.onFailure(e) : t.onSuccess('SUCCESS');
                    }
                  );
                }),
                (e.setDeviceStatusNotRemembered = function (t) {
                  if (
                    null == this.signInUserSession ||
                    !this.signInUserSession.isValid()
                  )
                    return t.onFailure(new Error('User is not authenticated'));
                  this.client.request(
                    'UpdateDeviceStatus',
                    {
                      AccessToken: this.signInUserSession
                        .getAccessToken()
                        .getJwtToken(),
                      DeviceKey: this.deviceKey,
                      DeviceRememberedStatus: 'not_remembered',
                    },
                    function (e) {
                      return e ? t.onFailure(e) : t.onSuccess('SUCCESS');
                    }
                  );
                }),
                (e.listDevices = function (t, e, n) {
                  if (
                    null == this.signInUserSession ||
                    !this.signInUserSession.isValid()
                  )
                    return n.onFailure(new Error('User is not authenticated'));
                  var i = {
                    AccessToken: this.signInUserSession
                      .getAccessToken()
                      .getJwtToken(),
                    Limit: t,
                  };
                  e && (i.PaginationToken = e),
                    this.client.request('ListDevices', i, function (t, e) {
                      return t ? n.onFailure(t) : n.onSuccess(e);
                    });
                }),
                (e.globalSignOut = function (t) {
                  var e = this;
                  if (
                    null == this.signInUserSession ||
                    !this.signInUserSession.isValid()
                  )
                    return t.onFailure(new Error('User is not authenticated'));
                  this.client.request(
                    'GlobalSignOut',
                    {
                      AccessToken: this.signInUserSession
                        .getAccessToken()
                        .getJwtToken(),
                    },
                    function (n) {
                      return n
                        ? t.onFailure(n)
                        : (e.clearCachedUser(), t.onSuccess('SUCCESS'));
                    }
                  );
                }),
                (e.signOut = function (t) {
                  var e = this;
                  t && 'function' == typeof t
                    ? this.getSession(function (n, i) {
                        if (n) return t(n);
                        e.revokeTokens(function (n) {
                          e.cleanClientData(), t(n);
                        });
                      })
                    : this.cleanClientData();
                }),
                (e.revokeTokens = function (t) {
                  if (
                    (void 0 === t && (t = function () {}),
                    'function' != typeof t)
                  )
                    throw new Error(
                      'Invalid revokeTokenCallback. It should be a function.'
                    );
                  if (!this.signInUserSession)
                    return t(new Error('User is not authenticated'));
                  if (!this.signInUserSession.getAccessToken())
                    return t(new Error('No Access token available'));
                  var e = this.signInUserSession.getRefreshToken().getToken(),
                    n = this.signInUserSession.getAccessToken();
                  if (this.isSessionRevocable(n) && e)
                    return this.revokeToken({ token: e, callback: t });
                  t();
                }),
                (e.isSessionRevocable = function (t) {
                  if (t && 'function' == typeof t.decodePayload)
                    try {
                      return !!t.decodePayload().origin_jti;
                    } catch (t) {}
                  return !1;
                }),
                (e.cleanClientData = function () {
                  (this.signInUserSession = null), this.clearCachedUser();
                }),
                (e.revokeToken = function (t) {
                  var e = t.token,
                    n = t.callback;
                  this.client.requestWithRetry(
                    'RevokeToken',
                    { Token: e, ClientId: this.pool.getClientId() },
                    function (t) {
                      if (t) return n(t);
                      n();
                    }
                  );
                }),
                (e.sendMFASelectionAnswer = function (t, e) {
                  var n = this,
                    i = {};
                  (i.USERNAME = this.username), (i.ANSWER = t);
                  var r = {
                    ChallengeName: 'SELECT_MFA_TYPE',
                    ChallengeResponses: i,
                    ClientId: this.pool.getClientId(),
                    Session: this.Session,
                  };
                  this.getUserContextData() &&
                    (r.UserContextData = this.getUserContextData()),
                    this.client.request(
                      'RespondToAuthChallenge',
                      r,
                      function (i, r) {
                        return i
                          ? e.onFailure(i)
                          : ((n.Session = r.Session),
                            'SMS_MFA' === t
                              ? e.mfaRequired(
                                  r.ChallengeName,
                                  r.ChallengeParameters
                                )
                              : 'SOFTWARE_TOKEN_MFA' === t
                              ? e.totpRequired(
                                  r.ChallengeName,
                                  r.ChallengeParameters
                                )
                              : void 0);
                      }
                    );
                }),
                (e.getUserContextData = function () {
                  return this.pool.getUserContextData(this.username);
                }),
                (e.associateSoftwareToken = function (t) {
                  var e = this;
                  null != this.signInUserSession &&
                  this.signInUserSession.isValid()
                    ? this.client.request(
                        'AssociateSoftwareToken',
                        {
                          AccessToken: this.signInUserSession
                            .getAccessToken()
                            .getJwtToken(),
                        },
                        function (e, n) {
                          return e
                            ? t.onFailure(e)
                            : t.associateSecretCode(n.SecretCode);
                        }
                      )
                    : this.client.request(
                        'AssociateSoftwareToken',
                        { Session: this.Session },
                        function (n, i) {
                          return n
                            ? t.onFailure(n)
                            : ((e.Session = i.Session),
                              t.associateSecretCode(i.SecretCode));
                        }
                      );
                }),
                (e.verifySoftwareToken = function (t, e, n) {
                  var i = this;
                  null != this.signInUserSession &&
                  this.signInUserSession.isValid()
                    ? this.client.request(
                        'VerifySoftwareToken',
                        {
                          AccessToken: this.signInUserSession
                            .getAccessToken()
                            .getJwtToken(),
                          UserCode: t,
                          FriendlyDeviceName: e,
                        },
                        function (t, e) {
                          return t ? n.onFailure(t) : n.onSuccess(e);
                        }
                      )
                    : this.client.request(
                        'VerifySoftwareToken',
                        {
                          Session: this.Session,
                          UserCode: t,
                          FriendlyDeviceName: e,
                        },
                        function (t, e) {
                          if (t) return n.onFailure(t);
                          i.Session = e.Session;
                          var r = {};
                          r.USERNAME = i.username;
                          var s = {
                            ChallengeName: 'MFA_SETUP',
                            ClientId: i.pool.getClientId(),
                            ChallengeResponses: r,
                            Session: i.Session,
                          };
                          i.getUserContextData() &&
                            (s.UserContextData = i.getUserContextData()),
                            i.client.request(
                              'RespondToAuthChallenge',
                              s,
                              function (t, e) {
                                return t
                                  ? n.onFailure(t)
                                  : ((i.signInUserSession =
                                      i.getCognitoUserSession(
                                        e.AuthenticationResult
                                      )),
                                    i.cacheTokens(),
                                    n.onSuccess(i.signInUserSession));
                              }
                            );
                        }
                      );
                }),
                t
              );
            })();
          function et() {}
          n(313), (et.prototype.userAgent = J.userAgent);
          const nt = et;
          function it(t) {
            var e = 'function' == typeof Map ? new Map() : void 0;
            return (
              (it = function (t) {
                if (
                  null === t ||
                  ((n = t),
                  -1 === Function.toString.call(n).indexOf('[native code]'))
                )
                  return t;
                var n;
                if ('function' != typeof t)
                  throw new TypeError(
                    'Super expression must either be null or a function'
                  );
                if (void 0 !== e) {
                  if (e.has(t)) return e.get(t);
                  e.set(t, i);
                }
                function i() {
                  return rt(t, arguments, at(this).constructor);
                }
                return (
                  (i.prototype = Object.create(t.prototype, {
                    constructor: {
                      value: i,
                      enumerable: !1,
                      writable: !0,
                      configurable: !0,
                    },
                  })),
                  ot(i, t)
                );
              }),
              it(t)
            );
          }
          function rt(t, e, n) {
            return (
              (rt = st()
                ? Reflect.construct.bind()
                : function (t, e, n) {
                    var i = [null];
                    i.push.apply(i, e);
                    var r = new (Function.bind.apply(t, i))();
                    return n && ot(r, n.prototype), r;
                  }),
              rt.apply(null, arguments)
            );
          }
          function st() {
            if ('undefined' == typeof Reflect || !Reflect.construct) return !1;
            if (Reflect.construct.sham) return !1;
            if ('function' == typeof Proxy) return !0;
            try {
              return (
                Boolean.prototype.valueOf.call(
                  Reflect.construct(Boolean, [], function () {})
                ),
                !0
              );
            } catch (t) {
              return !1;
            }
          }
          function ot(t, e) {
            return (
              (ot = Object.setPrototypeOf
                ? Object.setPrototypeOf.bind()
                : function (t, e) {
                    return (t.__proto__ = e), t;
                  }),
              ot(t, e)
            );
          }
          function at(t) {
            return (
              (at = Object.setPrototypeOf
                ? Object.getPrototypeOf.bind()
                : function (t) {
                    return t.__proto__ || Object.getPrototypeOf(t);
                  }),
              at(t)
            );
          }
          var ut = (function (t) {
              function e(e, n, i, r) {
                var s;
                return (
                  ((s = t.call(this, e) || this).code = n),
                  (s.name = i),
                  (s.statusCode = r),
                  s
                );
              }
              return (
                (i = t),
                ((n = e).prototype = Object.create(i.prototype)),
                (n.prototype.constructor = n),
                ot(n, i),
                e
              );
              var n, i;
            })(it(Error)),
            ct = (function () {
              function t(t, e, n) {
                this.endpoint =
                  e || 'https://cognito-idp.' + t + '.amazonaws.com/';
                var i = (n || {}).credentials;
                this.fetchOptions = i ? { credentials: i } : {};
              }
              var e = t.prototype;
              return (
                (e.promisifyRequest = function (t, e) {
                  var n = this;
                  return new Promise(function (i, r) {
                    n.request(t, e, function (t, e) {
                      t
                        ? r(new ut(t.message, t.code, t.name, t.statusCode))
                        : i(e);
                    });
                  });
                }),
                (e.requestWithRetry = function (t, e, n) {
                  var i,
                    r,
                    s = this;
                  ((i = [e]),
                  (r = 5e3),
                  void 0 === r && (r = ht),
                  lt(
                    function (e) {
                      return new Promise(function (n, i) {
                        s.request(t, e, function (t, e) {
                          t ? i(t) : n(e);
                        });
                      });
                    },
                    i,
                    (function (t) {
                      return function (e) {
                        var n = 100 * Math.pow(2, e) + 100 * Math.random();
                        return !(n > t) && n;
                      };
                    })(r)
                  ))
                    .then(function (t) {
                      return n(null, t);
                    })
                    .catch(function (t) {
                      return n(t);
                    });
                }),
                (e.request = function (t, e, n) {
                  var i,
                    r = {
                      'Content-Type': 'application/x-amz-json-1.1',
                      'X-Amz-Target': 'AWSCognitoIdentityProviderService.' + t,
                      'X-Amz-User-Agent': nt.prototype.userAgent,
                      'Cache-Control': 'no-store',
                    },
                    s = Object.assign({}, this.fetchOptions, {
                      headers: r,
                      method: 'POST',
                      mode: 'cors',
                      body: JSON.stringify(e),
                    });
                  fetch(this.endpoint, s)
                    .then(
                      function (t) {
                        return (i = t), t;
                      },
                      function (t) {
                        if (t instanceof TypeError)
                          throw new Error('Network error');
                        throw t;
                      }
                    )
                    .then(function (t) {
                      return t.json().catch(function () {
                        return {};
                      });
                    })
                    .then(function (t) {
                      if (i.ok) return n(null, t);
                      var e = (t.__type || t.code).split('#').pop(),
                        r = new Error(t.message || t.Message || null);
                      return (r.name = e), (r.code = e), n(r);
                    })
                    .catch(function (t) {
                      if (i && i.headers && i.headers.get('x-amzn-errortype'))
                        try {
                          var e = i.headers
                              .get('x-amzn-errortype')
                              .split(':')[0],
                            r = new Error(
                              i.status ? i.status.toString() : null
                            );
                          return (
                            (r.code = e),
                            (r.name = e),
                            (r.statusCode = i.status),
                            n(r)
                          );
                        } catch (e) {
                          return n(t);
                        }
                      else
                        t instanceof Error &&
                          'Network error' === t.message &&
                          (t.code = 'NetworkError');
                      return n(t);
                    });
                }),
                t
              );
            })();
          function lt(t, e, n, i) {
            if ((void 0 === i && (i = 1), 'function' != typeof t))
              throw Error('functionToRetry must be a function');
            return (
              t.name,
              JSON.stringify(e),
              t.apply(void 0, e).catch(function (r) {
                if ((t.name, (s = r) && s.nonRetryable)) throw (t.name, r);
                var s,
                  o = n(i, e, r);
                if ((t.name, !1 !== o))
                  return new Promise(function (t) {
                    return setTimeout(t, o);
                  }).then(function () {
                    return lt(t, e, n, i + 1);
                  });
                throw r;
              })
            );
          }
          Error;
          var ht = 3e5,
            ft = (function () {
              function t(t, e) {
                var n = t || {},
                  i = n.UserPoolId,
                  r = n.ClientId,
                  s = n.endpoint,
                  o = n.fetchOptions,
                  a = n.AdvancedSecurityDataCollectionFlag;
                if (!i || !r)
                  throw new Error('Both UserPoolId and ClientId are required.');
                if (i.length > 55 || !/^[\w-]+_[0-9a-zA-Z]+$/.test(i))
                  throw new Error('Invalid UserPoolId format.');
                var u = i.split('_')[0];
                (this.userPoolId = i),
                  (this.clientId = r),
                  (this.client = new ct(u, s, o)),
                  (this.advancedSecurityDataCollectionFlag = !1 !== a),
                  (this.storage = t.Storage || new X().getStorage()),
                  e && (this.wrapRefreshSessionCallback = e);
              }
              var e = t.prototype;
              return (
                (e.getUserPoolId = function () {
                  return this.userPoolId;
                }),
                (e.getUserPoolName = function () {
                  return this.getUserPoolId().split('_')[1];
                }),
                (e.getClientId = function () {
                  return this.clientId;
                }),
                (e.signUp = function (t, e, n, i, r, s) {
                  var o = this,
                    a = {
                      ClientId: this.clientId,
                      Username: t,
                      Password: e,
                      UserAttributes: n,
                      ValidationData: i,
                      ClientMetadata: s,
                    };
                  this.getUserContextData(t) &&
                    (a.UserContextData = this.getUserContextData(t)),
                    this.client.request('SignUp', a, function (e, n) {
                      if (e) return r(e, null);
                      var i = { Username: t, Pool: o, Storage: o.storage },
                        s = {
                          user: new tt(i),
                          userConfirmed: n.UserConfirmed,
                          userSub: n.UserSub,
                          codeDeliveryDetails: n.CodeDeliveryDetails,
                        };
                      return r(null, s);
                    });
                }),
                (e.getCurrentUser = function () {
                  var t =
                      'CognitoIdentityServiceProvider.' +
                      this.clientId +
                      '.LastAuthUser',
                    e = this.storage.getItem(t);
                  if (e) {
                    var n = { Username: e, Pool: this, Storage: this.storage };
                    return new tt(n);
                  }
                  return null;
                }),
                (e.getUserContextData = function (t) {
                  if ('undefined' != typeof AmazonCognitoAdvancedSecurityData) {
                    var e = AmazonCognitoAdvancedSecurityData;
                    if (this.advancedSecurityDataCollectionFlag) {
                      var n = e.getData(t, this.userPoolId, this.clientId);
                      if (n) return { EncodedData: n };
                    }
                    return {};
                  }
                }),
                t
              );
            })(),
            pt =
              (n(736),
              (function () {
                function t(e, n) {
                  c()(this, t),
                    g()(this, 'cognitoUserPool', null),
                    g()(this, 'username', ''),
                    g()(this, 'accessToken', ''),
                    g()(this, 'idToken', ''),
                    g()(this, 'refreshToken', ''),
                    this.buildUserPool(e, n);
                }
                var e, n, i, r, o;
                return (
                  h()(t, [
                    {
                      key: 'cognitoUser',
                      get: function () {
                        return this.username
                          ? this.getCognitoUser(this.username)
                          : null;
                      },
                    },
                  ]),
                  h()(t, [
                    {
                      key: 'buildUserPool',
                      value: function (t, e) {
                        this.cognitoUserPool = new ft({
                          UserPoolId: t,
                          ClientId: e,
                        });
                      },
                    },
                    {
                      key: 'getCognitoUser',
                      value: function (t) {
                        var e = { Username: t, Pool: this.cognitoUserPool };
                        return new tt(e);
                      },
                    },
                    {
                      key: 'refreshSession',
                      value: function () {
                        var t = this;
                        return this.cognitoUserPool
                          ? this.username
                            ? (new q({ RefreshToken: this.refreshTokenValue }),
                              void this.getCognitoUser(
                                this.username
                              ).refreshSession(RefreshToken, function (e, n) {
                                return e
                                  ? {
                                      cognitoErrorCode: e.code,
                                      message: e.message,
                                    }
                                  : ((t.idToken = n.getIdToken().getJwtToken()),
                                    (t.accessToken = n
                                      .getAccessToken()
                                      .getJwtToken()),
                                    (t.refreshToken = n
                                      .getRefreshToken()
                                      .getToken()),
                                    { message: 'Session has been refreshed.' });
                              }))
                            : {
                                message:
                                  'No Cognito User available for session refresh',
                              }
                          : { message: 'No user pool assigned' };
                      },
                    },
                    {
                      key: 'login',
                      value:
                        ((o = a()(
                          s().mark(function t(e, n) {
                            var i,
                              r,
                              o,
                              a = this;
                            return s().wrap(
                              function (t) {
                                for (;;)
                                  switch ((t.prev = t.next)) {
                                    case 0:
                                      if (this.cognitoUserPool) {
                                        t.next = 2;
                                        break;
                                      }
                                      return t.abrupt('return', {
                                        message: 'No user pool assigned',
                                      });
                                    case 2:
                                      return (
                                        (i = new v({
                                          Username: e,
                                          Password: n,
                                        })),
                                        (r = this.getCognitoUser(e)),
                                        (o = null),
                                        (t.next = 7),
                                        Promise.resolve(
                                          new Promise(function (t) {
                                            r.authenticateUser(i, {
                                              onSuccess: function (n) {
                                                (a.username = e),
                                                  (a.idToken = n
                                                    .getIdToken()
                                                    .getJwtToken()),
                                                  (a.accessToken = n
                                                    .getAccessToken()
                                                    .getJwtToken()),
                                                  (a.refreshToken = n
                                                    .getRefreshToken()
                                                    .getToken()),
                                                  (o = {
                                                    message:
                                                      'Cognito User has been logged in.',
                                                    username: a.username,
                                                    idToken: a.idToken,
                                                    accessToken: a.accessToken,
                                                    refreshToken:
                                                      a.refreshToken,
                                                  }),
                                                  t();
                                              },
                                              onFailure: function (e) {
                                                'PasswordResetRequiredException' ===
                                                e.code
                                                  ? r.forgotPassword({
                                                      onSuccess: function () {
                                                        (o = {
                                                          message:
                                                            'Cognito User has been sent an email with password reset instructions.',
                                                        }),
                                                          t();
                                                      },
                                                      onFailure: function (e) {
                                                        (o = {
                                                          cognitoErrorCode:
                                                            e.code,
                                                          message: e.message,
                                                        }),
                                                          t();
                                                      },
                                                    })
                                                  : ((o = {
                                                      cognitoErrorCode: e.code,
                                                      message: e.message,
                                                    }),
                                                    t());
                                              },
                                              newPasswordRequired: function () {
                                                (o = {
                                                  message:
                                                    'Cognito User must change password.',
                                                }),
                                                  t();
                                              },
                                            });
                                          })
                                        )
                                      );
                                    case 7:
                                      return t.abrupt('return', o);
                                    case 8:
                                    case 'end':
                                      return t.stop();
                                  }
                              },
                              t,
                              this
                            );
                          })
                        )),
                        function (t, e) {
                          return o.apply(this, arguments);
                        }),
                    },
                    {
                      key: 'register',
                      value: function (t, e) {
                        if (!this.cognitoUserPool)
                          return { message: 'No user pool assigned' };
                        var n = { Name: 'email', Value: t },
                          i = [],
                          r = new Y(n);
                        i.push(r),
                          this.cognitoUserPool.signUp(
                            n.Value,
                            e,
                            i,
                            null,
                            function (t, e) {
                              return t
                                ? {
                                    cognitoErrorCode: t.code,
                                    message: t.message,
                                  }
                                : {
                                    message:
                                      'Cognito User Account created. Email sent to Cognito User for confirmation.',
                                  };
                            }
                          );
                      },
                    },
                    {
                      key: 'confirmUser',
                      value: function (t, e) {
                        if (!this.cognitoUserPool)
                          return { message: 'No user pool assigned' };
                        new tt({
                          Username: t,
                          Pool: this.cognitoUserPool,
                        }).confirmRegistration(e, !1, function (t, e) {
                          return t
                            ? { cognitoErrorCode: t.code, message: t.message }
                            : {
                                message:
                                  'Cognito User Account has been confirmed.',
                              };
                        });
                      },
                    },
                    {
                      key: 'forgotPassword',
                      value:
                        ((r = a()(
                          s().mark(function t(e) {
                            var n, i;
                            return s().wrap(
                              function (t) {
                                for (;;)
                                  switch ((t.prev = t.next)) {
                                    case 0:
                                      if (this.cognitoUserPool) {
                                        t.next = 2;
                                        break;
                                      }
                                      return t.abrupt('return', {
                                        message: 'No user pool assigned',
                                      });
                                    case 2:
                                      return (
                                        (n = new tt({
                                          Username: e,
                                          Pool: this.cognitoUserPool,
                                        })),
                                        (t.next = 5),
                                        Promise.resolve(
                                          new Promise(function (t) {
                                            n.forgotPassword({
                                              onSuccess: function (e) {
                                                (i = {
                                                  message:
                                                    'Cognito User has been sent an email with password reset instructions.',
                                                  details: e,
                                                }),
                                                  t();
                                              },
                                              onFailure: function (e) {
                                                (i = {
                                                  cognitoErrorCode: e.code,
                                                  message: e.message,
                                                }),
                                                  t();
                                              },
                                            });
                                          })
                                        )
                                      );
                                    case 5:
                                      return t.abrupt('return', i);
                                    case 6:
                                    case 'end':
                                      return t.stop();
                                  }
                              },
                              t,
                              this
                            );
                          })
                        )),
                        function (t) {
                          return r.apply(this, arguments);
                        }),
                    },
                    {
                      key: 'changePassword',
                      value:
                        ((i = a()(
                          s().mark(function t(e, n, i) {
                            var r, o;
                            return s().wrap(
                              function (t) {
                                for (;;)
                                  switch ((t.prev = t.next)) {
                                    case 0:
                                      if (this.cognitoUserPool) {
                                        t.next = 2;
                                        break;
                                      }
                                      return t.abrupt('return', {
                                        message: 'No user pool assigned',
                                      });
                                    case 2:
                                      (r = new v({ Username: e, Password: n })),
                                        (o = new tt({
                                          Username: e,
                                          Pool: this.cognitoUserPool,
                                        })).authenticateUser(r, {
                                          onSuccess: function () {
                                            return !1;
                                          },
                                          onFailure: function (t) {
                                            return {
                                              cognitoErrorCode: t.code,
                                              message:
                                                'Current password for this Cognito User is incorrect.',
                                            };
                                          },
                                          newPasswordRequired: function (t, e) {
                                            o.completeNewPasswordChallenge(
                                              i,
                                              {},
                                              {
                                                onSuccess: function () {
                                                  return {
                                                    message:
                                                      'Password has been changed for this Cognito User.',
                                                  };
                                                },
                                                onFailure: function (t) {
                                                  return {
                                                    cognitoErrorCode: t.code,
                                                    message: t.message,
                                                  };
                                                },
                                              }
                                            );
                                          },
                                        });
                                    case 5:
                                    case 'end':
                                      return t.stop();
                                  }
                              },
                              t,
                              this
                            );
                          })
                        )),
                        function (t, e, n) {
                          return i.apply(this, arguments);
                        }),
                    },
                    {
                      key: 'confirmPassword',
                      value:
                        ((n = a()(
                          s().mark(function t(e, n, i) {
                            var r, o;
                            return s().wrap(
                              function (t) {
                                for (;;)
                                  switch ((t.prev = t.next)) {
                                    case 0:
                                      if (this.cognitoUserPool) {
                                        t.next = 2;
                                        break;
                                      }
                                      return t.abrupt('return', {
                                        message: 'No user pool assigned',
                                      });
                                    case 2:
                                      return (
                                        (r = new tt({
                                          Username: e,
                                          Pool: this.cognitoUserPool,
                                        })),
                                        (t.next = 5),
                                        Promise.resolve(
                                          new Promise(function (t) {
                                            r.confirmPassword(n, i, {
                                              onSuccess: function (e) {
                                                (o = {
                                                  message:
                                                    'Password has been changed for this Cognito User.',
                                                  details: e,
                                                }),
                                                  t();
                                              },
                                              onFailure: function (e) {
                                                (o =
                                                  'ExpiredCodeException' ===
                                                  e.code
                                                    ? {
                                                        cognitoErrorCode:
                                                          e.code,
                                                        message:
                                                          'Verification Code has expired. A new reset password request needs to be made.',
                                                      }
                                                    : {
                                                        cognitoErrorCode:
                                                          e.code,
                                                        message: e.message,
                                                      }),
                                                  t();
                                              },
                                            });
                                          })
                                        )
                                      );
                                    case 5:
                                      return t.abrupt('return', o);
                                    case 6:
                                    case 'end':
                                      return t.stop();
                                  }
                              },
                              t,
                              this
                            );
                          })
                        )),
                        function (t, e, i) {
                          return n.apply(this, arguments);
                        }),
                    },
                    {
                      key: 'confirmRegistration',
                      value:
                        ((e = a()(
                          s().mark(function t(e, n, i, r, o) {
                            var a, u, c;
                            return s().wrap(function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (a = {
                                        userStatus: i,
                                        password: o,
                                        session: r,
                                        username: n,
                                      }),
                                      (u = {
                                        method: 'POST',
                                        body: JSON.stringify(a),
                                        headers: {},
                                      }),
                                      (t.next = 4),
                                      Promise.resolve(
                                        new Promise(function (t) {
                                          fetch(e, u)
                                            .then(function (t) {
                                              return t.json();
                                            })
                                            .then(function (e) {
                                              (c = e), t();
                                            });
                                        })
                                      )
                                    );
                                  case 4:
                                    return t.abrupt('return', c);
                                  case 5:
                                  case 'end':
                                    return t.stop();
                                }
                            }, t);
                          })
                        )),
                        function (t, n, i, r, s) {
                          return e.apply(this, arguments);
                        }),
                    },
                    {
                      key: 'removeUser',
                      value: function () {
                        (this.username = ''),
                          (this.accessToken = ''),
                          (this.idToken = ''),
                          (this.refreshToken = '');
                      },
                    },
                  ]),
                  t
                );
              })()),
            dt = (function () {
              function t(e, n, i) {
                c()(this, t),
                  g()(this, 'host', 'api-demo.tryformkiq.com'),
                  g()(this, 'validDateRegExp', /^d{4}-d{2}-d{2}$/),
                  g()(this, 'validTZRegExp', /(([+-]?)(d{2}):?(d{0,2}))/),
                  g()(this, 'userPoolId', ''),
                  g()(this, 'clientId', ''),
                  e && (this.host = e),
                  n &&
                    i &&
                    ((this.userPoolId = n),
                    (this.clientId = i),
                    this.buildCognitoClient(n, i)),
                  t.instance || (t.instance = this);
              }
              var e, n, i;
              return (
                h()(t, [
                  {
                    key: 'instance',
                    get: function () {
                      return t.instance;
                    },
                    set: function (e) {
                      t.instance = e;
                    },
                  },
                ]),
                h()(t, [
                  {
                    key: 'logout',
                    value:
                      ((i = a()(
                        s().mark(function t() {
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    this.cognitoClient.removeUser();
                                  case 1:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function () {
                        return i.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'buildCognitoClient',
                    value: function (t, e) {
                      this.cognitoClient = new pt(t, e);
                    },
                  },
                  {
                    key: 'buildQueryString',
                    value: function (t) {
                      var e = Object.keys(t).map(function (e) {
                        return e + '=' + encodeURIComponent(t[e]);
                      });
                      return e.length ? '?' + e.join('&') : '';
                    },
                  },
                  {
                    key: 'buildOptions',
                    value: function (t, e, n, i) {
                      var r = { method: t };
                      return (
                        n || (n = {}),
                        !i &&
                          this.cognitoClient &&
                          this.cognitoClient.accessToken &&
                          (n.Authorization = this.cognitoClient.accessToken),
                        e &&
                          ('string' == typeof e
                            ? (r.body = e)
                            : 'object' === p()(e) &&
                              (r.body = JSON.stringify(e))),
                        (r.headers = n),
                        r
                      );
                    },
                  },
                  {
                    key: 'fetchAndRespond',
                    value:
                      ((n = a()(
                        s().mark(function t(e, n) {
                          var i;
                          return s().wrap(function (t) {
                            for (;;)
                              switch ((t.prev = t.next)) {
                                case 0:
                                  return (
                                    (t.next = 2),
                                    Promise.resolve(
                                      new Promise(function (t) {
                                        fetch(e, n)
                                          .then(function (t) {
                                            return t.json().then(function (e) {
                                              return {
                                                httpStatus: t.status,
                                                body: e,
                                              };
                                            });
                                          })
                                          .then(function (e) {
                                            (i = e.body).status ||
                                              (i.status = e.httpStatus),
                                              t();
                                          })
                                          .catch(function (e) {
                                            'Failed to fetch' === e.message
                                              ? (console.error(
                                                  'Fetch failed, but execution continues:',
                                                  e
                                                ),
                                                (i = {
                                                  status: 'fetch_failed',
                                                  error: e,
                                                }))
                                              : console.error(
                                                  'Unhandled error:',
                                                  e
                                                ),
                                              t();
                                          });
                                      })
                                    )
                                  );
                                case 2:
                                  return t.abrupt('return', i);
                                case 3:
                                case 'end':
                                  return t.stop();
                              }
                          }, t);
                        })
                      )),
                      function (t, e) {
                        return n.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'uploadFile',
                    value:
                      ((e = a()(
                        s().mark(function t(e, n, i) {
                          var r;
                          return s().wrap(function (t) {
                            for (;;)
                              switch ((t.prev = t.next)) {
                                case 0:
                                  return (
                                    (t.next = 2),
                                    Promise.resolve(
                                      new Promise(function (t) {
                                        var s = new XMLHttpRequest();
                                        s.open('PUT', e, !0),
                                          s.setRequestHeader(
                                            'Content-Type',
                                            n.type
                                          ),
                                          (s.upload.onprogress = i),
                                          (s.onreadystatechange = function () {
                                            (r =
                                              200 == this.status
                                                ? {
                                                    status: this.status,
                                                    message:
                                                      'File uploaded successfully',
                                                  }
                                                : {
                                                    status: this.status,
                                                    message:
                                                      'An unexpected error has occurred',
                                                  }),
                                              t();
                                          }),
                                          s.send(n);
                                      })
                                    )
                                  );
                                case 2:
                                  return t.abrupt('return', r);
                                case 3:
                                case 'end':
                                  return t.stop();
                              }
                          }, t);
                        })
                      )),
                      function (t, n, i) {
                        return e.apply(this, arguments);
                      }),
                  },
                ]),
                t
              );
            })(),
            gt = (function () {
              function t(e) {
                c()(this, t),
                  (this.apiClient = e || dt.instance),
                  t.instance || (t.instance = this);
              }
              var e,
                n,
                i,
                r,
                o,
                u,
                l,
                f,
                p,
                d,
                g,
                v,
                y,
                m,
                C,
                w,
                b,
                S,
                A,
                k,
                T,
                E,
                U,
                I,
                x,
                D,
                P,
                R,
                O,
                _,
                N,
                F,
                B,
                M,
                L,
                K,
                V,
                q,
                j,
                J,
                Q,
                G,
                W,
                H;
              return (
                h()(t, [
                  {
                    key: 'getDocuments',
                    value:
                      ((H = a()(
                        s().mark(function t() {
                          var e,
                            n,
                            i,
                            r,
                            o,
                            a,
                            u,
                            c,
                            l,
                            h,
                            f = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (e =
                                        f.length > 0 && void 0 !== f[0]
                                          ? f[0]
                                          : null),
                                      (n =
                                        f.length > 1 && void 0 !== f[1]
                                          ? f[1]
                                          : null),
                                      (i =
                                        f.length > 2 && void 0 !== f[2]
                                          ? f[2]
                                          : null),
                                      (r =
                                        f.length > 3 && void 0 !== f[3]
                                          ? f[3]
                                          : null),
                                      (o =
                                        f.length > 4 && void 0 !== f[4]
                                          ? f[4]
                                          : null),
                                      (a =
                                        f.length > 5 && void 0 !== f[5]
                                          ? f[5]
                                          : null),
                                      (u =
                                        f.length > 6 && void 0 !== f[6]
                                          ? f[6]
                                          : null),
                                      (c = {}),
                                      e && (c.siteId = e),
                                      n &&
                                        n.match(
                                          this.apiClient.validDateRegExp
                                        ) &&
                                        ((c.date = n),
                                        i &&
                                          i.match(
                                            this.apiClient.validTZRegExp
                                          ) &&
                                          (c.tz = i)),
                                      r && r.length && (c.previous = r),
                                      o && o.length && (c.next = o),
                                      u && u.length && (c.deleted = u),
                                      a && (c.limit = a),
                                      (l = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents'
                                        )
                                        .concat(
                                          this.apiClient.buildQueryString(c)
                                        )),
                                      (h = this.apiClient.buildOptions('GET')),
                                      (t.next = 18),
                                      this.apiClient.fetchAndRespond(l, h)
                                    );
                                  case 18:
                                    return t.abrupt('return', t.sent);
                                  case 19:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function () {
                        return H.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'searchDocuments',
                    value:
                      ((W = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a,
                            u,
                            c,
                            l = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (n =
                                        l.length > 1 && void 0 !== l[1]
                                          ? l[1]
                                          : null),
                                      (i =
                                        l.length > 2 && void 0 !== l[2]
                                          ? l[2]
                                          : null),
                                      (r =
                                        l.length > 3 && void 0 !== l[3]
                                          ? l[3]
                                          : null),
                                      (o =
                                        l.length > 4 && void 0 !== l[4]
                                          ? l[4]
                                          : null),
                                      (a = {}),
                                      n && (a.siteId = n),
                                      o && o.length && (a.previous = o),
                                      r && r.length && (a.next = r),
                                      i && (a.limit = i),
                                      (u = ''
                                        .concat(this.apiClient.host, '/search')
                                        .concat(
                                          this.apiClient.buildQueryString(a)
                                        )),
                                      (c = this.apiClient.buildOptions(
                                        'POST',
                                        e
                                      )),
                                      (t.next = 13),
                                      this.apiClient.fetchAndRespond(u, c)
                                    );
                                  case 13:
                                    return t.abrupt('return', t.sent);
                                  case 14:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return W.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getDocument',
                    value:
                      ((G = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((n =
                                        a.length > 1 && void 0 !== a[1]
                                          ? a[1]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 3;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No document ID specified',
                                      })
                                    );
                                  case 3:
                                    return (
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents/'
                                        )
                                        .concat(e)
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o = this.apiClient.buildOptions('GET')),
                                      (t.next = 9),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 9:
                                    return t.abrupt('return', t.sent);
                                  case 10:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return G.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'addDocument',
                    value:
                      ((Q = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (n =
                                        a.length > 1 && void 0 !== a[1]
                                          ? a[1]
                                          : null),
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents'
                                        )
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o = this.apiClient.buildOptions(
                                        'POST',
                                        e
                                      )),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return Q.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'addDocumentUsingPublicPath',
                    value:
                      ((J = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (n =
                                        a.length > 1 && void 0 !== a[1]
                                          ? a[1]
                                          : null),
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/public/documents'
                                        )
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o = this.apiClient.buildOptions(
                                        'POST',
                                        e
                                      )),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return J.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'updateDocument',
                    value:
                      ((j = a()(
                        s().mark(function t(e, n) {
                          var i,
                            r,
                            o,
                            a,
                            u = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((i =
                                        u.length > 2 && void 0 !== u[2]
                                          ? u[2]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 3;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No document ID specified',
                                      })
                                    );
                                  case 3:
                                    return (
                                      (r = {}),
                                      i && (r.siteId = i),
                                      (o = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents/'
                                        )
                                        .concat(e)
                                        .concat(
                                          this.apiClient.buildQueryString(r)
                                        )),
                                      (a = this.apiClient.buildOptions(
                                        'PATCH',
                                        n
                                      )),
                                      (t.next = 9),
                                      this.apiClient.fetchAndRespond(o, a)
                                    );
                                  case 9:
                                    return t.abrupt('return', t.sent);
                                  case 10:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, e) {
                        return j.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'deleteDocument',
                    value:
                      ((q = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a,
                            u = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((n =
                                        u.length > 1 && void 0 !== u[1]
                                          ? u[1]
                                          : null),
                                      (i =
                                        u.length > 2 && void 0 !== u[2]
                                          ? u[2]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 4;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No document ID specified',
                                      })
                                    );
                                  case 4:
                                    return (
                                      (r = {}),
                                      n && (r.siteId = n),
                                      i && i.length && (r.softDelete = i),
                                      (o = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents/'
                                        )
                                        .concat(e)
                                        .concat(
                                          this.apiClient.buildQueryString(r)
                                        )),
                                      (a =
                                        this.apiClient.buildOptions('DELETE')),
                                      (t.next = 11),
                                      this.apiClient.fetchAndRespond(o, a)
                                    );
                                  case 11:
                                    return t.abrupt('return', t.sent);
                                  case 12:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return q.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'restoreDocument',
                    value:
                      ((V = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((n =
                                        a.length > 1 && void 0 !== a[1]
                                          ? a[1]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 3;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No document ID specified',
                                      })
                                    );
                                  case 3:
                                    return (
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents/'
                                        )
                                        .concat(e, '/restore')
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o = this.apiClient.buildOptions('PUT')),
                                      (t.next = 9),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 9:
                                    return t.abrupt('return', t.sent);
                                  case 10:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return V.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getDocumentTags',
                    value:
                      ((K = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a,
                            u = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((n =
                                        u.length > 1 && void 0 !== u[1]
                                          ? u[1]
                                          : null),
                                      (i =
                                        u.length > 2 && void 0 !== u[2]
                                          ? u[2]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 4;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No document ID specified',
                                      })
                                    );
                                  case 4:
                                    return (
                                      (r = {}),
                                      n && (r.siteId = n),
                                      i && (r.limit = i),
                                      (o = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents/'
                                        )
                                        .concat(e, '/tags')
                                        .concat(
                                          this.apiClient.buildQueryString(r)
                                        )),
                                      (a = this.apiClient.buildOptions('GET')),
                                      (t.next = 11),
                                      this.apiClient.fetchAndRespond(o, a)
                                    );
                                  case 11:
                                    return t.abrupt('return', t.sent);
                                  case 12:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return K.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getDocumentTag',
                    value:
                      ((L = a()(
                        s().mark(function t(e, n) {
                          var i,
                            r,
                            o,
                            a,
                            u = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((i =
                                        u.length > 2 && void 0 !== u[2]
                                          ? u[2]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 3;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No document ID specified',
                                      })
                                    );
                                  case 3:
                                    if (n) {
                                      t.next = 5;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No tag key specified',
                                      })
                                    );
                                  case 5:
                                    return (
                                      (r = {}),
                                      i && (r.siteId = i),
                                      (o = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents/'
                                        )
                                        .concat(e, '/tags/')
                                        .concat(n)
                                        .concat(
                                          this.apiClient.buildQueryString(r)
                                        )),
                                      (a = this.apiClient.buildOptions('GET')),
                                      (t.next = 11),
                                      this.apiClient.fetchAndRespond(o, a)
                                    );
                                  case 11:
                                    return t.abrupt('return', t.sent);
                                  case 12:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, e) {
                        return L.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'addDocumentTag',
                    value:
                      ((M = a()(
                        s().mark(function t(e, n) {
                          var i,
                            r,
                            o,
                            a,
                            u = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((i =
                                        u.length > 2 && void 0 !== u[2]
                                          ? u[2]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 3;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No document ID specified',
                                      })
                                    );
                                  case 3:
                                    return (
                                      (r = {}),
                                      i && (r.siteId = i),
                                      (o = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents/'
                                        )
                                        .concat(e, '/tags')
                                        .concat(
                                          this.apiClient.buildQueryString(r)
                                        )),
                                      (a = this.apiClient.buildOptions(
                                        'POST',
                                        n
                                      )),
                                      (t.next = 9),
                                      this.apiClient.fetchAndRespond(o, a)
                                    );
                                  case 9:
                                    return t.abrupt('return', t.sent);
                                  case 10:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, e) {
                        return M.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'updateDocumentTag',
                    value:
                      ((B = a()(
                        s().mark(function t(e, n) {
                          var i,
                            r,
                            o,
                            a,
                            u,
                            c = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((i =
                                        c.length > 2 && void 0 !== c[2]
                                          ? c[2]
                                          : null),
                                      (r =
                                        c.length > 3 && void 0 !== c[3]
                                          ? c[3]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 4;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No document ID specified',
                                      })
                                    );
                                  case 4:
                                    return (
                                      (o = {}),
                                      r && (o.siteId = r),
                                      (a = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents/'
                                        )
                                        .concat(e, '/tags/')
                                        .concat(n)
                                        .concat(
                                          this.apiClient.buildQueryString(o)
                                        )),
                                      (u = this.apiClient.buildOptions(
                                        'PUT',
                                        i
                                      )),
                                      (t.next = 10),
                                      this.apiClient.fetchAndRespond(a, u)
                                    );
                                  case 10:
                                    return t.abrupt('return', t.sent);
                                  case 11:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, e) {
                        return B.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'deleteDocumentTag',
                    value:
                      ((F = a()(
                        s().mark(function t(e, n) {
                          var i,
                            r,
                            o,
                            a,
                            u = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((i =
                                        u.length > 2 && void 0 !== u[2]
                                          ? u[2]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 3;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No document ID specified',
                                      })
                                    );
                                  case 3:
                                    if (n) {
                                      t.next = 5;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No tag key specified',
                                      })
                                    );
                                  case 5:
                                    return (
                                      (r = {}),
                                      i && (r.siteId = i),
                                      (o = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents/'
                                        )
                                        .concat(e, '/tags/')
                                        .concat(n)
                                        .concat(
                                          this.apiClient.buildQueryString(r)
                                        )),
                                      (a =
                                        this.apiClient.buildOptions('DELETE')),
                                      (t.next = 11),
                                      this.apiClient.fetchAndRespond(o, a)
                                    );
                                  case 11:
                                    return t.abrupt('return', t.sent);
                                  case 12:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, e) {
                        return F.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getDocumentContent',
                    value:
                      ((N = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a,
                            u,
                            c = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((n =
                                        c.length > 1 && void 0 !== c[1]
                                          ? c[1]
                                          : null),
                                      (i =
                                        c.length > 2 &&
                                        void 0 !== c[2] &&
                                        c[2]),
                                      (r =
                                        c.length > 3 && void 0 !== c[3]
                                          ? c[3]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 5;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No document ID specified',
                                      })
                                    );
                                  case 5:
                                    return (
                                      (o = {}),
                                      n && (o.versionKey = n),
                                      r && (o.siteId = r),
                                      (o.inline = i),
                                      (a = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents/'
                                        )
                                        .concat(e, '/content')
                                        .concat(
                                          this.apiClient.buildQueryString(o)
                                        )),
                                      (u = this.apiClient.buildOptions('GET')),
                                      (t.next = 13),
                                      this.apiClient.fetchAndRespond(a, u)
                                    );
                                  case 13:
                                    return t.abrupt('return', t.sent);
                                  case 14:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return N.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getDocumentUrl',
                    value:
                      ((_ = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a,
                            u,
                            c = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((n =
                                        c.length > 1 && void 0 !== c[1]
                                          ? c[1]
                                          : null),
                                      (i =
                                        c.length > 2 &&
                                        void 0 !== c[2] &&
                                        c[2]),
                                      (r =
                                        c.length > 3 && void 0 !== c[3]
                                          ? c[3]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 5;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No document ID specified',
                                      })
                                    );
                                  case 5:
                                    return (
                                      (o = {}),
                                      n && (o.versionKey = n),
                                      r && (o.siteId = r),
                                      (o.inline = i),
                                      (a = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents/'
                                        )
                                        .concat(e, '/url')
                                        .concat(
                                          this.apiClient.buildQueryString(o)
                                        )),
                                      (u = this.apiClient.buildOptions('GET')),
                                      (t.next = 13),
                                      this.apiClient.fetchAndRespond(a, u)
                                    );
                                  case 13:
                                    return t.abrupt('return', t.sent);
                                  case 14:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return _.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getDocumentVersions',
                    value:
                      ((O = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((n =
                                        a.length > 1 && void 0 !== a[1]
                                          ? a[1]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 3;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No document ID specified',
                                      })
                                    );
                                  case 3:
                                    return (
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents/'
                                        )
                                        .concat(e, '/versions')
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o = this.apiClient.buildOptions('GET')),
                                      (t.next = 9),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 9:
                                    return t.abrupt('return', t.sent);
                                  case 10:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return O.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'putDocumentVersion',
                    value:
                      ((R = a()(
                        s().mark(function t(e, n) {
                          var i,
                            r,
                            o,
                            a,
                            u,
                            c = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((i =
                                        c.length > 2 && void 0 !== c[2]
                                          ? c[2]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 3;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No document ID specified',
                                      })
                                    );
                                  case 3:
                                    if (n) {
                                      t.next = 5;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No version key specified',
                                      })
                                    );
                                  case 5:
                                    return (
                                      (r = {}),
                                      i && (r.siteId = i),
                                      (o = { versionKey: n }),
                                      (a = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents/'
                                        )
                                        .concat(e, '/versions')
                                        .concat(
                                          this.apiClient.buildQueryString(r)
                                        )),
                                      (u = this.apiClient.buildOptions(
                                        'PUT',
                                        o
                                      )),
                                      (t.next = 12),
                                      this.apiClient.fetchAndRespond(a, u)
                                    );
                                  case 12:
                                    return t.abrupt('return', t.sent);
                                  case 13:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, e) {
                        return R.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getDocumentAccessAttributes',
                    value:
                      ((P = a()(
                        s().mark(function t(e, n) {
                          var i, r, o;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (e) {
                                      t.next = 2;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No site ID specified',
                                      })
                                    );
                                  case 2:
                                    if (n) {
                                      t.next = 4;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No document ID specified',
                                      })
                                    );
                                  case 4:
                                    return (
                                      (i = { siteId: e }),
                                      (r = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents/'
                                        )
                                        .concat(n, '/accessAttributes')
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o = this.apiClient.buildOptions('GET')),
                                      (t.next = 9),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 9:
                                    return t.abrupt('return', t.sent);
                                  case 10:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, e) {
                        return P.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'addDocumentAccessAttributes',
                    value:
                      ((D = a()(
                        s().mark(function t(e, n, i) {
                          var r, o, a;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (e) {
                                      t.next = 2;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No site ID specified',
                                      })
                                    );
                                  case 2:
                                    if (n) {
                                      t.next = 4;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No document ID specified',
                                      })
                                    );
                                  case 4:
                                    return (
                                      (r = { siteId: e }),
                                      (o = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents/'
                                        )
                                        .concat(n, '/accessAttributes')
                                        .concat(
                                          this.apiClient.buildQueryString(r)
                                        )),
                                      (a = this.apiClient.buildOptions(
                                        'POST',
                                        i
                                      )),
                                      (t.next = 9),
                                      this.apiClient.fetchAndRespond(o, a)
                                    );
                                  case 9:
                                    return t.abrupt('return', t.sent);
                                  case 10:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, e, n) {
                        return D.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'addDocumentAccessAttributes',
                    value:
                      ((x = a()(
                        s().mark(function t(e, n, i) {
                          var r, o, a;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (e) {
                                      t.next = 2;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No site ID specified',
                                      })
                                    );
                                  case 2:
                                    if (n) {
                                      t.next = 4;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No document ID specified',
                                      })
                                    );
                                  case 4:
                                    return (
                                      (r = { siteId: e }),
                                      (o = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents/'
                                        )
                                        .concat(n, '/accessAttributes')
                                        .concat(
                                          this.apiClient.buildQueryString(r)
                                        )),
                                      (a = this.apiClient.buildOptions(
                                        'PUT',
                                        i
                                      )),
                                      (t.next = 9),
                                      this.apiClient.fetchAndRespond(o, a)
                                    );
                                  case 9:
                                    return t.abrupt('return', t.sent);
                                  case 10:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, e, n) {
                        return x.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'deleteDocumentAccessAttributes',
                    value:
                      ((I = a()(
                        s().mark(function t(e, n) {
                          var i, r, o;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (e) {
                                      t.next = 2;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No site ID specified',
                                      })
                                    );
                                  case 2:
                                    if (n) {
                                      t.next = 4;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No document ID specified',
                                      })
                                    );
                                  case 4:
                                    return (
                                      (i = { siteId: e }),
                                      (r = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents/'
                                        )
                                        .concat(n, '/accessAttributes')
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o =
                                        this.apiClient.buildOptions('DELETE')),
                                      (t.next = 9),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 9:
                                    return t.abrupt('return', t.sent);
                                  case 10:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, e) {
                        return I.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getDocumentActions',
                    value:
                      ((U = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((n =
                                        a.length > 1 && void 0 !== a[1]
                                          ? a[1]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 3;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No document ID specified',
                                      })
                                    );
                                  case 3:
                                    return (
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents/'
                                        )
                                        .concat(e, '/actions')
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o = this.apiClient.buildOptions('GET')),
                                      (t.next = 9),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 9:
                                    return t.abrupt('return', t.sent);
                                  case 10:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return U.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'postDocumentActions',
                    value:
                      ((E = a()(
                        s().mark(function t(e, n) {
                          var i,
                            r,
                            o,
                            a,
                            u,
                            c = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((i =
                                        c.length > 2 && void 0 !== c[2]
                                          ? c[2]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 3;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No document ID specified',
                                      })
                                    );
                                  case 3:
                                    if (n) {
                                      t.next = 5;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No actions specified',
                                      })
                                    );
                                  case 5:
                                    return (
                                      (r = {}),
                                      i && (r.siteId = i),
                                      (o = { actions: n }),
                                      (a = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents/'
                                        )
                                        .concat(e, '/actions')
                                        .concat(
                                          this.apiClient.buildQueryString(r)
                                        )),
                                      (u = this.apiClient.buildOptions(
                                        'POST',
                                        o
                                      )),
                                      (t.next = 12),
                                      this.apiClient.fetchAndRespond(a, u)
                                    );
                                  case 12:
                                    return t.abrupt('return', t.sent);
                                  case 13:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, e) {
                        return E.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getSignedUrlForNewDocumentUpload',
                    value:
                      ((T = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (n =
                                        a.length > 1 && void 0 !== a[1]
                                          ? a[1]
                                          : null),
                                      (i = {}),
                                      n && (i.siteId = n),
                                      e && (i.path = e),
                                      (r = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents/upload'
                                        )
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o = this.apiClient.buildOptions('GET')),
                                      (t.next = 8),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 8:
                                    return t.abrupt('return', t.sent);
                                  case 9:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return T.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getSignedUrlForNewDocumentUploadWithBody',
                    value:
                      ((k = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a,
                            u = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (n =
                                        u.length > 1 && void 0 !== u[1]
                                          ? u[1]
                                          : null),
                                      (i =
                                        u.length > 2 && void 0 !== u[2]
                                          ? u[2]
                                          : null),
                                      (r = {}),
                                      n && (r.siteId = n),
                                      i && (r.contentLength = i),
                                      (o = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents/upload'
                                        )
                                        .concat(
                                          this.apiClient.buildQueryString(r)
                                        )),
                                      (a = this.apiClient.buildOptions(
                                        'POST',
                                        e
                                      )),
                                      (t.next = 9),
                                      this.apiClient.fetchAndRespond(o, a)
                                    );
                                  case 9:
                                    return t.abrupt('return', t.sent);
                                  case 10:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return k.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getSignedUrlForDocumentReplacementUpload',
                    value:
                      ((A = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a,
                            u,
                            c = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((n =
                                        c.length > 1 && void 0 !== c[1]
                                          ? c[1]
                                          : null),
                                      (i =
                                        c.length > 2 && void 0 !== c[2]
                                          ? c[2]
                                          : null),
                                      (r =
                                        c.length > 3 && void 0 !== c[3]
                                          ? c[3]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 5;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No document ID specified',
                                      })
                                    );
                                  case 5:
                                    return (
                                      (o = {}),
                                      i && (o.siteId = i),
                                      n && (o.path = n),
                                      r && (o.contentLength = r),
                                      (a = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents/'
                                        )
                                        .concat(e, '/upload')
                                        .concat(
                                          this.apiClient.buildQueryString(o)
                                        )),
                                      (u = this.apiClient.buildOptions('GET')),
                                      (t.next = 13),
                                      this.apiClient.fetchAndRespond(a, u)
                                    );
                                  case 13:
                                    return t.abrupt('return', t.sent);
                                  case 14:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return A.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'postDocumentCompress',
                    value:
                      ((S = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a,
                            u = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((n =
                                        u.length > 1 && void 0 !== u[1]
                                          ? u[1]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 3;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No document IDs specified',
                                      })
                                    );
                                  case 3:
                                    return (
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = { documentIds: e }),
                                      (o = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents/compress'
                                        )
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (a = this.apiClient.buildOptions(
                                        'POST',
                                        r
                                      )),
                                      (t.next = 10),
                                      this.apiClient.fetchAndRespond(o, a)
                                    );
                                  case 10:
                                    return t.abrupt('return', t.sent);
                                  case 11:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return S.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getUserActivities',
                    value:
                      ((b = a()(
                        s().mark(function t() {
                          var e,
                            n,
                            i,
                            r,
                            o,
                            a,
                            u,
                            c = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (e =
                                        c.length > 0 && void 0 !== c[0]
                                          ? c[0]
                                          : null),
                                      (n =
                                        c.length > 1 && void 0 !== c[1]
                                          ? c[1]
                                          : null),
                                      (i =
                                        c.length > 2 && void 0 !== c[2]
                                          ? c[2]
                                          : null),
                                      (r =
                                        c.length > 3 && void 0 !== c[3]
                                          ? c[3]
                                          : null),
                                      (o = {}),
                                      e && (o.userId = n),
                                      n && (o.siteId = n),
                                      i && i.length && (o.next = i),
                                      r && (o.limit = r),
                                      (a = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/userActivities'
                                        )
                                        .concat(
                                          this.apiClient.buildQueryString(o)
                                        )),
                                      (u = this.apiClient.buildOptions('GET')),
                                      (t.next = 13),
                                      this.apiClient.fetchAndRespond(a, u)
                                    );
                                  case 13:
                                    return t.abrupt('return', t.sent);
                                  case 14:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function () {
                        return b.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getDocumentUserActivities',
                    value:
                      ((w = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a,
                            u,
                            c = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((n =
                                        c.length > 1 && void 0 !== c[1]
                                          ? c[1]
                                          : null),
                                      (i =
                                        c.length > 2 && void 0 !== c[2]
                                          ? c[2]
                                          : null),
                                      (r =
                                        c.length > 3 && void 0 !== c[3]
                                          ? c[3]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 5;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No document ID specified',
                                      })
                                    );
                                  case 5:
                                    return (
                                      (o = {}),
                                      n && (o.siteId = n),
                                      i && i.length && (o.next = i),
                                      r && (o.limit = r),
                                      (a = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents/'
                                        )
                                        .concat(e, '/userActivities')
                                        .concat(
                                          this.apiClient.buildQueryString(o)
                                        )),
                                      (u = this.apiClient.buildOptions('GET')),
                                      (t.next = 13),
                                      this.apiClient.fetchAndRespond(a, u)
                                    );
                                  case 13:
                                    return t.abrupt('return', t.sent);
                                  case 14:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return w.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'editDocumentWithOnlyoffice',
                    value:
                      ((C = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((n =
                                        a.length > 1 && void 0 !== a[1]
                                          ? a[1]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 3;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No document ID specified',
                                      })
                                    );
                                  case 3:
                                    return (
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/onlyoffice/'
                                        )
                                        .concat(e, '/edit')
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o = this.apiClient.buildOptions('POST')),
                                      (t.next = 9),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 9:
                                    return t.abrupt('return', t.sent);
                                  case 10:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return C.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'createDocumentWithOnlyoffice',
                    value:
                      ((m = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a,
                            u,
                            c = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((n =
                                        c.length > 1 && void 0 !== c[1]
                                          ? c[1]
                                          : null),
                                      (i =
                                        c.length > 2 && void 0 !== c[2]
                                          ? c[2]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 4;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No extension specified',
                                      })
                                    );
                                  case 4:
                                    return (
                                      (r = {}),
                                      i && (r.siteId = i),
                                      n && (r.path = n),
                                      (o = { extension: e }),
                                      (a = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/onlyoffice/new'
                                        )
                                        .concat(
                                          this.apiClient.buildQueryString(r)
                                        )),
                                      (u = this.apiClient.buildOptions(
                                        'POST',
                                        o
                                      )),
                                      (t.next = 12),
                                      this.apiClient.fetchAndRespond(a, u)
                                    );
                                  case 12:
                                    return t.abrupt('return', t.sent);
                                  case 13:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return m.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'moveDocument',
                    value:
                      ((y = a()(
                        s().mark(function t(e, n) {
                          var i,
                            r,
                            o,
                            a,
                            u,
                            c = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (i =
                                        c.length > 2 && void 0 !== c[2]
                                          ? c[2]
                                          : null),
                                      (r = {}),
                                      i && (r.siteId = i),
                                      (o = { source: e, target: n }),
                                      (a = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/indices/folder/move'
                                        )
                                        .concat(
                                          this.apiClient.buildQueryString(r)
                                        )),
                                      (u = this.apiClient.buildOptions(
                                        'POST',
                                        o
                                      )),
                                      (t.next = 8),
                                      this.apiClient.fetchAndRespond(a, u)
                                    );
                                  case 8:
                                    return t.abrupt('return', t.sent);
                                  case 9:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, e) {
                        return y.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'createFolder',
                    value:
                      ((v = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a,
                            u = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (n =
                                        u.length > 1 && void 0 !== u[1]
                                          ? u[1]
                                          : null),
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = { path: e }),
                                      (o = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents'
                                        )
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (a = this.apiClient.buildOptions(
                                        'POST',
                                        r
                                      )),
                                      (t.next = 8),
                                      this.apiClient.fetchAndRespond(o, a)
                                    );
                                  case 8:
                                    return t.abrupt('return', t.sent);
                                  case 9:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return v.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'deleteFolder',
                    value:
                      ((g = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (n =
                                        a.length > 1 && void 0 !== a[1]
                                          ? a[1]
                                          : null),
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/indices/folder/'
                                        )
                                        .concat(e)
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o =
                                        this.apiClient.buildOptions('DELETE')),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return g.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getESignatureConfig',
                    value:
                      ((d = a()(
                        s().mark(function t() {
                          var e,
                            n,
                            i,
                            r,
                            o = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (e =
                                        o.length > 0 && void 0 !== o[0]
                                          ? o[0]
                                          : null),
                                      (n = {}),
                                      e && (n.siteId = e),
                                      (i = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/esignature/docusign/config'
                                        )
                                        .concat(
                                          this.apiClient.buildQueryString(n)
                                        )),
                                      (r = this.apiClient.buildOptions('GET')),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(i, r)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function () {
                        return d.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'setESignatureConfig',
                    value:
                      ((p = a()(
                        s().mark(function t() {
                          var e,
                            n,
                            i,
                            r,
                            o,
                            a,
                            u,
                            c,
                            l = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (e =
                                        l.length > 0 && void 0 !== l[0]
                                          ? l[0]
                                          : null),
                                      (n = l.length > 1 ? l[1] : void 0),
                                      (i = l.length > 2 ? l[2] : void 0),
                                      (r = l.length > 3 ? l[3] : void 0),
                                      (o = {}),
                                      e && (o.siteId = e),
                                      (a = {
                                        privateKey: n,
                                        userId: i,
                                        clientId: r,
                                      }),
                                      (u = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/esignature/docusign/config'
                                        )
                                        .concat(
                                          this.apiClient.buildQueryString(o)
                                        )),
                                      (c = this.apiClient.buildOptions(
                                        'PUT',
                                        a
                                      )),
                                      (t.next = 11),
                                      this.apiClient.fetchAndRespond(u, c)
                                    );
                                  case 11:
                                    return t.abrupt('return', t.sent);
                                  case 12:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function () {
                        return p.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'sendForDocusignESignature',
                    value:
                      ((f = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a,
                            u,
                            c,
                            l,
                            h,
                            f,
                            p = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((n =
                                        p.length > 1 && void 0 !== p[1]
                                          ? p[1]
                                          : null),
                                      (i =
                                        p.length > 2 && void 0 !== p[2]
                                          ? p[2]
                                          : ''),
                                      (r =
                                        p.length > 3 && void 0 !== p[3]
                                          ? p[3]
                                          : 'created'),
                                      (o =
                                        !(p.length > 4 && void 0 !== p[4]) ||
                                        p[4]),
                                      (a =
                                        p.length > 5 && void 0 !== p[5]
                                          ? p[5]
                                          : []),
                                      (u =
                                        p.length > 6 && void 0 !== p[6]
                                          ? p[6]
                                          : []),
                                      e)
                                    ) {
                                      t.next = 8;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No document ID specified',
                                      })
                                    );
                                  case 8:
                                    return (
                                      (c = {}),
                                      n && (c.siteId = n),
                                      (l = {
                                        status: r,
                                        developmentMode: o,
                                        emailSubject: i,
                                        signers: a,
                                      }),
                                      u.length && (l.carbonCopies = u),
                                      (h = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/esignature/docusign/'
                                        )
                                        .concat(e)
                                        .concat(
                                          this.apiClient.buildQueryString(c)
                                        )),
                                      (f = this.apiClient.buildOptions(
                                        'POST',
                                        l
                                      )),
                                      (t.next = 16),
                                      this.apiClient.fetchAndRespond(h, f)
                                    );
                                  case 16:
                                    return t.abrupt('return', t.sent);
                                  case 17:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return f.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'buildDocumentParametersForAddOrUpdate',
                    value: function (t, e, n, i) {
                      return new vt(t, e, n, i);
                    },
                  },
                  {
                    key: 'buildDocumentTagParametersForAdd',
                    value: function (t, e) {
                      return new yt(t, e);
                    },
                  },
                  {
                    key: 'getCases',
                    value:
                      ((l = a()(
                        s().mark(function t() {
                          var e,
                            n,
                            i,
                            r,
                            o,
                            a,
                            u = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (e =
                                        u.length > 0 && void 0 !== u[0]
                                          ? u[0]
                                          : null),
                                      (n =
                                        u.length > 1 && void 0 !== u[1]
                                          ? u[1]
                                          : null),
                                      (i =
                                        u.length > 2 && void 0 !== u[2]
                                          ? u[2]
                                          : null),
                                      (r = {}),
                                      e && (r.siteId = e),
                                      n && n.length && (r.next = n),
                                      i && (r.limit = i),
                                      (o = ''
                                        .concat(this.apiClient.host, '/cases')
                                        .concat(
                                          this.apiClient.buildQueryString(r)
                                        )),
                                      (a = this.apiClient.buildOptions('GET')),
                                      (t.next = 11),
                                      this.apiClient.fetchAndRespond(o, a)
                                    );
                                  case 11:
                                    return t.abrupt('return', t.sent);
                                  case 12:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function () {
                        return l.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'addCase',
                    value:
                      ((u = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (n =
                                        a.length > 1 && void 0 !== a[1]
                                          ? a[1]
                                          : null),
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(this.apiClient.host, '/cases')
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o = this.apiClient.buildOptions(
                                        'POST',
                                        e
                                      )),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return u.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getCase',
                    value:
                      ((o = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((n =
                                        a.length > 1 && void 0 !== a[1]
                                          ? a[1]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 3;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No case ID specified',
                                      })
                                    );
                                  case 3:
                                    return (
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(this.apiClient.host, '/cases/')
                                        .concat(e)
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o = this.apiClient.buildOptions('GET')),
                                      (t.next = 9),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 9:
                                    return t.abrupt('return', t.sent);
                                  case 10:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return o.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'deleteCase',
                    value:
                      ((r = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((n =
                                        a.length > 1 && void 0 !== a[1]
                                          ? a[1]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 3;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No case ID specified',
                                      })
                                    );
                                  case 3:
                                    return (
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(this.apiClient.host, '/cases/')
                                        .concat(e)
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o =
                                        this.apiClient.buildOptions('DELETE')),
                                      (t.next = 9),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 9:
                                    return t.abrupt('return', t.sent);
                                  case 10:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return r.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getCaseDocuments',
                    value:
                      ((i = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a,
                            u,
                            c = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((n =
                                        c.length > 1 && void 0 !== c[1]
                                          ? c[1]
                                          : null),
                                      (i =
                                        c.length > 2 && void 0 !== c[2]
                                          ? c[2]
                                          : null),
                                      (r =
                                        c.length > 3 && void 0 !== c[3]
                                          ? c[3]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 5;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No case ID specified',
                                      })
                                    );
                                  case 5:
                                    return (
                                      (o = {}),
                                      n && (o.siteId = n),
                                      i && i.length && (o.next = i),
                                      r && (o.limit = r),
                                      (a = ''
                                        .concat(this.apiClient.host, '/cases/')
                                        .concat(e, '/documents')
                                        .concat(
                                          this.apiClient.buildQueryString(o)
                                        )),
                                      (u = this.apiClient.buildOptions('GET')),
                                      (t.next = 13),
                                      this.apiClient.fetchAndRespond(a, u)
                                    );
                                  case 13:
                                    return t.abrupt('return', t.sent);
                                  case 14:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return i.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getCaseTasks',
                    value:
                      ((n = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a,
                            u,
                            c = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((n =
                                        c.length > 1 && void 0 !== c[1]
                                          ? c[1]
                                          : null),
                                      (i =
                                        c.length > 2 && void 0 !== c[2]
                                          ? c[2]
                                          : null),
                                      (r =
                                        c.length > 3 && void 0 !== c[3]
                                          ? c[3]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 5;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No case ID specified',
                                      })
                                    );
                                  case 5:
                                    return (
                                      (o = {}),
                                      n && (o.siteId = n),
                                      i && i.length && (o.next = i),
                                      r && (o.limit = r),
                                      (a = ''
                                        .concat(this.apiClient.host, '/cases/')
                                        .concat(e, '/tasks')
                                        .concat(
                                          this.apiClient.buildQueryString(o)
                                        )),
                                      (u = this.apiClient.buildOptions('GET')),
                                      (t.next = 13),
                                      this.apiClient.fetchAndRespond(a, u)
                                    );
                                  case 13:
                                    return t.abrupt('return', t.sent);
                                  case 14:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return n.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getCaseNigos',
                    value:
                      ((e = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a,
                            u,
                            c = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((n =
                                        c.length > 1 && void 0 !== c[1]
                                          ? c[1]
                                          : null),
                                      (i =
                                        c.length > 2 && void 0 !== c[2]
                                          ? c[2]
                                          : null),
                                      (r =
                                        c.length > 3 && void 0 !== c[3]
                                          ? c[3]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 5;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No case ID specified',
                                      })
                                    );
                                  case 5:
                                    return (
                                      (o = {}),
                                      n && (o.siteId = n),
                                      i && i.length && (o.next = i),
                                      r && (o.limit = r),
                                      (a = ''
                                        .concat(this.apiClient.host, '/cases/')
                                        .concat(e, '/nigos')
                                        .concat(
                                          this.apiClient.buildQueryString(o)
                                        )),
                                      (u = this.apiClient.buildOptions('GET')),
                                      (t.next = 13),
                                      this.apiClient.fetchAndRespond(a, u)
                                    );
                                  case 13:
                                    return t.abrupt('return', t.sent);
                                  case 14:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return e.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'instance',
                    get: function () {
                      return t.instance;
                    },
                    set: function (e) {
                      t.instance = e;
                    },
                  },
                ]),
                t
              );
            })(),
            vt = (function () {
              function t(e, n, i, r, s) {
                c()(this, t),
                  g()(this, 'documents', []),
                  e && (this.content = e),
                  n && (this.contentType = n),
                  i && (this.path = i),
                  r && (this.tags = r),
                  s && (this.actions = s);
              }
              return (
                h()(t, [
                  {
                    key: 'addChildDocument',
                    value: function (e, n, i, r, s) {
                      var o = new t(e, n, i, r, s);
                      this.documents.push(o);
                    },
                  },
                  {
                    key: 'addAttachment',
                    value: function (e, n) {
                      var i = new t(null, null, e, n);
                      this.documents.push(i);
                    },
                  },
                ]),
                t
              );
            })(),
            yt = function t(e, n) {
              c()(this, t), e && (this.key = e), n && (this.value = n);
            },
            mt = (function () {
              function t(e, n) {
                c()(this, t),
                  (this.apiClient = e || dt.instance),
                  (this.documentsApi = n || gt.instance);
              }
              var e, n;
              return (
                h()(t, [
                  {
                    key: 'checkWebFormsInDocument',
                    value: function () {
                      var t = this;
                      Array.from(document.getElementsByTagName('FORM'))
                        .filter(function (t) {
                          return t.classList.contains('fkq-form');
                        })
                        .forEach(function (e) {
                          e.setAttribute('action', 'JavaScript://'),
                            (e.onsubmit = function (e) {
                              t.submitFormkiqForm(e.target);
                            });
                        });
                    },
                  },
                  {
                    key: 'submitFormkiqForm',
                    value:
                      ((n = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a,
                            u,
                            c,
                            l,
                            h = this;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      ((n = {}).attachmentFields = []),
                                      (n.formFields = []),
                                      e.getAttribute('name') &&
                                        (n.formName = e.getAttribute('name')),
                                      (i = n.formName
                                        ? n.formName
                                        : 'Unknown Form'),
                                      onFormSubmitted && onFormSubmitted(i),
                                      e
                                        .querySelectorAll(
                                          'input, select, textarea'
                                        )
                                        .forEach(function (t) {
                                          var e;
                                          switch (t.tagName) {
                                            case 'INPUT':
                                              switch (t.type) {
                                                case 'button':
                                                case 'reset':
                                                case 'submit':
                                                  break;
                                                case 'checkbox':
                                                case 'radio':
                                                  var i = '';
                                                  t.getAttribute('name') &&
                                                    (i =
                                                      t.getAttribute('name'));
                                                  var r = -1;
                                                  if (
                                                    i &&
                                                    n.formFields.length
                                                  ) {
                                                    var s = n.formFields.filter(
                                                      function (t) {
                                                        return (
                                                          t.fieldName === i
                                                        );
                                                      }
                                                    );
                                                    s.length &&
                                                      (r = n.formFields.indexOf(
                                                        s[0]
                                                      ));
                                                  }
                                                  -1 === r
                                                    ? ((e = {}),
                                                      i && (e.fieldName = i),
                                                      'checkbox' === t.type
                                                        ? ((e.values = []),
                                                          t.checked &&
                                                            e.values.push(
                                                              t.value
                                                            ))
                                                        : t.checked &&
                                                          (e.value = t.value),
                                                      n.formFields.push(e))
                                                    : t.checked &&
                                                      ('checkbox' === t.type
                                                        ? n.formFields[
                                                            r
                                                          ].values.push(t.value)
                                                        : (n.formFields[
                                                            r
                                                          ].value = t.value));
                                                  break;
                                                case 'file':
                                                  var o = {};
                                                  t.getAttribute('name') &&
                                                    (o.fieldName =
                                                      t.getAttribute('name')),
                                                    t.value.length
                                                      ? (o.hasFile = !0)
                                                      : (o.hasFile = !1),
                                                    n.attachmentFields.push(o);
                                                  break;
                                                default:
                                                  (e = {}),
                                                    t.getAttribute('name') &&
                                                      (e.fieldName =
                                                        t.getAttribute('name')),
                                                    (e.value = t.value),
                                                    n.formFields.push(e);
                                              }
                                              break;
                                            case 'SELECT':
                                              if (
                                                ((e = {}),
                                                t.getAttribute('name') &&
                                                  (e.fieldName =
                                                    t.getAttribute('name')),
                                                t.multiple)
                                              ) {
                                                var a = Array.from(t.options);
                                                e.values = a
                                                  .filter(function (t) {
                                                    return t.selected;
                                                  })
                                                  .map(function (t) {
                                                    return t.value;
                                                  });
                                              } else
                                                e.value =
                                                  t.options[
                                                    t.selectedIndex
                                                  ].value;
                                              n.formFields.push(e);
                                              break;
                                            case 'TEXTAREA':
                                              (e = {}),
                                                t.getAttribute('name') &&
                                                  (e.fieldName =
                                                    t.getAttribute('name')),
                                                (e.value = t.value),
                                                n.formFields.push(e);
                                          }
                                        }),
                                      (r = JSON.stringify(n)),
                                      (o = []),
                                      n.formName &&
                                        o.push({
                                          key: 'webformName',
                                          value: JSON.stringify(
                                            n.formName
                                          ).replace(/\"/g, ''),
                                        }),
                                      (a = null),
                                      window.location.href &&
                                        (a = window.location.href),
                                      (u =
                                        this.documentsApi.buildDocumentParametersForAddOrUpdate(
                                          r,
                                          'application/json',
                                          a,
                                          o
                                        )),
                                      (c = Array.from(
                                        e.getElementsByTagName('INPUT')
                                      ).filter(function (t) {
                                        return 'file' === t.type;
                                      })).forEach(function (t) {
                                        if (t.value) {
                                          var e = t.value.replace(
                                            'C:\\fakepath\\',
                                            ''
                                          );
                                          u.addAttachment(e, [
                                            h.documentsApi.buildDocumentTagParametersForAdd(
                                              'fieldName',
                                              t.getAttribute('name')
                                            ),
                                          ]);
                                        }
                                      }),
                                      (t.next = 18),
                                      this.sendFormRequests(u, c)
                                    );
                                  case 18:
                                    (l = t.sent),
                                      onFormCompleted
                                        ? onFormCompleted(i, l)
                                        : (console.log(
                                            'no onFormCompleted function found for ${formNameForCallbacks}. Response below:'
                                          ),
                                          console.log(l));
                                  case 20:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return n.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'sendFormRequests',
                    value:
                      ((e = a()(
                        s().mark(function t(e, n) {
                          var i,
                            r = this;
                          return s().wrap(function (t) {
                            for (;;)
                              switch ((t.prev = t.next)) {
                                case 0:
                                  return (
                                    (i = {}),
                                    (t.next = 3),
                                    Promise.resolve(
                                      new Promise(function (t) {
                                        r.documentsApi
                                          .addDocumentUsingPublicPath(e)
                                          .then(function (e) {
                                            if (e.documentId)
                                              if (e.documents) {
                                                var s = [];
                                                e.documents
                                                  .filter(function (t) {
                                                    return t.uploadUrl;
                                                  })
                                                  .forEach(function (t, e) {
                                                    var i = n[e];
                                                    if (i && i.value) {
                                                      var o = i.files[0];
                                                      s.push(
                                                        new Promise(function (
                                                          e
                                                        ) {
                                                          r.apiClient
                                                            .uploadFile(
                                                              t.uploadUrl,
                                                              o
                                                            )
                                                            .then(function (t) {
                                                              e();
                                                            });
                                                        })
                                                      );
                                                    }
                                                  }),
                                                  s.length
                                                    ? Promise.all(s).then(
                                                        function () {
                                                          (i.success = !0),
                                                            (i.message =
                                                              'Form has been submitted and received, along with '.concat(
                                                                s.length,
                                                                ' attachments.'
                                                              )),
                                                            t();
                                                        }
                                                      )
                                                    : ((i.success = !0),
                                                      (i.message =
                                                        'Form has been submitted and received, but not all attachments were received successfully.'),
                                                      t());
                                              } else
                                                (i.success = !0),
                                                  (i.message =
                                                    'Form has been submitted and received.'),
                                                  t();
                                            else
                                              (i.success = !1),
                                                (i.message =
                                                  'Form failed to be processed successfully. Please try again later.'),
                                                t();
                                          });
                                      })
                                    )
                                  );
                                case 3:
                                  return t.abrupt('return', i);
                                case 4:
                                case 'end':
                                  return t.stop();
                              }
                          }, t);
                        })
                      )),
                      function (t, n) {
                        return e.apply(this, arguments);
                      }),
                  },
                ]),
                t
              );
            })(),
            Ct = (function () {
              function t(e) {
                c()(this, t),
                  (this.apiClient = e || dt.instance),
                  t.instance || (t.instance = this);
              }
              var e, n, i, r, o, u, l, f, p;
              return (
                h()(t, [
                  {
                    key: 'getConfiguration',
                    value:
                      ((p = a()(
                        s().mark(function t() {
                          var e,
                            n,
                            i,
                            r,
                            o = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (e =
                                        o.length > 0 && void 0 !== o[0]
                                          ? o[0]
                                          : null),
                                      (n = {}),
                                      e && (n.siteId = e),
                                      (i = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/configuration'
                                        )
                                        .concat(
                                          this.apiClient.buildQueryString(n)
                                        )),
                                      (r = this.apiClient.buildOptions('GET')),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(i, r)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function () {
                        return p.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getOpenPolicyAgentConfigurations',
                    value:
                      ((f = a()(
                        s().mark(function t() {
                          var e,
                            n,
                            i,
                            r,
                            o = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (e =
                                        o.length > 0 && void 0 !== o[0]
                                          ? o[0]
                                          : null),
                                      (n = {}),
                                      e && (n.siteId = e),
                                      (i = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/configuration/opa'
                                        )
                                        .concat(
                                          this.apiClient.buildQueryString(n)
                                        )),
                                      (r = this.apiClient.buildOptions('GET')),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(i, r)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function () {
                        return f.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getOpenPolicyAgentConfiguration',
                    value:
                      ((l = a()(
                        s().mark(function t() {
                          var e,
                            n,
                            i,
                            r,
                            o = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (e =
                                        o.length > 0 && void 0 !== o[0]
                                          ? o[0]
                                          : null),
                                      (n = {}),
                                      e && (n.siteId = e),
                                      (i = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/configuration/opa/'
                                        )
                                        .concat(e)
                                        .concat(
                                          this.apiClient.buildQueryString(n)
                                        )),
                                      (r = this.apiClient.buildOptions('GET')),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(i, r)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function () {
                        return l.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'configureOpenPolicyAgent',
                    value:
                      ((u = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (n =
                                        a.length > 1 && void 0 !== a[1]
                                          ? a[1]
                                          : null),
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/configuration/opa'
                                        )
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o = this.apiClient.buildOptions(
                                        'PUT',
                                        e
                                      )),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return u.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'deleteOpenPolicyAgent',
                    value:
                      ((o = a()(
                        s().mark(function t() {
                          var e,
                            n,
                            i,
                            r,
                            o = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (e =
                                        o.length > 0 && void 0 !== o[0]
                                          ? o[0]
                                          : null),
                                      (n = {}),
                                      e && (n.siteId = e),
                                      (i = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/configuration/opa/'
                                        )
                                        .concat(e)
                                        .concat(
                                          this.apiClient.buildQueryString(n)
                                        )),
                                      (r =
                                        this.apiClient.buildOptions('DELETE')),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(i, r)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function () {
                        return o.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'updateConfiguration',
                    value:
                      ((r = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (n =
                                        a.length > 1 && void 0 !== a[1]
                                          ? a[1]
                                          : null),
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/configuration'
                                        )
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o = this.apiClient.buildOptions(
                                        'PATCH',
                                        e
                                      )),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return r.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getApiKeys',
                    value:
                      ((i = a()(
                        s().mark(function t() {
                          var e,
                            n,
                            i,
                            r,
                            o = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (e =
                                        o.length > 0 && void 0 !== o[0]
                                          ? o[0]
                                          : null),
                                      (n = {}),
                                      e && (n.siteId = e),
                                      (i = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/configuration/apiKeys'
                                        )
                                        .concat(
                                          this.apiClient.buildQueryString(n)
                                        )),
                                      (r = this.apiClient.buildOptions('GET')),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(i, r)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function () {
                        return i.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'addApiKey',
                    value:
                      ((n = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (n =
                                        a.length > 1 && void 0 !== a[1]
                                          ? a[1]
                                          : null),
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/configuration/apiKeys'
                                        )
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o = this.apiClient.buildOptions(
                                        'POST',
                                        e
                                      )),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return n.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'deleteApiKey',
                    value:
                      ((e = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((n =
                                        a.length > 1 && void 0 !== a[1]
                                          ? a[1]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 3;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No API Key specified',
                                      })
                                    );
                                  case 3:
                                    return (
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/configuration/apiKeys/'
                                        )
                                        .concat(e)
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o =
                                        this.apiClient.buildOptions('DELETE')),
                                      (t.next = 9),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 9:
                                    return t.abrupt('return', t.sent);
                                  case 10:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return e.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'instance',
                    get: function () {
                      return t.instance;
                    },
                    set: function (e) {
                      t.instance = e;
                    },
                  },
                ]),
                t
              );
            })(),
            wt = (function () {
              function t(e) {
                c()(this, t),
                  (this.apiClient = e || dt.instance),
                  t.instance || (t.instance = this);
              }
              var e, n, i, r, o, u;
              return (
                h()(t, [
                  {
                    key: 'getPresets',
                    value:
                      ((u = a()(
                        s().mark(function t(e, n, i, r) {
                          var o, a, u;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (o = {}),
                                      e && (o.siteId = e),
                                      n && n.length && (o.previous = n),
                                      i && i.length && (o.next = i),
                                      r && (o.limit = r),
                                      (a = ''
                                        .concat(this.apiClient.host, '/presets')
                                        .concat(
                                          this.apiClient.buildQueryString(o)
                                        )),
                                      (u = this.apiClient.buildOptions('GET')),
                                      (t.next = 9),
                                      this.apiClient.fetchAndRespond(a, u)
                                    );
                                  case 9:
                                    return t.abrupt('return', t.sent);
                                  case 10:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, e, n, i) {
                        return u.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'addPreset',
                    value:
                      ((o = a()(
                        s().mark(function t(e, n) {
                          var i, r, o;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(this.apiClient.host, '/presets')
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o = this.apiClient.buildOptions(
                                        'POST',
                                        e
                                      )),
                                      (t.next = 6),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 6:
                                    return t.abrupt('return', t.sent);
                                  case 7:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, e) {
                        return o.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'deletePreset',
                    value:
                      ((r = a()(
                        s().mark(function t(e, n) {
                          var i, r, o;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (e) {
                                      t.next = 2;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No preset ID specified',
                                      })
                                    );
                                  case 2:
                                    return (
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/presets/'
                                        )
                                        .concat(e)
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o =
                                        this.apiClient.buildOptions('DELETE')),
                                      (t.next = 8),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 8:
                                    return t.abrupt('return', t.sent);
                                  case 9:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, e) {
                        return r.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getPresetTags',
                    value:
                      ((i = a()(
                        s().mark(function t(e) {
                          var n, i, r;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (e) {
                                      t.next = 2;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No preset ID specified',
                                      })
                                    );
                                  case 2:
                                    return (
                                      (n = {}),
                                      siteId && (n.siteId = siteId),
                                      (i = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/presets/'
                                        )
                                        .concat(e, '/tags')
                                        .concat(
                                          this.apiClient.buildQueryString(n)
                                        )),
                                      (r = this.apiClient.buildOptions('GET')),
                                      (t.next = 8),
                                      this.apiClient.fetchAndRespond(i, r)
                                    );
                                  case 8:
                                    return t.abrupt('return', t.sent);
                                  case 9:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return i.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'addPresetTag',
                    value:
                      ((n = a()(
                        s().mark(function t(e, n) {
                          var i, r, o;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (e) {
                                      t.next = 2;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No preset ID specified',
                                      })
                                    );
                                  case 2:
                                    return (
                                      (i = {}),
                                      siteId && (i.siteId = siteId),
                                      (r = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/presets/'
                                        )
                                        .concat(e, '/tags')
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o = this.apiClient.buildOptions(
                                        'POST',
                                        n
                                      )),
                                      (t.next = 8),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 8:
                                    return t.abrupt('return', t.sent);
                                  case 9:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, e) {
                        return n.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'deletePresetTag',
                    value:
                      ((e = a()(
                        s().mark(function t(e, n) {
                          var i, r, o;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (e) {
                                      t.next = 2;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No preset ID specified',
                                      })
                                    );
                                  case 2:
                                    if (n) {
                                      t.next = 4;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No tag key specified',
                                      })
                                    );
                                  case 4:
                                    return (
                                      (i = {}),
                                      siteId && (i.siteId = siteId),
                                      (r = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/presets/'
                                        )
                                        .concat(e, '/tags/')
                                        .concat(n)
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o =
                                        this.apiClient.buildOptions('DELETE')),
                                      (t.next = 10),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 10:
                                    return t.abrupt('return', t.sent);
                                  case 11:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, n) {
                        return e.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'buildPresetParametersForAdd',
                    value: function (t, e) {
                      return new bt(t, e);
                    },
                  },
                  {
                    key: 'buildPresetTagParametersForAdd',
                    value: function (t, e) {
                      return new St(t, e);
                    },
                  },
                  {
                    key: 'instance',
                    get: function () {
                      return t.instance;
                    },
                    set: function (e) {
                      t.instance = e;
                    },
                  },
                ]),
                t
              );
            })(),
            bt = function t(e, n) {
              c()(this, t), e && (this.name = e), n && (this.tags = n);
            },
            St = function t(e, n) {
              c()(this, t), e && (this.key = e), n && (this.value = n);
            },
            At = (function () {
              function t(e) {
                c()(this, t),
                  (this.apiClient = e || dt.instance),
                  t.instance || (t.instance = this);
              }
              var e, n, i;
              return (
                h()(t, [
                  {
                    key: 'search',
                    value:
                      ((i = a()(
                        s().mark(function t(e, n, i, r, o) {
                          var a, u, c;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (a = {}),
                                      n && (a.siteId = n),
                                      i && i.length && (a.previous = i),
                                      r && r.length && (a.next = r),
                                      o && (a.limit = o),
                                      (u = ''
                                        .concat(this.apiClient.host, '/search')
                                        .concat(
                                          this.apiClient.buildQueryString(a)
                                        )),
                                      (c = this.apiClient.buildOptions(
                                        'POST',
                                        e
                                      )),
                                      (t.next = 9),
                                      this.apiClient.fetchAndRespond(u, c)
                                    );
                                  case 9:
                                    return t.abrupt('return', t.sent);
                                  case 10:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, e, n, r, s) {
                        return i.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'searchFulltext',
                    value:
                      ((n = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a,
                            u = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (n =
                                        u.length > 1 && void 0 !== u[1]
                                          ? u[1]
                                          : null),
                                      (i =
                                        u.length > 2 && void 0 !== u[2]
                                          ? u[2]
                                          : null),
                                      (r = {}),
                                      n && (r.siteId = n),
                                      i && (r.limit = i),
                                      (o = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/searchFulltext'
                                        )
                                        .concat(
                                          this.apiClient.buildQueryString(r)
                                        )),
                                      (a = this.apiClient.buildOptions(
                                        'POST',
                                        e
                                      )),
                                      (t.next = 9),
                                      this.apiClient.fetchAndRespond(o, a)
                                    );
                                  case 9:
                                    return t.abrupt('return', t.sent);
                                  case 10:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return n.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'searchIndices',
                    value:
                      ((e = a()(
                        s().mark(function t(e, n, i, r, o) {
                          var a, u, c;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (a = {}),
                                      n && (a.siteId = n),
                                      i && i.length && (a.previous = i),
                                      r && r.length && (a.next = r),
                                      o && (a.limit = o),
                                      (u = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/indices/search'
                                        )
                                        .concat(
                                          this.apiClient.buildQueryString(a)
                                        )),
                                      (c = this.apiClient.buildOptions('POST', {
                                        indexType: e,
                                      })),
                                      (t.next = 9),
                                      this.apiClient.fetchAndRespond(u, c)
                                    );
                                  case 9:
                                    return t.abrupt('return', t.sent);
                                  case 10:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, n, i, r, s) {
                        return e.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'buildTagSearchParameters',
                    value: function (t, e, n) {
                      return new kt(t, e, n);
                    },
                  },
                  {
                    key: 'instance',
                    get: function () {
                      return t.instance;
                    },
                    set: function (e) {
                      t.instance = e;
                    },
                  },
                ]),
                t
              );
            })(),
            kt = function t(e, n, i) {
              c()(this, t);
              var r = { tag: {} };
              e && (r.tag.key = e),
                n ? (r.tag.beginsWith = n) : i && (r.tag.eq = i),
                (this.query = r);
            },
            Tt = (function () {
              function t(e) {
                c()(this, t),
                  (this.apiClient = e || dt.instance),
                  t.instance || (t.instance = this);
              }
              var e;
              return (
                h()(t, [
                  {
                    key: 'getSites',
                    value:
                      ((e = a()(
                        s().mark(function t(e) {
                          var n, i, r;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (n = {}),
                                      e && (n.siteId = e),
                                      (i = ''
                                        .concat(this.apiClient.host, '/sites')
                                        .concat(
                                          this.apiClient.buildQueryString(n)
                                        )),
                                      (r = this.apiClient.buildOptions('GET')),
                                      (t.next = 6),
                                      this.apiClient.fetchAndRespond(i, r)
                                    );
                                  case 6:
                                    return t.abrupt('return', t.sent);
                                  case 7:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return e.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'instance',
                    get: function () {
                      return t.instance;
                    },
                    set: function (e) {
                      t.instance = e;
                    },
                  },
                ]),
                t
              );
            })(),
            Et = (function () {
              function t(e) {
                c()(this, t),
                  (this.apiClient = e || dt.instance),
                  t.instance || (t.instance = this);
              }
              var e;
              return (
                h()(t, [
                  {
                    key: 'getVersion',
                    value:
                      ((e = a()(
                        s().mark(function t() {
                          var e, n;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (e = ''.concat(
                                        this.apiClient.host,
                                        '/version'
                                      )),
                                      (n = this.apiClient.buildOptions('GET')),
                                      (t.next = 4),
                                      this.apiClient.fetchAndRespond(e, n)
                                    );
                                  case 4:
                                    return t.abrupt('return', t.sent);
                                  case 5:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function () {
                        return e.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'instance',
                    get: function () {
                      return t.instance;
                    },
                    set: function (e) {
                      t.instance = e;
                    },
                  },
                ]),
                t
              );
            })(),
            Ut = (function () {
              function t(e) {
                c()(this, t),
                  (this.apiClient = e || dt.instance),
                  t.instance || (t.instance = this);
              }
              var e, n, i;
              return (
                h()(t, [
                  {
                    key: 'getWebhooks',
                    value:
                      ((i = a()(
                        s().mark(function t() {
                          var e,
                            n,
                            i,
                            r,
                            o = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (e =
                                        o.length > 0 && void 0 !== o[0]
                                          ? o[0]
                                          : null),
                                      (n = {}),
                                      e && (n.siteId = e),
                                      (i = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/webhooks'
                                        )
                                        .concat(
                                          this.apiClient.buildQueryString(n)
                                        )),
                                      (r = this.apiClient.buildOptions('GET')),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(i, r)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function () {
                        return i.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'addWebhook',
                    value:
                      ((n = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (n =
                                        a.length > 1 && void 0 !== a[1]
                                          ? a[1]
                                          : null),
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/webhooks'
                                        )
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o = this.apiClient.buildOptions(
                                        'POST',
                                        e
                                      )),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return n.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'deleteWebhook',
                    value:
                      ((e = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((n =
                                        a.length > 1 && void 0 !== a[1]
                                          ? a[1]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 3;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No webhook ID specified',
                                      })
                                    );
                                  case 3:
                                    return (
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/webhooks/'
                                        )
                                        .concat(e)
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o =
                                        this.apiClient.buildOptions('DELETE')),
                                      (t.next = 9),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 9:
                                    return t.abrupt('return', t.sent);
                                  case 10:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return e.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'instance',
                    get: function () {
                      return t.instance;
                    },
                    set: function (e) {
                      t.instance = e;
                    },
                  },
                ]),
                t
              );
            })(),
            It = (function () {
              function t(e) {
                c()(this, t),
                  (this.apiClient = e || dt.instance),
                  t.instance || (t.instance = this);
              }
              var e, n, i, r, o, u, l, f, p, d, g, v, y;
              return (
                h()(t, [
                  {
                    key: 'getWorkflows',
                    value:
                      ((y = a()(
                        s().mark(function t() {
                          var e,
                            n,
                            i,
                            r,
                            o = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (e =
                                        o.length > 0 && void 0 !== o[0]
                                          ? o[0]
                                          : null),
                                      (n = {}),
                                      e && (n.siteId = e),
                                      (i = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/workflows'
                                        )
                                        .concat(
                                          this.apiClient.buildQueryString(n)
                                        )),
                                      (r = this.apiClient.buildOptions('GET')),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(i, r)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function () {
                        return y.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getWorkflow',
                    value:
                      ((v = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (n =
                                        a.length > 1 && void 0 !== a[1]
                                          ? a[1]
                                          : null),
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/workflows/'
                                        )
                                        .concat(e)
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o = this.apiClient.buildOptions('GET')),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return v.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'addWorkflow',
                    value:
                      ((g = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (n =
                                        a.length > 1 && void 0 !== a[1]
                                          ? a[1]
                                          : null),
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/workflows'
                                        )
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o = this.apiClient.buildOptions(
                                        'POST',
                                        e
                                      )),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return g.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'putWorkflow',
                    value:
                      ((d = a()(
                        s().mark(function t(e, n) {
                          var i,
                            r,
                            o,
                            a,
                            u = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (i =
                                        u.length > 2 && void 0 !== u[2]
                                          ? u[2]
                                          : null),
                                      (r = {}),
                                      i && (r.siteId = i),
                                      (o = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/workflows/'
                                        )
                                        .concat(e)
                                        .concat(
                                          this.apiClient.buildQueryString(r)
                                        )),
                                      (a = this.apiClient.buildOptions(
                                        'PUT',
                                        n
                                      )),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(o, a)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, e) {
                        return d.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'deleteWorkflow',
                    value:
                      ((p = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((n =
                                        a.length > 1 && void 0 !== a[1]
                                          ? a[1]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 3;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No workflow ID specified',
                                      })
                                    );
                                  case 3:
                                    return (
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/workflows/'
                                        )
                                        .concat(e)
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o =
                                        this.apiClient.buildOptions('DELETE')),
                                      (t.next = 9),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 9:
                                    return t.abrupt('return', t.sent);
                                  case 10:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return p.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getQueues',
                    value:
                      ((f = a()(
                        s().mark(function t() {
                          var e,
                            n,
                            i,
                            r,
                            o = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (e =
                                        o.length > 0 && void 0 !== o[0]
                                          ? o[0]
                                          : null),
                                      (n = {}),
                                      e && (n.siteId = e),
                                      (i = ''
                                        .concat(this.apiClient.host, '/queues')
                                        .concat(
                                          this.apiClient.buildQueryString(n)
                                        )),
                                      (r = this.apiClient.buildOptions('GET')),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(i, r)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function () {
                        return f.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'addQueue',
                    value:
                      ((l = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (n =
                                        a.length > 1 && void 0 !== a[1]
                                          ? a[1]
                                          : null),
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(this.apiClient.host, '/queues')
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o = this.apiClient.buildOptions(
                                        'POST',
                                        e
                                      )),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return l.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getQueue',
                    value:
                      ((u = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((n =
                                        a.length > 1 && void 0 !== a[1]
                                          ? a[1]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 3;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No queue ID specified',
                                      })
                                    );
                                  case 3:
                                    return (
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(this.apiClient.host, '/queues/')
                                        .concat(e)
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o = this.apiClient.buildOptions('GET')),
                                      (t.next = 9),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 9:
                                    return t.abrupt('return', t.sent);
                                  case 10:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return u.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'deleteQueue',
                    value:
                      ((o = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((n =
                                        a.length > 1 && void 0 !== a[1]
                                          ? a[1]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 3;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No queue ID specified',
                                      })
                                    );
                                  case 3:
                                    return (
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(this.apiClient.host, '/queues/')
                                        .concat(e)
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o =
                                        this.apiClient.buildOptions('DELETE')),
                                      (t.next = 9),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 9:
                                    return t.abrupt('return', t.sent);
                                  case 10:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return o.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getDocumentsInQueue',
                    value:
                      ((r = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a,
                            u,
                            c,
                            l = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (n =
                                        l.length > 1 && void 0 !== l[1]
                                          ? l[1]
                                          : null),
                                      (i =
                                        l.length > 2 && void 0 !== l[2]
                                          ? l[2]
                                          : null),
                                      (r =
                                        l.length > 3 && void 0 !== l[3]
                                          ? l[3]
                                          : null),
                                      (o =
                                        l.length > 4 && void 0 !== l[4]
                                          ? l[4]
                                          : null),
                                      (a = {}),
                                      n && (a.siteId = n),
                                      o && o.length && (a.previous = o),
                                      r && r.length && (a.next = r),
                                      i && (a.limit = i),
                                      (u = ''
                                        .concat(this.apiClient.host, '/queues/')
                                        .concat(e, '/documents')
                                        .concat(
                                          this.apiClient.buildQueryString(a)
                                        )),
                                      (c = this.apiClient.buildOptions('GET')),
                                      (t.next = 13),
                                      this.apiClient.fetchAndRespond(u, c)
                                    );
                                  case 13:
                                    return t.abrupt('return', t.sent);
                                  case 14:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return r.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getWorkflowsInDocument',
                    value:
                      ((i = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a,
                            u,
                            c,
                            l = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (n =
                                        l.length > 1 && void 0 !== l[1]
                                          ? l[1]
                                          : null),
                                      (i =
                                        l.length > 2 && void 0 !== l[2]
                                          ? l[2]
                                          : null),
                                      (r =
                                        l.length > 3 && void 0 !== l[3]
                                          ? l[3]
                                          : null),
                                      (o =
                                        l.length > 4 && void 0 !== l[4]
                                          ? l[4]
                                          : null),
                                      (a = {}),
                                      n && (a.siteId = n),
                                      o && o.length && (a.previous = o),
                                      r && r.length && (a.next = r),
                                      i && (a.limit = i),
                                      (u = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents/'
                                        )
                                        .concat(e, '/workflows')
                                        .concat(
                                          this.apiClient.buildQueryString(a)
                                        )),
                                      (c = this.apiClient.buildOptions('GET')),
                                      (t.next = 13),
                                      this.apiClient.fetchAndRespond(u, c)
                                    );
                                  case 13:
                                    return t.abrupt('return', t.sent);
                                  case 14:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return i.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'addWorkflowToDocument',
                    value:
                      ((n = a()(
                        s().mark(function t(e, n) {
                          var i,
                            r,
                            o,
                            a,
                            u = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (i =
                                        u.length > 2 && void 0 !== u[2]
                                          ? u[2]
                                          : null),
                                      (r = {}),
                                      i && (r.siteId = i),
                                      (o = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents/'
                                        )
                                        .concat(e, '/workflows')
                                        .concat(
                                          this.apiClient.buildQueryString(r)
                                        )),
                                      (a = this.apiClient.buildOptions('POST', {
                                        workflowId: n,
                                      })),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(o, a)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, e) {
                        return n.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'addDecisionToDocumentWorkflow',
                    value:
                      ((e = a()(
                        s().mark(function t(e, n, i) {
                          var r,
                            o,
                            a,
                            u,
                            c = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (r =
                                        c.length > 3 && void 0 !== c[3]
                                          ? c[3]
                                          : null),
                                      (o = {}),
                                      r && (o.siteId = r),
                                      previous &&
                                        previous.length &&
                                        (o.previous = previous),
                                      next && next.length && (o.next = next),
                                      limit && (o.limit = limit),
                                      (a = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/documents/'
                                        )
                                        .concat(e, '/workflows/')
                                        .concat(n, '/decisions')
                                        .concat(
                                          this.apiClient.buildQueryString(o)
                                        )),
                                      (u = this.apiClient.buildOptions(
                                        'POST',
                                        i
                                      )),
                                      (t.next = 10),
                                      this.apiClient.fetchAndRespond(a, u)
                                    );
                                  case 10:
                                    return t.abrupt('return', t.sent);
                                  case 11:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, n, i) {
                        return e.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'instance',
                    get: function () {
                      return t.instance;
                    },
                    set: function (e) {
                      t.instance = e;
                    },
                  },
                ]),
                t
              );
            })(),
            xt = (function () {
              function t(e) {
                c()(this, t),
                  (this.apiClient = e || dt.instance),
                  t.instance || (t.instance = this);
              }
              var e, n, i, r, o, u, l, f, p, d;
              return (
                h()(t, [
                  {
                    key: 'getRulesets',
                    value:
                      ((d = a()(
                        s().mark(function t() {
                          var e,
                            n,
                            i,
                            r,
                            o,
                            a,
                            u = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (e =
                                        u.length > 0 && void 0 !== u[0]
                                          ? u[0]
                                          : null),
                                      (n =
                                        u.length > 1 && void 0 !== u[1]
                                          ? u[1]
                                          : null),
                                      (i =
                                        u.length > 2 && void 0 !== u[2]
                                          ? u[2]
                                          : null),
                                      (r = {}),
                                      e && (r.siteId = e),
                                      n && n.length && (r.next = n),
                                      i && (r.limit = i),
                                      (o = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/rulesets'
                                        )
                                        .concat(
                                          this.apiClient.buildQueryString(r)
                                        )),
                                      (a = this.apiClient.buildOptions('GET')),
                                      (t.next = 11),
                                      this.apiClient.fetchAndRespond(o, a)
                                    );
                                  case 11:
                                    return t.abrupt('return', t.sent);
                                  case 12:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function () {
                        return d.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getRuleset',
                    value:
                      ((p = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (n =
                                        a.length > 1 && void 0 !== a[1]
                                          ? a[1]
                                          : null),
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/rulesets/'
                                        )
                                        .concat(e)
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o = this.apiClient.buildOptions('GET')),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return p.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'addRuleset',
                    value:
                      ((f = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (n =
                                        a.length > 1 && void 0 !== a[1]
                                          ? a[1]
                                          : null),
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/rulesets'
                                        )
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o = this.apiClient.buildOptions(
                                        'POST',
                                        e
                                      )),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return f.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'patchRuleset',
                    value:
                      ((l = a()(
                        s().mark(function t(e, n) {
                          var i,
                            r,
                            o,
                            a,
                            u = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (i =
                                        u.length > 2 && void 0 !== u[2]
                                          ? u[2]
                                          : null),
                                      (r = {}),
                                      i && (r.siteId = i),
                                      (o = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/rulesets/'
                                        )
                                        .concat(e)
                                        .concat(
                                          this.apiClient.buildQueryString(r)
                                        )),
                                      (a = this.apiClient.buildOptions(
                                        'PATCH',
                                        n
                                      )),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(o, a)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, e) {
                        return l.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'deleteRuleset',
                    value:
                      ((u = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((n =
                                        a.length > 1 && void 0 !== a[1]
                                          ? a[1]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 3;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No ruleset ID specified',
                                      })
                                    );
                                  case 3:
                                    return (
                                      (i = {}),
                                      n && (i.siteId = n),
                                      (r = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/rulesets/'
                                        )
                                        .concat(e)
                                        .concat(
                                          this.apiClient.buildQueryString(i)
                                        )),
                                      (o =
                                        this.apiClient.buildOptions('DELETE')),
                                      (t.next = 9),
                                      this.apiClient.fetchAndRespond(r, o)
                                    );
                                  case 9:
                                    return t.abrupt('return', t.sent);
                                  case 10:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return u.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getRules',
                    value:
                      ((o = a()(
                        s().mark(function t(e) {
                          var n,
                            i,
                            r,
                            o,
                            a,
                            u,
                            c = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (n =
                                        c.length > 1 && void 0 !== c[1]
                                          ? c[1]
                                          : null),
                                      (i =
                                        c.length > 2 && void 0 !== c[2]
                                          ? c[2]
                                          : null),
                                      (r =
                                        c.length > 3 && void 0 !== c[3]
                                          ? c[3]
                                          : null),
                                      (o = {}),
                                      n && (o.siteId = n),
                                      i && i.length && (o.next = i),
                                      r && (o.limit = r),
                                      (a = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/rulesets/'
                                        )
                                        .concat(e, '/rules')
                                        .concat(
                                          this.apiClient.buildQueryString(o)
                                        )),
                                      (u = this.apiClient.buildOptions('GET')),
                                      (t.next = 11),
                                      this.apiClient.fetchAndRespond(a, u)
                                    );
                                  case 11:
                                    return t.abrupt('return', t.sent);
                                  case 12:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return o.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'addRule',
                    value:
                      ((r = a()(
                        s().mark(function t(e, n) {
                          var i,
                            r,
                            o,
                            a,
                            u = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (i =
                                        u.length > 2 && void 0 !== u[2]
                                          ? u[2]
                                          : null),
                                      (r = {}),
                                      i && (r.siteId = i),
                                      (o = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/rulesets/'
                                        )
                                        .concat(e, '/rules')
                                        .concat(
                                          this.apiClient.buildQueryString(r)
                                        )),
                                      (a = this.apiClient.buildOptions(
                                        'POST',
                                        n
                                      )),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(o, a)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, e) {
                        return r.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'getRule',
                    value:
                      ((i = a()(
                        s().mark(function t(e, n) {
                          var i,
                            r,
                            o,
                            a,
                            u = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (i =
                                        u.length > 2 && void 0 !== u[2]
                                          ? u[2]
                                          : null),
                                      (r = {}),
                                      i && (r.siteId = i),
                                      (o = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/rulesets/'
                                        )
                                        .concat(e, '/rules/')
                                        .concat(n)
                                        .concat(
                                          this.apiClient.buildQueryString(r)
                                        )),
                                      (a = this.apiClient.buildOptions('GET')),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(o, a)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, e) {
                        return i.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'patchRule',
                    value:
                      ((n = a()(
                        s().mark(function t(e, n, i) {
                          var r,
                            o,
                            a,
                            u,
                            c = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (r =
                                        c.length > 3 && void 0 !== c[3]
                                          ? c[3]
                                          : null),
                                      (o = {}),
                                      r && (o.siteId = r),
                                      (a = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/rulesets/'
                                        )
                                        .concat(e, '/rules/')
                                        .concat(n)
                                        .concat(
                                          this.apiClient.buildQueryString(o)
                                        )),
                                      (u = this.apiClient.buildOptions(
                                        'PATCH',
                                        i
                                      )),
                                      (t.next = 7),
                                      this.apiClient.fetchAndRespond(a, u)
                                    );
                                  case 7:
                                    return t.abrupt('return', t.sent);
                                  case 8:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, e, i) {
                        return n.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'deleteRule',
                    value:
                      ((e = a()(
                        s().mark(function t(e, n) {
                          var i,
                            r,
                            o,
                            a,
                            u = arguments;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      ((i =
                                        u.length > 2 && void 0 !== u[2]
                                          ? u[2]
                                          : null),
                                      e)
                                    ) {
                                      t.next = 3;
                                      break;
                                    }
                                    return t.abrupt(
                                      'return',
                                      JSON.stringify({
                                        message: 'No ruleset ID specified',
                                      })
                                    );
                                  case 3:
                                    return (
                                      (r = {}),
                                      i && (r.siteId = i),
                                      (o = ''
                                        .concat(
                                          this.apiClient.host,
                                          '/rulesets/'
                                        )
                                        .concat(e, '/rules/')
                                        .concat(n)
                                        .concat(
                                          this.apiClient.buildQueryString(r)
                                        )),
                                      (a =
                                        this.apiClient.buildOptions('DELETE')),
                                      (t.next = 9),
                                      this.apiClient.fetchAndRespond(o, a)
                                    );
                                  case 9:
                                    return t.abrupt('return', t.sent);
                                  case 10:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, n) {
                        return e.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'instance',
                    get: function () {
                      return t.instance;
                    },
                    set: function (e) {
                      t.instance = e;
                    },
                  },
                ]),
                t
              );
            })(),
            Dt = (function () {
              function t(e, n, i) {
                c()(this, t),
                  (this.apiClient = new dt(e, n, i)),
                  (this.configurationApi = new Ct()),
                  (this.documentsApi = new gt()),
                  (this.presetsApi = new wt()),
                  (this.searchApi = new At()),
                  (this.sitesApi = new Tt()),
                  (this.versionApi = new Et()),
                  (this.webhooksApi = new Ut()),
                  (this.workflowsApi = new It()),
                  (this.rulesetsApi = new xt()),
                  (this.webFormsHandler = new mt()),
                  this.webFormsHandler.checkWebFormsInDocument();
              }
              var e, n;
              return (
                h()(t, [
                  {
                    key: 'login',
                    value:
                      ((n = a()(
                        s().mark(function t(e, n) {
                          var i;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (!this.apiClient.cognitoClient) {
                                      t.next = 16;
                                      break;
                                    }
                                    return (
                                      (t.next = 3),
                                      this.apiClient.cognitoClient.login(e, n)
                                    );
                                  case 3:
                                    return (
                                      (i = t.sent),
                                      (this.configurationApi.apiClient.cognitoClient =
                                        this.apiClient.cognitoClient),
                                      (this.documentsApi.apiClient.cognitoClient =
                                        this.apiClient.cognitoClient),
                                      (this.presetsApi.apiClient.cognitoClient =
                                        this.apiClient.cognitoClient),
                                      (this.searchApi.apiClient.cognitoClient =
                                        this.apiClient.cognitoClient),
                                      (this.sitesApi.apiClient.cognitoClient =
                                        this.apiClient.cognitoClient),
                                      (this.versionApi.apiClient.cognitoClient =
                                        this.apiClient.cognitoClient),
                                      (this.webhooksApi.apiClient.cognitoClient =
                                        this.apiClient.cognitoClient),
                                      (this.workflowsApi.apiClient.cognitoClient =
                                        this.apiClient.cognitoClient),
                                      (this.rulesetsApi.apiClient.cognitoClient =
                                        this.apiClient.cognitoClient),
                                      t.abrupt('return', i)
                                    );
                                  case 16:
                                    return t.abrupt('return', {
                                      message:
                                        'No authentication client (e.g., Cognito) has been initialized.',
                                    });
                                  case 17:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t, e) {
                        return n.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'logout',
                    value:
                      ((e = a()(
                        s().mark(function t() {
                          var e;
                          return s().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (t.next = 2), this.apiClient.logout()
                                    );
                                  case 2:
                                    return (
                                      (e = t.sent),
                                      (this.configurationApi.apiClient.cognitoClient =
                                        this.apiClient.cognitoClient),
                                      (this.documentsApi.apiClient.cognitoClient =
                                        this.apiClient.cognitoClient),
                                      (this.presetsApi.apiClient.cognitoClient =
                                        this.apiClient.cognitoClient),
                                      (this.searchApi.apiClient.cognitoClient =
                                        this.apiClient.cognitoClient),
                                      (this.sitesApi.apiClient.cognitoClient =
                                        this.apiClient.cognitoClient),
                                      (this.versionApi.apiClient.cognitoClient =
                                        this.apiClient.cognitoClient),
                                      (this.webhooksApi.apiClient.cognitoClient =
                                        this.apiClient.cognitoClient),
                                      (this.workflowsApi.apiClient.cognitoClient =
                                        this.apiClient.cognitoClient),
                                      (this.rulesetsApi.apiClient.cognitoClient =
                                        this.apiClient.cognitoClient),
                                      t.abrupt('return', e)
                                    );
                                  case 13:
                                  case 'end':
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function () {
                        return e.apply(this, arguments);
                      }),
                  },
                  {
                    key: 'resetClient',
                    value: function (t, e, n) {
                      (this.apiClient = new dt(t, e, n)),
                        (this.configurationApi.apiClient = this.apiClient),
                        (this.documentsApi.apiClient = this.apiClient),
                        (this.presetsApi.apiClient = this.apiClient),
                        (this.searchApi.apiClient = this.apiClient),
                        (this.sitesApi.apiClient = this.apiClient),
                        (this.versionApi.apiClient = this.apiClient),
                        (this.webhooksApi.apiClient = this.apiClient),
                        (this.workflowsApi.apiClient = this.apiClient),
                        (this.rulesetsApi.apiClient = this.apiClient);
                    },
                  },
                  {
                    key: 'rebuildCognitoClient',
                    value: function (t, e, n, i) {
                      (this.apiClient.cognitoClient.username = t),
                        (this.apiClient.cognitoClient.idToken = e),
                        (this.apiClient.cognitoClient.accessToken = n),
                        (this.apiClient.cognitoClient.refreshToken = i),
                        (this.configurationApi.apiClient.cognitoClient =
                          this.apiClient.cognitoClient),
                        (this.documentsApi.apiClient.cognitoClient =
                          this.apiClient.cognitoClient),
                        (this.presetsApi.apiClient.cognitoClient =
                          this.apiClient.cognitoClient),
                        (this.searchApi.apiClient.cognitoClient =
                          this.apiClient.cognitoClient),
                        (this.sitesApi.apiClient.cognitoClient =
                          this.apiClient.cognitoClient),
                        (this.versionApi.apiClient.cognitoClient =
                          this.apiClient.cognitoClient),
                        (this.webhooksApi.apiClient.cognitoClient =
                          this.apiClient.cognitoClient),
                        (this.workflowsApi.apiClient.cognitoClient =
                          this.apiClient.cognitoClient),
                        (this.rulesetsApi.apiClient.cognitoClient =
                          this.apiClient.cognitoClient);
                    },
                  },
                ]),
                t
              );
            })();
        },
        772: (t, e, n) => {
          'use strict';
          function i(t, e) {
            return (
              (e = e || {}),
              new Promise(function (n, i) {
                var r = new XMLHttpRequest(),
                  s = [],
                  o = [],
                  a = {},
                  u = function () {
                    return {
                      ok: 2 == ((r.status / 100) | 0),
                      statusText: r.statusText,
                      status: r.status,
                      url: r.responseURL,
                      text: function () {
                        return Promise.resolve(r.responseText);
                      },
                      json: function () {
                        return Promise.resolve(JSON.parse(r.responseText));
                      },
                      blob: function () {
                        return Promise.resolve(new Blob([r.response]));
                      },
                      clone: u,
                      headers: {
                        keys: function () {
                          return s;
                        },
                        entries: function () {
                          return o;
                        },
                        get: function (t) {
                          return a[t.toLowerCase()];
                        },
                        has: function (t) {
                          return t.toLowerCase() in a;
                        },
                      },
                    };
                  };
                for (var c in (r.open(e.method || 'get', t, !0),
                (r.onload = function () {
                  r
                    .getAllResponseHeaders()
                    .replace(
                      /^(.*?):[^\S\n]*([\s\S]*?)$/gm,
                      function (t, e, n) {
                        s.push((e = e.toLowerCase())),
                          o.push([e, n]),
                          (a[e] = a[e] ? a[e] + ',' + n : n);
                      }
                    ),
                    n(u());
                }),
                (r.onerror = i),
                (r.withCredentials = 'include' == e.credentials),
                e.headers))
                  r.setRequestHeader(c, e.headers[c]);
                r.send(e.body || null);
              })
            );
          }
          n.r(e), n.d(e, { default: () => i });
        },
        906: () => {},
      },
      e = {};
    function n(i) {
      if (e[i]) return e[i].exports;
      var r = (e[i] = { id: i, loaded: !1, exports: {} });
      return t[i](r, r.exports, n), (r.loaded = !0), r.exports;
    }
    return (
      (n.n = (t) => {
        var e = t && t.__esModule ? () => t.default : () => t;
        return n.d(e, { a: e }), e;
      }),
      (n.d = (t, e) => {
        for (var i in e)
          n.o(e, i) &&
            !n.o(t, i) &&
            Object.defineProperty(t, i, { enumerable: !0, get: e[i] });
      }),
      (n.g = (function () {
        if ('object' == typeof globalThis) return globalThis;
        try {
          return this || new Function('return this')();
        } catch (t) {
          if ('object' == typeof window) return window;
        }
      })()),
      (n.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e)),
      (n.r = (t) => {
        'undefined' != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(t, Symbol.toStringTag, { value: 'Module' }),
          Object.defineProperty(t, '__esModule', { value: !0 });
      }),
      (n.nmd = (t) => ((t.paths = []), t.children || (t.children = []), t)),
      n(63)
    );
  })().FormkiqClient;
});
//# sourceMappingURL=formkiq-client-sdk-es6.js.map
