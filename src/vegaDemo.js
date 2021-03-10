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
var ghg_pollutant = [];
var country = [];
var countries1 = [];
var pollutant = [];


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

d3.csv(ghgData).then(function(data) {
  data.forEach(function(d) {
    ghg.push(d);
  });
  for (let i in ghg) {
    ghg[i].Year = parseInt(ghg[i].Year);
    let num = ghg[i].Year;
    if (!year_ghg.includes(num)) {
      year_ghg.push(num);
    }
    let cty = ghg[i].Country;
    if (!country.includes(cty)) {
      country.push(cty);
    }
    let pol = ghg[i].Pollutant;
    if (!ghg_pollutant.includes(pol)) {
      ghg_pollutant.push(pol);
    }
  }
  drawBarAndPie();
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
      vl.x().fieldO('Month').sort('none'),
      vl.y().fieldQ('temp').title('temperature change'),
      vl.opacity().if(selection).value(0)    // New
    )
    .render()
    .then(viewElement => {
      document.getElementById('view2').appendChild(viewElement);
    });
}

function drawBarAndPie() {
  var selection = vl.selectSingle('Select')
    .fields('Year')
    .init({Year: year_ghg[5]})
    .bind(vl.slider(1990,2018,1));

  var barChart = vl.markBar()
    .data(ghg)
    .select(selection)
    .transform(
      vl.filter(selection),
      vl.groupby(['Country','Pollutant'])
    )
    .title('How Greenhouse Gases Change in Each Country Every Year?')
    .encode(
      vl.x().sum('Value').title('Quantity of Emission (Tonnes of CO2 equivalent, Thousands)'),
      vl.y().fieldN('Country'),
      vl.color().fieldN('Pollutant').scale('tableau20').legend({values: ghg_pollutant}),
      vl.tooltip(['Country','Pollutant','Value'])
    )
    .height(250)
    .width(600);

    var pieChart = vl.markArc({outerRadius: 120})
    .data(ghg)
    .select(selection)
    .transform(
      vl.filter(selection),
      vl.groupby(['Pollutant'])
        .aggregate(vl.sum('Value').as('Total_Quantity'))
    )
    .title('How Does Each Greenhouse Gas Changes?')
    .encode(
      vl.theta().fieldQ('Total_Quantity').stack(true).scale({range: [0.75 * Math.PI, 2.75 * Math.PI]}),
      vl.color().fieldN('Pollutant').scale('tableau20').legend({values: ghg_pollutant}),
      vl.tooltip(['Pollutant','Total_Quantity'])
    )
    .height(250)
    .width(240);

    vl.hconcat(barChart, pieChart)
    .resolve({legend: {color: 'independent'}})
    .render()
    .then(viewElement => {
      document.getElementById('bar-pie').appendChild(viewElement);
  });
}
