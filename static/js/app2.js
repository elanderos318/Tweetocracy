// Select Twitter Button
var twitterButton = d3.select(".twitter-button");
// Create Event Listener
twitterButton.on("click", getOauthAuthorize);
// Fetch Request Token Data, then redirect to Twitter's Authorization page
function getOauthAuthorize() {
    d3.json("/request_token").then(function(data) {
        var request_token = data["oauth_token"];
        window.location.replace(`https://api.twitter.com/oauth/authorize?oauth_token=${request_token}`)
    })
}

// testing checkboxes
bidenBox = d3.select("#joe-biden-checkbox");

bidenBox.on("click", function() {
    if (bidenBox.property("checked")) {
        console.log("biden is checked");

        dateValue = datePicker.property("value");
        console.log(dateValue)
    }
})

datePicker = d3.select(".datepicker");


//// testing

// d3.json("/foo", function(err, data) {
//     if (err) throw err;

//     console.log(data)
// })

//////// All Charts will use the below sizes ////////////////////
// Set SVG Chart Formatting
var svgHeight = 700;
var svgWidth = 1100;

var margin = {
  top: 60,
  right: 40,
  bottom: 140,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

///////// Retrieve initial data for displaying graphs on loading page ///////////////////
// request tweet data from server API endpoint

d3.json("/aag_init").then(function(data) {
    // Create at a glance graph using retrieved data
    graphAAG(data);
}).catch(function(e) {
    console.log(e);
})

d3.json("/moving_average_init").then(function(data) {
    graphMA(data);
}).catch(function(e) {
    console.log(e);
})


/////////////// Select relevant filter data for event listeners ////////////////////
// Select "At a Glance" Checkboxes
var bidenBox = d3.select("#joe-biden-checkbox");
var bookerBox = d3.select("#cory-booker-checkbox");
var buttigiegBox = d3.select("#pete-buttigieg-checkbox");
var castroBox = d3.select("#julian-castro-checkbox");
var delaneyBox = d3.select("#john-delaney-checkbox");
var gabbardBox = d3.select("#tulsi-gabbard-checkbox");
var gillibrandBox = d3.select("#kirsten-gillibrand-checkbox");
var gravelBox = d3.select("#mike-gravel-checkbox");
var harrisBox = d3.select("#kamala-harris-checkbox");
var hickenlooperBox = d3.select("#john-hickenlooper-checkbox");
var insleeBox = d3.select("#jay-inslee-checkbox");
var klobucharBox = d3.select("#amy-klobuchar-checkbox");
var messamBox = d3.select("#wayne-messam-checkbox");
var moultonBox = d3.select("#seth-moulton-checkbox");
var rourkeBox = d3.select("#beto-rourke-checkbox");
var ryanBox = d3.select("#tim-ryan-checkbox");
var sandersBox = d3.select("#bernie-sanders-checkbox");
var trumpBox = d3.select("#donald-trump-checkbox");
var warrenBox = d3.select("#elizabeth-warren-checkbox");
var weldBox = d3.select("#bill-weld-checkbox");
var williamsonBox = d3.select("#marianne-williamson-checkbox");
var yangBox = d3.select("#andrew-yang-checkbox");
var swalwellBox = d3.select("#eric-swalwell-checkbox");
var bennetBox = d3.select("#michael-bennet-checkbox");
var bullockBox = d3.select("#steve-bullock-checkbox");
var blasioBox = d3.select("#bill-blasio-checkbox");
var sestakBox = d3.select("#joe-sestak-checkbox");
var steyerBox = d3.select("#tom-steyer-checkbox");

// Select Aggregation Method Buttons
var meanRadio = d3.select("#mean-radio");
var medianRadio = d3.select("#median-radio");

// Select "Retweets or Favorites Radio Buttons"
var retweetRadio = d3.select("#retweet-radio");
var favoriteRadio = d3.select("#favorite-radio");

// Select "Date From" and "Date To" Inputs
var dateFromSelection = d3.select("#aag-date-from");
var dateToSelection = d3.select("#aag-date-to");

// Select "at a glance" Submit Button
var selectionSubmit = d3.select(".selection-submit");

// Create event listener for submit button
selectionSubmit.on("click", submitClick);

// Create Label for variable metric label display on initial load
var metricLabel = "Retweets";

// Create Button Click function
function submitClick() {
    // Create list to append all checked candidates
    var candidatesList = [];
    // Prevent the page from refreshing
    d3.event.preventDefault();

    ////////////////////////////////////////////////////
    // Append list with names whose boxes are checked
    if (bidenBox.property("checked")) {
        candidatesList.push("939091");
    }
    if (bookerBox.property("checked")) {
        candidatesList.push("15808765");
    }
    if (buttigiegBox.property("checked")) {
        candidatesList.push("226222147");
    }
    if (castroBox.property("checked")) {
        candidatesList.push("19682187");
    }
    if (delaneyBox.property("checked")) {
        candidatesList.push("426028646");
    }
    if (gabbardBox.property("checked")) {
        candidatesList.push("26637348");
    }
    if (gillibrandBox.property("checked")) {
        candidatesList.push("72198806");
    }
    if (gravelBox.property("checked")) {
        candidatesList.push("14709326");
    }
    if (harrisBox.property("checked")) {
        candidatesList.push("30354991");
    }
    if (hickenlooperBox.property("checked")) {
        candidatesList.push("117839957");
    }
    if (insleeBox.property("checked")) {
        candidatesList.push("21789463");
    }
    if (klobucharBox.property("checked")) {
        candidatesList.push("33537967");
    }
    if (messamBox.property("checked")) {
        candidatesList.push("33954145");
    }
    if (moultonBox.property("checked")) {
        candidatesList.push("248495200");
    }
    if (rourkeBox.property("checked")) {
        candidatesList.push("342863309");
    }
    if (ryanBox.property("checked")) {
        candidatesList.push("466532637");
    }
    if (sandersBox.property("checked")) {
        candidatesList.push("216776631");
    }
    if (trumpBox.property("checked")) {
        candidatesList.push("25073877");
    }
    if (warrenBox.property("checked")) {
        candidatesList.push("357606935");
    }
    if (weldBox.property("checked")) {
        candidatesList.push("734783792502575105");
    }
    if (williamsonBox.property("checked")) {
        candidatesList.push("21522338");
    }
    if (yangBox.property("checked")) {
        candidatesList.push("2228878592");
    }
    if (swalwellBox.property("checked")) {
        candidatesList.push("942156122");
    }
    if (bennetBox.property("checked")) {
        candidatesList.push("45645232");
    }
    if (bullockBox.property("checked")) {
        candidatesList.push("111721601");
    }
    if (blasioBox.property("checked")) {
        candidatesList.push("476193064");
    }
    if (sestakBox.property("checked")) {
        candidatesList.push("46764631");
    }
    if (steyerBox.property("checked")) {
        candidatesList.push("949934436");
    }

    /////////////////////////////////////////////

    // Check Aggregation Method Selected

    var aggregationVariable;

    if (meanRadio.property("checked")) {
        aggregationVariable = "average";
    } else {
        aggregationVariable = "median";
    }

    /////////////////////////////////////////////

    // Check Retweet/Favorite Selection

    var metricVariable;

    if (retweetRadio.property("checked")) {
        metricVariable = "retweet_average";
        metricLabel = "Retweets";
    } else {
        metricVariable = "favorite_average";
        metricLabel = "Favorites";
    }
    /////////////////////////////////////////////

    // Check Date Range Selected

    var dateFrom;
    var dateTo;
    dateFrom = dateFromSelection.property("value");
    dateTo = dateToSelection.property("value");

    // Create time formatter
    var formatTime = d3.timeFormat("%b %d, %Y");
    //// Default Dates will be set to the current date to a month ago
    var currentDate = new Date();
    var monthAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate()); 

    if (!dateFrom) {
        dateFrom = formatTime(monthAgo);
    }
    if (!dateTo) {
        dateTo = formatTime(currentDate);
        }
    // console.log(dateFrom);
    // console.log(dateTo);

    ////////////////////////////////////////////


    filteredCandidatesData(candidatesList, metricVariable, aggregationVariable, dateFrom, dateTo);
}

// Function for filtering data based on filter selections
function filteredCandidatesData(candidatesList, metricVariable, aggregationVariable, dateFrom, dateTo) {

    ///// Send a POST request to the backend to filter data for our "At a Glance" bar chart
    d3.json("/aag_filter", {
        method: "POST",
        body: JSON.stringify({
            candidatesList: candidatesList,
            dateFrom: dateFrom,
            dateTo: dateTo
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
    }).then(json => {

        var aagData = json;
        ////// set our x and y variables
        var bands = json.map(d => d["user_name"]);
        var score = json.map(d => d[metricVariable]);

        // Select Title Label
        var titleLabel = d3.select(".title-label");
        // Select Y Axis Label
        var yAxisLabel = d3.select(".y-axis-label");

        // Generate new xaxis scalar, select current x-axis, and render/transition to new axis
        xScaleBands = xBands(bands);
        xBandsAxis = d3.select(".x-band-axis");
        renderXBandsAxis(xScaleBands, xBandsAxis);
        
        // Generate new yaxis scalar, select current y-axis, and render/transition to new axis
        yScaleBands = yBands(score);
        yBandsAxis = d3.select(".y-band-axis");
        renderYBandsAxis(yScaleBands, yBandsAxis);

        // Generate new bars
        renderRect(bands, xScaleBands, aagData, yScaleBands, titleLabel, yAxisLabel, metricVariable)
    })

    ///// Send a POST request to the backend to filter data for our "Moving Average" line chart
    d3.json("/moving_average_filter", {
        method: "POST",
        body: JSON.stringify({
            candidatesList: candidatesList,
            dateFrom: dateFrom,
            dateTo: dateTo
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
    }).then(json => {

        // console.log(json)
        // console.log(typeof json)

        var newMA = json;

        // create time parser
        var parseTime = d3.timeParse("%Y-%m-%d");
    
        // set variable metric
        var lineMetric;

        if (metricVariable == "retweet_average") {
            lineMetric = "retweet_moving_average";
        } else {
            lineMetric = "favorite_moving_average";
        }
    
        // Modify Data 
        newMA.forEach(function(data) {
            data["moving_average_date"] = parseTime(data["moving_average_date"]);
            data["retweet_moving_average"] = +data["retweet_moving_average"];
            data["favorite_moving_average"] = +data["favorite_moving_average"];
        });


        // Select current y axis. Need to update the metric displayed if changed
        var linesYLabel = d3.select(".ma-y-axis-label");

        // Generate new xaxis
        xTimeScale = xMovingLineScalar(newMA, lineMetric);
        xTimeAxis = d3.select(".ma-x-axis");
        renderXLineAxis(xTimeScale, xTimeAxis);

        // Generate new yaxis
        yLinearScale = yMovingLineScalar(newMA, lineMetric);
        yLinearAxis = d3.select(".ma-y-axis");
        renderYLineAxis(yLinearScale, yLinearAxis);

        // Genereate new lines
        renderLines(newMA, xTimeScale, yLinearScale, lineMetric, linesYLabel, metricLabel);

        
    })
}

////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////    Section for updating Moving Average line chart /////////////
////////////////////////////////////////////////////////////////////////////////////////////


///////////////////// Render new Lines /////////////////////////////////////////////

function renderLines(newMA, xTimeScale, yLinearScale, lineMetric, linesYLabel, metricLabel) {

    // Build a "line generator" which will build line data for each candidate info
    someGenerator = d3.line()
        .x(d => xTimeScale(d["moving_average_date"]))
        .y(d => yLinearScale(d[lineMetric]))
    ////// Select current line group, and pass in filtered data from "cnadidateGroup" function
    var linesGroup = chartGroupMA.selectAll(".line")
        .data(candidateGroup(newMA))
        /// Enter any new path, and merge/update existing path data
        // "someGenerator" will set x and y values for lines
        linesGroup.enter()
        .append("path")
        .merge(linesGroup)
        .attr("d", function(d) {
            return someGenerator(d.candidateData)
        })
        .classed("line", true)
        .style("stroke", (d, i) => colorBands(i))
        .style("stroke-width", "2px")
        // Remove any left over data
        linesGroup.exit().remove();
    maToolTip(linesGroup, metricLabel, lineMetric);
        // Transition y-label if another metric was selected
        linesYLabel.transition()
            .duration(1000)
            .text(`Moving Average (${metricLabel})`)

    return linesGroup;
}

////// Update X Axis Scalar

function xMovingLineScalar(newMA) {
    // create scale 
    var xTimeScale = d3.scaleTime()
        .domain(d3.extent(newMA, d => d["moving_average_date"]))
        .range([0, width]);
    return xTimeScale;
}

/////// Render new X Axis with updated scalar
function renderXLineAxis(xTimeScale, xTimeAxis) {
    var bottomAxis = d3.axisBottom(xTimeScale)
        .tickFormat(d3.timeFormat("%m-%d-%Y"));

    xTimeAxis.transition()
        .duration(1000)
        .call(bottomAxis)
        .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");
    
    return xTimeAxis;
}

///// Update Y Axis Scalar
function yMovingLineScalar(data, lineMetric) {
    // create scale
    var yLinearScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d[lineMetric]))
        .range([height, 0]);

    return yLinearScale;
}

//// Render new Y Axis with updated scalar
function renderYLineAxis(yLinearScale, yLinearAxis) {
    var leftAxis = d3.axisLeft(yLinearScale);

    yLinearAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
    return yLinearAxis;
}

function maToolTip(chartLines, metricLabel, lineMetric) {

    var maToolTip = d3.tip()
        .attr("class", "ma-tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.userName}`)
        })
        // .html(function(d) {
        //     return(`${d.userName}<br>${metricLabel} ${d.candidateData}`);
        // });

    chartLines.call(maToolTip);

    chartLines.on("mouseover", maToolTip.show)
        .on("mouseout", maToolTip.hide);

    return chartLines;
}

////////////// Section End
//////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////
////////////////////  Section for Updating "At A Glance" Bar Chart /////////////////
///////////////////////////////////////////////////////////////////////////////////////



////// Function for rendering new bars
function renderRect(bands, xScaleBands, aagData, yScaleBands, titleLabel, yAxisLabel, metricVariable) {
    /// Select current bars and pass in filtered data
    var rectGroup = chartGroupAAG.selectAll("rect")
        .data(aagData)
    /// Enter any new data, merge/update existing data
        rectGroup.enter()
        .append("rect")
        .merge(rectGroup)
        .style("fill", (d, i) => colorBands(i))
        .style("stroke", "black")
        .attr("x", (d, i) => xScaleBands(bands[i]))
        .attr("y", d => yScaleBands(d[metricVariable]))
        .attr("width", xScaleBands.bandwidth())
        .attr("height", d => height - yScaleBands(d[metricVariable]))
    //// Remove any left over data
        rectGroup.exit().remove();

    //// Update Tool Tips
    aagToolTip(rectGroup, metricLabel, metricVariable);
    
    //// Update Title Label Display if metric changed
    titleLabel.transition()
        .duration(1000)
        .text(`Average Number of ${metricLabel} per Candidate`);
    //// Update y label display if metric changed
    yAxisLabel.transition()
        .duration(1000)
        .text(`Average Number of ${metricLabel}`);

    return rectGroup;
}

// function used for updating y-scale var
function yBands(score) {
    var yScaleBands = d3.scaleLinear()
        .domain([0, d3.max(score)])
        .range([height, 0])

    return yScaleBands;
}

// function used for updated Y Axis
function renderYBandsAxis(yScaleBands, yBandsAxis) {
    var leftAxis = d3.axisLeft(yScaleBands);

    yBandsAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yBandsAxis;
}

// function used for updating x-scale var
function xBands(bands) {
    // create scale
    var xScaleBands = d3.scaleBand()
        .domain(bands)
        .range([0, width])
        .padding(0);

    return xScaleBands;
}

// function used for updated X Axis
function renderXBandsAxis(xScaleBands, xBandsAxis) {
    var bottomAxis = d3.axisBottom(xScaleBands);

    xBandsAxis.transition()
        .duration(1000)
        .call(bottomAxis)
        .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");

    return xBandsAxis;
}

/// Function for creating Tool Tips
function aagToolTip(rectGroupAAG, metricLabel, metricVariable) {
    var rectToolTip = d3.tip()
        .attr("class", "aag-tooltip")
        .offset([80, -60])
        .html(function(d) {
            return(`${d['user_name']}<br>Avg Number of ${metricLabel}: ${d[metricVariable]}`);
        });

    rectGroupAAG.call(rectToolTip);

    rectGroupAAG.on("mouseover", rectToolTip.show)
        .on("mouseout", rectToolTip.hide);

    return rectGroupAAG;
}       

//////////// Section End
//////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////
/////////////////     Create Initial "At a Glance" Graph     ///////////////
/////////////////////////////////////////////////////////////////////////////

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svgAAG = d3
  .select(".at-a-glance-graph")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  // Append an SVG group
var chartGroupAAG = svgAAG.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Create color variable
var colorBands = d3.scaleOrdinal(d3.schemeCategory20);

// Function to create initial AAG graph
function graphAAG(data) {
    // transform data into applicable form
    var initData = JSON.parse(data);

    // retrieve keys for candidate names
    var bands = initData.map(d => d['user_name']);
    // retrieve average retweet data for candidates
    var retweetAverages = initData.map(d => d['retweet_average']);

    // Create initial metricVariable
    var initMetricVariable = "retweet_average";

    // create scalar for retweet data
    var yScaleBands = d3.scaleLinear()
        .domain([0, d3.max(retweetAverages)])
        .range([height, 0])
    // create scalar for candidate classifier
    var xScaleBands = d3.scaleBand()
        .domain(bands)
        .range([0, width])
        .padding(0);
    // create axis
    var xBandsAxis = d3.axisBottom(xScaleBands);
    var yBandsAxis = d3.axisLeft(yScaleBands);
    // append y axis
    chartGroupAAG.append("g")
        .classed("y-band-axis", true)
        .call(yBandsAxis);
    // append x axis and transform text for readability
    chartGroupAAG.append("g")
        .attr("transform", `translate(0, ${height})`)
        .classed("x-band-axis", true)
        .call(xBandsAxis)
        .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");

    // Append bars
    var rectGroupAAG = chartGroupAAG.selectAll("rect")
        .data(initData)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScaleBands(bands[i]))
        .attr("y", d => yScaleBands(d['retweet_average']))
        .attr("width", xScaleBands.bandwidth())
        .attr("height", d => height - yScaleBands(d['retweet_average']))
        .classed("bandsData", true)
        .style("stroke", "black")
        .style("fill", (d, i) => colorBands(i))

    rectGroupAAG = aagToolTip(rectGroupAAG, metricLabel, initMetricVariable);

    // Append title
    chartGroupAAG.append("text")
        .attr("transform", `translate(${width / 2}, -15)`)
        .attr("text-anchor", "middle")
        .attr("font-size", "30px")
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", "1.5px")
        .attr("font-family", "Lato")
        .classed("title-label", true)
        .text(`Average Number of ${metricLabel} per Candidate`);

    // Append x axis label
    chartGroupAAG.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 130})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("font-family", "Roboto")
        .text("Candidate");

    // Append y axis label
    chartGroupAAG.append("text")
        .attr("transform", `translate(-10, ${height / 2}) rotate(270)`)
        .attr("y", "-50")
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", d3.rgb(150,150,150))
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("font-family", "Roboto")
        .classed("y-axis-label", true)
        .text(`Average Number of ${metricLabel}`)
}

/////////////////////////////////////////////////////////////////////////////
/////////////////     Create Initial Moving Average Graph     ///////////////
/////////////////////////////////////////////////////////////////////////////

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svgMA = d3
  .select(".moving-average-graph")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

//   Append an SVG group
var chartGroupMA = svgMA.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Function will group data by candidate and return data in a form appropriate for creating separate lines
function candidateGroup(data) {
    // Fetch user names
    var candidatesAllNames = data.map(d => d["user_name"]);
    // Filter for only distinct names
    var candidatesUniqueNames = [...new Set(candidatesAllNames)]; 

    var lineList = [];
    // loop through candidates and create data
    for (let i = 0; i < candidatesUniqueNames.length; i++) {

        var candidateName = candidatesUniqueNames[i];

        var candidateData = data.filter(d => d["user_name"] == candidateName);
        // Creates Object which contains candidate name and a list of objects which contain retweet/favorite moving averages
        var candidateObject = {
            userName: candidateName,
            candidateData: candidateData
        };

        lineList.push(candidateObject);
    }

    console.log(lineList);

    return(lineList);
}

////////////////// Create Initial Moving Average Graph
function graphMA(data) {

    var initMA = data;

    // create time parser
    var parseTime = d3.timeParse("%Y-%m-%d");

    // init metric == retweets
    var initMetric = "retweet_moving_average"

    // Modify Data 
    initMA.forEach(function(data) {
        data["moving_average_date"] = parseTime(data["moving_average_date"]);
        data[initMetric] = +data[initMetric];
        data["favorite_moving_average"] = +data["favorite_moving_average"];
    });


    // create scalar for time x-axis
    var xTimeScale = d3.scaleTime()
        .domain(d3.extent(initMA, d => d["moving_average_date"]))
        .range([0, width]);
    // create scalar for y-axis
    var yLinearScale = d3.scaleLinear()
        .domain(d3.extent(initMA, d => d[initMetric]))
        .range([height, 0]);
    // Create Line Generator Function which will create line point data for each candidate
    lineGenerator = d3.line()
        .x(d => xTimeScale(d["moving_average_date"]))
        .y(d => yLinearScale(d[initMetric]))
    // Create Axis
    var bottomAxis = d3.axisBottom(xTimeScale)
        .tickFormat(d3.timeFormat("%m-%d-%Y"))
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append X Axis and Rotate Ticks
    chartGroupMA.append("g")
        .classed("ma-x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

    // Append Y Axis
    chartGroupMA.append("g")
        .classed("ma-y-axis", true)
        .call(leftAxis);

    // Append Chart Lines
    var chartLines = chartGroupMA.selectAll('.line')
        .data(candidateGroup(initMA))
        .enter()
        .append("path")
        .attr("d", function(d) {
            return lineGenerator(d.candidateData)
        })
        .classed("line", true)
        .style("stroke", (d, i) => colorBands(i))
        .style("stroke-width", "2px")

    maToolTip(chartLines, metricLabel, initMetric);
    
    // Append Title
    chartGroupMA.append("text")
        .attr("transform", `translate(${width / 2}, -15)`)
        .attr("text-anchor", "middle")
        .attr("font-size", "30px")
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", "1.5px")
        .attr("font-family", "Lato")
        .classed("ma-title-label", true)
        .text(`Moving Averages for each Candidate`);

    // Append x axis label
    chartGroupMA.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 130})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("font-family", "Roboto")
        .text("Date");

    // Append y axis label
    chartGroupMA.append("text")
        .attr("transform", `translate(-10, ${height / 2}) rotate(270)`)
        .attr("y", "-50")
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", d3.rgb(150,150,150))
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("font-family", "Roboto")
        .classed("ma-y-axis-label", true)
        .text(`Moving Average (${metricLabel})`)

}

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////


///////// Retrieve initial data for displaying graphs on loading page ///////////////////
// request tweet data from server API endpoint
d3.json("/time_init").then(function(data) {
    graphTime(data);
}).catch(function(e) {
    console.log(e);
})

/////////////// Select relevant filter data for event listeners ////////////////////
// Select "Time" Radio Buttons
var bidenTime = d3.select("#time-joe-biden-radio");
var bookerTime = d3.select("#time-cory-booker-radio");
var buttigiegTime = d3.select("#time-pete-buttigieg-radio");
var castroTime = d3.select("#time-julian-castro-radio");
var delaneyTime = d3.select("#time-john-delaney-radio");
var gabbardTime = d3.select("#time-tulsi-gabbard-radio");
var gillibrandTime = d3.select("#time-kirsten-gillibrand-radio");
var gravelTime = d3.select("#time-mike-gravel-radio");
var harrisTime = d3.select("#time-kamala-harris-radio");
var hickenlooperTime = d3.select("#time-john-hickenlooper-radio");
var insleeTime = d3.select("#time-jay-inslee-radio");
var klobucharTime = d3.select("#time-amy-klobuchar-radio");
var messamTime = d3.select("#time-wayne-messam-radio");
var moultonTime = d3.select("#time-seth-moulton-radio");
var rourkeTime = d3.select("#time-beto-rourke-radio");
var ryanTime = d3.select("#time-tim-ryan-radio");
var sandersTime = d3.select("#time-bernie-sanders-radio");
var trumpTime = d3.select("#time-donald-trump-radio");
var warrenTime = d3.select("#time-elizabeth-warren-radio");
var weldTime = d3.select("#time-bill-weld-radio");
var williamsonTime = d3.select("#time-marianne-williamson-radio");
var yangTime = d3.select("#time-andrew-yang-radio");
var swalwellTime = d3.select("#time-eric-swalwell-radio");
var bennetTime = d3.select("#time-michael-bennet-radio");
var bullockTime = d3.select("#time-steve-bullock-radio");
var blasioTime = d3.select("#time-bill-blasio-radio");
var sestakTime = d3.select("#time-joe-sestak-radio");
var steyerTime = d3.select("#time-tom-steyer-radio");

// Select Aggregation Method Buttons
var meanRadioTime = d3.select("#time-mean-radio");
var medianRadioTime = d3.select("#time-median-radio");

// Select "Retweets,Favorites, or Count" Radio Buttons"
var retweetRadioTime = d3.select("#time-retweet-radio");
var favoriteRadioTime = d3.select("#time-favorite-radio");
var countRadioTime = d3.select("#time-count-radio");

// Select "Hourly or Daily" Buttons
var hourlyRadioTime = d3.select("#time-hourly-radio");
var dailyRadioTime = d3.select("#time-daily-radio");

// Select "Date From" and "Date To" Inputs
var dateFromSelectionTime = d3.select("#time-date-from");
var dateToSelectionTime = d3.select("#time-date-to");

// Select "time" Submit Button
var selectionSubmitTime = d3.select(".time-selection-submit");

// Create event listener for submit button
selectionSubmitTime.on("click", submitTimeClick);

// Create Label for variable metric label display on initial load
var timeMetricLabel = "Retweets";
// create variable for functional data type to use
var metricTimeVar = "retweet_average";
// create variable for 'Hour' or "Day" choice
var timeChoice = "Hour";


var chosenCandidate = "939091";
const candidateButtons = d3.selectAll(".time-input-radio");
candidateButtons.on("change", function(d) {
    chosenCandidate = this.value;
})

// function will gather filter selections
function submitTimeClick() {
    // Prevent the page from refreshing
    d3.event.preventDefault();

    /////////////////////////////////////////////

    // Check Aggregation Method Selected

    var aggregationTimeVar;

    if (meanRadioTime.property("checked")) {
        aggregationTimeVar = "average";
    } else {
        aggregationTimeVar = "median";
    }

    /////////////////////////////////////////////

    // Check Retweet/Favorite Selection

    if (retweetRadioTime.property("checked")) {
        metricTimeVar = "retweet_average";
        timeMetricLabel = "Retweets";
    } else if (favoriteRadioTime.property("checked")) {
        metricTimeVar = "favorite_average";
        timeMetricLabel = "Favorites";
    } else {
        metricTimeVar = "count";
        timeMetricLabel = "Count";
    }
    /////////////////////////////////////////////

    // Check Hour/Day Selection

    if (hourlyRadioTime.property("checked")) {
        timeChoice = "Hour";
    } else {
        timeChoice = "Day";
    }

    ////////////////////////////////////////////////////////

    // Check Date Range Selected

    var dateFromTime;
    var dateToTime;
    dateFromTime = dateFromSelectionTime.property("value");
    dateToTime = dateToSelectionTime.property("value");

    // Create time formatter
    var formatTime = d3.timeFormat("%b %d, %Y");
    //// Default Dates will be set to the current date to a month ago if nothing is selected
    var currentDate = new Date();
    var monthAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate()); 

    if (!dateFromTime) {
        dateFromTime = formatTime(monthAgo);
    }
    if (!dateToTime) {
        dateToTime = formatTime(currentDate);
        }
    // console.log(dateFrom);
    // console.log(dateTo);

    ////////////////////////////////////////////


    filteredTimeData(chosenCandidate, metricTimeVar, aggregationTimeVar, dateFromTime, dateToTime, timeChoice);
}

// Function for filtering based on filter selection
function filteredTimeData(chosenCandidate, metricTimeVar, aggregationTimeVar, dateFromTime, dateToTime, timeChoice) {
    //// Send a POST request to the backend to filter data for "Time" bar chart
    console.log(chosenCandidate);
    d3.json("/time_filter", {
        method: "POST",
        body: JSON.stringify({
            chosenCandidate: chosenCandidate,
            dateFrom: dateFromTime,
            dateTo: dateToTime,
            timeBasis: timeChoice
        }),
        headers: {
            "Content-type": "application/json; charset-UTF-i"
        }
    }).then(json => {

        var timeData = json;
        /// set our x and y variables
        var timeBands = json.map(d => d[timeChoice]);
        var yVariable = json.map(d => d[metricTimeVar]);

        // Select Labels
        var timeTitle = d3.select(".time-title-label");
        var xTimeLabel = d3.select(".x-time-label");
        var yTimeLabel = d3.select(".y-time-label");

        // Generate new xaxis sclar, select current x-axis, and render/transition to new axis
        xScaleTimeBands = xTimeBands(timeBands);
        xTimeBandsAxis = d3.select(".x-time-axis");
        renderXTimeBandsAxis(xScaleTimeBands, xTimeBandsAxis);
        // Generate new yaxis scalar, select current y-axis, and render/transition to new axis
        yScaleTimeBands = yTimeBands(yVariable);
        yTimeBandsAxis = d3.select(".y-time-axis");
        renderYTimeBandsAxis(yScaleTimeBands, yTimeBandsAxis);

        //Generate new Bars
        renderTimeRect(timeBands, xScaleTimeBands, timeData, timeTitle, yScaleTimeBands, xTimeLabel, yTimeLabel, metricTimeVar);


    })
}

// function for updating "Time" graph bars
function renderTimeRect(timeBands, xScaleTimeBands, timeData, timeTitle, yScaleTimeBands, xTimeLabel, yTimeLabel, metricTimeVar) {
    // Select current bars and pass in filtered data
    var rectGroupTime = chartGroupTime.selectAll("rect")
        .data(timeData)
    // Enter any new data, merge/update existing data
        rectGroupTime.enter()
        .append("rect")
        .merge(rectGroupTime)
        .style("fill", (d, i) => colorBands(i))
        .style("stroke", "black")
        .attr("x", (d, i) => xScaleTimeBands(timeBands[i]))
        .attr("y", d => yScaleTimeBands(d[metricTimeVar]))
        .attr("width", xScaleTimeBands.bandwidth())
        .attr("height", d => height - yScaleTimeBands(d[metricTimeVar]))
    // Remove any left over data
        rectGroupTime.exit().remove();
    
    // Update Tool Tips
    timeToolTip(rectGroupTime, timeMetricLabel, metricTimeVar);

    // Update Labels
    xTimeLabel.transition()
        .duration(1000)
        .text(`${timeChoice}`)
    
    if (timeMetricLabel == "Count") {
        timeTitle.transition()
            .duration(1000)
            .text(`Total Number of Tweets per ${timeChoice}: ${timeData[0]["user_name"]}`)
        yTimeLabel.transition()
            .duration(1000)
            .text("Total Number of Tweets")
    } else {
        timeTitle.transition()
            .duration(1000)
            .text(`Average Number of ${timeMetricLabel} per ${timeChoice}: ${timeData[0]["user_name"]}`)
        yTimeLabel.transition()
            .duration(1000)
            .text(`Average Number of ${timeMetricLabel}`)
    }

    return rectTimeGroup;
}

// funciton used for updating y axis scalar
function yTimeBands(yVariable) {
    var yScaleTimeBands = d3.scaleLinear()
        .domain([0, d3.max(yVariable)])
        .range([height, 0])

    return yScaleTimeBands;
}

// function used for updating Y Axis 
function renderYTimeBandsAxis(yScaleTimeBands, yTimeBandsAxis) {
    var leftAxis = d3.axisLeft(yScaleTimeBands);

    yTimeBandsAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yTimeBandsAxis;
}
// function used for updating x-axis scalar
function xTimeBands(timeBands) {
    // create scale
    var xScaleTimeBands = d3.scaleBand()
        .domain(timeBands)
        .range([0, width])

    return xScaleTimeBands;
}

// function used for updateing X Axis
function renderXTimeBandsAxis(xScaleTimeBands, xTimeBandsAxis) {
    var bottomAxis = d3.axisBottom(xScaleTimeBands);

    xTimeBandsAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xTimeBandsAxis;
}

function timeToolTip(rectGroupTime, timeMetricLabel, metricTimeVar) {

    if (timeMetricLabel == "Count") {
    var rectToolTip = d3.tip()
        .attr("class", "time-tooltip")
        .offset([80, -60])
        .html(function(d) {
            return(`${d['user_name']}<br>Total Number of Tweets: ${d[metricTimeVar]}<br>${timeChoice}: ${d[timeChoice]}`)
        });
    } else {
    var rectToolTip = d3.tip()
        .attr("class", "time-tooltip")
        .offset([80, -60])
        .html(function(d) {
            return(`${d['user_name']}<br>Avg Number of ${timeMetricLabel}: ${d[metricTimeVar]}<br>${timeChoice}: ${d[timeChoice]}`)
        });
    }

    rectGroupTime.call(rectToolTip)

    rectGroupTime.on("mouseover", rectToolTip.show)
        .on("mouseout", rectToolTip.hide);
    
    return rectGroupTime;
}


////////////////////////////////////////////////////////////////////////////
////////////////////// Create Initial "Time" Graph /////////////////////////
/////////////////////////////////////////////////////////////////////////////

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svgTime = d3
  .select(".time-graph")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  // Append an SVG group
var chartGroupTime = svgTime.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Function to create initial Time Graph
function graphTime(data) {
    // Transform data into applicable form
    // var initTime = JSON.parse(data);
    var initTime = data;
    // Initial candidate = Joe Biden
    var initCandidate = "Joe Biden"
    // retrieve data type (hours)
    var timeBands = initTime.map(d => d[timeChoice]);
    // retrieve hourly average retweet data for candidate
    var timeAverages = initTime.map(d => d[metricTimeVar]);
    // create scalar for retweet data
    var yScaleBands = d3.scaleLinear()
        .domain([0, d3.max(timeAverages)])
        .range([height, 0]);
    // create scalar for hourly categories
    var xScaleBands = d3.scaleBand()
        .domain(timeBands)
        .range([0, width])
    // create axis
    var xBandsAxis = d3.axisBottom(xScaleBands);
    var yBandsAxis = d3.axisLeft(yScaleBands);
    // Append x axis
    chartGroupTime.append("g")
        .attr("transform", `translate(0, ${height})`)
        .classed("x-time-axis", true)
        .call(xBandsAxis);
    // Append y axis
    chartGroupTime.append("g")
        .classed("y-time-axis", true)
        .call(yBandsAxis);

    // Append bars
    var rectGroupTime = chartGroupTime.selectAll("rect")
        .data(initTime)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScaleBands(timeBands[i]))
        .attr("y", d => yScaleBands(d[metricTimeVar]))
        .attr("width", xScaleBands.bandwidth())
        .attr("height", d => height - yScaleBands(d[metricTimeVar]))
        .classed("timeBands", true)
        .style("stroke", "black")
        .style("fill", (d, i) => colorBands(i))

    rectGroupTime = timeToolTip(rectGroupTime, timeMetricLabel, metricTimeVar)

    // Append title
    chartGroupTime.append("text")
        .attr("transform", `translate(${width / 2}, -15)`)
        .attr("text-anchor", "middle")
        .attr("font-size", "30px")
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", "1.5px")
        .attr("font-family", "Lato")
        .classed("time-title-label", true)
        .text(`Average Number of ${timeMetricLabel} per ${timeChoice}: ${initCandidate}`)
    // Append x axis label
    chartGroupTime.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 50})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("font-family", "Roboto")
        .classed("x-time-label", true)
        .text(`${timeChoice}`)
    // Append y ais label
    chartGroupTime.append("text")
        .attr("transform", `translate(-10, ${height / 2}) rotate(270)`)
        .attr("text-anchor", "middle")
        .attr("y", "-50")
        .attr("font-size", "18px")
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("font-family", "Roboto")
        .classed("y-time-label", true)
        .text(`Average Number of ${timeMetricLabel}`)
}