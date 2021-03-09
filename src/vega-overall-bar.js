import ghgData from '../static/ghg_cleanup.csv'
import fpData from '../static/temp-ghg-dataset.csv'
"use strict";

var ds = [];
var countries = [];
var year = [];
var ghg = [];
var year_ghg = [];

const options = {
  config: {},
  init: (view) => {
    view.tooltip(new vegaTooltip.Handler().call);
  },
  view: {
    renderer: "canvas",
  },
};

vl.register(vega, vegaLite, options);

d3.csv(fpData).then(function(data) {
  data.forEach(function(d){
    ds.push(d);
    if (!countries.includes(d.Country)) {
      countries.push(d.Country);
    }
    if (!year.includes(d.Year)) {
      year.push(d.Year);
    }
  })
  drawBarVegaLite();
});

d3.csv(ghgData).then(function(data) {
  data.forEach(function(d){
    ghg.push(d);
  })
  d3.csv(ghgData).then(function(data) {
    data.forEach(function(d){
      if (!year.includes(d.Year)) {
        year.push(d.Year)
      }
    })
  })

  drawBarVegaLite3();
});

function drawBarVegaLite3() {
  const selectGenre = vl.selectSingle('Select') // name the selection 'Select'
      .fields('Country')          // limit selection to the Major_Genre field
      .init({Country: countries[0]}) // use first genre entry as initial value
      .bind(vl.menu(countries));

    const temp = vl.markBar()
      .data(ds)
      .select(selectGenre)
      .transform(
        //vl.if(selectGenre, vl.filter('datum.Country == ' + selectGenre)),
        vl.groupby(['Country','Year'])
          .aggregate(vl.average('Temperature').as('avg_temp'))
      ).encode(
        vl.y().fieldQ('avg_temp').title('Temperature Change'),
        vl.x().fieldQ('Year'),
        vl.opacity().if(selectGenre, vl.value(1)).value(0)
      ).width(500)
      .height(300);

    const ghg = vl.markBar()
      .data(ds)
      .transform(
        vl.filter('datum.Pollutant == "Carbon dioxide"'),
        vl.groupby(['Country','Year'])
          .aggregate(vl.average('GHG').as('avg_ghg'))
      ).encode(
        vl.x().fieldQ('Year'),
        vl.y().fieldQ('avg_ghg').title('avg_carbon_dioxide'),
        vl.opacity().if(selectGenre, vl.value(1)).value(0)
      ).width(500)
      .height(300);

    vl.vconcat(ghg, temp)
      .render()
      .then(viewElement => {
      document.getElementById('view').appendChild(viewElement);
    });
}