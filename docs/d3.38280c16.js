// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../static/data_world.csv":[function(require,module,exports) {
module.exports = "/data_world.38ca5671.csv";
},{}],"d3.js":[function(require,module,exports) {
"use strict";

var _data_world = _interopRequireDefault(require("../static/data_world.csv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import dataset
"use strict"; // the code should be executed in "strict mode".
// With strict mode, you can not, for example, use undeclared variables


var bar_svg; // used for svg later

var g; // used for color scheme later

var worldArray = []; // used to store data later
// preparation for our svg

var margin = {
  top: 20,
  right: 20,
  bottom: 50,
  left: 25
},
    w = 1400 - (margin.left + margin.right),
    h = 520 - (margin.top + margin.bottom);
console.log(margin); // preparation for our x/y axis

var y = d3.scaleLinear().range([h, 0]);
var x = d3.scaleBand().range([0, w]).padding(0.15);
var yAxis = d3.axisLeft(y);
var xAxis = d3.axisBottom(x);
var yearSet = []; // once finish processing data, make a graph!

d3.csv(_data_world.default).then(function (data) {
  data.forEach(function (d) {
    worldArray.push(d);

    if (!yearSet.includes(d.Years)) {
      yearSet.push(d.Years);
    }
  });
  drawBarD3();
});

function drawBarD3() {
  x.domain(worldArray.map(function (d) {
    return d.Years;
  }));
  y.domain(d3.extent(worldArray, function (d) {
    return parseFloat(d.Temperature_Change);
  })); // create our svg

  bar_svg = d3.select('#d3').append('svg').attr("id", "bar-chart").attr("width", w + margin.left + margin.right).attr("height", h + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  g = bar_svg.selectAll('g').data(worldArray).enter().append('g'); //.attr('transform', d => 'translate(0' + ',' + x(d.Years) + ')');
  // append x axis to svg

  bar_svg.append("g").attr("transform", "translate(0," + h + ")").attr("class", "myXaxis").call(xAxis).append('text').attr('text-anchor', 'end').attr('fill', 'black').attr('font-size', '15px').attr('font-weight', 'bold').attr('x', w - margin.right).attr('y', -10).text('Years'); // append y axis to svg

  bar_svg.append("g").attr("class", "myYaxis").call(yAxis).append('text').attr('transform', "translate(20, ".concat(margin.top, ") rotate(-90)")).attr('text-anchor', 'end').attr('fill', 'black').attr('font-size', '15px').attr('font-weight', 'bold').text('Temperature Change (degree celcius)');
  g.append('rect').attr('class', 'bar').attr('y', function (d) {
    if (d.Temperature_Change >= 0) {
      return y(d.Temperature_Change);
    } else {
      return y(0);
    }
  }).attr('x', function (d) {
    return x(d.Years);
  }).attr('width', x.bandwidth()).attr('height', function (d) {
    if (d.Temperature_Change >= 0) {
      return y(0) - y(d.Temperature_Change);
    } else {
      return y(d.Temperature_Change) - y(0);
    }
  }).style('fill', function (d) {
    if (d.Temperature_Change >= 0) {
      return 'pink';
    } else {
      return 'skyblue';
    }
  }).style('stroke', 'teal');
  g.append('title').text(function (d) {
    return d.Temperature_Change;
  });
  g.selectAll("rect").join("rect").on('mouseover', function () {
    d3.select(this).attr('stroke', '#333').attr('stroke-width', 2);
  }).on('mouseout', function () {
    d3.select(this).attr('stroke-width', null);
  }); // add legend

  var legend = bar_svg.append('g').attr("id", "legend-group");
  legend.selectAll("rect").data(worldArray).join("rect").attr("class", "legends").attr("x", 40).attr("y", function (d) {
    if (d.Temperature_Change >= 0) {
      return 25;
    } else {
      return 25 + 30;
    }
  }).attr("width", 10).attr("height", 10).style("fill", function (d) {
    if (d.Temperature_Change >= 0) {
      return 'pink';
    } else {
      return 'skyblue';
    }
  });
  legend.selectAll("text").data(worldArray).join("text").attr("class", "legends").attr("x", 60).attr("y", function (d) {
    if (d.Temperature_Change >= 0) {
      return 30;
    } else {
      return 30 + 30;
    }
  }).text(function (d) {
    if (d.Temperature_Change >= 0) {
      return "Temperature Change >= 0";
    } else {
      return "Temperature Change < 0";
    }
  }).style("font-size", "15px").attr("alignment-baseline", "middle");
}
},{"../static/data_world.csv":"../static/data_world.csv"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59430" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","d3.js"], null)
//# sourceMappingURL=/d3.38280c16.js.map