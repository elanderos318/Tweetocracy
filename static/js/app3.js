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

// Select "Retweets or Favorites Radio Buttons"
var retweetRadioTime = d3.select("#time-hourly-radio");
var favoriteRadioTime = d3.select("#time-daily-radio");

// Select "Hourly or Daily" Buttons
var hourlyRadioTime = d3.select("#time-retweet-radio");
var dailyRadioTime = d3.select("#time-favorite-radio");

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


function submitTimeClick() {
    // Create list to append all checked candidates
    var candidatesList = [];
    // Prevent the page from refreshing
    d3.event.preventDefault();

    ////////////////////////////////////////////////////
    // Append list with names whose boxes are checked
    if (bidenTime.property("checked")) {
        candidatesList.push("939091");
    }
    if (bookerTime.property("checked")) {
        candidatesList.push("15808765");
    }
    if (buttigiegTime.property("checked")) {
        candidatesList.push("226222147");
    }
    if (castroTime.property("checked")) {
        candidatesList.push("19682187");
    }
    if (delaneyTime.property("checked")) {
        candidatesList.push("426028646");
    }
    if (gabbardTime.property("checked")) {
        candidatesList.push("26637348");
    }
    if (gillibrandTime.property("checked")) {
        candidatesList.push("72198806");
    }
    if (gravelTime.property("checked")) {
        candidatesList.push("14709326");
    }
    if (harrisTime.property("checked")) {
        candidatesList.push("30354991");
    }
    if (hickenlooperTime.property("checked")) {
        candidatesList.push("117839957");
    }
    if (insleeTime.property("checked")) {
        candidatesList.push("21789463");
    }
    if (klobucharTime.property("checked")) {
        candidatesList.push("33537967");
    }
    if (messamTime.property("checked")) {
        candidatesList.push("33954145");
    }
    if (moultonTime.property("checked")) {
        candidatesList.push("248495200");
    }
    if (rourkeTime.property("checked")) {
        candidatesList.push("342863309");
    }
    if (ryanTime.property("checked")) {
        candidatesList.push("466532637");
    }
    if (sandersTime.property("checked")) {
        candidatesList.push("216776631");
    }
    if (trumpTime.property("checked")) {
        candidatesList.push("25073877");
    }
    if (warrenTime.property("checked")) {
        candidatesList.push("357606935");
    }
    if (weldTime.property("checked")) {
        candidatesList.push("734783792502575105");
    }
    if (williamsonTime.property("checked")) {
        candidatesList.push("21522338");
    }
    if (yangTime.property("checked")) {
        candidatesList.push("2228878592");
    }
    if (swalwellTime.property("checked")) {
        candidatesList.push("942156122");
    }
    if (bennetTime.property("checked")) {
        candidatesList.push("45645232");
    }
    if (bullockTime.property("checked")) {
        candidatesList.push("111721601");
    }
    if (blasioTime.property("checked")) {
        candidatesList.push("476193064");
    }
    if (sestakTime.property("checked")) {
        candidatesList.push("46764631");
    }
    if (steyerTime.property("checked")) {
        candidatesList.push("949934436");
    }

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
    } else {
        metricTimeVar = "favorite_average";
        timeMetricLabel = "Favorites";
    }
    /////////////////////////////////////////////

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
        dateFrom = formatTime(monthAgo);
    }
    if (!dateToTime) {
        dateTo = formatTime(currentDate);
        }
    // console.log(dateFrom);
    // console.log(dateTo);

    ////////////////////////////////////////////


    filteredTimeData(candidatesList, metricTimeVar, aggregationTimeVar, dateFromTime, dateToTime);
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
    // retrieve data type (hours)
    var timeBands = initTime.map(d => d['hour']);
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
        .text(`Average Number of ${timeMetricLabel} per Hour: Joe Biden`)
    // Append x axis label
    chartGroupTime.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 130})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("font-family", "Roboto")
        .text("Hour")
    // Append y ais label
    chartGroupTime.append("text")
        .attr("transform", `translate(-10, ${height / 2}) rotate(270)`)
        .attr("y", "-50")
        .attr("font-size", "18px")
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("font-family", "Roboto")
        .classed("y-time-label", true)
        .text(`Average Number of ${timeMetricLabel}`)
}