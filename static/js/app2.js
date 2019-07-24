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

// request tweet data from server API endpoint

d3.json("/test", function(err, data) {
    if (err) throw err;

    // Create retweet graph using retrieved data
    retweetGraphAAG(data);
    // Create favorite graph using retrieved data
    favoriteGraphAAG(data);

});


// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svgRetweetsAAG = d3
  .select(".at-a-glance-retweets")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  // Append an SVG group
var chartGroupRetweetsAAG = svgRetweetsAAG.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Create color variable
var colorBands = d3.scaleOrdinal(d3.schemeCategory20);


// Function to create graph for average retweets per candidate
function retweetGraphAAG(data) {
    // transform data into applicable form
    var retweetData = JSON.parse(data);

    console.log(retweetData);
    // retrieve keys for candidate names
    var bands = retweetData.map(d => d['user']);
    // retrieve average retweet data for candidates
    var retweetAverages = retweetData.map(d => d['retweet_average']);

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
    chartGroupRetweetsAAG.append("g")
        .classed("y-band-axis", true)
        .call(yBandsAxis);
    // append x axis and transform text for readability
    chartGroupRetweetsAAG.append("g")
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
    var rectGroupRetweetsAAG = chartGroupRetweetsAAG.selectAll("rect")
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
    chartGroupRetweetsAAG.append("text")
        .attr("transform", `translate(${width / 2}, -15)`)
        .attr("text-anchor", "middle")
        .attr("font-size", "30px")
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", "1.5px")
        .attr("font-family", "Lato")
        .text("Mean # of Retweets per Candidate");

    // Append x axis label
    chartGroupRetweetsAAG.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 130})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("font-family", "Roboto")
        .text("Candidate");

    // Append y axis label
    chartGroupRetweetsAAG.append("text")
        .attr("transform", `translate(-10, ${height / 2}) rotate(270)`)
        .attr("y", "-50")
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", d3.rgb(150,150,150))
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("font-family", "Roboto")
        .text("Average Number of Retweets")
}


// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svgFavoritesAAG = d3
  .select(".at-a-glance-favorites")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroupFavoritesAAG = svgFavoritesAAG.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Function to create graph for average favorites per candidate
function favoriteGraphAAG(data) {
    // transform data into applicable form
    var favoriteData = JSON.parse(data);
    // retrieve keys for candidate names
    var favoriteBands = favoriteData.map(d => d['user']);
    // retrieve average favorite data for candidates
    var favoriteAverages = favoriteData.map(d => d['favorite_average']);

    // create scalar for favorite data
    var yScaleBandsFavorites = d3.scaleLinear()
        .domain([0, d3.max(favoriteAverages)])
        .range([height, 0])
    // create scalar for candidate classifier
    var xScaleBandsFavorites = d3.scaleBand()
        .domain(favoriteBands)
        .range([0, width])
        .padding(0);
    // create axis
    var xBandsAxisFavorites = d3.axisBottom(xScaleBandsFavorites);
    var yBandsAxisFavorites = d3.axisLeft(yScaleBandsFavorites);
    // append y axis
    chartGroupFavoritesAAG.append("g")
        .classed("y-band-axis", true)
        .call(yBandsAxisFavorites);
    // append x axis and transform text for readability
    chartGroupFavoritesAAG.append("g")
        .attr("transform", `translate(0, ${height})`)
        .classed("x-band-axis", true)
        .call(xBandsAxisFavorites)
        .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");

    // Append bars
    var rectGroupFavoritesAAG = chartGroupFavoritesAAG.selectAll("rect")
        .data(favoriteData)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScaleBandsFavorites(favoriteBands[i]))
        .attr("y", d => yScaleBandsFavorites(d['favorite_average']))
        .attr("width", xScaleBandsFavorites.bandwidth())
        .attr("height", d => height - yScaleBandsFavorites(d['favorite_average']))
        .classed("bandsData", true)
        .style("stroke", "black")
        .style("fill", (d, i) => colorBands(i))

    // Append title
    chartGroupFavoritesAAG.append("text")
        .attr("transform", `translate(${width / 2}, -15)`)
        .attr("text-anchor", "middle")
        .attr("font-size", "30px")
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", "1.5px")
        .attr("font-family", "Lato")
        .text("Mean # of Favorites per Candidate");

    // Append x axis label
    chartGroupFavoritesAAG.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 130})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("font-family", "Roboto")
        .text("Candidate");

    // Append y axis label
    chartGroupFavoritesAAG.append("text")
        .attr("transform", `translate(-10, ${height / 2}) rotate(270)`)
        .attr("y", "-50")
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", d3.rgb(150,150,150))
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("font-family", "Roboto")
        .text("Average Number of Favorites")
}
