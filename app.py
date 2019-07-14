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

app = Flask(__name__)
app.secret_key = os.urandom(24)

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

# payload = {
#     'oauth_callback':callback_url
# }

# local testing

payload = {
    'oauth_callback':"http://127.0.0.1:5000/"
}

r = requests.post('https://api.twitter.com/oauth/request_token', auth = auth, data = payload)

# print(r.url)

# print(r.status_code)

# print(r.text)

response_output = r.text
response_parameters = response_output.split("&")

# print(response_parameters)

oauth_token = response_parameters[0][12:]
# print(oauth_token)
oauth_token_secret=response_parameters[1][19:]
# print(oauth_token_secret)
oauth_callback_confirmed = bool(response_parameters[2][25:])
# print(oauth_callback_confirmed)

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

#Set up routes
@app.route('/')
def index():

    request_token = request.args.get("oauth_token")
    # print(request_token)
    oauth_verifier = request.args.get("oauth_verifier")
    # print(oauth_verifier)
    # print(request_token == oauth_token)

    if request_token == oauth_token and oauth_verifier:

        auth_access = OAuth1(ck, cs, request_token, ats)

        payload_access = {
            'oauth_verifier':oauth_verifier
        }

        r_access = requests.post("https://api.twitter.com/oauth/access_token", auth = auth_access, data = payload_access)
        r_access_text = r_access.text

        # print(r_access.status_code)
        # print(r_access_text)

        post_access_params = r_access_text.split("&")

        access_token = post_access_params[0][12:]
        access_token_secret = post_access_params[1][19:]
        user_id = post_access_params[2][8:]
        screen_name = post_access_params[3][12:]

        session["username"] = screen_name

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