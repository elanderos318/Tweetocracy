import os
import pandas as pd
import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/candidates_tweets.sqlite"

engine = create_engine('sqlite:///db/candidates_tweets.sqlite', echo = False)

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
    return render_template('index.html')

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