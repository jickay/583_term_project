// let selectedStates = [2];
let selectedStates = [];

function toggleState(elem, stateNum) {
  if (selectedStates.includes(stateNum)) {
    // Remove state
    selectedStates = selectedStates.filter(num => {
      // console.log(num !== stateNum);
      return num !== stateNum;
    });
    elem.classList.toggle("clicked");
    // updateCircles();
  } else {
    // Add state
    selectedStates.push(stateNum);
    elem.classList.toggle("clicked");
    // addCircles();
  }
  console.log("Current set of States: ");
  console.log(selectedStates);
  updateCircles('#a-container');
}

let vizHeight = 600;
let rangeBase = 200;
let yMargin = 75;
let ageScale = d3.scaleLinear().range([vizHeight-yMargin, rangeBase-yMargin]);

let modData = {};

// gridlines in y axis function
function make_y_gridlines() {		
  return d3.axisLeft(ageScale)
}

function drawCircles(domSelector) {

    // Import dataset
    modData = d3.csv("./data.txt", d => {
      return {
        state: +d.StateCode,
        age: convertAgeCodes(d.TenYearAgeGroupsCode),
        gender: d.GenderCode,
        race: convertRaceCodes(d.RaceCode),
        deaths: +d.Deaths,
        population: +d.Population,
        rate: +d.CrudeRate
      }
    });
    
    modData.then( data => {
      // console.log("All data:");
      // console.log(data);

      ageScale.domain(d3.extent(data, function(d) { return d.age; }));

      var svg = d3.select(domSelector)
        .append('svg')
          .style('width','100%')
          .style('height',vizHeight+'px');
      
      svg.append("g")			
          .attr("class", "grid")
          .call(make_y_gridlines()
            .tickSize(-1800)
            .tickFormat("")
          );

      svg.selectAll('circle')
          .data(data.filter( d => {
            for (let i=0; i<selectedStates.length; i++) {
              // console.log(selectedStates[i]);
              if (d.state == selectedStates[i]) {
                return true;
              }
            }
            return false;
          }))
          .enter()
          .append('circle')
              .attr('r', function (d) {
                let rate = d.rate * 100;
                if (rate < 3) { rate = 3; }
                if (rate !== rate) { rate = 3; }
                let radius = Math.sqrt(rate/Math.PI);
                return radius;
              })
              .attr('cy', function (d, i) {
                let base = 50
                    margin = yMargin,
                    bottom = vizHeight;
                return (bottom - d.age * base) - margin;
              })
              .attr('cx', function (d, i) {
                let base = 130,
                    spacing = 170,
                    raceNum = getCX(d.race);
                let margin = 160,
                    cx = raceNum * base + (spacing * raceNum),
                    shift = 60;
                if (d.gender == "M") {
                  shift = shift;
                } else if (d.gender == "F") {
                  shift = -shift;
                }
                return cx + margin + shift;
              })
              // .attr('fill', function (d) {
              //   let color = getRaceColor(d.race,d.gender);
              //   console.log(d.race, color);
              //   return color;
              // })
              .attr('opacity', d => {
                console.log(1/selectedStates.length);
                return 1 / (selectedStates.length + 1);
              });

        
        svg.selectAll('circle').each( function (d) {
          this.classList.add(d.race);
          this.classList.add(d.gender);
        });
    })
  
    
};

function updateCircles(domSelector) {
  console.log("Updating circles");
  console.log(selectedStates);

  var t = d3.transition()
      .duration(600);

  // Import dataset
  // let allData = d3.csv("./data.txt", d => {
  //   let modData = {
  //     state: +d.StateCode,
  //     age: convertAgeCodes(d.TenYearAgeGroupsCode),
  //     gender: d.GenderCode,
  //     race: convertRaceCodes(d.RaceCode),
  //     deaths: +d.Deaths,
  //     population: +d.Population,
  //     rate: +d.CrudeRate
  //   }
  //   return modData;
  // });
  
    // modData.then( data => {
    //   data.filter(d => {
    //     for (let i=0; i<selectedStates.length; i++) {
    //       // console.log(selectedStates[i]);
    //       if (d.state == selectedStates[i]) {
    //         console.log(selectedStates[i]);
    //         return true;
    //       }
    //     }
    //     return false;
    //   });
    // console.log(data);

    modData.then(data => {
        let newData = data.filter(d => {
              for (let i=0; i<selectedStates.length; i++) {
                // console.log(selectedStates[i]);
                if (d.state == selectedStates[i]) {
                  console.log(selectedStates[i]);
                  return true;
                }
              }
              return false;
            });

        let svg = d3.select("svg")
            .selectAll('circle').data(newData);
            // .data(data).filter(d => {
            //   console.log(d);
            //       for (let i=0; i<selectedStates.length; i++) {
            //         // console.log(selectedStates[i]);
            //         if (d.state == selectedStates[i]) {
            //           // console.log(selectedStates[i]);
            //           return true;
            //         }
            //       }
            //       return false;
            //     });

        console.log("Clearing data");
        svg.exit()
          .transition(t)
            .style('fill-opacity', 1e-6)
          .remove();

        console.log("Entering data");

        svg.enter().append('circle')
            .merge(svg)
            .attr('r', function (d) {
              let rate = d.rate * 100;
              if (rate < 3) { rate = 3; }
              if (rate !== rate) { rate = 3; }
              let radius = Math.sqrt(rate/Math.PI);
              return radius;
            })
            .attr('cy', function (d, i) {
              let base = 50
                  margin = yMargin,
                  bottom = vizHeight;
              return (bottom - d.age * base) - margin;
            })
            .attr('cx', function (d, i) {
              let base = 130,
                  spacing = 170,
                  raceNum = getCX(d.race);
              let margin = 160,
                  cx = raceNum * base + (spacing * raceNum),
                  shift = 60;
              if (d.gender == "M") {
                shift = shift;
              } else if (d.gender == "F") {
                shift = -shift;
              }
              return cx + margin + shift;
            })
            // .attr('fill', function (d) {
            //   let color = getRaceColor(d.race,d.gender);
            //   console.log(d.race, color);
            //   return color;
            // })
          .transition(t)
            .attr('opacity', d => {
              // console.log(1/selectedStates.length);
              return 1 / (selectedStates.length + 1);
            })

        d3.select('svg').selectAll('circle').each( function (d) {
            this.classList = "";
            this.classList.add(d.race);
            this.classList.add(d.gender);
        });


  });
}

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

let color1 = d3.rgb(12, 67, 199);  // Red, Green, Blue

function getRaceColor (race,gender) {
  console.log(race,gender);
  if (gender == "F") {
    switch(race) {
      case "white": return rgba(0,0,0,0);
      case "black": return "green";
      case "asian": return "blue";
      case "native": return color1;
    }
  } else {
    switch(race) {
      case "white": return "red";
      case "black": return "green";
      case "asian": return "blue";
      case "native": return "purple";
    }
  }

}

// Interactive events
// document.getElementsByClass('.state-btn')[0].addEventListener('click', function() {
//   console.log(this.id);
//   updateStates(this.id);
// })