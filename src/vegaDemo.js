import fpData from '../static/temp-ghg-dataset.csv'    // import dataset
"use strict";     // the code should be executed in "strict mode".
                  // With strict mode, you can not, for example, use undeclared variables

var ds = [];   // used to store data later
var countries = [];


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

// Again, We use d3.csv() to process data
d3.csv(fpData).then(function(data) {
  data.forEach(function(d){
    ds.push(d);
    if (!countries.includes(d.Country)) {
      countries.push(d.Country);
    }
  })
  drawBarVegaLite();
});

function drawBarVegaLite() {
  // var sunshine = add_data(vl, sunshine.csv, format_type = NULL);
  // your visualization goes here
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
      // render returns a promise to a DOM element containing the chart
      // viewElement.value contains the Vega View object instance
      document.getElementById('view').appendChild(viewElement);
    });
  }
