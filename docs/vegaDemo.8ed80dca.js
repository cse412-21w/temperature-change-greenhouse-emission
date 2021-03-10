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
})({"lpg4":[function(require,module,exports) {
module.exports = "https://cse412-21w.github.io/temperature-change-greenhouse-emission/temp-ghg-dataset.6bc052ae.csv";
},{}],"NbsI":[function(require,module,exports) {
module.exports = "https://cse412-21w.github.io/temperature-change-greenhouse-emission/ghg_cleanup.790a3c89.csv";
},{}],"fp3K":[function(require,module,exports) {
module.exports = "https://cse412-21w.github.io/temperature-change-greenhouse-emission/tempData.5084db74.csv";
},{}],"CsaW":[function(require,module,exports) {
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
var ghg_pollutant = [];
var country = [];
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

  for (var i in ghg) {
    ghg[i].Year = parseInt(ghg[i].Year);
    var num = ghg[i].Year;

    if (!year_ghg.includes(num)) {
      year_ghg.push(num);
    }

    var cty = ghg[i].Country;

    if (!country.includes(cty)) {
      country.push(cty);
    }

    var pol = ghg[i].Pollutant;

    if (!ghg_pollutant.includes(pol)) {
      ghg_pollutant.push(pol);
    }
  }

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
  vl.markBar().data(da).select(selection).transform(vl.groupby(['Country', 'Year', 'Month']).aggregate(vl.average('Temperature').as('temp'))).encode(vl.x().fieldO('Month').sort('none'), vl.y().fieldQ('temp').title('temperature change'), vl.opacity().if(selection).value(0) // New
  ).render().then(function (viewElement) {
    document.getElementById('view2').appendChild(viewElement);
  });
}

function drawBarVegaLite2() {
  var selection = vl.selectSingle('Select').fields('Year').init({
    Year: year_ghg[5]
  }).bind(vl.slider(1990, 2018, 1));
  var barChart = vl.markBar().data(ghg).select(selection).transform(vl.filter(selection), vl.groupby(['Country', 'Pollutant'])).title('How Greenhouse Gases Change in Each Country Every Year?').encode(vl.x().sum('Value').title('Quantity of Emission (Tonnes of CO2 equivalent, Thousands)'), vl.y().fieldN('Country'), vl.color().fieldN('Pollutant').scale('tableau20').legend({
    values: ghg_pollutant
  }), vl.tooltip(['Country', 'Pollutant', 'Value'])).height(200).width(300);
  var pieChart1 = vl.markArc({
    outerRadius: 120
  }).data(ghg).select(selection).transform(vl.filter(selection), vl.groupby(['Country'])).title('Which Country Has the Most GHG Every Year?').encode(vl.theta().sum('Value').stack(true).scale({
    range: [0.75 * Math.PI, 2.75 * Math.PI]
  }), vl.color().fieldN('Country').scale('tableau20').legend({
    values: country
  })).height(240).width(250);
  var pieChart2 = vl.markArc({
    outerRadius: 120
  }).data(ghg).select(selection).transform(vl.filter(selection), vl.groupby(['Pollutant'])).title('How Each GHG Changes?').encode(vl.theta().sum('Value').stack(true).scale({
    range: [0.75 * Math.PI, 2.75 * Math.PI]
  }), vl.color().fieldN('Pollutant').scale('tableau20').legend({
    values: ghg_pollutant
  })).height(240).width(250);
  vl.hconcat(barChart, pieChart1, pieChart2).resolve({
    legend: {
      color: 'independent'
    }
  }).render().then(function (viewElement) {
    document.getElementById('overall-bar').appendChild(viewElement);
  });
}
},{"../static/temp-ghg-dataset.csv":"lpg4","../static/ghg_cleanup.csv":"NbsI","../static/tempData.csv":"fp3K"}]},{},["CsaW"], null)
//# sourceMappingURL=https://cse412-21w.github.io/temperature-change-greenhouse-emission/vegaDemo.8ed80dca.js.map