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
})({"NbsI":[function(require,module,exports) {
module.exports = "https://cse412-21w.github.io/temperature-change-greenhouse-emission/ghg_cleanup.018975a5.csv";
},{}],"CoJm":[function(require,module,exports) {
"use strict";

var _ghg_cleanup = _interopRequireDefault(require("../static/ghg_cleanup.csv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

"use strict";

var ghg = [];
var year = [];
var options = {
  config: {},
  init: function init(view) {
    view.tooltip(new vegaTooltip.Handler().call);
  },
  view: {
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
      if (!year.includes(d.Year)) {
        year.push(d.Year);
      }
    });
  });
  drawBarVegaLite();
});

function drawBarVegaLite() {
  var selection = vl.selectSingle('Select').fields('Year').init({
    Year: year[5]
  }).bind(vl.slider(1990, 2018, 1));
  vl.markBar().data(ghg).select(selection).transform(vl.groupby(['Country', 'Year', 'Pollutant'])).encode(vl.x().average('Value').title('Amount of Gas Emission'), vl.y().fieldN('Country'), vl.color().fieldN('Pollutant').scale('tableau20'), vl.tooltip(['Country', 'Pollutant', 'Value'])).render().then(function (viewElement) {
    document.getElementById('overall-bar').appendChild(viewElement);
  });
}
},{"../static/ghg_cleanup.csv":"NbsI"}]},{},["CoJm"], null)
//# sourceMappingURL=https://cse412-21w.github.io/temperature-change-greenhouse-emission/vega-overall-bar.c61d2486.js.map