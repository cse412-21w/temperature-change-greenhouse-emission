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
})({"P7RG":[function(require,module,exports) {
module.exports = "https://cse412-21w.github.io/temperature-change-greenhouse-emission/fpData.81c3616c.csv";
},{}],"CsaW":[function(require,module,exports) {
"use strict";

var _fpData = _interopRequireDefault(require("../static/fpData.csv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import dataset
"use strict"; // the code should be executed in "strict mode".
// With strict mode, you can not, for example, use undeclared variables


var ds = []; // used to store data later

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
vl.register(vega, vegaLite, options); // Again, We use d3.csv() to process data

d3.csv(ds).then(function (data) {
  data.forEach(function (d) {
    ds.push(d);
  });
  drawBarVegaLite();
});

function drawBarVegaLite() {
  // var sunshine = add_data(vl, sunshine.csv, format_type = NULL);
  // your visualization goes here
  var countries = uniqueValid(ds, function (d) {
    return d.Country;
  });
  var selectGenre = vl.selectSingle('Select') // name the selection 'Select'
  .fields('Country') // limit selection to the Major_Genre field
  .init({
    Country: countries[0]
  }) // use first genre entry as initial value
  .bind(vl.menu(countries));
  var temp = vl.markLine().data(ds).select(selectGenre).transform(vl.groupby(['Country', 'Year']).aggregate(vl.average('temperature').as('avg_temp'))).encode(vl.y().fieldQ('avg_temp').title('avg_temp'), vl.x().fieldQ('Year'), vl.opacity().if(selectGenre, vl.value(0.75)).value(0.05));
  var ghg = vl.markBar().data(ds).transform(vl.groupby(['Country', 'Year']).aggregate(vl.average('GHG').as('avg_ghg'))).encode(vl.x().fieldQ('Year'), vl.y().fieldQ('avg_ghg').title('avg_ghg'), vl.opacity().if(selectGenre, vl.value(0.75)).value(0.05));
  vl.vconcat(ghg, temp).render().then(function (viewElement) {
    // render returns a promise to a DOM element containing the chart
    // viewElement.value contains the Vega View object instance
    document.getElementById('view').appendChild(viewElement);
  });
}
},{"../static/fpData.csv":"P7RG"}]},{},["CsaW"], null)
//# sourceMappingURL=https://cse412-21w.github.io/temperature-change-greenhouse-emission/vegaDemo.a82608f8.js.map