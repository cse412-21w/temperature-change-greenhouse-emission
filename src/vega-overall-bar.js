import ghgData from '../static/ghg_cleanup.csv'  
"use strict";     

var ghg = [];
var year = [];

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
  
  drawBarVegaLite();
});

function drawBarVegaLite() {
  const selection = vl.selectSingle('Select') 
    .fields('Year')      
    .init({Year: year[5]}) 
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