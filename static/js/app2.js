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
var svgWidth = 900;

var margin = {
  top: 60,
  right: 40,
  bottom: 140,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svgAAG = d3
  .select(".at-a-glance-graph")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var svgMA = d3
    .select(".moving-average-graph")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var svgTime = d3
  .select(".time-graph")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var svgHist = d3
    .select(".histogram-graph")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight + 50);

var svgBox = d3
    .select(".box-plot-graph")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);


var svgTweets = d3
    .select("#tweet-title")
    .append("svg")
    .attr("width", 1742)
    .attr("height", 100);


// Append an SVG group
var chartGroupAAG = svgAAG.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chartGroupMA = svgMA.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chartGroupTime = svgTime.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chartGroupHist = svgHist.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chartGroupBox = svgBox.append("g")
    .attr("transform",`translate(${margin.left}, ${margin.top})`)

var chartGroupTweets = svgTweets.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
    // .attr("transform", `translate(0, 0)`);


// Create color variable
var colorBands = d3.scaleOrdinal(d3.schemeCategory20);

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

    // console.log(lineList);

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

// create variable for candidate info to display, and change depending on radio changes
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
    
    // Create color variable
    var myColor = d3.scaleSequential()
        .interpolator(d3.interpolateInferno)
        .domain([0, timeBands.length])

        // Select current bars and pass in filtered data
    var rectGroupTime = chartGroupTime.selectAll("rect")
        .data(timeData)
    // Enter any new data, merge/update existing data
        rectGroupTime.enter()
        .append("rect")
        .merge(rectGroupTime)
        .style("fill", (d, i) => myColor(i))
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

    return rectGroupTime;
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
        .paddingInner([.1]);

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
// Function used for creating tool tips
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
        .paddingInner([.1])
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

    // Create color variable
    var myColor = d3.scaleSequential()
        .interpolator(d3.interpolateInferno)
        .domain([0, timeBands.length])

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
        .style("fill", (d, i) => myColor(i))

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



/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

///////// Retrieve initial data for displaying graphs on loading page ///////////////////
// request tweet data from server API endpoint
d3.json("/histogram_init").then(function(data) {
    graphHist(data);
}).catch(function(e) {
    console.log(e);
})


/////////////// Select relevant filter data for event listeners ////////////////////
// Select "Dist" Radio Buttons
var bidenDist = d3.select("#dist-joe-biden-checkbox");
var bookerDist = d3.select("#dist-cory-booker-checkbox");
var buttigiegDist = d3.select("#dist-pete-buttigieg-checkbox");
var castroDist = d3.select("#dist-julian-castro-checkbox");
var delaneyDist = d3.select("#dist-john-delaney-checkbox");
var gabbardDist = d3.select("#dist-tulsi-gabbard-checkbox");
var gillibrandDist = d3.select("#dist-kirsten-gillibrand-checkbox");
var gravelDist = d3.select("#dist-mike-gravel-checkbox");
var harrisDist = d3.select("#dist-kamala-harris-checkbox");
var hickenlooperDist = d3.select("#dist-john-hickenlooper-checkbox");
var insleeDist = d3.select("#dist-jay-inslee-checkbox");
var klobucharDist = d3.select("#dist-amy-klobuchar-checkbox");
var messamDist = d3.select("#dist-wayne-messam-checkbox");
var moultonDist = d3.select("#dist-seth-moulton-checkbox");
var rourkeDist = d3.select("#dist-beto-rourke-checkbox");
var ryanDist = d3.select("#dist-tim-ryan-checkbox");
var sandersDist = d3.select("#dist-bernie-sanders-checkbox");
var trumpDist = d3.select("#dist-donald-trump-checkbox");
var warrenDist = d3.select("#dist-elizabeth-warren-checkbox");
var weldDist = d3.select("#dist-bill-weld-checkbox");
var williamsonDist = d3.select("#dist-marianne-williamson-checkbox");
var yangDist = d3.select("#dist-andrew-yang-checkbox");
var swalwellDist = d3.select("#dist-eric-swalwell-checkbox");
var bennetDist = d3.select("#dist-michael-bennet-checkbox");
var bullockDist = d3.select("#dist-steve-bullock-checkbox");
var blasioDist = d3.select("#dist-bill-blasio-checkbox");
var sestakDist = d3.select("#dist-joe-sestak-checkbox");
var steyerDist = d3.select("#dist-tom-steyer-checkbox");

// Select Aggregation Method Buttons
var meanRadioDist = d3.select("#dist-mean-radio");
var medianRadioDist = d3.select("#dist-median-radio");

// Select "Retweets,Favorites, or Count" Radio Buttons"
var retweetRadioDist = d3.select("#dist-retweet-radio");
var favoriteRadioDist = d3.select("#dist-favorite-radio");
var countRadioDist = d3.select("#dist-count-radio");

// Select "Date From" and "Date To" Inputs
var dateFromSelectionDist = d3.select("#dist-date-from");
var dateToSelectionDist = d3.select("#dist-date-to");

// Select "dist" Submit Button
var selectionSubmitDist = d3.select(".dist-selection-submit");

// Create event listener for submit button
selectionSubmitDist.on("click", submitDistClick);

// Create Label for variable metric label display on initial load
var distMetricLabel = "Retweets";
// create variable for functional data type to use
var distMetricVar = "retweet_average";

function submitDistClick() {
    // Create list to append all checked candidates
    var candidatesList = [];
    // Prevent the page from refreshing
    d3.event.preventDefault();

    ////////////////////////////////////////////////////
    // Append list with names whose boxes are checked
    if (bidenDist.property("checked")) {
        candidatesList.push("939091");
    }
    if (bookerDist.property("checked")) {
        candidatesList.push("15808765");
    }
    if (buttigiegDist.property("checked")) {
        candidatesList.push("226222147");
    }
    if (castroDist.property("checked")) {
        candidatesList.push("19682187");
    }
    if (delaneyDist.property("checked")) {
        candidatesList.push("426028646");
    }
    if (gabbardDist.property("checked")) {
        candidatesList.push("26637348");
    }
    if (gillibrandDist.property("checked")) {
        candidatesList.push("72198806");
    }
    if (gravelDist.property("checked")) {
        candidatesList.push("14709326");
    }
    if (harrisDist.property("checked")) {
        candidatesList.push("30354991");
    }
    if (hickenlooperDist.property("checked")) {
        candidatesList.push("117839957");
    }
    if (insleeDist.property("checked")) {
        candidatesList.push("21789463");
    }
    if (klobucharDist.property("checked")) {
        candidatesList.push("33537967");
    }
    if (messamDist.property("checked")) {
        candidatesList.push("33954145");
    }
    if (moultonDist.property("checked")) {
        candidatesList.push("248495200");
    }
    if (rourkeDist.property("checked")) {
        candidatesList.push("342863309");
    }
    if (ryanDist.property("checked")) {
        candidatesList.push("466532637");
    }
    if (sandersDist.property("checked")) {
        candidatesList.push("216776631");
    }
    if (trumpDist.property("checked")) {
        candidatesList.push("25073877");
    }
    if (warrenDist.property("checked")) {
        candidatesList.push("357606935");
    }
    if (weldDist.property("checked")) {
        candidatesList.push("734783792502575105");
    }
    if (williamsonDist.property("checked")) {
        candidatesList.push("21522338");
    }
    if (yangDist.property("checked")) {
        candidatesList.push("2228878592");
    }
    if (swalwellDist.property("checked")) {
        candidatesList.push("942156122");
    }
    if (bennetDist.property("checked")) {
        candidatesList.push("45645232");
    }
    if (bullockDist.property("checked")) {
        candidatesList.push("111721601");
    }
    if (blasioDist.property("checked")) {
        candidatesList.push("476193064");
    }
    if (sestakDist.property("checked")) {
        candidatesList.push("46764631");
    }
    if (steyerDist.property("checked")) {
        candidatesList.push("949934436");
    }


    /////////////////////////////////////////////

    // Check Aggregation Method Selected

    var aggregationDistVar;

    if (meanRadioDist.property("checked")) {
        aggregationDistVar = "average";
    } else {
        aggregationDistVar = "median";
    }

    /////////////////////////////////////////////

    // Check Retweet/Favorite Selection

    if (retweetRadioDist.property("checked")) {
        distMetricVar = "retweet_count";
        distMetricLabel = "Retweets";
    } else {
        distMetricVar = "favorite_count";
        distMetricLabel = "Favorites";
    }
    /////////////////////////////////////////////

    // Check Date Range Selected

    var dateFromDist;
    var dateToDist;
    dateFromDist = dateFromSelectionDist.property("value");
    dateToDist = dateToSelectionDist.property("value");

    // Create time formatter
    var formatTime = d3.timeFormat("%b %d, %Y");
    //// Default Dates will be set to the current date to a month ago if nothing is selected
    var currentDate = new Date();
    var monthAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate()); 

    if (!dateFromDist) {
        dateFromDist = formatTime(monthAgo);
    }
    if (!dateToDist) {
        dateToDist = formatTime(currentDate);
        }


    ////////////////////////////////////////////


    filteredDistData(candidatesList, distMetricVar, aggregationDistVar, dateFromDist, dateToDist);

}

// Function for filtering based on filter selection
function filteredDistData(candidatesList, distMetricVar, aggregationDistVar, dateFromDist, dateToDist) {
    //// Send a POST request to the backend to filter data for "Hist" bar chart
    d3.json("/histogram_filter", {
        method: "POST",
        body: JSON.stringify({
            candidatesList: candidatesList,
            dateFrom: dateFromDist,
            dateTo: dateToDist,
            distMetricVar: distMetricVar
        }),
        headers: {
            "Content-type": "application/json; charset-UTF-i"
        }
    }).then(json => {

        var histData = json;
        /// set our x and y variables
        var histBands = json.map(d => d["tick"]);
        var histCount = json.map(d => d["count"]);

        // Select Labels
        var histTitle = d3.select(".hist-title-label");
        var xHistLabel = d3.select(".x-hist-label");
        var yHistLabel = d3.select(".y-hist-label");

        // Generate new xaxis sclar, select current x-axis, and render/transition to new axis
        xScaleHistBands = xHistBands(histBands);
        xHistBandsAxis = d3.select(".x-hist-axis");
        renderXHistBandsAxis(xScaleHistBands, xHistBandsAxis);
        // Generate new yaxis scalar, select current y-axis, and render/transition to new axis
        yScaleHistBands = yHistBands(histCount);
        yHistBandsAxis = d3.select(".y-hist-axis");
        renderYHistBandsAxis(yScaleHistBands, yHistBandsAxis);

        //Generate new Bars
        renderHistRect(histBands, xScaleHistBands, histData, histTitle, yScaleHistBands, xHistLabel, distMetricLabel);
    })
    //// Send a POST request to the backend to filter data for "Box Plot" bar chart
    d3.json("/box_plot_filter", {
        method: "POST",
        body: JSON.stringify({
            candidatesList: candidatesList,
            dateFrom: dateFromDist,
            dateTo: dateToDist,
            distMetricVar: distMetricVar
        }),
        headers: {
            "Content-type": "application/json; charset-UTF-i"
        }
        }).then(json => {
            var boxData = json;
            // set our variables
            var boxBands = json.map(d => d["user_name"]);
            var maxData = boxData.map(d => d["max"]);
            var minData = boxData.map(d => d["min"]);

            // Generate new xaxis scalar, select current x-axis, and render/transition to new axis
            var xBoxScale = xBoxBands(boxBands);
            var xBoxAxis = d3.select(".x-box-axis");
            renderXBoxAxis(xBoxScale, xBoxAxis);
            // Generate new yaxis scalar, select current y-axis and render/transition to new axis
            var yBoxScale = yBoxBands(maxData, minData);
            var yBoxAxis = d3.select(".y-box-axis");
            renderYBoxAxis(yBoxScale, yBoxAxis);

            // Select Labels   
            var boxTitle = d3.select(".box-title-label");
            var yBoxLabel = d3.select(".y-box-label");
            
            renderBoxRect(boxData, boxBands, xBoxScale, boxTitle, yBoxLabel, yBoxScale, distMetricLabel);
        })
    
}

// Function for rendering new rects
function renderBoxRect(boxData, boxBands, xBoxScale, boxTitle, yBoxLabel, yBoxScale, distMetricLabel) {
    // Select current bars and pass in filteredData
    var rectGroupBox = chartGroupBox.selectAll(".boxes")
        .data(boxData)
    // Enter any new data, merge/update existing data
        rectGroupBox.enter()
        .append("rect")
        .merge(rectGroupBox)
        .attr("x", function(d,i) {
            return (xBoxScale(boxBands[i]));
        })
        .attr("y", function(d) {
            return (yBoxScale(d["q3"]));
        })
        .attr("height", function(d) {
            return (yBoxScale(d["q1"]) - yBoxScale(d["q3"]));
        })
        .attr("width", d => xBoxScale.bandwidth())
        .attr("stroke", "black")
        .style("fill", "#69b3a2")
    // Remove any left over data
    rectGroupBox.exit().remove();

    // Select current verticle line and pass in filtered Data
    var verticleLines = d3.selectAll(".vertLines")
        .data(boxData)
        verticleLines.enter()
        .append("line")
        .merge(verticleLines)
        .attr("x1", function(d, i) {
            return(xBoxScale(boxBands[i]) + xBoxScale.bandwidth()/2);
        })
        .attr("x2", function(d, i) {
            return(xBoxScale(boxBands[i]) + xBoxScale.bandwidth()/2);
        })
        .attr("y1", function(d) {
            return(yBoxScale(d["min"]));
        })
        .attr("y2", function(d) {
            return(yBoxScale(d["max"]));
        })
        .attr("stroke", "black")
        .attr("width", 40)
    verticleLines.exit().remove();

    // Select current median lines and pass in filtered data
    var medianLines = d3.selectAll(".medianLines")
        .data(boxData)
        medianLines.enter()
        .append("line")
        .merge(medianLines)
        .attr("x1", function(d, i) {
            return(xBoxScale(boxBands[i]));
        })
        .attr("x2", function(d, i) {
            return(xBoxScale(boxBands[i])+ xBoxScale.bandwidth());
        })
        .attr("y1", function(d) {
            return (yBoxScale(d["median"]));
        })
        .attr("y2", function(d) {
            return (yBoxScale(d["median"]));
        })
        .attr("stroke", "black")
        .style("width", 50)
    medianLines.exit().remove();

    boxTitle.transition()
        .duration(1000)
        .text(`Candidate Box Plots (ln transformed): ${distMetricLabel}`);

    yBoxLabel.transition()
        .duration(1000)
        .text(`${distMetricLabel} (ln transformed)`)

    return rectGroupBox;
}

// Function for creating new y scale
function yBoxBands(maxData, minData) {
    var yBoxScale = d3.scaleLinear()
        .domain([(d3.min(minData) - d3.max(maxData) *.05), d3.max(maxData) * 1.05])
        .range([height, 0]);

    return yBoxScale;
}

// Function for rendering new y Axis
function renderYBoxAxis(yBoxScale, yBoxAxis) {
    var leftAxis = d3.axisLeft(yBoxScale);

    yBoxAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yBoxAxis;
}

// Function for creating new scale
function xBoxBands(boxBands) {
    var xBoxScale = d3.scaleBand()
        .domain(boxBands)
        .range([0, width])
        .paddingInner([0.1])
        .paddingOuter([0.5]);

    return xBoxScale;
}

// Funciton for rendering new xScale
function renderXBoxAxis(xBoxScale, xBoxAxis) {
    var bottomAxis = d3.axisBottom(xBoxScale);

    xBoxAxis.transition()
        .duration(1000)
        .call(bottomAxis)
        .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");

    return xBoxAxis;
}

// function used for updated "Hist" Graph Bars
function renderHistRect(histBands, xScaleHistBands, histData, histTitle, yScaleHistBands, xHistLabel, distMetricLabel) {
    // Select current bars and pass in filtered data
    var rectGroupHist = chartGroupHist.selectAll("rect")
        .data(histData)
    // Enter any new data, merge/update existing data
        rectGroupHist.enter()
        .append("rect")
        .merge(rectGroupHist)
        .style("fill", (d, i) => colorBands(i))
        .style("stroke", "black")
        .attr("x", (d, i) => xScaleHistBands(histBands[i]))
        .attr("y", function(d, i) {
            if (d["count"] == 0) {
                return yScaleHistBands(1);
            } else {
                return yScaleHistBands(d["count"]);
            }
        })
        .attr("width", d => xScaleHistBands.bandwidth())
        .attr("height", function(d, i) {
            if (d["count"] == 0) {
                return height - yScaleHistBands(1);
            } else {
                return height - yScaleHistBands(d["count"]);
            }
        })
    // Remove any left over data
    rectGroupHist.exit().remove();

    // Update Labels
    histTitle.transition()
        .duration(1000)
        .text(`Distribution of Frequencies (Log Scaled): ${distMetricLabel}`);

    xHistLabel.transition()
        .duration(1000)
        .text(`Value Ranges: ${distMetricLabel}`);

    return rectGroupHist;
}

// function used for updateing y-axis scalar
function yHistBands(histCount) {
    // Create Scalar
    var yScaleHistBands = d3.scaleLog()
        .domain([1, d3.max(histCount)])
        .range([height, 0]);

    return yScaleHistBands;
}

// function used for updating Y Axis
function renderYHistBandsAxis(yScaleHistBands, yHistBandsAxis) {
    var leftAxis = d3.axisLeft(yScaleHistBands);

    yHistBandsAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yHistBandsAxis;
}
// function used for updating x-axis scalar
function xHistBands(histBands) {
    // Create Scale
    var xScaleHistBands = d3.scaleBand()
        .domain(histBands)
        .range([0, width])

    return xScaleHistBands;
}
// function used for updateing X Axis
function renderXHistBandsAxis(xScaleHistBands, xHistBandsAxis) {

    var bottomAxis = d3.axisBottom(xScaleHistBands)
        .tickFormat(function(d, i) {
            if (i % 9 == 0) {
                return d;
            }
        })

    xHistBandsAxis.transition()
        .duration(1000)
        .call(bottomAxis)
        .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");

    return xHistBandsAxis;
}

////////////////////////////////////////////////////////////////////////////
////////////////////// Create Initial "Histogram" Graph /////////////////////////
/////////////////////////////////////////////////////////////////////////////

// Function to create initial Time Graph
function graphHist(data) {
    // Transform data into applicable form
    var initHist = data;
    // retrieve data type (value ranges)
    var histBands = initHist.map(d => d['tick']);
    // retrieve frequency data: initial data is retweet frequency
    var histFreq = initHist.map(d => d['count']);
    // create scalar for retweet data
    // We are using log frequencies because it makes the graph more visually appealing
    var yScaleBands = d3.scaleLog()
        .domain([1, d3.max(histFreq)])
        .range([height, 0]);
    // create scalar for hourly categories
    var xScaleBands = d3.scaleBand()
        .domain(histBands)
        .range([0, width])
    // create axis, separate out the ticks because there are too many
    var xBandsAxis = d3.axisBottom(xScaleBands)
        .tickFormat(function(d, i) {
            if (i % 9 == 0) {
                return d;
            }
        })
    var yBandsAxis = d3.axisLeft(yScaleBands);
    // Append x axis
    chartGroupHist.append("g")
        .attr("transform", `translate(0, ${height})`)
        .classed("x-hist-axis", true)
        .call(xBandsAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");
    // Append y axis
    chartGroupHist.append("g")
        .classed("y-hist-axis", true)
        .call(yBandsAxis);

    // Append bars
    // Account for the log scalar by replacing any 0 values with 1
    var rectGroupHist = chartGroupHist.selectAll("rect")
        .data(initHist)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScaleBands(histBands[i]))
        .attr("y", function(d) {
            if (d["count"] == 0) {
                return yScaleBands(1);
            } else {
                return yScaleBands(d["count"]);
            }
        })
        .attr("width", xScaleBands.bandwidth())
        .attr("height", function(d) {
            if (d["count"] == 0) {
                return height - yScaleBands(1);
            } else {
                return height - yScaleBands(d["count"]);
            }
        })
        .classed("histBands", true)
        .style("stroke", "black")
        .style("fill", (d, i) => colorBands(i))

    // rectGroupTime = timeToolTip(rectGroupTime, timeMetricLabel, metricTimeVar)

    // Append title
    chartGroupHist.append("text")
        .attr("transform", `translate(${width / 2}, -15)`)
        .attr("text-anchor", "middle")
        .attr("font-size", "30px")
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", "1.5px")
        .attr("font-family", "Lato")
        .classed("hist-title-label", true)
        .text(`Distribution of Frequencies (Log Scaled): ${distMetricLabel}`)
    // Append x axis label
    chartGroupHist.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 150})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("font-family", "Roboto")
        .classed("x-hist-label", true)
        .text(`Value Ranges: ${distMetricLabel}`)
    // Append y ais label
    chartGroupHist.append("text")
        .attr("transform", `translate(-10, ${height / 2}) rotate(270)`)
        .attr("text-anchor", "middle")
        .attr("y", "-50")
        .attr("font-size", "18px")
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("font-family", "Roboto")
        .classed("y-hist-label", true)
        .text("Frequency (Log Scaled)")
}



///////// Retrieve initial data for displaying graphs on loading page ///////////////////
// request tweet data from server API endpoint

d3.json("/box_plot_init").then(function(d) {
    graphBox(d);
}).catch(function(e) {
    console.log(e);
})

////////////////////////////////////////////////////////////////////////////
////////////////////// Create Initial "Box Plot" Graph /////////////////////////
/////////////////////////////////////////////////////////////////////////////

function graphBox(data) {
    // var boxData = JSON.parse(data);
    var boxData = data;

    var boxBands = boxData.map(d => d["user_name"]);

    var maxData = boxData.map(d => d["max"]);
    var minData = boxData.map(d => d["min"]);

    var yScaleLinear = d3.scaleLinear()
        .domain([(d3.min(minData) - d3.max(maxData) *.05), d3.max(maxData) * 1.05])
        .range([height, 0]);

    // var maxSelection = d3.max(1, d3.min(minData));

    // var yScaleLog = d3.scaleLog()
    //     .domain([1, d3.max(maxData)])
    //     .range([height, 0]);
    
    var xScaleBands = d3.scaleBand()
        .domain(boxBands)
        .range([0, width])
        .paddingInner([0.1])
        .paddingOuter([0.5]);

    // console.log(xScaleBands.bandwidth())

    var bottomAxis = d3.axisBottom(xScaleBands);

    // var leftAxis = d3.axisLeft(yScaleLinear);
    var leftAxis = d3.axisLeft(yScaleLinear);


    chartGroupBox.append("g")
        .attr("transform", `translate(0, ${height})`)
        .classed("x-box-axis", true)
        .call(bottomAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

    chartGroupBox.append("g")
        .classed("y-box-axis", true)
        .call(leftAxis)


    // Show the main vertical line
    chartGroupBox.selectAll("vertLines")
        .data(boxData)
        .enter()
        .append("line")
        .classed("vertLines", true)
        .attr("x1", function(d, i){
            return(xScaleBands(boxBands[i]) + xScaleBands.bandwidth()/2)
        })
        .attr("x2", function(d, i){
            return(xScaleBands(boxBands[i])+ xScaleBands.bandwidth()/2)
        })
        .attr("y1", function(d){
            return(yScaleLinear(d["min"]))
        })
        .attr("y2", function(d){
            return(yScaleLinear(d["max"]))
        })
        .attr("stroke", "black")
        .style("width", 40)

    var rectGroupBox = chartGroupBox.selectAll("boxes")
        .data(boxData)
        .enter()
        .append("rect")
        .classed("boxes", true)
        .attr("x", function(d,i) {
            return (xScaleBands(boxBands[i]));
        })
        .attr("y", function(d) {
            return (yScaleLinear(d["q3"]));
        })
        .attr("height", function(d) {
            return (yScaleLinear(d["q1"]) - yScaleLinear(d["q3"]));
        })
        .attr("width", xScaleBands.bandwidth())
        .attr("stroke", "black")
        .style("fill", "#69b3a2")

    chartGroupBox.selectAll("medianLines")
        .data(boxData)
        .enter()
        .append("line")
        .classed("medianLines", true)
        .attr("x1", function(d, i) {
            return (xScaleBands(boxBands[i]));
        })
        .attr('x2', function(d, i) {
            return(xScaleBands(boxBands[i]) + xScaleBands.bandwidth());
        })
        .attr('y1', function(d) {
            return (yScaleLinear(d["median"]));
        })
        .attr('y2', function(d) {
            return (yScaleLinear(d["median"]));
        })
        .attr("stroke", "black")
        .style("width", 50);

    // Append title
    chartGroupBox.append("text")
        .attr("transform", `translate(${width / 2}, -15)`)
        .attr("text-anchor", "middle")
        .attr("font-size", "30px")
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", "1.5px")
        .attr("font-family", "Lato")
        .classed("box-title-label", true)
        .text(`Candidate Box Plots (ln transformed): ${distMetricLabel}`)
    // Append x axis label
    chartGroupBox.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 130})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("font-family", "Roboto")
        .classed("x-box-label", true)
        .text(`Candidate`)
    // Append y ais label
    chartGroupBox.append("text")
        .attr("transform", `translate(-10, ${height / 2}) rotate(270)`)
        .attr("text-anchor", "middle")
        .attr("y", "-50")
        .attr("font-size", "18px")
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("font-family", "Roboto")
        .classed("y-box-label", true)
        .text(`${distMetricLabel} (ln transformed)`)


}

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////


// Initialize tweet list
d3.json("/tweets_init").then(function(d) {
    tweetsDisplay(d);
}).catch(function(e) {
    console.log(e);
})



/////////////// Select relevant filter data for event listeners ////////////////////
// Select "Tweets" Radio Buttons
var bidenTweets = d3.select("#tweets-joe-biden-radio");
var bookerTweets = d3.select("#tweets-cory-booker-radio");
var buttigiegTweets = d3.select("#tweets-pete-buttigieg-radio");
var castroTweets = d3.select("#tweets-julian-castro-radio");
var delaneyTweets = d3.select("#tweets-john-delaney-radio");
var gabbardTweets = d3.select("#tweets-tulsi-gabbard-radio");
var gillibrandTweets = d3.select("#tweets-kirsten-gillibrand-radio");
var gravelTweets = d3.select("#tweets-mike-gravel-radio");
var harrisTweets = d3.select("#tweets-kamala-harris-radio");
var hickenlooperTweets = d3.select("#tweets-john-hickenlooper-radio");
var insleeTweets = d3.select("#tweets-jay-inslee-radio");
var klobucharTweets = d3.select("#tweets-amy-klobuchar-radio");
var messamTweets = d3.select("#tweets-wayne-messam-radio");
var moultonTweets = d3.select("#tweets-seth-moulton-radio");
var rourkeTweets = d3.select("#tweets-beto-rourke-radio");
var ryanTweets = d3.select("#tweets-tim-ryan-radio");
var sandersTweets = d3.select("#tweets-bernie-sanders-radio");
var trumpTweets = d3.select("#tweets-donald-trump-radio");
var warrenTweets = d3.select("#tweets-elizabeth-warren-radio");
var weldTweets = d3.select("#tweets-bill-weld-radio");
var williamsonTweets = d3.select("#tweets-marianne-williamson-radio");
var yangTweets = d3.select("#tweets-andrew-yang-radio");
var swalwellTweets = d3.select("#tweets-eric-swalwell-radio");
var bennetTweets = d3.select("#tweets-michael-bennet-radio");
var bullockTweets = d3.select("#tweets-steve-bullock-radio");
var blasioTweets = d3.select("#tweets-bill-blasio-radio");
var sestakTweets = d3.select("#tweets-joe-sestak-radio");
var steyerTweets = d3.select("#tweets-tom-steyer-radio");

// Select "Retweets,Favorites" Radio Buttons"
var retweetRadioTweets = d3.select("#tweets-retweet-radio");
var favoriteRadioTweets = d3.select("#tweets-favorite-radio");


// Select "Date From" and "Date To" Inputs
var dateFromSelectionTweets = d3.select("#tweets-date-from");
var dateToSelectionTweets = d3.select("#tweets-date-to");

// Select "tweets" Submit Button
var tweetSubmit = d3.select(".tweets-selection-submit");

// Create event listener for submit button
tweetSubmit.on("click", submitTweetsClick);

// Create Label for variable metric label display on initial load
var tweetMetricLabel = "Retweets";

// create variable for candidate info to display, and change depending on radio changes
var chosenTweetsCandidate = "939091";
const candidateTweetsButtons = d3.selectAll(".tweets-input-radio");
candidateTweetsButtons.on("change", function(d) {
    chosenTweetsCandidate = this.value;
})

function submitTweetsClick() {
    // Prevent the page from refreshing
    d3.event.preventDefault();


    /////////////////////////////////////////////

    // Check Retweet/Favorite Selection

    if (retweetRadioTweets.property("checked")) {
        tweetMetricLabel = "Retweets";
    } else {
        tweetMetricLabel = "Favorites";
    }
    ////////////////////////////////////////////////////////

    // Check Date Range Selected

    var dateFromTweets;
    var dateToTweets;
    dateFromTweets = dateFromSelectionTweets.property("value");
    dateToTweets = dateToSelectionTweets.property("value");

    // Create time formatter
    var formatTime = d3.timeFormat("%b %d, %Y");
    //// Default Dates will be set to the current date to a month ago if nothing is selected
    var currentDate = new Date();
    var monthAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate()); 

    if (!dateFromTweets) {
        dateFromTweets = formatTime(monthAgo);
    }
    if (!dateToTweets) {
        dateToTweets = formatTime(currentDate);
        }

    filteredTweetsData(chosenTweetsCandidate, tweetMetricLabel, dateFromTweets, dateToTweets);
}

// Function for sending data with "POST" and retrieving new Tweet list
function filteredTweetsData(chosenTweetsCandidate, tweetMetricLabel, dateFromTweets, dateToTweets) {
    //// Send a POST request to the backend to filter data for "Tweets" list
    d3.json("/tweets_filter", {
        method: "POST",
        body: JSON.stringify({
            chosenTweetsCandidate: chosenTweetsCandidate,
            dateFrom: dateFromTweets,
            dateTo: dateToTweets,
            tweetMetricLabel: tweetMetricLabel
        }),
        headers: {
            "Content-type": "application/json; charset-UTF-i"
        }
    }).then(json => {
        var tweetData = json;

        var candidateName = tweetData[0]["user_name"];

        var tweetIds = tweetData.map(d => d["tweet_id_str"])

        var tweetTitleText = d3.select(".tweet-title");

        tweetTitleText.transition()
            .duration(1000)
            .text(`Top Tweets (${tweetMetricLabel}): ${candidateName}`);

        
        d3.selectAll("twitter-widget").remove()

        for (var i = 0; i < tweetIds.length; i++) {

            twttr.widgets.createTweet(
                tweetIds[i],
                document.getElementById('tweet-list'),
                {
                align: 'center',
                width: 500
                })
                .then(function (el) {
                console.log("Tweet displayed.")
                });
            }

    })

}



// Function for displaying Initial tweet list
function tweetsDisplay(data) {
    tweetData = data;
    // console.log(data);

    // Initial Candidates' tweet == "Joe Biden"
    var initCandidate = "Joe Biden"

        // var tweetTitle = d3.select("#tweet-title");

    chartGroupTweets.append("text")
        .attr("transform", `translate(${width / 2}, -15)`)
        .attr("text-anchor", "middle")
        .attr("font-size", "30px")
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", "1.5px")
        .attr("font-family", "Lato")
        .classed("tweet-title", true)
        .text(`Top Tweets (${tweetMetricLabel}): ${initCandidate}`)

    tweetIds = tweetData.map(d => d["tweet_id_str"]);

    d3.selectAll("twitter-widget").remove()

    for (var i = 0; i < tweetIds.length; i++) {

        twttr.widgets.createTweet(
            tweetIds[i],
            document.getElementById('tweet-list'),
            {
              align: 'center',
              width: 500
            })
            .then(function (el) {
              console.log("Tweet displayed.")
            });

    }


}


//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////




// Initialize random tweet
d3.json("/machine_learning_tweet").then(function(d) {
    console.log(d);    
}).catch(function(e) {
    console.log(e);
})



