// Select Twitter Button
var twitterButton = d3.select(".twitter-button");
// Create Event Listener
twitterButton.on("click", getOauthAuthorize);
// Fetch Request Token Data, then redirect to Twitter's Authorization page
function getOauthAuthorize() {
    console.log("yes")
    d3.json("/request_token", function(err, data) {
        if (err) throw err;
        var request_token = data["oauth_token"];
        window.location.replace(`https://api.twitter.com/oauth/authorize?oauth_token=${request_token}`)
    })
}

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

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".at-a-glance-retweets")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  // Append an SVG group
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Create color variable
var colorBands = d3.scaleOrdinal(d3.schemeCategory20);

// Fetch Timeline Average Retweet Data and generate graph

d3.json("/test", function(err, data) {
    if (err) throw err;

    var retweetData = JSON.parse(data);

    console.log(retweetData);

    // var retweetObject = [{
    //     'retweets': retweetData
    // }];

    // retweetObject.retweets = retweetData;

    // console.log(retweetObject);


    var bands = retweetData.map(d => d['user']);
    var retweetAverages = retweetData.map(d => d['retweet_average']);

    // var yScaleBands = d3.scaleLinear()
    //     .domain([0, d3.max(retweetData)])
    //     .range([height, 0])

    var yScaleBands = d3.scaleLinear()
        .domain([0, d3.max(retweetAverages)])
        .range([height, 0])

    var xScaleBands = d3.scaleBand()
        .domain(bands)
        .range([0, width])
        .padding(0);


    var xBandsAxis = d3.axisBottom(xScaleBands);
    var yBandsAxis = d3.axisLeft(yScaleBands);


    chartGroup.append("g")
        .classed("y-band-axis", true)
        .call(yBandsAxis);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .classed("x-band-axis", true)
        .call(xBandsAxis)
        .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");

    var rectGroup = chartGroup.selectAll("rect")
        .data(retweetData)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScaleBands(bands[i]))
        .attr("y", d => yScaleBands(d['retweet_average']))
        .attr("width", xScaleBands.bandwidth())
        .attr("height", d => height - yScaleBands(d['retweet_average']))
        .classed("bandsData", true)
        .style("stroke", "black")
        .style("fill", (d, i) => colorBands(i))

    // Append title
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, -15)`)
        .attr("text-anchor", "middle")
        .attr("font-size", "30px")
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", "1.5px")
        .attr("font-family", "Lato")
        .text("Mean # of Retweets per Candidate");

    // Append x axis label
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 130})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("font-family", "Roboto")
        .text("Candidate");

    // Append y axis label
    chartGroup.append("text")
        .attr("transform", `translate(-10, ${height / 2}) rotate(270)`)
        .attr("y", "-50")
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", d3.rgb(150,150,150))
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("font-family", "Roboto")
        .text("Average Number of Retweets")
    // var rectGroup = chartGroup.selectAll("rect")
    //     .data(retweetObject)
    //     .enter()
    //     .append("rect")
    //     .attr("x", 100)
    //     .attr("y", 100)
    //     .attr("width", 100)
    //     .attr("height", 100)
    //     .classed("bandsData", true)
    //     .style("stroke", "black")
    // .style("fill", (d, i) => colorBands(i))
});

// }).catch(e => {
//     console.log(e);
// })