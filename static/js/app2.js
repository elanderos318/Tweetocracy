// Select Twitter Button
var twitterButton = d3.select(".twitter-button");
// Create Event Listener
// twitterButton.on("click", getOauthAuthorize);
// Fetch Request Token Data, then redirect to Twitter's Authorization page
// function getOauthAuthorize() {
//     console.log("yes")
//     d3.json("/request_token").then(function(data) {
//         var request_token = data["oauth_token"];
//         window.location.replace(`https://api.twitter.com/oauth/authorize?oauth_token=${request_token}`)
//     }).catch(e => {
//         console.log(e);
//     })
// }

// Set SVG Chart Formatting
var svgHeight = 600;
var svgWidth = 1100;


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
  .select(".at-a-glance-retweets")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  // Append an SVG group
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);


// Fetch Timeline Average Retweet Data and generate graph

d3.json("/test", function(err, data) {
    if (err) throw err;

    var retweetData = JSON.parse(data);

    var retweetObject = [{
        'retweets': retweetData
    }];

    retweetObject.retweets = retweetData;

    console.log(retweetObject);

    console.log(retweetData);

    var bands = ["Donald Trump"];

    // var yScaleBands = d3.scaleLinear()
    //     .domain([0, d3.max(retweetData)])
    //     .range([height, 0])

    var yScaleBands = d3.scaleLinear()
        .domain([0, retweetData])
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
        .call(xBandsAxis);

    var rectGroup = chartGroup.selectAll("rect")
        .data(retweetObject)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScaleBands(bands[i]))
        .attr("y", d => yScaleBands(d['retweets']))
        .attr("width", xScaleBands.bandwidth())
        .attr("height", d => height - yScaleBands(d['retweets']))
        .classed("bandsData", true)
        .style("stroke", "black")
        .style("fill", "black")

    console.log(rectGroup)

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