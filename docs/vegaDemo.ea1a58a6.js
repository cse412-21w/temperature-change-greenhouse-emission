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
})({"../static/temp-ghg-dataset.csv":[function(require,module,exports) {
module.exports = "/temp-ghg-dataset.79c9ff5e.csv";
},{}],"../static/ghg_cleanup.csv":[function(require,module,exports) {
module.exports = "/ghg_cleanup.a75ee86c.csv";
},{}],"../static/tempData.csv":[function(require,module,exports) {
module.exports = "/tempData.26194e6a.csv";
},{}],"vegaDemo.js":[function(require,module,exports) {
"use strict";

var _tempGhgDataset = _interopRequireDefault(require("../static/temp-ghg-dataset.csv"));

var _ghg_cleanup = _interopRequireDefault(require("../static/ghg_cleanup.csv"));

var _tempData = _interopRequireDefault(require("../static/tempData.csv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

"use strict";

var ds = [];
var da = [];
var test = [];
var countries = [];
var year = [];
var year_ghg = [];
var ghg = [];
var countries1 = [];
var pollutant = [];
var options = {
  config: {// Vega-Lite default configuration
  },
  init: function init(view) {
    // initialize tooltip handler
    view.tooltip(new vegaTooltip.Handler().call);
  },
  view: {
    // view constructor options
    // remove the loader if you don't want to default to vega-datasets!
    //   loader: vega.loader({
    //     baseURL: "",
    //   }),
    renderer: "canvas"
  }
};
vl.register(vega, vegaLite, options);
d3.csv(_ghg_cleanup.default).then(function (data) {
  data.forEach(function (d) {
    ghg.push(d);
  });
  d3.csv(_ghg_cleanup.default).then(function (data) {
    data.forEach(function (d) {
      if (!year_ghg.includes(d.Year)) {
        year_ghg.push(d.Year);
      }
    });
  });
  drawBarVegaLite2();
});
d3.csv(_ghg_cleanup.default).then(function (data) {
  data.forEach(function (d) {
    test.push(d);

    if (!pollutant.includes(d.Pollutant)) {
      pollutant.push(d.Pollutant);
    }
  });
  drawLineVegalite();
});
d3.csv(_tempGhgDataset.default).then(function (data) {
  data.forEach(function (d) {
    ds.push(d);

    if (!countries.includes(d.Country)) {
      countries.push(d.Country);
    }
  });
  drawBarVegaLite();
});
d3.csv(_tempData.default).then(function (data) {
  data.forEach(function (d) {
    da.push(d);

    if (!countries1.includes(d.Country)) {
      countries1.push(d.Country);
    }

    if (!year.includes(d.Year)) {
      year.push(d.Year);
    }
  });
  drawBarVegaLite1();
});

function drawLineVegalite() {
  var base = vl.markLine().data(test).encode(vl.x().fieldT('Year').title('Years'), vl.color().fieldN('Pollutant')).width(240).height(180);
  var cb = base.transform(vl.filter("datum.Pollutant == 'Carbon dioxide'")).encode(vl.y().average("Value"));
  var methane = base.transform(vl.filter("datum.Pollutant == 'Methane'")).encode(vl.y().average("Value"));
  var no = base.transform(vl.filter("datum.Pollutant == 'Nitrous oxide'")).encode(vl.y().average("Value"));
  vl.hconcat(cb, methane, no).render().then(function (viewElement) {
    document.getElementById('ghg').appendChild(viewElement);
  });
}

function drawBarVegaLite() {
  // var sunshine = add_data(vl, sunshine.csv, format_type = NULL);
  // your visualization goes here
  var selectGenre = vl.selectSingle('Select').fields('Country').init({
    Country: countries[0]
  }).bind(vl.menu(countries));
  var temp = vl.markBar().data(ds).select(selectGenre).transform(vl.groupby(['Country', 'Year']).aggregate(vl.average('Temperature').as('avg_temp'))).encode(vl.y().fieldQ('avg_temp').title('Temperature Change'), vl.x().fieldQ('Year'), vl.opacity().if(selectGenre, vl.value(1)).value(0), vl.color().fieldN("Country").scale('tableau20')).width(500).height(300);
  var ghg = vl.markBar().data(ds).transform(vl.filter('datum.Pollutant == "Carbon dioxide"'), vl.groupby(['Country', 'Year']).aggregate(vl.average('GHG').as('avg_ghg'))).encode(vl.x().fieldQ('Year'), vl.y().fieldQ('avg_ghg').title('avg_carbon_dioxide'), vl.opacity().if(selectGenre, vl.value(1)).value(0), vl.color().fieldN("Country").scale('tableau20')).width(500).height(300);
  vl.vconcat(ghg, temp).render().then(function (viewElement) {
    document.getElementById('view').appendChild(viewElement);
  });
}

function drawBarVegaLite1() {
  var selection = vl.selectSingle('select').fields('Country', 'Year').init({
    Country: countries1[0],
    Year: year[0]
  }).bind({
    Country: vl.menu(countries1),
    Year: vl.menu(year)
  });
  vl.markBar().data(da).select(selection).transform(vl.groupby(['Country', 'Year', 'Month']).aggregate(vl.average('Temperature').as('temp'))).encode(vl.x().fieldO('Month'), vl.y().fieldQ('temp').title('temperature change'), vl.opacity().if(selection).value(0) // New
  ).render().then(function (viewElement) {
    document.getElementById('view2').appendChild(viewElement);
  });
}

function drawBarVegaLite2() {
  var selection = vl.selectSingle('Select').fields('Year').init({
    Year: year_ghg[5]
  }).bind(vl.slider(1990, 2018, 1));
  vl.markBar().data(ghg).select(selection).transform(vl.groupby(['Country', 'Year', 'Pollutant'])).encode(vl.x().average('Value').title('Amount of Gas Emission'), vl.y().fieldN('Country'), vl.color().fieldN('Pollutant').scale('tableau20'), vl.tooltip(['Country', 'Pollutant', 'Value'])).render().then(function (viewElement) {
    document.getElementById('overall-bar').appendChild(viewElement);
  });
}
},{"../static/temp-ghg-dataset.csv":"../static/temp-ghg-dataset.csv","../static/ghg_cleanup.csv":"../static/ghg_cleanup.csv","../static/tempData.csv":"../static/tempData.csv"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50891" + '/');

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
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","vegaDemo.js"], null)
//# sourceMappingURL=/vegaDemo.ea1a58a6.js.map