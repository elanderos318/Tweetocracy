var twitterButton = d3.select(".twitter-button");

twitterButton.on("click", getOauthAuthorize);

function getOauthAuthorize() {
    console.log("yes")
    d3.json("/request_token", function(data) {
        // console.log('yes')
        // console.log(data)
        var response = JSON.parse(data);
        console.log(response)
    })
}