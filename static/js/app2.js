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

d3.json("/init_data", function(err, data) {
    if (err) throw err;

    // Create retweet graph using retrieved data
    graphAAG(data);
    // Create favorite graph using retrieved data
    favoriteGraphAAG(data);

});


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

// Select "Retweets or Favorites Radio Buttons"

var retweetRadio = d3.select("#retweet-radio");
var favoriteRadio = d3.select("#favorite-radio");

// Select "at a glance" Submit Button
var selectionSubmit = d3.select(".selection-submit");

// Create event listener for submit button
selectionSubmit.on("click", submitClick);

// Create Button Click function
function submitClick() {
    // Create list to append all checked candidates
    var candidateList = [];
    // Prevent the page from refreshing
    d3.event.preventDefault();

    ////////////////////////////////////////////////////
    // Append list with names whose boxes are checked
    if (bidenBox.property("checked")) {
        candidateList.push("939091");
    }
    if (bookerBox.property("checked")) {
        candidateList.push("15808765");
    }
    if (buttigiegBox.property("checked")) {
        candidateList.push("226222147");
    }
    if (castroBox.property("checked")) {
        candidateList.push("19682187");
    }
    if (delaneyBox.property("checked")) {
        candidateList.push("426028646");
    }
    if (gabbardBox.property("checked")) {
        candidateList.push("26637348");
    }
    if (gillibrandBox.property("checked")) {
        candidateList.push("72198806");
    }
    if (gravelBox.property("checked")) {
        candidateList.push("14709326");
    }
    if (harrisBox.property("checked")) {
        candidateList.push("30354991");
    }
    if (hickenlooperBox.property("checked")) {
        candidateList.push("117839957");
    }
    if (insleeBox.property("checked")) {
        candidateList.push("21789463");
    }
    if (klobucharBox.property("checked")) {
        candidateList.push("33537967");
    }
    if (messamBox.property("checked")) {
        candidateList.push("33954145");
    }
    if (moultonBox.property("checked")) {
        candidateList.push("248495200");
    }
    if (rourkeBox.property("checked")) {
        candidateList.push("342863309");
    }
    if (ryanBox.property("checked")) {
        candidateList.push("466532637");
    }
    if (sandersBox.property("checked")) {
        candidateList.push("216776631");
    }
    if (trumpBox.property("checked")) {
        candidateList.push("25073877");
    }
    if (warrenBox.property("checked")) {
        candidateList.push("357606935");
    }
    if (weldBox.property("checked")) {
        candidateList.push("734783792502575105");
    }
    if (williamsonBox.property("checked")) {
        candidateList.push("21522338");
    }
    if (yangBox.property("checked")) {
        candidateList.push("2228878592");
    }
    if (swalwellBox.property("checked")) {
        candidateList.push("942156122");
    }
    if (bennetBox.property("checked")) {
        candidateList.push("45645232");
    }
    if (bullockBox.property("checked")) {
        candidateList.push("111721601");
    }
    if (blasioBox.property("checked")) {
        candidateList.push("476193064");
    }
    if (sestakBox.property("checked")) {
        candidateList.push("46764631");
    }
    if (steyerBox.property("checked")) {
        candidateList.push("949934436");
    }

    /////////////////////////////////////////////

    // Check Aggregation Method Selected

    /////////////////////////////////////////////

    // Check Retweet/Favorite Selection

    var metricVariable;

    if (retweetRadio.property("checked")) {
        metricVariable = "retweet_count";
    } else {
        metricVariable = "favorite_count";
    }
    /////////////////////////////////////////////

    // Check Date Range Selected



    ////////////////////////////////////////////


    filteredCandidatesData(candidateList, metricVariable);
}

// Function for filtering data based on filter selections
function filteredCandidatesData(candidatesList, metricVariable) {

    d3.json("/filter", {
        method: "POST",
        body: JSON.stringify({
            candidatesList: candidatesList,
            metricVariable: metricVariable
        })
    }).then(json => {
        console.log(json)
        console.log(typeof json)
    })
    
    // function(err, data) {
    //     if (err) throw err;
    //     console.log(data)
    //     console.log(typeof data)
    // })
    // d3.json("/data", function(err, data) {
    //     if (err) throw err;

    //     var tweetData = JSON.parse(data);

    //     var filteredData = tweetData.filter(function(d) {
    //         return candidatesList.includes(d["user_id_str"]);
    //     });



    // })
}


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

// function groupData(data) {

//     groupList = [];

//     for 
// }


// Function to create initial AAG graph
function graphAAG(data) {
    // transform data into applicable form
    var initData = JSON.parse(data);

    // retrieve keys for candidate names
    var bands = retweetData.map(d => d['user_name']);
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
        .text("Average Number of Retweets per Candidate");

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
    var favoriteBands = favoriteData.map(d => d['user_name']);
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
        .text("Average Number of Favorites per Candidate");

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
