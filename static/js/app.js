var svgWidth = 1100;
var svgHeight = 600;

var margin = {
  top: 60,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart1")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

/////////////////////////////////////////////////////////////////////
/////////////////// Selecting Determinant values with D3 ///////////////////
/////////////////////////////////////////////////////////////////////

// Select checkboxes
var bidenBox = d3.select(".Joe-Biden-box");
var bookerBox = d3.select(".Cory-Booker-box");
var buttigiegBox = d3.select(".Pete-Buttigieg-box");
var castroBox = d3.select(".Julian-Castro-box");
var delaneyBox = d3.select(".John-Delaney-box");
var gabbardBox = d3.select(".Tulsi-Gabbard-box");
var gillibrandBox = d3.select(".Kirsten-Gillibrand-box");
var gravelBox = d3.select(".Mike-Gravel-box");
var harrisBox = d3.select(".Kamala-Harris-box");
var hickenlooperBox = d3.select(".John-Hickenlooper-box");
var insleeBox = d3.select(".Jay-Inslee-box");
var klobucharBox = d3.select(".Amy-Klobuchar-box");
var messamBox = d3.select(".Wayne-Messam-box");
var moultonBox = d3.select(".Seth-Moulton-box");
var rourkeBox = d3.select(".Beto-Rourke-box");
var ryanBox = d3.select(".Tim-Ryan-box");
var sandersBox = d3.select(".Bernie-Sanders-box");
var trumpBox = d3.select(".Donald-Trump-box");
var warrenBox = d3.select(".Elizabeth-Warren-box");
var weldBox = d3.select(".Bill-Weld-box");
var williamsonBox = d3.select(".Marianne-Williamson-box");
var yangBox = d3.select(".Andrew-Yang-box");

//////////////////////////////////////////////////////////////////

// Select radio buttons
var engagementRadio = d3.select("#engagement");
var retweetsRadio = d3.select("#retweets");
var favoritesRadio = d3.select("#favorites")
var commentsRadio = d3.select("#comments")

// Select Button
var submitButton = d3.select(".btn-default")

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

// Create Event Listener for Submit Button
submitButton.on("click", buttonClick);

// Create Button Click Function
function buttonClick() {

    // Create list to append all checked candidates
    var candidateList = [];
    // Prevent the page from refreshing
    d3.event.preventDefault();

    ///////////////////////////////////////////////////
    // Append list with names whose boxes are checked
    if (bidenBox.property("checked")) {
        candidateList.push("Joe Biden");
    }
    if (bookerBox.property("checked")) {
        candidateList.push("Cory Booker");
    }
    if (buttigiegBox.property("checked")) {
        candidateList.push("Pete Buttigieg");
    }
    if (castroBox.property("checked")) {
        candidateList.push("Julián Castro");
    }
    if (delaneyBox.property("checked")) {
        candidateList.push("John Delaney");
    }
    if (gabbardBox.property("checked")) {
        candidateList.push("Tulsi Gabbard");
    }
    if (gillibrandBox.property("checked")) {
        candidateList.push("Kirsten Gillibrand");
    }
    if (gravelBox.property("checked")) {
        candidateList.push("Mike Gravel");
    }
    if (harrisBox.property("checked")) {
        candidateList.push("Kamala Harris");
    }
    if (hickenlooperBox.property("checked")) {
        candidateList.push("John Hickenlooper");
    }
    if (insleeBox.property("checked")) {
        candidateList.push("Jay Inslee");
    }
    if (klobucharBox.property("checked")) {
        candidateList.push("Amy Klobuchar");
    }
    if (messamBox.property("checked")) {
        candidateList.push("Wayne Messam");
    }
    if (moultonBox.property("checked")) {
        candidateList.push("Seth Moulton");
    }
    if (rourkeBox.property("checked")) {
        candidateList.push("Beto O'Rourke");
    }
    if (ryanBox.property("checked")) {
        candidateList.push("Tim Ryan");
    }
    if (sandersBox.property("checked")) {
        candidateList.push("Bernie Sanders");
    }
    if (trumpBox.property("checked")) {
        candidateList.push("Donald Trump");
    }
    if (warrenBox.property("checked")) {
        candidateList.push("Elizabeth Warren");
    }
    if (weldBox.property("checked")) {
        candidateList.push("Bill Weld");
    }
    if (williamsonBox.property("checked")) {
        candidateList.push("Marianne Williamson");
    }
    if (yangBox.property("checked")) {
        candidateList.push("Andrew Yang");
    }
    //////////////////////////////////////////////////


    // Check which y variable is checked

    var yVariable;

    if (engagementRadio.property("checked")) {
        yVariable = "engagement_score";
    } else if (retweetsRadio.property("checked")) {
        yVariable = "retweets";
    } else if (favoritesRadio.property("checked")) {
        yVariable = "favorites";
    } else {
        yVariable = "comments";
    }
    /////////////////////////////////////////////////////


    filteredCandidatesData(candidateList, yVariable);

}


function filteredCandidatesData(candidates, yVariable) {
    d3.json("/candidates_tweets", function(err, data) {
        var tweetData = JSON.parse(data);
        // console.log(tweetData)
        // Create time parser
        var parseTime = d3.timeParse('%I:%M %p - %d %b %Y');
    
        tweetData.forEach(function(d) {
            d['date_string'] = parseTime(d['date_string']);
            d['engagement_score'] = roundedVar(d['engagement_score']);
            // console.log(d.date_string)
        });

        var filteredData = tweetData.filter(function(d) {
            return candidates.includes(d.name);
        });

        console.log(filteredData)

        // Generate new x axis
        xTimeScale = xScale(filteredData);
        xAxis = d3.select(".x-axis");
        renderXAxis(xTimeScale, xAxis);

        // Generate new y axis
        yLinearScale = yScale(filteredData, yVariable);
        yAxis = d3.select(".y-axis");
        renderYAxis(yLinearScale, yAxis);

        // Generate Circles
        renderCircles(xTimeScale, filteredData, yLinearScale, yVariable);
    })
}

// function used for updating x-scale var
function xScale(filteredData) {
    // create scale
    var xTimeScale = d3.scaleTime()
        .domain(d3.extent(filteredData, d => d.date_string))
        .range([0, width]);

    return xTimeScale;
}

// function used for updated y-scale var
function yScale(filteredData, chosenYVariable) {
    // create scale
    var yLinearScale = d3.scaleLinear()
        // .domain(d3.extent(filteredData, d => d[chosenYVariable]))
        .domain([d3.min(filteredData, d => d[chosenYVariable]) * .9, 
            d3.max(filteredData, d => d[chosenYVariable]) * 1.1])
        .range([height, 0]);
    
    return yLinearScale;
}

// function used for updating x axis var
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// function used for updating y axis var
function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

function roundedVar(number) {
    var round = Math.round((number + 0.000001) * 1000) / 1000;
    return round;

}

function renderCircles(newXScale, filteredData, newYScale, chosenYVariable) {
    var circlesGroup = chartGroup.selectAll("circle")
        .data(filteredData);

    circlesGroup.enter()
        .append("circle")
        .merge(circlesGroup)
        .style("fill", d => color(d.name))
        .style("stroke", "black")
        .attr("cx", d => newXScale(d['date_string']))
        .attr("cy", d => newYScale(d[chosenYVariable]))
        .attr("r", 5);


    circlesGroup.exit().remove();

    // return circlesGroup;
}
// Create color variable
var color = d3.scaleOrdinal(d3.schemeCategory20);

// Create Graph

d3.json("/candidates_tweets", function(err, data) {
    if (err) throw err;
    var tweetData = JSON.parse(data);
    // console.log(tweetData)
    // Create time parser
    var parseTime = d3.timeParse('%I:%M %p - %d %b %Y');

    tweetData.forEach(function(d) {
        d['date_string'] = parseTime(d['date_string']);
        d.engagement_score = roundedVar(d.engagement_score);
        // console.log(d.date_string)
    });

    // xScale Function
    var xTimeScale = xScale(tweetData);
    // yScale Function
    // temporary y variable
    var chosenYVariable = "engagement_score"
    var yLinearScale = yScale(tweetData, chosenYVariable);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xTimeScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    // append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(tweetData)
        .enter()
        .append("circle")
        .style("fill", d => color(d.name))
        .style("stroke", "black")
        .classed("circlesData", true)
        .attr("cx", d => xTimeScale(d.date_string))
        .attr("cy", d => yLinearScale(d[chosenYVariable]))
        .attr("r", 5)

    // Append title
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, 0)`)
        .attr("text-anchor", "middle")
        .attr("font-size", "30px")
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", "1.5px")
        .attr("font-family", "sans-serif")
        .text("Candidates' Tweet Stats over Time");
    // Append x axis label
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 40})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", d3.rgb(150,150,150))
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("font-family", "sans-serif")
        .text("Time");
    // Append y axis label
    chartGroup.append("text")
        .attr("transform", `translate(-10, ${height / 2}) rotate(270)`)
        .attr("y", "-50")
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", d3.rgb(150,150,150))
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("font-family", "sans-serif")
        .text("Chosen Y Variable")
})

/////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// Hour Day Bar Graph ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg2 = d3
  .select(".chart2")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup2 = svg2.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const candidateButtons = d3.selectAll(".hour-day-radio");
const hourDayButtons = d3.selectAll(".hour-day-selection");

var chosenCandidate = "Joe Biden";
var jsonVar = "hour";
var dependentVar = "tweet_hour";

candidateButtons.on("change", function(d) {
    console.log('button changed to ' + this.value);

    chosenCandidate = this.value;

    radioChange();
})

hourDayButtons.on("change", function(d) {
    jsonVar = this.value;
    if (jsonVar === "hour") {
        dependentVar = "tweet_hour";
    } else {
        dependentVar = "tweet_weekday"
    }

    radioChange();
})

function radioChange() {
    d3.json(`/candidates_${jsonVar}_categorized`, function(err, data) {
        if (err) throw err;

        var newData = JSON.parse(data);

        newData.forEach(function(d) {
            d["median_engagement"] = roundedVar(d["median_engagement"]);
    
        })

        var newDataFiltered = newData.filter(function(d) {
            return d["name"] === chosenCandidate; 
        })
        console.log(newDataFiltered)

        bands = newDataFiltered.map(d => d[dependentVar]);

        score = newDataFiltered.map(d => d["median_engagement"]);

        // Generate new xaxis
        xScaleBands = xBands(bands);
        xBandsAxis = d3.select(".x-band-axis");
        renderXBandsAxis(xScaleBands, xBandsAxis);

        // Generate new yaxis
        yScaleBands = yBands(score);
        yBandsAxis = d3.select(".y-band-axis");
        renderYBandsAxis(yScaleBands, yBandsAxis);

        renderRect(bands, xScaleBands, newDataFiltered, yScaleBands, chosenCandidate)
    })
}

function renderRect(bands, xScaleBands, filteredData, yScaleBands, chosenYVariable) {
    var rectGroup = chartGroup2.selectAll("rect")
        .data(filteredData);

        rectGroup.enter()
        .append("rect")
        .merge(rectGroup)
        .style("fill", (d, i) => colorBands(i))
        .style("stroke", "black")
        .attr("x", (d, i) => xScaleBands(bands[i]))
        .attr("y", d => yScaleBands(d["median_engagement"]))
        .attr("width", xScaleBands.bandwidth())
        .attr("height", d => height - yScaleBands(d["median_engagement"]))


        rectGroup.exit().remove();

    return rectGroup;
}

// function used for updating x axis var
function renderXBandsAxis(xScaleBands, xBandsAxis) {
    var bottomAxis = d3.axisBottom(xScaleBands);

    xBandsAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xBandsAxis;
}

// function used for updating y axis var
function renderYBandsAxis(yScaleBands, yBandsAxis) {
    var leftAxis = d3.axisLeft(yScaleBands);

    yBandsAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yBandsAxis;
}

function xBands(bands) {
    var xScaleBands = d3.scaleBand()
        .domain(bands)
        .range([0, width])
        .padding(0);

    return xScaleBands;
}

function yBands(data) {
    var yScaleBands = d3.scaleLinear()
        .domain([0, d3.max(data)])
        .range([height, 0])

    return yScaleBands;
}

// Create color variable
var colorBands = d3.scaleOrdinal(d3.schemeCategory20);

// Create graph
d3.json(`/candidates_${jsonVar}_categorized`, function(err, data) {
    if (err) throw err;
    var timeData = JSON.parse(data);


    timeData.forEach(function(d) {
        d["median_engagement"] = roundedVar(d["median_engagement"]);

    })

    var timeDataFiltered = timeData.filter(function(d) {
        return d["name"] === chosenCandidate; 
    })

    var bands = timeDataFiltered.map(d => d[dependentVar]);

    var score = timeDataFiltered.map(d => d["median_engagement"]);
    // console.log(score)

    var xScaleBands = xBands(bands);

    var yScaleBands = yBands(score);

    var xBandsAxis = d3.axisBottom(xScaleBands);
    var yBandsAxis = d3.axisLeft(yScaleBands);

    chartGroup2.append("g")
        .classed("y-band-axis", true)
        .call(yBandsAxis);

    chartGroup2.append("g")
        .attr("transform", `translate(0, ${height})`)
        .classed("x-band-axis", true)
        .call(xBandsAxis);

    var rectGroup = chartGroup2.selectAll("rect")
        .data(timeDataFiltered)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScaleBands(bands[i]))
        .attr("y", d => yScaleBands(d["median_engagement"]))
        .attr("width", xScaleBands.bandwidth())
        .attr("height", d => height - yScaleBands(d["median_engagement"]))
        .classed("bandsData", true)
        .style("stroke", "black")
        .style("fill", (d, i) => colorBands(i))

    // Append title
    chartGroup2.append("text")
        .attr("transform", `translate(${width / 2}, -15)`)
        .attr("text-anchor", "middle")
        .attr("font-size", "30px")
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", "1.5px")
        .attr("font-family", "sans-serif")
        .text("Median Engagement Score Per Hour/Weekday");
    // Append x axis label
    chartGroup2.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 40})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", d3.rgb(150,150,150))
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("font-family", "sans-serif")
        .text("Chosen X Variable (Hour/Day)");
    // Append y axis label
    chartGroup2.append("text")
        .attr("transform", `translate(-10, ${height / 2}) rotate(270)`)
        .attr("y", "-50")
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", d3.rgb(150,150,150))
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("font-family", "sans-serif")
        .text("Median Engagement Score")


})

///////////////////////////////////////////////////////////
////////////////// Sentiment Vs. Engagement /////////////
////////////////////////////////////////////////////////////

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg3 = d3
  .select(".chart3")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup3 = svg3.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const candidateButtons2 = d3.selectAll(".sentiment-engagement-radio");

var chosenCandidate2 = "Bernie Sanders";

candidateButtons2.on("change", function(d) {

    chosenCandidate2 = this.value;

    radioChange2();
})

function radioChange2() {

    d3.json("/replies_absolute_sentiment", function(err, data) {
        if (err) throw err;

        var newSentData = JSON.parse(data);

        newSentData.forEach(function(d) {
            d["engagement_score"] = roundedVar(d["engagement_score"]);
        })

        newSentDataFiltered = newSentData.filter(function(d) {
            return d["name"] == chosenCandidate2;
        })
        // console.log(newSentDataFiltered);

        // Generate new x axis
        xLinearScale2 = xScale2(newSentDataFiltered);
        xAxis2 = d3.select(".x-axis-2");
        renderXAxis2(xLinearScale2, xAxis2);

        // Generate new y axis
        yLinearScale2 = yScale2(newSentDataFiltered);
        yAxis2 = d3.select(".y-axis-2");
        renderYAxis2(yLinearScale2, yAxis2);

        // Generate Circles
        renderCircles2(xLinearScale2, newSentDataFiltered, yLinearScale2);

    })

}



// function used for updating x-scale var
function xScale2(filteredData) {
    // create scale
    var xLinearScale2 = d3.scaleLinear()
        .domain(d3.extent(filteredData, d => d.average_absolute_sentiment_score))
        .range([0, width]);

    return xLinearScale2;
}

// function used for updated y-scale var
function yScale2(filteredData) {
    // create scale
    var yLinearScale2 = d3.scaleLinear()
        .domain([d3.min(filteredData, d => d["engagement_score"]) * .9, 
            d3.max(filteredData, d => d["engagement_score"]) * 1.1])
        .range([height, 0]);
    
    return yLinearScale2;
}

// function used for updating x axis var
function renderXAxis2(newXScale, xAxis2) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis2.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis2;
}

// function used for updating y axis var
function renderYAxis2(newYScale, yAxis2) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis2.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis2;
}


function renderCircles2(newXScale, filteredData, newYScale) {
    var circlesGroup2 = chartGroup3.selectAll("circle")
        .data(filteredData);

    circlesGroup2.enter()
        .append("circle")
        .merge(circlesGroup2)
        .style("fill", d => color2(d.name))
        .style("stroke", "black")
        .attr("cx", d => newXScale(d['average_absolute_sentiment_score']))
        .attr("cy", d => newYScale(d["engagement_score"]))
        .attr("r", 5);


    circlesGroup2.exit().remove();

    return circlesGroup2;
}

// Create color variable
var color2 = d3.scaleOrdinal(d3.schemeCategory20);

// Create Graph

d3.json("/replies_absolute_sentiment", function(err, data) {
    if (err) throw err;
    var sentData = JSON.parse(data);

    sentData.forEach(function(d) {
        d["engagement_score"] = roundedVar(d["engagement_score"]);
    })


    // Create temporary candidate choice
    var chosenCandidate2 = "Bernie Sanders"

    sentDataFiltered = sentData.filter(function(d) {
        return d.name == chosenCandidate2
    })

    // xScale Function
    var xLinearScale2 = xScale2(sentDataFiltered);
    // yScale Function
    var yLinearScale2 = yScale2(sentDataFiltered);


    // Create initial axis functions
    var bottomAxis2 = d3.axisBottom(xLinearScale2);
    var leftAxis2 = d3.axisLeft(yLinearScale2);

    // append x axis
    var xAxis2 = chartGroup3.append("g")
        .classed("x-axis-2", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis2);
    // append y axis
    var yAxis2 = chartGroup3.append("g")
        .classed("y-axis-2", true)
        .call(leftAxis2);
    
    // append initial circles
    var circlesGroup2 = chartGroup3.selectAll("circle")
        .data(sentDataFiltered)
        .enter()
        .append("circle")
        .style("fill", d => color2(d.name))
        .style("stroke", "black")
        .classed("circlesData2", true)
        .attr("cx", d => xLinearScale2(d.average_absolute_sentiment_score))
        .attr("cy", d => yLinearScale2(d["engagement_score"]))
        .attr("r", 5)

    // Append title
    chartGroup3.append("text")
        .attr("transform", `translate(${width / 2}, -15)`)
        .attr("text-anchor", "middle")
        .attr("font-size", "30px")
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", "1.5px")
        .attr("font-family", "sans-serif")
        .text("Replies' Sentiment vs Engagement");
    // Append x axis label
    chartGroup3.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 40})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", d3.rgb(150,150,150))
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("font-family", "sans-serif")
        .text("Replies' Sentiment (Absolute Value)");
    // Append y axis label
    chartGroup3.append("text")
        .attr("transform", `translate(-10, ${height / 2}) rotate(270)`)
        .attr("y", "-50")
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", d3.rgb(150,150,150))
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("font-family", "sans-serif")
        .text("Engagement Score")
})