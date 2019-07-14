var twitterButton = d3.select(".twitter-button");

twitterButton.on("click", getOauthAuthorize);

function getOauthAuthorize() {
    console.log("yes")
    d3.json("/request_token").then(function(data) {
        // console.log('yes')
        console.log(data)
        // var response = JSON.parse(data);
        // console.log(response);
        console.log(data["oauth_token"]);
        var request_token = data["oauth_token"];
        // https://api.twitter.com/oauth/authorize?oauth_token=Z6eEdO8MOmk394WozF5oKyuAv855l4Mlqo7hhlSLik

        window.location.replace(`https://api.twitter.com/oauth/authorize?oauth_token=${request_token}`)
    }).catch(e => {
        console.log(e);
    })
}


