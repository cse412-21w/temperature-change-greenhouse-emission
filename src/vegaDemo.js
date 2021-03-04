import fpData from '../static/temp-ghg-dataset.csv'
import ghgData from '../static/ghg_cleanup.csv'
import tempData from '../static/tempData.csv'
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


const options = {
  config: {
    // Vega-Lite default configuration
  },
  init: (view) => {
    // initialize tooltip handler
    view.tooltip(new vegaTooltip.Handler().call);
  },
  view: {
    // view constructor options
    // remove the loader if you don't want to default to vega-datasets!
    //   loader: vega.loader({
    //     baseURL: "",
    //   }),
    renderer: "canvas",
  },
};

vl.register(vega, vegaLite, options);

d3.csv(ghgData).then(function(data) {
  data.forEach(function(d){
    ghg.push(d);
  })
  d3.csv(ghgData).then(function(data) {
    data.forEach(function(d){
      if (!year_ghg.includes(d.Year)) {
        year_ghg.push(d.Year)
      }
    })
  })

  drawBarVegaLite2();
});

d3.csv(ghgData).then(function(data) {
  data.forEach(function(d){
    test.push(d);
    if (!pollutant.includes(d.Pollutant)) {
      pollutant.push(d.Pollutant);
    }
  })
  drawLineVegalite();
});

d3.csv(fpData).then(function(data) {
  data.forEach(function(d){
    ds.push(d);
    if (!countries.includes(d.Country)) {
      countries.push(d.Country);
    }
  })
  drawBarVegaLite();
});

d3.csv(tempData).then(function(data) {
  data.forEach(function(d){
    da.push(d);
    if (!countries1.includes(d.Country)) {
      countries1.push(d.Country);
    }
    if (!year.includes(d.Year)) {
      year.push(d.Year);
    }
  })
  drawBarVegaLite1();
});

function drawLineVegalite() {
  const base = vl.markLine()
  .data(test)
  .encode(
    vl.x().fieldT('Year').title('Years'),
    vl.color().fieldN('Pollutant')
  )
  .width(240)
  .height(180);
  const cb = base.transform(vl.filter("datum.Pollutant == 'Carbon dioxide'")).encode(vl.y().average("Value"));
  const methane = base.transform(vl.filter("datum.Pollutant == 'Methane'")).encode(vl.y().average("Value"));
  const no = base.transform(vl.filter("datum.Pollutant == 'Nitrous oxide'")).encode(vl.y().average("Value"));
  vl.hconcat(cb, methane, no)
  .render()
  .then(viewElement => {
    document.getElementById('ghg').appendChild(viewElement);
  });
}

function drawBarVegaLite() {
  // var sunshine = add_data(vl, sunshine.csv, format_type = NULL);
  // your visualization goes here
    const selectGenre = vl.selectSingle('Select')
      .fields('Country')
      .init({Country: countries[0]})
      .bind(vl.menu(countries));

    const temp = vl.markBar()
      .data(ds)
      .select(selectGenre)
      .transform(
        vl.groupby(['Country','Year'])
          .aggregate(vl.average('Temperature').as('avg_temp'))
      ).encode(
        vl.y().fieldQ('avg_temp').title('Temperature Change'),
        vl.x().fieldQ('Year'),
        vl.opacity().if(selectGenre, vl.value(1)).value(0),
        vl.color().fieldN("Country").scale('tableau20')
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
        vl.opacity().if(selectGenre, vl.value(1)).value(0),
        vl.color().fieldN("Country").scale('tableau20')
      ).width(500)
      .height(300);

    vl.vconcat(ghg, temp)
      .render()
      .then(viewElement => {
      document.getElementById('view').appendChild(viewElement);
    });
  }

function drawBarVegaLite1() {
    const selection = vl.selectSingle('select')
        .fields('Country', 'Year')
        .init({Country: countries1[0], Year: year[0]})
        .bind({Country: vl.menu(countries1), Year: vl.menu(year)});

    vl.markBar()
    .data(da)
    .select(selection)
    .transform(
          vl.groupby(['Country','Year','Month'])
            .aggregate(vl.average('Temperature').as('temp'))
       )
     .encode(
      vl.x().fieldO('Month'),
      vl.y().fieldQ('temp').title('temperature change'),
      vl.opacity().if(selection).value(0)    // New
    )
    .render()
    .then(viewElement => {
      document.getElementById('view2').appendChild(viewElement);
    });
}

function drawBarVegaLite2() {
  const selection = vl.selectSingle('Select')
    .fields('Year')
    .init({Year: year_ghg[5]})
    .bind(vl.slider(1990,2018,1));

  vl.markBar()
    .data(ghg)
    .select(selection)
    .transform(
      vl.groupby(['Country','Year','Pollutant'])
    )
    .encode(
      vl.x().average('Value').title('Amount of Gas Emission'),
      vl.y().fieldN('Country'),
      vl.color().fieldN('Pollutant').scale('tableau20'),
      vl.tooltip(['Country','Pollutant','Value'])
    )
    .render()
    .then(viewElement => {
      document.getElementById('overall-bar').appendChild(viewElement);
  });
}