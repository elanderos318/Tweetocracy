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
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, render_template, request, redirect, url_for, session

from Candidates import candidates_list

app = Flask(__name__)
# app.secret_key = os.urandom(24)

# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/candidates_tweets.sqlite"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/twitter_db.sqlite"


# engine = create_engine('sqlite:///db/candidates_tweets.sqlite', echo = False)
engine = create_engine('sqlite:///db/twitter_db.sqlite', echo = False)

# Declare a Base using automap_base()
Base = automap_base()
# Use the Base class to reflect the database tables
Base.prepare(engine, reflect=True)
# Assign the tweets class to a variable called 'Tweets'
Tweets = Base.classes.tweet_data


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

# Create authorization object
auth = OAuth1(ck, cs, at, ats)

# Required callback_url for twitter authorization
callback_url = "https://tweetocracy.herokuapp.com/"

# payload = {
#     'oauth_callback':callback_url
# }

# local testing

# Payload object sends required callback info to twitter API
payload = {
    'oauth_callback':"http://127.0.0.1:5000/"
}

# Execute a POST/Auth request to twittier api to intitiate access
r = requests.post('https://api.twitter.com/oauth/request_token', auth = auth, data = payload)

print(f'Post Request Token URL:{r.url}')
print(f'Post Request Status:{r.status_code}')
print(f'Post Request Text: {r.text}')

# Collect response information
response_output = r.text
# Relevant paramters are received as a string, separated by an '&' character
response_parameters = response_output.split("&")

# Store relevant response paramters in variables
oauth_token = response_parameters[0][12:]
print(f'OAuth_token:{oauth_token}')
oauth_token_secret=response_parameters[1][19:]
print(f'Oauth Token Secret:{oauth_token_secret}')
oauth_callback_confirmed = bool(response_parameters[2][25:])
print(f'Callback Confirmed:{oauth_callback_confirmed}')

#### Tweet DataSet
# tweets_df = pd.DataFrame(engine.execute("SELECT * FROM candidates_tweets").fetchall())
# tweets_df = tweets_df.rename(columns = {
#     0: "comments",
#     1: "date_string",
#     2: "datetime",
#     3: "engagement_score",
#     4: "favorites",
#     5: "name",
#     6: "party",
#     7: "retweets",
#     8: "stream_id",
#     9: "text",
#     10: "tweet_url",
#     11: "twitter_username",
#     12: "unix_time"
# })
# tweets_json = tweets_df.to_json(orient='records')

### Hour Dataset
# hour_df = pd.DataFrame(engine.execute("SELECT * FROM candidates_hour_categorized").fetchall())
# hour_df = hour_df.rename(columns = {
#     0: "name",
#     1: "tweet_hour",
#     2: "median_engagement"
# })
# hour_json = hour_df.to_json(orient='records')

### Day Dataset
# day_df = pd.DataFrame(engine.execute("SELECT * FROM candidates_day_categorized").fetchall())
# day_df = day_df.rename(columns = {
#     0: "name",
#     1: "tweet_weekday",
#     2: "median_engagement"
# })
# day_json = day_df.to_json(orient='records')

### Replies Sentiment Dataset
# sentiment_df = pd.DataFrame(engine.execute("SELECT * FROM replies_absolute_sentiment").fetchall())
# sentiment_df = sentiment_df.rename(columns = {
#     0: "name",
#     1: "stream_id",
#     2: "engagement_score",
#     3: "average_absolute_sentiment_score"
# })
# sentiment_json = sentiment_df.to_json(orient='records')

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

@app.route('/init_data')
def data():

    # Create Session for reading/updating database
    session = Session(engine)

    # graph_data = session.query(Tweets).all()

    # graph_data_list = []

    # for row in graph_data:
    #     data_dict = {}
    #     data_dict["created_at"] = row.created_at
    #     data_dict["tweet_id"] = row.tweet_id
    #     data_dict["tweet_id_str"] = row.tweet_id_str
    #     data_dict["full_text"] = row.full_text
    #     data_dict["in_reply_to_status_id"] = row.in_reply_to_status_id
    #     data_dict["in_reply_to_status_id_str"] = row.in_reply_to_status_id_str
    #     data_dict["in_reply_to_user_id"] = row.in_reply_to_user_id
    #     data_dict["in_reply_to_user_id_str"] = row.in_reply_to_user_id_str
    #     data_dict["user_id"] = row.user_id
    #     data_dict["user_id_str"] = row.user_id_str
    #     data_dict["user_name"] = row.user_name
    #     data_dict["user_screen_name"] = row.user_screen_name
    #     data_dict["retweet_count"] = row.retweet_count
    #     data_dict["favorite_count"] = row.favorite_count
    #     graph_data_list.append(data_dict)


    average_query = session.query(Tweets.user_name, func.avg(Tweets.retweet_count), func.avg(Tweets.favorite_count)).group_by(Tweets.user_name).all()

    keys = ('user_name', 'retweet_average', 'favorite_average')

    graph_data_list = [dict(zip(keys, values)) for values in average_query]

    response_json = json.dumps(graph_data_list)

    session.close()

    return(jsonify(response_json))

@app.route("/filter", methods = ["GET", "POST"])
def filter():
    if request.method == "POST":
        #read data and convert to list of dictionary
        data = request.data
        filter_data = [json.loads(data.decode('utf-8'))]
        candidate_ids = filter_data[0]["candidatesList"]
        metric_variable = filter_data[0]["metricVariable"]

        print(candidate_ids)
        # print(type(candidate_ids[0]))

        session = Session(engine)
        # simple_query = session.query(Tweets).all()
        # print(simple_query)
        base_query = session.query(Tweets.user_name,
            func.avg(Tweets.retweet_count),
            func.avg(Tweets.favorite_count)).\
            filter(Tweets.user_id_str.in_(candidate_ids)).\
            group_by(Tweets.user_name).all()
        print(base_query)
        # filter_query = base_query.filter(Tweets.user_id_str in candidate_ids).all()
        # print(filter_query)
        # filter_average_query = filter_query(Tweets.user_name, func.avg(Tweets.retweet_count), func.avg(Tweets.favorite_count)).group_by(Tweets.user_name).all()

        # keys = ('user_name', 'retweet_average', 'favorite_average')
        # filter_data_list = [dict(zip(keys, values)) for values in filter_average_query]


        decoded_json = json.dumps(filter_data)

        return decoded_json


@app.route("/foo")
def foo():

    ### Fetch Timeline Data

    response_list = []

    for x in range(len(candidates_list)):

        candidate_name = candidates_list[x]['name']
        candidate_id = candidates_list[x]["twitter_user_id"]

        # if user_name == "Donald Trump":
        #     continue

        print(f'Retrieving Data for {candidate_name}')

        user_get = requests.get(f'https://api.twitter.com/1.1/statuses/user_timeline.json?id={candidate_id}&count=100', params = extended_payload, auth = auth)

        user_json = user_get.json()
        print(json.dumps(user_json[0], indent = 4))

        user_tweet_count = 0
        user_retweet_total = 0
        user_favorite_total = 0
        passed_tweets = 0
        

        for tweet in user_json:
            

            print(f'Tweet Count: {user_tweet_count}')
            print(f'Total Retweet Count: {user_retweet_total}')

            # We do not count retweets as user tweets. If retweeted_stats is true, we will continue to the next iteration
            try:
                tweet["retweeted_status"]
                passed_tweets = passed_tweets + 1
                continue
            except KeyError:
                pass

            ####### Program code for detecting replies/self-replies

            # reply = tweet['in_reply_to_user_id_str']

            # if reply:
            #     if reply == tweet['user']['id_str']:
            #         pass
            #     else:
            #         passed_tweets = passed_tweets + 1
            #         continue
            

            # Store relevant information in variables
            created_at = tweet["created_at"]
            tweet_id = tweet["id"]
            tweet_id_str = tweet["id_str"]
            full_text = tweet["full_text"]
            in_reply_to_status_id = tweet["in_reply_to_status_id"]
            in_reply_to_status_id_str = tweet["in_reply_to_status_id_str"]
            in_reply_to_user_id = tweet["in_reply_to_user_id"]
            in_reply_to_user_id_str = tweet["in_reply_to_user_id_str"]
            user_id = tweet["user"]["id"]
            user_id_str = tweet["user"]["id_str"]
            user_name = tweet["user"]["name"]
            user_screen_name = tweet["user"]["screen_name"]
            retweet_count = tweet["retweet_count"]
            favorite_count = tweet["favorite_count"]

            # Query the sql table and look for tweet_id_str

            tweet_query = session.query(Tweets)

            if tweet_query.filter_by(tweet_id_str = tweet_id_str).count() > 0:
                print("existing tweet")
                # current_tweet = tweet_query.filter(Tweets.tweet_id_str == tweet_id_str).count()
                # print(current_tweet)
            else:
                print("adding tweet to db")
                session.add(Tweets(created_at = created_at, tweet_id = tweet_id, tweet_id_str = tweet_id_str,
                    full_text = full_text, in_reply_to_status_id = in_reply_to_status_id,
                    in_reply_to_status_id_str = in_reply_to_status_id_str,
                    in_reply_to_user_id = in_reply_to_user_id, in_reply_to_user_id_str = in_reply_to_user_id_str,
                    user_id = user_id, user_id_str = user_id_str, user_name = user_name, user_screen_name = user_screen_name,
                    retweet_count = retweet_count, favorite_count = favorite_count))

                session.commit()
            
            # new_tweet_query = session.query(Tweets)
            # for tweet in new_tweet_query:
            #     print(tweet.tweet_id_str)

            ################################################

            user_tweet_count = user_tweet_count + 1
            user_retweet_total = user_retweet_total + retweet_count
            user_favorite_total = user_favorite_total + favorite_count

        retweet_average = user_retweet_total / user_tweet_count
        favorite_average = user_favorite_total / user_tweet_count

        print(f'Retweet Average for User {user_name} is {retweet_average}')

        response_list.append({
            "user": user_name,
            "retweet_average": retweet_average,
            "favorite_average": favorite_average,
            "total_tweets_retrieved": user_tweet_count,
            "total_retweets_counted": user_retweet_total
        })

    return "Hello"


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