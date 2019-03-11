let selectedStates = 2;

let ageScale = d3.scaleLinear().range([1000, 200]);

// gridlines in y axis function
function make_y_gridlines() {		
  return d3.axisLeft(ageScale)
} 

var drawCircles = function (domSelector) {


    // Import dataset
    d3.csv("./data.txt", d => {
      return {
        state: +d.StateCode,
        age: convertAgeCodes(d.TenYearAgeGroupsCode),
        gender: d.GenderCode,
        race: convertRaceCodes(d.RaceCode),
        deaths: +d.Deaths,
        population: +d.Population,
        rate: +d.CrudeRate
      }
    }).then( data => {
      console.log("All data:");
      console.log(data);

      ageScale.domain(d3.extent(data, function(d) { return d.age; }));

      var svg = d3.select(domSelector)
        .append('svg')
          .style('width','1500px')
          .style('height','1100px');
      
      svg.append("g")			
          .attr("class", "grid")
          .call(make_y_gridlines()
            .tickSize(-1500)
            .tickFormat("")
          );          

      svg.selectAll('circle')
        .data(data.filter( d => {
          return d.state == selectedStates;
        }))
        .enter()
          .append('circle')
            .attr('r', function (d) {
              let radius = d.rate;
              if (radius < 3) { radius = 3; }
              if (radius !== radius) { radius = 3; }
              return radius;
            })
            .attr('cy', function (d, i) {
              let base = 100,
                  margin = 100;
                  bottom = 900;
              return (bottom - d.age * base) + margin;
            })
            .attr('cx', function (d, i) {
              let base = 200,
                  spacing = 170,
                  raceNum = getCX(d.race);
              let margin = 200,
                  cx = raceNum * base + (spacing * raceNum),
                  shift = 80;
              if (d.gender == "M") {
                shift = shift;
              } else if (d.gender == "F") {
                shift = -shift;
              }
              return cx + margin + shift;
            })
            .attr('fill', function (d) {
              let color = getRaceColor(d.race);
              console.log(d.race, color);
              return color;
            })
            .attr('opacity', 0.5);
    })
  
    
};


function convertRaceCodes (code) {
  switch(code) {
    case "2106-3": return "white";
    case "2054-5": return "black";
    case "A-PI": return "asian";
    case "1002-5": return "native";
    default: return "unknown";
  }
}

function convertAgeCodes (age) {
  switch(age) {
    case "5-14": return 0;
    case "15-24": return 1;
    case "25-34": return 2;
    case "35-44": return 3;
    case "45-54": return 4;
    case "55-64": return 5;
    case "65-74": return 6;
    case "75-84": return 7;
    case "85+": return 8;
  }
}

function getCX (race) {
  switch(race) {
    case "white": return 3;
    case "black": return 2;
    case "asian": return 1;
    case "native": return 0;
  }
}


function getRaceColor (race) {
  // console.log(race);
  switch(race) {
    case "white": return "red";
    case "black": return "green";
    case "asian": return "blue";
    case "native": return "purple";
  }
}

// Interactive events
// document.getElementsByClass('.state-btn')[0].addEventListener('click', function() {
//   console.log(this.id);
//   updateStates(this.id);
// })