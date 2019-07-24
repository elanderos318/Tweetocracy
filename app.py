import os

import json

import requests
from requests_oauthlib import OAuth1

import cryptography
from cryptography.fernet import Fernet

import pandas as pd
import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template, request, redirect, url_for, session

from Candidates import candidates_list

app = Flask(__name__)
# app.secret_key = os.urandom(24)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/candidates_tweets.sqlite"

engine = create_engine('sqlite:///db/candidates_tweets.sqlite', echo = False)

######

__location__ = os.path.dirname(os.path.realpath(__file__))
print(__location__)

config_dir = os.path.join(__location__, "config")
print(config_dir)

print(os.getcwd())

with open ('config/config_key.key', 'rb') as ck:
    fernet_key = ck.read()

with open('config/config_encrypt_1.key', 'rb') as c1:
    cke_e = c1.read()
with open('config/config_encrypt_2.key', 'rb') as c2:
    cse_e = c2.read()
with open('config/config_encrypt_3.key', 'rb') as c3:
    ate_e = c3.read()
with open('config/config_encrypt_4.key', 'rb') as c4:
    atse_e = c4.read()

fernet = Fernet(fernet_key)

cke_d = fernet.decrypt(cke_e)
cse_d = fernet.decrypt(cse_e)
ate_d = fernet.decrypt(ate_e)
atse_d = fernet.decrypt(atse_e)

ck = cke_d.decode()
cs = cse_d.decode()
at = ate_d.decode()
ats = atse_d.decode()

auth = OAuth1(ck, cs, at, ats)

callback_url = "https://tweetocracy.herokuapp.com/"

# declare variable
# oauth_token = "_"

# payload = {
#     'oauth_callback':callback_url
# }

# local testing

payload = {
    'oauth_callback':"http://127.0.0.1:5000/"
}

r = requests.post('https://api.twitter.com/oauth/request_token', auth = auth, data = payload)

print(f'Post Request Token URL:{r.url}')

print(f'Post Request Token:{r.status_code}')

print(f'Post Request Text: {r.text}')

response_output = r.text
response_parameters = response_output.split("&")

print(response_parameters)

oauth_token = response_parameters[0][12:]
print(f'OAuth_token:{oauth_token}')
oauth_token_secret=response_parameters[1][19:]
print(f'Oauth Token Secret:{oauth_token_secret}')
oauth_callback_confirmed = bool(response_parameters[2][25:])
print(f'Callback Confirmed:{oauth_callback_confirmed}')

#### Tweet DataSet
tweets_df = pd.DataFrame(engine.execute("SELECT * FROM candidates_tweets").fetchall())
tweets_df = tweets_df.rename(columns = {
    0: "comments",
    1: "date_string",
    2: "datetime",
    3: "engagement_score",
    4: "favorites",
    5: "name",
    6: "party",
    7: "retweets",
    8: "stream_id",
    9: "text",
    10: "tweet_url",
    11: "twitter_username",
    12: "unix_time"
})
tweets_json = tweets_df.to_json(orient='records')

### Hour Dataset
hour_df = pd.DataFrame(engine.execute("SELECT * FROM candidates_hour_categorized").fetchall())
hour_df = hour_df.rename(columns = {
    0: "name",
    1: "tweet_hour",
    2: "median_engagement"
})
hour_json = hour_df.to_json(orient='records')

### Day Dataset
day_df = pd.DataFrame(engine.execute("SELECT * FROM candidates_day_categorized").fetchall())
day_df = day_df.rename(columns = {
    0: "name",
    1: "tweet_weekday",
    2: "median_engagement"
})
day_json = day_df.to_json(orient='records')

### Replies Sentiment Dataset
sentiment_df = pd.DataFrame(engine.execute("SELECT * FROM replies_absolute_sentiment").fetchall())
sentiment_df = sentiment_df.rename(columns = {
    0: "name",
    1: "stream_id",
    2: "engagement_score",
    3: "average_absolute_sentiment_score"
})
sentiment_json = sentiment_df.to_json(orient='records')

## Set up 'tweet_mode: extended' payload to show full texts of tweets

extended_payload = {
    'tweet_mode': 'extended'
}

#Set up routes
@app.route('/')
def index():

    query_string = request.query_string
    print(f'Query String: {query_string.decode()}')
    # print(type(query_string.decode()))
    request_token = request.args.get("oauth_token")
    print(f'Query Request Token:{request_token}')
    print(f'Query Request Token == Oauth Request? {request_token == oauth_token}')

    oauth_verifier = request.args.get("oauth_verifier")



    ### Fetch Timeline Data

    current_candidate

    # timeline = requests.get("https://api.twitter.com/1.1/statuses/user_timeline.json?id=25073877&count=1", params = extended_payload, auth = auth)

    # timeline_status = timeline.status_code
    # print(f'Timeline Status: {timeline_status}')

    # timeline_json = timeline.json()
    # print(json.dumps(timeline_json, indent = 4))

    # user_id = timeline_json[0]['user']['id_str']

    # print(json.dumps(user_id))
    # for candidate in candidates_list:
    #     print(candidate["name"])
    #     user_id = candidate["twitter_user_id"]

    #     user_get = requests.get(f'https://api.twitter.com/1.1/statuses/user_timeline.json?id={user_id}&count=1', params = extended_payload, auth = auth)
    #     user_json = user_get.json()

        # user_id = user_json[0]['user']['id_str']
        # print(f'User ID: {user_id}')
        # response_screen_name = user_json[0]['user']['screen_name']
        # if candidate['twitter_screen_name'] == response_screen_name:
        #     print('Match')
        # else:
        #     print('Not a match')


    #### Testing tweet request

    # tweet = requests.get("https://api.twitter.com/1.1/statuses/show.json?id=1152577020594917376", params = extended_payload, auth = auth)

    # tweet_json = tweet.json()

    # print(json.dumps(tweet_json, indent=4))


    # print(type(request_token))
    # print(oauth_token)

    if request_token == oauth_token and oauth_verifier:

        print("works!")

        auth_access = OAuth1(ck, cs, oauth_token, oauth_token_secret)

        payload_access = {
            'oauth_verifier':oauth_verifier
        }

        r_access = requests.post("https://api.twitter.com/oauth/access_token", auth = auth_access, data = payload_access)
        r_access_text = r_access.text

        print(f'Post Access Status: {r_access.status_code}')
        print(f'Post Access Text: {r_access_text}')

        post_access_params = r_access_text.split("&")

        print(post_access_params)

        access_token = post_access_params[0][12:]
        print(f'Access Token: {access_token}')
        access_token_secret = post_access_params[1][19:]
        print(f'Access Token SEcret: {access_token_secret}')
        screen_name = post_access_params[3][12:]
        print(f'Screen Name: {screen_name}')

        #### Testing

        final_access = OAuth1(ck, cs, access_token, access_token_secret)

        # tweet = requests.get("https://api.twitter.com/1.1/statuses/show.json?id=1152577020594917376", params = extended_payload, auth = final_access)

        # tweet_json = tweet.json()

        # print(json.dumps(tweet_json, indent=4))

        ## user timeline testing

        timeline = requests.get("https://api.twitter.com/1.1/statuses/user_timeline.json?id=25073877&count=2", auth = final_access)


        timeline_status = timeline.status_code
        print(f'Timeline Status: {timeline_status}')

        timeline_json = timeline.json()
        print(json.dumps(timeline_json, indent = 4))



        # session["username"] = screen_name

        # print(access_token)
        # print(access_token_secret)
        # print(user_id)
        # print(screen_name)

        # if r_access.status_code == 200:
        #     return redirect(url_for('test'))
        # else:
        #     return redirect(url_for('fail'))

    return render_template('index.html')

@app.route('/test')
def test():
    return 'Success! Text:'
@app.route('/fail')
def fail():
    return 'Fail!'

@app.route('/request_token')
def request_token():

    # production callback
    # callback_url = "https://tweetocracy.herokuapp.com/"

    # local testing
    # payload = {
    # 'oauth_callback':"http://127.0.0.1:5000/"
    # }

    # r = requests.post('https://api.twitter.com/oauth/request_token', auth = auth, data = payload)

    # response_output = r.text
    # print(response_output)
    # response_parameters = response_output.split("&")

    # oauth_token = response_parameters[0][12:]
    # print(oauth_token)
    # oauth_token_secret = response_parameters[1][19:]
    # oauth_callback_confirmed = bool(response_parameters[2][25:])

    # print(oauth_token)
    token_response_dict = {"oauth_token": oauth_token}
    return(jsonify(**token_response_dict))

@app.route("/candidates_tweets")
def candidates_tweets():
    return(jsonify(tweets_json))

@app.route("/candidates_hour_categorized")
def candidates_hour_categorized():
    return(jsonify(hour_json))

@app.route("/candidates_day_categorized")
def candidates_day_categorized():
    return(jsonify(day_json))

@app.route("/replies_absolute_sentiment")
def replies_absolute_sentiment():
    return(jsonify(sentiment_json))

if __name__ == "__main__":
        app.debug = True
        app.run()