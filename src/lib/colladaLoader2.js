var THREE = require('three');

THREE.ColladaLoader = function(a) {
        this.manager = void 0 !== a ? a : THREE.DefaultLoadingManager
    };
    THREE.ColladaLoader.prototype = {
        constructor: THREE.ColladaLoader,
        load: function(a, b, c, d) {
            function e(a) {
                var b = a.split("/");
                return b.pop(), (b.length < 1 ? "." : b.join("/")) + "/"
            }
            var f = this,
                g = new THREE.XHRLoader(f.manager);
            g.load(a, function(c) {
                b(f.parse(c, e(a)))
            }, c, d)
        },
        options: {set convertUpAxis(a) {
                console.log("ColladaLoder.options.convertUpAxis: TODO")
            }
        },
        setCrossOrigin: function(a) {
            this.crossOrigin = a
        },
        parse: function(a, b) {
            function c(a, b) {
                for (var c = [], d = a.childNodes, e = 0, f = d.length; e < f; e++) {
                    var g = d[e];
                    g.nodeName === b && c.push(g)
                }
                return c
            }

            function d(a) {
                if (0 === a.length) return [];
                for (var b = a.trim().split(/\s+/), c = new Array(b.length), d = 0, e = b.length; d < e; d++) c[d] = parseFloat(b[d]);
                return c
            }

            function e(a) {
                if (0 === a.length) return [];
                for (var b = a.trim().split(/\s+/), c = new Array(b.length), d = 0, e = b.length; d < e; d++) c[d] = parseInt(b[d]);
                return c
            }

            function f(a) {
                return a.substring(1)
            }

            function g(a) {
                return {
                    unit: h(c(a, "unit")[0]),
                    upAxis: i(c(a, "up_axis")[0])
                }
            }

            function h(a) {
                return void 0 !== a ? parseFloat(a.getAttribute("meter")) : 1
            }

            function i(a) {
                return void 0 !== a ? a.textContent : "Y_UP"
            }

            function j(a, b, d, e) {
                var f = c(a, b)[0];
                if (void 0 !== f)
                    for (var g = c(f, d), h = 0; h < g.length; h++) e(g[h])
            }

            function k(a, b) {
                for (var c in a) {
                    var d = a[c];
                    d.build = b(a[c])
                }
            }

            function l(a, b) {
                return void 0 !== a.build ? a.build : (a.build = b(a), a.build)
            }

            function n(a) {
                var b = {
                    init_from: c(a, "init_from")[0].textContent
                };
                ma.images[a.getAttribute("id")] = b
            }

            function o(a) {
                if (void 0 !== a.build) return a.build;
                var c = a.init_from;
                return void 0 !== b && (c = b + c), m.load(c)
            }

            function p(a) {
                return l(ma.images[a], o)
            }

            function q(a) {
                for (var b = {}, c = 0, d = a.childNodes.length; c < d; c++) {
                    var e = a.childNodes[c];
                    if (1 === e.nodeType) switch (e.nodeName) {
                        case "profile_COMMON":
                            b.profile = r(e)
                    }
                }
                ma.effects[a.getAttribute("id")] = b
            }

            function r(a) {
                for (var b = {
                        surfaces: {},
                        samplers: {}
                    }, c = 0, d = a.childNodes.length; c < d; c++) {
                    var e = a.childNodes[c];
                    if (1 === e.nodeType) switch (e.nodeName) {
                        case "newparam":
                            s(e, b);
                            break;
                        case "technique":
                            b.technique = v(e)
                    }
                }
                return b
            }

            function s(a, b) {
                for (var c = a.getAttribute("sid"), d = 0, e = a.childNodes.length; d < e; d++) {
                    var f = a.childNodes[d];
                    if (1 === f.nodeType) switch (f.nodeName) {
                        case "surface":
                            b.surfaces[c] = t(f);
                            break;
                        case "sampler2D":
                            b.samplers[c] = u(f)
                    }
                }
            }

            function t(a) {
                for (var b = {}, c = 0, d = a.childNodes.length; c < d; c++) {
                    var e = a.childNodes[c];
                    if (1 === e.nodeType) switch (e.nodeName) {
                        case "init_from":
                            b.init_from = e.textContent
                    }
                }
                return b
            }

            function u(a) {
                for (var b = {}, c = 0, d = a.childNodes.length; c < d; c++) {
                    var e = a.childNodes[c];
                    if (1 === e.nodeType) switch (e.nodeName) {
                        case "source":
                            b.source = e.textContent
                    }
                }
                return b
            }

            function v(a) {
                for (var b = {}, c = 0, d = a.childNodes.length; c < d; c++) {
                    var e = a.childNodes[c];
                    if (1 === e.nodeType) switch (e.nodeName) {
                        case "constant":
                        case "lambert":
                        case "blinn":
                        case "phong":
                            b.type = e.nodeName; b.parameters = w(e);
                    }
                }
                return b
            }

            function w(a) {
                for (var b = {}, c = 0, d = a.childNodes.length; c < d; c++) {
                    var e = a.childNodes[c];
                    if (1 === e.nodeType) switch (e.nodeName) {
                        case "emission":
                        case "diffuse":
                        case "specular":
                        case "shininess":
                        case "transparency":
                            b[e.nodeName] = x(e)
                    }
                }
                return b
            }

            function x(a) {
                for (var b = {}, c = 0, e = a.childNodes.length; c < e; c++) {
                    var f = a.childNodes[c];
                    if (1 === f.nodeType) switch (f.nodeName) {
                        case "color":
                            b[f.nodeName] = d(f.textContent);
                            break;
                        case "float":
                            b[f.nodeName] = parseFloat(f.textContent);
                            break;
                        case "texture":
                            b[f.nodeName] = {
                                id: f.getAttribute("texture"),
                                extra: y(f)
                            }
                    }
                }
                return b
            }

            function y(a) {
                for (var b = {}, c = 0, d = a.childNodes.length; c < d; c++) {
                    var e = a.childNodes[c];
                    if (1 === e.nodeType) switch (e.nodeName) {
                        case "extra":
                            b = z(e)
                    }
                }
                return b
            }

            function z(a) {
                for (var b = {}, c = 0, d = a.childNodes.length; c < d; c++) {
                    var e = a.childNodes[c];
                    if (1 === e.nodeType) switch (e.nodeName) {
                        case "technique":
                            b[e.nodeName] = A(e)
                    }
                }
                return b
            }

            function A(a) {
                for (var b = {}, c = 0, d = a.childNodes.length; c < d; c++) {
                    var e = a.childNodes[c];
                    if (1 === e.nodeType) switch (e.nodeName) {
                        case "repeatU":
                        case "repeatV":
                        case "offsetU":
                        case "offsetV":
                            b[e.nodeName] = parseFloat(e.textContent);
                            break;
                        case "wrapU":
                        case "wrapV":
                            b[e.nodeName] = parseInt(e.textContent)
                    }
                }
                return b
            }

            function B(a) {
                return a
            }

            function C(a) {
                return l(ma.effects[a], B)
            }

            function D(a) {
                for (var b = {
                        name: a.getAttribute("name")
                    }, c = 0, d = a.childNodes.length; c < d; c++) {
                    var e = a.childNodes[c];
                    if (1 === e.nodeType) switch (e.nodeName) {
                        case "instance_effect":
                            b.url = f(e.getAttribute("url"))
                    }
                }
                ma.materials[a.getAttribute("id")] = b
            }

            function E(a) {
                function e(a) {
                    var c = b.profile.samplers[a.id];
                    if (void 0 !== c) {
                        var d = b.profile.surfaces[c.source],
                            e = new THREE.Texture(p(d.init_from)),
                            f = a.extra;
                        if (void 0 !== f && void 0 !== f.technique) {
                            var g = f.technique;
                            e.wrapS = g.wrapU ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
                            e.wrapT = g.wrapV ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
                            e.offset.set(g.offsetU, g.offsetV); e.repeat.set(g.repeatU, g.repeatV);
                        } else e.wrapS = THREE.RepeatWrapping; e.wrapT = THREE.RepeatWrapping;
                        return e.needsUpdate = !0, e
                    }
                   
                  //  return console.error("ColladaLoder: Undefined sampler", a.id), null
                  return null;
                }
                var d, b = C(a.url),
                    c = b.profile.technique;
                switch (c.type) {
                    case "phong":
                    case "blinn":
                        d = new THREE.MeshPhongMaterial;
                        break;
                    case "lambert":
                        d = new THREE.MeshLambertMaterial;
                        break;
                    default:
                        d = new THREE.MeshBasicMaterial
                }
                d.name = a.name;
                var f = c.parameters;
                for (var g in f) {
                    var h = f[g];
                    switch (g) {
                        case "diffuse":
                            h.color && d.color.fromArray(h.color); h.texture && (d.map = e(h.texture));
                            break;
                        case "specular":
                            h.color && d.specular && d.specular.fromArray(h.color);
                            break;
                        case "shininess":
                            h.float && d.shininess && (d.shininess = h.float);
                            break;
                        case "emission":
                            h.color && d.emissive && d.emissive.fromArray(h.color);
                            break;
                        case "transparency":
                            h.float && (d.opacity = h.float); 1 !== h.float && (d.transparent = !0);
                    }
                }
                return d
            }

            function F(a) {
                return l(ma.materials[a], E)
            }

            function G(a) {
                for (var b = {
                        name: a.getAttribute("name")
                    }, c = 0, d = a.childNodes.length; c < d; c++) {
                    var e = a.childNodes[c];
                    if (1 === e.nodeType) switch (e.nodeName) {
                        case "optics":
                            b.optics = H(e)
                    }
                }
                ma.cameras[a.getAttribute("id")] = b
            }

            function H(a) {
                for (var b = 0; b < a.childNodes.length; b++) {
                    var c = a.childNodes[b];
                    switch (c.nodeName) {
                        case "technique_common":
                            return I(c)
                    }
                }
                return {}
            }

            function I(a) {
                for (var b = {}, c = 0; c < a.childNodes.length; c++) {
                    var d = a.childNodes[c];
                    switch (d.nodeName) {
                        case "perspective":
                        case "orthographic":
                            b.technique = d.nodeName; b.parameters = J(d)
                    }
                }
                return b
            }

            function J(a) {
                for (var b = {}, c = 0; c < a.childNodes.length; c++) {
                    var d = a.childNodes[c];
                    switch (d.nodeName) {
                        case "xfov":
                        case "yfov":
                        case "xmag":
                        case "ymag":
                        case "znear":
                        case "zfar":
                        case "aspect_ratio":
                            b[d.nodeName] = parseFloat(d.textContent)
                    }
                }
                return b
            }

            function K(a) {
                var b;
                switch (a.optics.technique) {
                    case "perspective":
                        b = new THREE.PerspectiveCamera(a.optics.parameters.yfov, a.optics.parameters.aspect_ratio, a.optics.parameters.znear, a.optics.parameters.zfar);
                        break;
                    case "orthographic":
                        b = new THREE.OrthographicCamera;
                        break;
                    default:
                        b = new THREE.PerspectiveCamera
                }
                return b.name = a.name, b
            }

            function L(a) {
                return l(ma.cameras[a], K)
            }

            function M(a) {
                for (var b = {}, c = 0, d = a.childNodes.length; c < d; c++) {
                    var e = a.childNodes[c];
                    if (1 === e.nodeType) switch (e.nodeName) {
                        case "technique_common":
                            b = N(e)
                    }
                }
                ma.lights[a.getAttribute("id")] = b
            }

            function N(a) {
                for (var b = {}, c = 0, d = a.childNodes.length; c < d; c++) {
                    var e = a.childNodes[c];
                    if (1 === e.nodeType) switch (e.nodeName) {
                        case "directional":
                        case "point":
                        case "spot":
                        case "ambient":
                            b.technique = e.nodeName; b.parameters = O(e)
                    }
                }
                return b
            }

            function O(a) {
                for (var b = {}, c = 0, e = a.childNodes.length; c < e; c++) {
                    var f = a.childNodes[c];
                    if (1 === f.nodeType) switch (f.nodeName) {
                        case "color":
                            var g = d(f.textContent);
                            b.color = (new THREE.Color).fromArray(g);
                            break;
                        case "falloff_angle":
                            b.falloffAngle = parseFloat(f.textContent);
                            break;
                        case "quadratic_attenuation":
                            var h = parseFloat(f.textContent);
                            b.distance = h ? Math.sqrt(1 / h) : 0
                    }
                }
                return b
            }

            function P(a) {
                var b;
                switch (a.technique) {
                    case "directional":
                        b = new THREE.DirectionalLight;
                        break;
                    case "point":
                        b = new THREE.PointLight;
                        break;
                    case "spot":
                        b = new THREE.SpotLight;
                        break;
                    case "ambient":
                        b = new THREE.AmbientLight
                }
                return a.parameters.color && b.color.copy(a.parameters.color), a.parameters.distance && (b.distance = a.parameters.distance), b
            }

            function Q(a) {
                return l(ma.lights[a], P)
            }

            function R(a) {
                for (var b = {
                        name: a.getAttribute("name"),
                        sources: {},
                        vertices: {},
                        primitives: []
                    }, d = c(a, "mesh")[0], e = 0; e < d.childNodes.length; e++) {
                    var f = d.childNodes[e];
                    if (1 === f.nodeType) {
                        var g = f.getAttribute("id");
                        switch (f.nodeName) {
                            case "source":
                                b.sources[g] = S(f);
                                break;
                            case "vertices":
                                b.vertices = T(f);
                                break;
                            case "polygons":
                                console.log("ColladaLoader: Unsupported primitive type: ", f.nodeName);
                                break;
                            case "lines":
                            case "linestrips":
                            case "polylist":
                            case "triangles":
                                b.primitives.push(U(f));
                                break;
                            default:
                                console.log(f)
                        }
                    }
                }
                ma.geometries[a.getAttribute("id")] = b
            }

            function S(a) {
                for (var b = {
                        array: [],
                        stride: 3
                    }, e = 0; e < a.childNodes.length; e++) {
                    var f = a.childNodes[e];
                    if (1 === f.nodeType) switch (f.nodeName) {
                        case "float_array":
                            b.array = d(f.textContent);
                            break;
                        case "technique_common":
                            var g = c(f, "accessor")[0];
                            void 0 !== g && (b.stride = parseInt(g.getAttribute("stride")));
                            break;
                        default:
                            console.log(f)
                    }
                }
                return b
            }

            function T(a) {
                for (var b = {}, c = 0; c < a.childNodes.length; c++) {
                    var d = a.childNodes[c];
                    1 === d.nodeType && (b[d.getAttribute("semantic")] = f(d.getAttribute("source")))
                }
                return b
            }

            function U(a) {
                for (var b = {
                        type: a.nodeName,
                        material: a.getAttribute("material"),
                        inputs: {},
                        stride: 0
                    }, c = 0, d = a.childNodes.length; c < d; c++) {
                    var g = a.childNodes[c];
                    if (1 === g.nodeType) switch (g.nodeName) {
                        case "input":
                            var h = f(g.getAttribute("source")),
                                i = g.getAttribute("semantic"),
                                j = parseInt(g.getAttribute("offset"));
                            b.inputs[i] = {
                                id: h,
                                offset: j
                            }; b.stride = Math.max(b.stride, j + 1);
                            break;
                        case "vcount":
                            b.vcount = e(g.textContent);
                            break;
                        case "p":
                            b.p = e(g.textContent)
                    }
                }
                return b
            }

            function X(a) {
                var b = {},
                    c = a.sources,
                    d = a.vertices,
                    e = a.primitives;
                if (0 === e.length) return b;
                for (var f = 0; f < e.length; f++) {
                    var g = e[f],
                        h = g.inputs,
                        i = new THREE.BufferGeometry;
                    a.name && (i.name = a.name);
                    for (var j in h) {
                        var k = h[j];
                        switch (j) {
                            case "VERTEX":
                                for (var l in d) i.addAttribute(l.toLowerCase(), Y(g, c[d[l]], k.offset));
                                break;
                            case "NORMAL":
                                i.addAttribute("normal", Y(g, c[k.id], k.offset));
                                break;
                            case "COLOR":
                                i.addAttribute("color", Y(g, c[k.id], k.offset));
                                break;
                            case "TEXCOORD":
                                i.addAttribute("uv", Y(g, c[k.id], k.offset))
                        }
                    }
                    var m;
                    switch (g.type) {
                        case "lines":
                            m = new THREE.LineSegments(i, V);
                            break;
                        case "linestrips":
                            m = new THREE.Line(i, V);
                            break;
                        case "triangles":
                        case "polylist":
                            m = new THREE.Mesh(i, W)
                    }
                    b[g.material] = m
                }
                return b
            }

            function Y(a, b, c) {
                function g(a) {
                    for (var b = d[a + c] * j, e = b + j; b < e; b++) k.push(i[b])
                }
                var d = a.p,
                    e = a.stride,
                    f = a.vcount,
                    h = 0,
                    i = b.array,
                    j = b.stride,
                    k = [];
                if (void 0 !== a.vcount) {
                    for (var l = 0, m = 0, n = f.length; m < n; m++) {
                        var o = f[m];
                        if (4 === o) {
                            var p = l + 0 * e,
                                q = l + 1 * e,
                                r = l + 2 * e,
                                s = l + 3 * e;
                            g(p); g(q); g(s); g(q); g(r); g(s);
                        } else if (3 === o) {
                            var p = l + 0 * e,
                                q = l + 1 * e,
                                r = l + 2 * e;
                            g(p); g(q); g(r);
                        } else h = Math.max(h, o);
                        l += e * o
                    }
                    h > 0 && console.log("ColladaLoader: Geometry has faces with more than 4 vertices.")
                } else
                    for (var m = 0, n = d.length; m < n; m += e) g(m);
                return new THREE.Float32Attribute(k, j)
            }

            function Z(a) {
                return l(ma.geometries[a], X)
            }

            function aa(a) {
                for (var b = {
                        name: a.getAttribute("name"),
                        matrix: new THREE.Matrix4,
                        nodes: [],
                        instanceCameras: [],
                        instanceLights: [],
                        instanceGeometries: [],
                        instanceNodes: []
                    }, c = 0; c < a.childNodes.length; c++) {
                    var e = a.childNodes[c];
                    if (1 === e.nodeType) switch (e.nodeName) {
                        case "node":
                            aa(e); b.nodes.push(e.getAttribute("id"));
                            break;
                        case "instance_camera":
                            b.instanceCameras.push(f(e.getAttribute("url")));
                            break;
                        case "instance_light":
                            b.instanceLights.push(f(e.getAttribute("url")));
                            break;
                        case "instance_geometry":
                            b.instanceGeometries.push(ba(e));
                            break;
                        case "instance_node":
                            b.instanceNodes.push(f(e.getAttribute("url")));
                            break;
                        case "matrix":
                            var g = d(e.textContent);
                            b.matrix.multiply($.fromArray(g).transpose());
                            break;
                        case "translate":
                            var g = d(e.textContent);
                            _.fromArray(g); b.matrix.multiply($.makeTranslation(_.x, _.y, _.z));
                            break;
                        case "rotate":
                            var g = d(e.textContent),
                                h = THREE.Math.degToRad(g[3]);
                            b.matrix.multiply($.makeRotationAxis(_.fromArray(g), h));
                            break;
                        case "scale":
                            var g = d(e.textContent);
                            b.matrix.scale(_.fromArray(g));
                            break;
                        case "extra":
                            break;
                        default:
                            console.log(e)
                    }
                }
                return null !== a.getAttribute("id") && (ma.nodes[a.getAttribute("id")] = b), b
            }

            function ba(a) {
                for (var b = {
                        id: f(a.getAttribute("url")),
                        materials: {}
                    }, c = 0; c < a.childNodes.length; c++) {
                    var d = a.childNodes[c];
                    if ("bind_material" === d.nodeName) {
                        for (var e = d.getElementsByTagName("instance_material"), g = 0; g < e.length; g++) {
                            var h = e[g],
                                i = h.getAttribute("symbol"),
                                j = h.getAttribute("target");
                            b.materials[i] = f(j)
                        }
                        break
                    }
                }
                return b
            }

            function ca(a) {
                for (var b = [], c = a.matrix, d = a.nodes, e = a.instanceCameras, f = a.instanceLights, g = a.instanceGeometries, h = a.instanceNodes, i = 0, j = d.length; i < j; i++) b.push(da(d[i]).clone());
                for (var i = 0, j = e.length; i < j; i++) b.push(L(e[i]).clone());
                for (var i = 0, j = f.length; i < j; i++) b.push(Q(f[i]).clone());
                for (var i = 0, j = g.length; i < j; i++) {
                    var k = g[i],
                        l = Z(k.id);
                    for (var m in l) {
                        var n = l[m].clone();
                        void 0 !== k.materials[m] && (n.material = F(k.materials[m])); b.push(n)
                    }
                }
                for (var i = 0, j = h.length; i < j; i++) b.push(da(h[i]).clone());
                var n;
                if (0 === d.length && 1 === b.length) n = b[0];
                else {
                    n = new THREE.Group;
                    for (var i = 0; i < b.length; i++) n.add(b[i])
                }
                return n.name = a.name, c.decompose(n.position, n.quaternion, n.scale), n
            }

            function da(a) {
                return l(ma.nodes[a], ca)
            }

            function ea(a) {
                for (var b = {
                        name: a.getAttribute("name"),
                        children: []
                    }, d = c(a, "node"), e = 0; e < d.length; e++) b.children.push(aa(d[e]));
                ma.visualScenes[a.getAttribute("id")] = b
            }

            function fa(a) {
                var b = new THREE.Group;
                b.name = a.name;
                for (var c = a.children, d = 0; d < c.length; d++) b.add(ca(c[d]));
                return b
            }

            function ga(a) {
                return l(ma.visualScenes[a], fa)
            }

            function ha(a) {
                var b = c(a, "instance_visual_scene")[0];
                return ga(f(b.getAttribute("url")))
            }
            var m = new THREE.ImageLoader;
            m.setCrossOrigin(this.crossOrigin);
            var V = new THREE.LineBasicMaterial,
                W = new THREE.MeshPhongMaterial,
                $ = new THREE.Matrix4,
                _ = new THREE.Vector3;
            if (console.time("ColladaLoader"), 0 === a.length) return {
                scene: new THREE.Scene
            };
            console.time("ColladaLoader: DOMParser");
            var ia = (new DOMParser).parseFromString(a, "application/xml");
            console.timeEnd("ColladaLoader: DOMParser");
            var ja = c(ia, "COLLADA")[0],
                ka = ja.getAttribute("version");
            console.log("ColladaLoader: File version", ka);
            var la = g(c(ja, "asset")[0]),
                ma = {
                    images: {},
                    effects: {},
                    materials: {},
                    cameras: {},
                    lights: {},
                    geometries: {},
                    nodes: {},
                    visualScenes: {}
                };
            console.time("ColladaLoader: Parse"); j(ja, "library_images", "image", n);
             j(ja, "library_effects", "effect", q); j(ja, "library_materials", "material", D);
              j(ja, "library_cameras", "camera", G); j(ja, "library_lights", "light", M);
               j(ja, "library_geometries", "geometry", R); j(ja, "library_nodes", "node", aa);
                j(ja, "library_visual_scenes", "visual_scene", ea); console.timeEnd("ColladaLoader: Parse");
                 console.time("ColladaLoader: Build"); k(ma.images, o);
                  k(ma.effects, B); k(ma.materials, E); k(ma.cameras, K);
                   k(ma.lights, P); k(ma.geometries, X); k(ma.nodes, ca); k(ma.visualScenes, fa); console.timeEnd("ColladaLoader: Build");
            var na = ha(c(ja, "scene")[0]);
            return "Z_UP" === la.upAxis && (na.rotation.x = -Math.PI / 2), na.scale.multiplyScalar(la.unit), console.timeEnd("ColladaLoader"), {
                animations: [],
                kinematics: {
                    joints: []
                },
                scene: na
            }
        }
    }