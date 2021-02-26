import fpData from '../static/fpData.csv'    // import dataset
"use strict";     // the code should be executed in "strict mode".
                  // With strict mode, you can not, for example, use undeclared variables

var ds = [];   // used to store data later


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
d3.csv(ds).then(function(data) {
  data.forEach(function(d){
    ds.push(d);
  })
  drawBarVegaLite();
});


function drawBarVegaLite() {
  // var sunshine = add_data(vl, sunshine.csv, format_type = NULL);
  // your visualization goes here
  const countries = uniqueValid(ds, d => d.Country)
    const selectGenre = vl.selectSingle('Select') // name the selection 'Select'
      .fields('Country')          // limit selection to the Major_Genre field
      .init({Country: countries[0]}) // use first genre entry as initial value
      .bind(vl.menu(countries));

    const temp = vl.markLine()
      .data(ds)
      .select(selectGenre)
      .transform(
        vl.groupby(['Country','Year'])
          .aggregate(vl.average('temperature').as('avg_temp'))
      ).encode(
        vl.y().fieldQ('avg_temp').title('avg_temp'),
        vl.x().fieldQ('Year'),
        vl.opacity().if(selectGenre, vl.value(0.75)).value(0.05)
      );

    const ghg = vl.markBar()
      .data(ds)
      .transform(
        vl.groupby(['Country','Year'])
          .aggregate(vl.average('GHG').as('avg_ghg'))
      ).encode(
        vl.x().fieldQ('Year'),
        vl.y().fieldQ('avg_ghg').title('avg_ghg'),
        vl.opacity().if(selectGenre, vl.value(0.75)).value(0.05)
      )

    vl.vconcat(ghg, temp)
      .render()
      .then(viewElement => {
      // render returns a promise to a DOM element containing the chart
      // viewElement.value contains the Vega View object instance
      document.getElementById('view').appendChild(viewElement);
    });
}
