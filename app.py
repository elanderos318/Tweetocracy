import os

import json

import datetime as dt
import calendar
import pytz

from itertools import groupby

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

from keras.models import load_model
from keras import backend as K

from sklearn.feature_extraction.text import CountVectorizer
from scipy.sparse import csr_matrix
from sklearn.externals import joblib
from sklearn.preprocessing import LabelEncoder

import random

import pickle

import nltk
import re
import string

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
# Assign the table classes to variables
Tweets = Base.classes.tweet_data
Update = Base.classes.database_update
Moving_Averages = Base.classes.moving_averages


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

#Route for direcitng to "Machine Learning" page
@app.route("/machine_learning")
def machine_learning():
    return render_template('machine_learning.html')

# Function for filtering out tweets which are newer than two days (Gives the tweet stats time to mature)
def filter_aged(list_element):
    date_string = list_element["created_at"]
    datetime_object = dt.datetime.strptime(date_string, "%a %b %d %H:%M:%S %z %Y")
    date_object = datetime_object.date()
    
    today_datetime = dt.datetime.utcnow()
    today_date = today_datetime.date()
    two_days_prior = today_date - dt.timedelta(days = 2)
    
    return date_object < two_days_prior

# Functions for returning day, hour, month values from a datetime string
def convert_day(date_string):
    datetime_object = dt.datetime.strptime(date_string, "%a %b %d %H:%M:%S %z %Y")
    day = dt.datetime.strftime(datetime_object, "%A")
    return day
def convert_hour(date_string):
    datetime_object = dt.datetime.strptime(date_string, "%a %b %d %H:%M:%S %z %Y")
    hour = dt.datetime.strftime(datetime_object, "%H")
    return hour
def convert_month(date_string):
    datetime_object = dt.datetime.strptime(date_string, "%a %b %d %H:%M:%S %z %Y")
    month = dt.datetime.strftime(datetime_object, "%B")
    return month
    

stopwords = nltk.corpus.stopwords.words('english')
wn = nltk.WordNetLemmatizer()

# Funciton for processing text data (remove punctuation, tokenization, lemmatization)
def clean_text(text):
    text = "".join([word.lower() for word in text if word not in string.punctuation])
    tokens = re.split('\W+', text)
    text = [wn.lemmatize(word) for word in tokens if word not in stopwords]
    return text

@app.route("/machine_learning_tweet")
def machine_learning_tweet():

    # today_datetime = dt.datetime.utcnow()
    # today_date = today_datetime.date()
    # two_days_prior = dt.date.today() - dt.timedelta(days = 2)

    random_candidate = random.choice(candidates_list)
    candidate_id = random_candidate["twitter_user_id"]

    user_get = requests.get(f'https://api.twitter.com/1.1/statuses/user_timeline.json?id={candidate_id}&count=100', params = extended_payload, auth = auth)
    user_json = user_get.json()
    user_filtered = list(filter(lambda x: filter_aged(x), user_json))

    tweet_selection = random.choice(user_filtered)
    tweet_dict = {
        'full_text': tweet_selection["full_text"],
        'retweet_count': tweet_selection["retweet_count"],
        'favorite_count': tweet_selection['favorite_count'],
        'created_at': tweet_selection['created_at']
    }
    tweet_dict['day'] = convert_day(tweet_dict['created_at'])
    tweet_dict['hour'] = convert_hour(tweet_dict['created_at'])
    tweet_dict['month']  = convert_month(tweet_dict['created_at'])

    tweet_list = [tweet_dict]
    tweet_df = pd.DataFrame(tweet_list)

    # NGramVectorizer
    ngram_vect = CountVectorizer(ngram_range=(2,2), analyzer=clean_text)
    ngram_vect.fit_transform(tweet_df['full_text'])


    __location__ = os.path.dirname(os.path.realpath(__file__))
    print(__location__)

    config_dir = os.path.join(__location__, "config")
    print(config_dir)

    print(os.getcwd())

    # retrieve column names from trained model
    with open('jupyter_notebook_code/columns.pkl', 'rb') as f:
        columns_list = pickle.load(f)
        
    null_list = []
    for i in range(0, len(columns_list)):
        null_list.append(0)

    X_features = dict(zip(columns_list, null_list))

    X_features['retweet_count'] = tweet_dict['retweet_count']
    X_features['favorite_count'] = tweet_dict['favorite_count']

    select_month = tweet_dict['month']
    select_day = tweet_dict['day']
    select_hour = tweet_dict['hour']
    X_features[f'month_{select_month}'] = 1
    X_features[f'day_{select_day}'] = 1
    X_features[f'hour_{select_hour}'] = 1

    for word in ngram_vect.get_feature_names():
        if word in X_features.keys():
            X_features[word] += 1

    X_features = np.array(list(X_features.values())).reshape((1, 58604))

    X_sparse = csr_matrix(X_features)

    scaler_filename = "jupyter_notebook_code/mas_scaler.save"
    scaler = joblib.load(scaler_filename) 

    X_scaled = scaler.transform(X_sparse)

    encoder = LabelEncoder()
    encoder.classes_ = np.load('jupyter_notebook_code/classes.npy', allow_pickle = True)

    model = load_model("jupyter_notebook_code/candidate_classifier.h5")

    # K.clear_session()

    prediction_prob = model.predict_proba(X_scaled)
    prediction_prob = [float(i) for i in prediction_prob[0]]
    classes_prob = list(zip(prediction_prob, encoder.classes_))
    sorted_class = sorted(classes_prob, key = lambda x: x[0], reverse = True)
    sorted_top = sorted_class[0:2]

    sorted_json = json.dumps(sorted_top)

    K.clear_session()

    return sorted_json


# Route for initializing "At a Glance" graph
@app.route('/aag_init')
def aag_init():
    # Create Session for reading/updating database
    session = Session(engine)

    # Initiate 'at a glance' graph from current_date to 30 days prior
    today_datetime = dt.datetime.utcnow()
    today_date = today_datetime.date()
    thirty_days_ago = dt.date.today() - dt.timedelta(days = 30)

    average_query = session.query(Tweets.user_name, 
        func.avg(Tweets.retweet_count), 
        func.avg(Tweets.favorite_count)).\
        filter(Tweets.created_at_date >= thirty_days_ago).\
        filter(Tweets.created_at_date <= today_date).\
        group_by(Tweets.user_name).all()

    keys = ('user_name', 'retweet_average', 'favorite_average')

    graph_data_list = [dict(zip(keys, values)) for values in average_query]

    response_json = json.dumps(graph_data_list)

    print(response_json)

    session.close()

    return jsonify(response_json)

# Route for initializing "Moving Average" graph
@app.route("/moving_average_init")
def moving_average_init():
    # Initiate 'moving average' graph from current_date to 30 days prior
    today_datetime = dt.datetime.utcnow()
    today_date = today_datetime.date()
    thirty_days_ago = dt.date.today() - dt.timedelta(days = 30)

    session = Session(engine)

    moving_average_list = []

    moving_average_query = session.query(Moving_Averages.candidate_name,
        Moving_Averages.date,
        Moving_Averages.retweet_moving_average, 
        Moving_Averages.favorite_moving_average).\
        filter(Moving_Averages.date >= thirty_days_ago).\
        filter(Moving_Averages.date <= today_date)
            
    keys = ("user_name", "moving_average_date", "retweet_moving_average", "favorite_moving_average")

    # Iteration for converting sqlalchemy date response into date string and appening to list
    for query in moving_average_query:
        list_query = list(query)
        list_query[1] = dt.datetime.strftime(list_query[1], "%Y-%m-%d")
        moving_average_dict = dict(zip(keys, list_query))
        moving_average_list.append(moving_average_dict)

    print(moving_average_list)

    session.close()

    moving_average_json = json.dumps(moving_average_list)

    return moving_average_json

# Ref ("/time_init") function used for sorting query based on hour, necessary for groupby
def time_sort(time):
    index_select = time[3]
    index_select = dt.time.strftime(index_select, "%H")
    return index_select

# Route for initializing "Time" graph
@app.route("/time_init")
def time_init():
    # Initiate "time" graph from current date to 30 days prior
    today_datetime = dt.datetime.utcnow()
    today_date = today_datetime.date()
    thirty_days_ago = dt.date.today() - dt.timedelta(days = 30)

    session = Session(engine)

    time_list = []
    init_user_name = candidates_list[0]["name"]
    init_user_id = candidates_list[0]["twitter_user_id"]

    #Initial candidate displayed == "Joe Biden"
    #Initial "time" selection == "hourly"
    time_query = session.query(Tweets.user_name, Tweets.retweet_count,
        Tweets.favorite_count, Tweets.created_at_time).\
        filter(Tweets.created_at_date >= thirty_days_ago).\
        filter(Tweets.created_at_date <= today_date).\
        filter(Tweets.user_id_str == init_user_id)
    
    time_sorted_list = sorted(time_query, key = time_sort)

    keys = ("user_name", "retweet_average", "favorite_average", "Hour")

    for k, g in groupby(time_sorted_list, key = time_sort):
        current_list = list(g)
        group_retweet_list = list(map(lambda x: x[1], current_list))
        group_favorite_list = list(map(lambda x: x[2], current_list))
        group_retweet_average = np.mean(group_retweet_list)
        group_favorite_average = np.mean(group_favorite_list)
        group_tuple = (init_user_name, group_retweet_average, group_favorite_average, k)
        group_dict = dict(zip(keys, group_tuple))
        time_list.append(group_dict)

    time_json = json.dumps(time_list)

    session.close()
    
    return time_json

@ app.route("/histogram_init")
def dist_init():
    # Initiate "histogram" graph from current date to 30 days prior
    today_datetime = dt.datetime.utcnow()
    today_date = today_datetime.date()
    thirty_days_ago = dt.date.today() - dt.timedelta(days = 30)

    session = Session(engine)

    histogram_query = session.query(Tweets.retweet_count).\
        filter(Tweets.created_at_date >= thirty_days_ago).\
        filter(Tweets.created_at_date <= today_date).\
        order_by(Tweets.retweet_count)
    # Query returned into a list of separate tuples, below combines all tuples into one
    [histogram_query] = list(zip(*histogram_query))
    # Create iterator
    query_iter = iter(histogram_query)

    #Find min and max values
    range_query = session.query(func.min(Tweets.retweet_count),
        func.max(Tweets.retweet_count)).\
        filter(Tweets.created_at_date >=thirty_days_ago).\
        filter(Tweets.created_at_date <= today_date).first()

    min_value = range_query[0]
    max_value = range_query[1]
    # Find range
    histogram_range = max_value - min_value

    #Define # of histogram bars (100)
    histogram_bars = 100

    # Find range for each bar
    bar_range = histogram_range / histogram_bars

    histogram_list = []

    # Create and append dicts which contain the value ranges for the bars with "0" value count
    for x in range(0, histogram_bars):
        begin_value = min_value + x * bar_range
        end_value = begin_value + bar_range
        begin_str = "{:,}".format(round(begin_value, 2))
        end_str = "{:,}".format(round(end_value, 2))
        range_str = begin_str + "-" + end_str
        hist_dict = {
            'begin': begin_value,
            'end': end_value,
            'tick': range_str,
            'count': 0
        }
        histogram_list.append(hist_dict)
    # Iterate through query, find a dict that fits, and increase count by one
    # "Value Error" raised for last item in query because the filter function does not yield a dict for this value. In this case it is simple to just increase the value of the last dict by one
    for y in query_iter:
        try:
            [current_bar] = list(filter(lambda x: y >= x["begin"] and y < x["end"], histogram_list))
            current_bar["count"] += 1
        except ValueError:
            histogram_list[-1]["count"] += 1
    
    
    histogram_json = json.dumps(histogram_list)

    session.close()

    return histogram_json


def user_sort(query):
    index_select = query[1]
    return index_select

def replace_zero(item):
    item_list = list(item)
    index_select = item[2]
    if index_select == 0:
        index_select = 1
        item_list.pop(0)
        item_list.append(index_select)
        return item_list
    else:
        return item_list

@app.route("/box_plot_init")
def box_plot_init():

    # Initiate "histogram" graph from current date to 30 days prior
    today_datetime = dt.datetime.utcnow()
    today_date = today_datetime.date()
    thirty_days_ago = dt.date.today() - dt.timedelta(days = 30)

    session = Session(engine)
    # Create query
    box_query = session.query(Tweets.user_name, Tweets.user_id_str, Tweets.retweet_count).\
        filter(Tweets.created_at_date >= thirty_days_ago).\
        filter(Tweets.created_at_date <= today_date)
    # sort list according to candidate
    box_sorted = sorted(box_query, key = user_sort)

    keys = ("user_name", "min", "q1", "median", "q3", "max")

    box_list = []
    # group by candidate
    # Data will be log transformed for a more visually appealing graph
    # we replace all zeroes with one
    # values are transformed to float/int bc json cannot parse data otherwise
    for k, g in groupby(box_sorted, key = user_sort):
        current_list = list(g)
        new_list = list(map(lambda x: replace_zero(x), current_list))
        retweet_list = list(map(lambda x: x[2], new_list))
        log_list = list(np.log(retweet_list))
        retweet_median = float(np.median(log_list))
        retweet_q1 = float(np.quantile(log_list, .25))
        retweet_q3 = float(np.quantile(log_list, .75))       
        retweet_min = int(np.min(log_list))
        retweet_max = int(np.max(log_list))
        user_id = k
        [user_dict] = list(filter(lambda x: x["twitter_user_id"] == user_id, candidates_list))
        user_name = user_dict["name"]
        user_tuple = (user_name, retweet_min, retweet_q1, retweet_median, retweet_q3, retweet_max)
        response_dict = dict(zip(keys, user_tuple))
        box_list.append(response_dict)

    box_json = json.dumps(box_list)

    session.close()

    return box_json

# Route for displaying top tweets
@app.route("/tweets_init")
def tweets_init():
    # Initiate "tweets" list from current date to 30 days prior
    today_datetime = dt.datetime.utcnow()
    today_date = today_datetime.date()
    thirty_days_ago = dt.date.today() - dt.timedelta(days = 30)

    session = Session(engine)

    # Select first candidate from "candidates_list" for displaying initial tweets
    tweet_list = []
    init_user_id = candidates_list[0]["twitter_user_id"]
    # Create query, initial metric is retweets
    tweet_query = session.query(Tweets.user_name, Tweets.tweet_id_str).\
        filter(Tweets.created_at_date >= thirty_days_ago).\
        filter(Tweets.created_at_date <= today_date).\
        filter(Tweets.user_id_str == init_user_id).\
        order_by(Tweets.retweet_count.desc()).limit(10)

    keys = ("user_name", "tweet_id_str")

    for tweet in tweet_query:
        tweet_dict = dict(zip(keys, tweet))
        tweet_list.append(tweet_dict)


    tweet_json = json.dumps(tweet_list)

    session.close()

    return tweet_json

# Route for sending back filtered data for tweet list
@app.route("/tweets_filter", methods = ["GET", "POST"])
def tweets_filter():
    if request.method == "POST":
        data = request.data
        filter_data = [json.loads(data.decode('utf-8'))]
        #retrieve data variables
        candidate_id = filter_data[0]["chosenTweetsCandidate"]
        date_from = filter_data[0]["dateFrom"]
        date_to = filter_data[0]["dateTo"]
        metric_var = filter_data[0]["tweetMetricLabel"]

        # convert string dates into DATETIME objects
        date_from_datetime = dt.datetime.strptime(date_from, "%b %d, %Y")
        date_to_datetime = dt.datetime.strptime(date_to, "%b %d, %Y")
        #convert DATETIME objects into DATE objects
        date_from_date = date_from_datetime.date()
        date_to_date = date_to_datetime.date()

        session = Session(engine)

        tweet_list = []

        if metric_var == "Retweets":
            # Create query
            tweet_query = session.query(Tweets.user_name, Tweets.tweet_id_str).\
                filter(Tweets.created_at_date >= date_from_date).\
                filter(Tweets.created_at_date <= date_to_date).\
                filter(Tweets.user_id_str == candidate_id).\
                order_by(Tweets.retweet_count.desc()).limit(10)

            keys = ("user_name", "tweet_id_str")

            for tweet in tweet_query:
                tweet_dict = dict(zip(keys, tweet))
                tweet_list.append(tweet_dict)
        else:
            # Create query
            tweet_query = session.query(Tweets.user_name, Tweets.tweet_id_str).\
                filter(Tweets.created_at_date >= date_from_date).\
                filter(Tweets.created_at_date <= date_to_date).\
                filter(Tweets.user_id_str == candidate_id).\
                order_by(Tweets.favorite_count.desc()).limit(10)

            keys = ("user_name", "tweet_id_str")

            for tweet in tweet_query:
                tweet_dict = dict(zip(keys, tweet))
                tweet_list.append(tweet_dict)


        tweet_json = json.dumps(tweet_list)

        session.close()

        return tweet_json
        

# Route for sending back filtered data for box plot
@app.route("/box_plot_filter", methods = ["GET", "POST"])
def box_plot_filter():

    if request.method == "POST":
        data = request.data
        filter_data = [json.loads(data.decode('utf-8'))]
        #retrieve data variables
        candidate_ids = filter_data[0]["candidatesList"]
        date_from = filter_data[0]["dateFrom"]
        date_to = filter_data[0]["dateTo"]
        metric_var = filter_data[0]["distMetricVar"]

        # convert string dates into DATETIME objects
        date_from_datetime = dt.datetime.strptime(date_from, "%b %d, %Y")
        date_to_datetime = dt.datetime.strptime(date_to, "%b %d, %Y")
        #convert DATETIME objects into DATE objects
        date_from_date = date_from_datetime.date()
        date_to_date = date_to_datetime.date()

        session = Session(engine)

        keys = ("user_name", "min", "q1", "median", "q3", "max")

        box_list = []
        # group by candidate
        # Data will be log transformed for a more visually appealing graph
        # we replace all zeroes with one
        # values are transformed to float/int bc json cannot parse data otherwise

        if metric_var == "retweet_count":
            # Create query
            box_query = session.query(Tweets.user_name, Tweets.user_id_str, Tweets.retweet_count).\
                filter(Tweets.user_id_str.in_(candidate_ids)).\
                filter(Tweets.created_at_date >= date_from_date).\
                filter(Tweets.created_at_date <= date_to_date)
            # sort list according to candidate
            box_sorted = sorted(box_query, key = user_sort)
            for k, g in groupby(box_sorted, key = user_sort):
                current_list = list(g)
                new_list = list(map(lambda x: replace_zero(x), current_list))
                retweet_list = list(map(lambda x: x[2], new_list))
                log_list = list(np.log(retweet_list))
                retweet_median = float(np.median(log_list))
                retweet_q1 = float(np.quantile(log_list, .25))
                retweet_q3 = float(np.quantile(log_list, .75))       
                retweet_min = int(np.min(log_list))
                retweet_max = int(np.max(log_list))
                user_id = k
                [user_dict] = list(filter(lambda x: x["twitter_user_id"] == user_id, candidates_list))
                user_name = user_dict["name"]
                user_tuple = (user_name, retweet_min, retweet_q1, retweet_median, retweet_q3, retweet_max)
                response_dict = dict(zip(keys, user_tuple))
                box_list.append(response_dict)
                
        elif metric_var == "favorite_count":
            # Create query
            box_query = session.query(Tweets.user_name, Tweets.user_id_str, Tweets.favorite_count).\
                filter(Tweets.user_id_str.in_(candidate_ids)).\
                filter(Tweets.created_at_date >= date_from_date).\
                filter(Tweets.created_at_date <= date_to_date)
            # sort list according to candidate
            box_sorted = sorted(box_query, key = user_sort)

            for k, g in groupby(box_sorted, key = user_sort):
                current_list = list(g)
                new_list = list(map(lambda x: replace_zero(x), current_list))
                favorite_list = list(map(lambda x: x[2], new_list))
                log_list = list(np.log(favorite_list))
                favorite_median = float(np.median(log_list))
                favorite_q1 = float(np.quantile(log_list, .25))
                favorite_q3 = float(np.quantile(log_list, .75))       
                favorite_min = int(np.min(log_list))
                favorite_max = int(np.max(log_list))
                user_id = k
                [user_dict] = list(filter(lambda x: x["twitter_user_id"] == user_id, candidates_list))
                user_name = user_dict["name"]
                user_tuple = (user_name, favorite_min, favorite_q1, favorite_median, favorite_q3, favorite_max)
                response_dict = dict(zip(keys, user_tuple))
                box_list.append(response_dict)

        box_json = json.dumps(box_list)

        session.close()

        return box_json


# Function for sorting and to call for "key" argument in groupby
def day_sort(query):
    return(query)

@app.route("/histogram_filter", methods = ["GET", "POST"])
def histogram_filter():
    if request.method == "POST":
        #read data and convert to list of dictionary
        data = request.data
        filter_data = [json.loads(data.decode('utf-8'))]
        #retrieve data variables
        candidate_ids = filter_data[0]["candidatesList"]
        date_from = filter_data[0]["dateFrom"]
        date_to = filter_data[0]["dateTo"]
        metric_var = filter_data[0]["distMetricVar"]

        # convert string dates into DATETIME objects
        date_from_datetime = dt.datetime.strptime(date_from, "%b %d, %Y")
        date_to_datetime = dt.datetime.strptime(date_to, "%b %d, %Y")
        #convert DATETIME objects into DATE objects
        date_from_date = date_from_datetime.date()
        date_to_date = date_to_datetime.date()

        session = Session(engine)

        histogram_list = []
        
        if metric_var == "retweet_count":

            histogram_query = session.query(Tweets.retweet_count).\
                filter(Tweets.user_id_str.in_(candidate_ids)).\
                filter(Tweets.created_at_date >= date_from_date).\
                filter(Tweets.created_at_date <= date_to_date).\
                order_by(Tweets.retweet_count)

            [histogram_query] = list(zip(*histogram_query))

            query_iter = iter(histogram_query)

            #Find min and max values
            range_query = session.query(func.min(Tweets.retweet_count),
                func.max(Tweets.retweet_count)).\
                filter(Tweets.user_id_str.in_(candidate_ids)).\
                filter(Tweets.created_at_date >= date_from_date).\
                filter(Tweets.created_at_date <= date_to_date).first()
            min_value = range_query[0]
            max_value = range_query[1]
            # Find range
            histogram_range = max_value - min_value
            #Define # of histogram bars (100)
            histogram_bars = 100
            # Find range for each bar
            bar_range = histogram_range / histogram_bars

            # Create and append dicts which contain the value ranges for the bars with "0" value count
            for x in range(0, histogram_bars):
                begin_value = min_value + x * bar_range
                end_value = begin_value + bar_range
                begin_str = "{:,}".format(round(begin_value, 2))
                end_str = "{:,}".format(round(end_value, 2))
                range_str = begin_str + "-" + end_str
                hist_dict = {
                    'begin': begin_value,
                    'end': end_value,
                    'tick': range_str,
                    'count': 0
                }
                histogram_list.append(hist_dict)

            # Iterate through query, find a dict that fits, and increase count by one
            # "Value Error" raised for last item in query because the filter function does not yield a dict for this value. In this case it is simple to just increase the value of the last dict by one
            for y in query_iter:
                try:
                    [current_bar] = list(filter(lambda x: y >= x["begin"] and y < x["end"], histogram_list))
                    current_bar["count"] += 1
                except ValueError:
                    histogram_list[-1]["count"] += 1


        else:

            histogram_query = session.query(Tweets.favorite_count).\
                filter(Tweets.user_id_str.in_(candidate_ids)).\
                filter(Tweets.created_at_date >= date_from_date).\
                filter(Tweets.created_at_date <= date_to_date).\
                order_by(Tweets.favorite_count)

            [histogram_query] = list(zip(*histogram_query))

            query_iter = iter(histogram_query)

            #Find min and max values
            range_query = session.query(func.min(Tweets.favorite_count),
                func.max(Tweets.favorite_count)).\
                filter(Tweets.user_id_str.in_(candidate_ids)).\
                filter(Tweets.created_at_date >= date_from_date).\
                filter(Tweets.created_at_date <= date_to_date).first()
            min_value = range_query[0]
            max_value = range_query[1]
            # Find range
            histogram_range = max_value - min_value
            #Define # of histogram bars (100)
            histogram_bars = 100
            # Find range for each bar
            bar_range = histogram_range / histogram_bars

            # Create and append dicts which contain the value ranges for the bars with "0" value count
            for x in range(0, histogram_bars):
                begin_value = min_value + x * bar_range
                end_value = begin_value + bar_range
                begin_str = "{:,}".format(round(begin_value, 2))
                end_str = "{:,}".format(round(end_value, 2))
                range_str = begin_str + "-" + end_str
                hist_dict = {
                    'begin': begin_value,
                    'end': end_value,
                    'tick': range_str,
                    'count': 0
                }
                histogram_list.append(hist_dict)

            # Iterate through query, find a dict that fits, and increase count by one
            # "Value Error" raised for last item in query because the filter function does not yield a dict for this value. In this case it is simple to just increase the value of the last dict by one
            for y in query_iter:
                try:
                    [current_bar] = list(filter(lambda x: y >= x["begin"] and y < x["end"], histogram_list))
                    current_bar["count"] += 1
                except ValueError:
                    histogram_list[-1]["count"] += 1


        histogram_json = json.dumps(histogram_list)

        session.close()

        return histogram_json



# Ref ("/time_filter") function used for sorting query based on hour or day, necessary for groupby
def date_time_sort(datetime_query, basis):
    index_select = datetime_query[3]
    if basis == "Hour":
        index_select = dt.datetime.strftime(index_select, "%H")
        return index_select
    elif basis == "Day":
        index_select = dt.datetime.strftime(index_select, "%w")
        return index_select

# Route for rendering new data for "Time" table based on filter selections
@app.route("/time_filter", methods = ["GET", "POST"])
def time_filter():
    if request.method == "POST":
        #read data and convert to list of dictionary
        data = request.data
        filter_data = [json.loads(data.decode('utf-8'))]
        #retrieve data variables
        candidate_id = filter_data[0]["chosenCandidate"]
        date_from = filter_data[0]["dateFrom"]
        date_to = filter_data[0]["dateTo"]
        time_basis = filter_data[0]["timeBasis"]
        # Find candidate with corresponding candidate id and retrieve their name
        candidate_retrieve = list(filter(lambda x: (x["twitter_user_id"] == candidate_id), candidates_list))
        candidate_name = candidate_retrieve[0]["name"]
        # convert string dates into DATETIME objects
        date_from_datetime = dt.datetime.strptime(date_from, "%b %d, %Y")
        date_to_datetime = dt.datetime.strptime(date_to, "%b %d, %Y")
        #convert DATETIME objects into DATE objects
        date_from_date = date_from_datetime.date()
        date_to_date = date_to_datetime.date()

        session = Session(engine)

        time_list = []

        filter_query = session.query(Tweets.user_name, Tweets.retweet_count,
            Tweets.favorite_count, Tweets.created_at_datetime).\
            filter(Tweets.user_id_str == candidate_id).\
            filter(Tweets.created_at_date >= date_from_date).\
            filter(Tweets.created_at_date <= date_to_date)
        
        time_sorted_list = sorted(filter_query, key = lambda query: date_time_sort(query, time_basis))

        keys = ("user_name", "retweet_average", "favorite_average", time_basis, "count")

        for k, g in groupby(time_sorted_list, key = lambda row: date_time_sort(row, time_basis)):
            current_list = list(g)
            group_count = len(current_list)
            group_retweet_list = list(map(lambda x: x[1], current_list))
            group_favorite_list = list(map(lambda x: x[2], current_list))
            group_retweet_average = np.mean(group_retweet_list)
            group_favorite_average = np.mean(group_favorite_list)
            if time_basis == "Hour":
                group_tuple = (candidate_name, group_retweet_average, group_favorite_average, k, group_count)
                group_dict = dict(zip(keys, group_tuple))
                time_list.append(group_dict)
            if time_basis == "Day":
                k_int = int(k) - 1
                calendar_days = list(calendar.day_abbr)
                current_day = calendar_days[k_int]
                group_tuple = (candidate_name, group_retweet_average, group_favorite_average, current_day, group_count)
                group_dict = dict(zip(keys, group_tuple))
                time_list.append(group_dict)

        time_json = json.dumps(time_list)

        return time_json


# Route for updating "At a Glance" Graph with filtered selections
@app.route("/aag_filter", methods = ["GET", "POST"])
def aag_filter():
    if request.method == "POST":
        #read data and convert to list of dictionary
        data = request.data
        filter_data = [json.loads(data.decode('utf-8'))]

        # retrieve data variables
        candidate_ids = filter_data[0]["candidatesList"]
        date_from = filter_data[0]["dateFrom"]
        date_to = filter_data[0]["dateTo"]

        # convert string dates into DATETIME objects
        date_from_object = dt.datetime.strptime(date_from, "%b %d, %Y")
        date_to_object = dt.datetime.strptime(date_to, "%b %d, %Y") + dt.timedelta(days = 1)

        session = Session(engine)
        
        filter_query = session.query(Tweets.user_name,
            func.avg(Tweets.retweet_count),
            func.avg(Tweets.favorite_count)).\
            filter(Tweets.user_id_str.in_(candidate_ids)).\
            filter(Tweets.created_at_datetime >= date_from_object).\
            filter(Tweets.created_at_datetime < date_to_object).\
            group_by(Tweets.user_name).all()
    
        keys = ('user_name', 'retweet_average', 'favorite_average')
        filter_list = [dict(zip(keys, values)) for values in filter_query]


        filter_json = json.dumps(filter_list)

        session.close()

        return filter_json



# Route for updating 'moving_average' table with recent tweet data
@app.route("/moving_average_update")
def moving_average_update():
    session = Session(engine)

    #timedelta object (10 days) for moving average
    days_back = dt.timedelta(days = 10)

    for candidate in candidates_list:
        # Fetch user id
        candidate_name_parent = candidate["name"]
        candidate_user_id = candidate["twitter_user_id"]
        print(candidate["name"])

        # Fetch most recent date for candidate and convert to date object
        most_recent_date = session.query(func.max(Tweets.created_at_date)).filter(Tweets.user_id_str == candidate_user_id).first()
        most_recent_date_object = most_recent_date[0]
        #Fetch date equal to 10 days before the last time table was updated
        # 21. The half-life of a tweet is 24 minutes
        # In other words, a tweet gets half its interactions in the first half hour, and then starts a long, slow decline into the fog of time
        # "https://blog.hootsuite.com/twitter-statistics/"
        most_recent_update = session.query(func.max(Moving_Averages.date)).\
            filter(Moving_Averages.candidate_id_str == candidate_user_id).first()
        ten_days_before = most_recent_update[0] - dt.timedelta(days = 10)
        #Create query which encompasses all dates for candidate
        update_query_all = session.query(Tweets.user_name,
            func.avg(Tweets.retweet_count),
            func.avg(Tweets.favorite_count)).\
            filter(Tweets.user_id == candidate_user_id).\
            filter(Tweets.created_at_date >= (ten_days_before  - days_back)).\
            filter(Tweets.created_at_date <= most_recent_date_object)
        # Find days between most recent and oldest plus one day
        days_diff = (most_recent_date_object - ten_days_before + dt.timedelta(days = 1)).days

        for days in range(0, days_diff):
            print(candidate_name_parent)
            # Select the current date in iteration
            current_date = ten_days_before + dt.timedelta(days = days)
            print(current_date)
            # Further filter query to select ten days before the current selected query(csq) up until csq
            current_date_query = update_query_all.\
                filter(Tweets.created_at_date > (current_date - days_back)).\
                filter(Tweets.created_at_date <= current_date).first()
            # Check if query has no tweets, then update table with zero values if true
            if (current_date_query[0] is None) and (current_date_query[1] is None):
                # Check if "None" row was previously added
                check_none_query = session.query(Moving_Averages).filter(Moving_Averages.date == current_date).\
                    filter(Moving_Averages.candidate_id_str == candidate_user_id)

                if check_none_query.count() > 0:
                    print("No Data, Row already exists, no update")
                    continue
                else:
                    session.add(Moving_Averages(candidate_name = candidate_name_parent,
                        candidate_id_str = candidate_user_id,
                        date = current_date,
                        retweet_moving_average = 0,
                        favorite_moving_average = 0))
                    session.commit()

                    # Update "Update" database with most recent records
                    datetime_now = dt.datetime.utcnow()
                    time_now = datetime_now.time()
                    date_now = datetime_now.date()
                    update_type = "moving_averages - from most recent tweets to 10 days before last update"

                    session.add(Update(update_time = time_now, update_date = date_now, update_datetime = datetime_now,
                        update_type = update_type, candidate_id_str = candidate_user_id))
                    session.commit()

                    print("No Data, table updated")
                    continue

            candidate_name = current_date_query[0]
            retweet_moving_average = current_date_query[1]
            favorite_moving_average = current_date_query[2]

            check_existing_query = session.query(Moving_Averages).filter(Moving_Averages.date == current_date).\
                filter(Moving_Averages.candidate_id_str == candidate_user_id)

            if check_existing_query.count() > 0:

                check_existing_query.candidate_name = candidate_name
                check_existing_query.retweet_moving_average = retweet_moving_average
                check_existing_query.favorite_moving_average = favorite_moving_average

                session.dirty
                session.commit()

                # Update "Update" database
                datetime_now = dt.datetime.utcnow()
                time_now = datetime_now.time()
                date_now = datetime_now.date()
                update_type = "moving_averages - from most recent tweets to 10 days before last update"

                session.add(Update(update_time = time_now, update_date = date_now, update_datetime = datetime_now,
                    update_type = update_type, candidate_id_str = candidate_user_id))

                session.commit()
                print('existing_data')
                print(current_date_query)

            else:

                session.add(Moving_Averages(candidate_name = candidate_name, candidate_id_str = candidate_user_id,
                    date = current_date, retweet_moving_average = retweet_moving_average, favorite_moving_average = favorite_moving_average))
                
                session.commit()

                # Update "Update" database
                datetime_now = dt.datetime.utcnow()
                time_now = datetime_now.time()
                date_now = datetime_now.date()

                update_type = "moving_averages - from most recent tweets to 10 days before last update"

                session.add(Update(update_time = time_now, update_date = date_now, update_datetime = datetime_now,
                    update_type = update_type, candidate_id_str = candidate_user_id))

                session.commit()
                print('data updated')
                print(current_date_query)

    session.close()

    return "Complete"
# route for updating "moving_average" with entire dataset from 'tweet_data'
@app.route("/moving_average_update_full")
def moving_average_update_full():

    session = Session(engine)
    # Timedelta object (10 days) for moving average
    days_back = dt.timedelta(days=10)

    for candidate in candidates_list:
        # Fetch user id
        candidate_name_parent = candidate["name"]
        candidate_user_id = candidate["twitter_user_id"]
        print(candidate["name"])

        # Fetch most recent date for candidate and convert to date object
        most_recent_date = session.query(func.max(Tweets.created_at_date)).filter(Tweets.user_id_str == candidate_user_id).first()
        most_recent_date_object = most_recent_date[0]
        # Fetch oldest date for candidate, convert to object, and add 10 days
        oldest_date = session.query(func.min(Tweets.created_at_date)).filter(Tweets.user_id_str == candidate_user_id).first()
        oldest_date_object = oldest_date[0] + dt.timedelta(days = 10)
        # create query which encompasses all dates for candidate
        update_query_all = session.query(Tweets.user_name,
            func.avg(Tweets.retweet_count),
            func.avg(Tweets.favorite_count)).\
            filter(Tweets.user_id == candidate_user_id).\
            filter(Tweets.created_at_date >= (oldest_date_object - days_back)).\
            filter(Tweets.created_at_date <= most_recent_date_object)

        # Find days between most recent and oldest plus one day
        days_diff = (most_recent_date_object - oldest_date_object + dt.timedelta(days = 1)).days

        for days in range(0, days_diff):
            print(candidate_name_parent)
            # Select the current date in iteration
            current_date = oldest_date_object + dt.timedelta(days = days)
            print(current_date)
            # Further filter query to select ten days before the current selected query(csq) up until csq
            current_date_query = update_query_all.\
                filter(Tweets.created_at_date > (current_date - days_back)).\
                filter(Tweets.created_at_date <= current_date).first()
            # Check if query has no tweets, then update table with zero values if true
            if (current_date_query[0] is None) and (current_date_query[1] is None):
                # Check if "None" row was previously added
                check_none_query = session.query(Moving_Averages).filter(Moving_Averages.date == current_date).\
                    filter(Moving_Averages.candidate_id_str == candidate_user_id)

                if check_none_query.count() > 0:
                    print("No Data, Row already exists, no update")
                    continue
                else:
                    session.add(Moving_Averages(candidate_name = candidate_name_parent,
                        candidate_id_str = candidate_user_id,
                        date = current_date,
                        retweet_moving_average = 0,
                        favorite_moving_average = 0))
                    session.commit()

                    # Update "Update" database
                    datetime_now = dt.datetime.utcnow()
                    time_now = datetime_now.time()
                    date_now = datetime_now.date()

                    update_type = "moving_averages - full"

                    session.add(Update(update_time = time_now, update_date = date_now, update_datetime = datetime_now,
                        update_type = update_type, candidate_id_str = candidate_user_id))

                    session.commit()

                    print("No Data, table updated")
                    continue
            
            candidate_name = current_date_query[0]
            retweet_moving_average = current_date_query[1]
            favorite_moving_average = current_date_query[2]

            check_existing_query = session.query(Moving_Averages).filter(Moving_Averages.date == current_date).\
                filter(Moving_Averages.candidate_id_str == candidate_user_id)

            if check_existing_query.count() > 0:

                check_existing_query.candidate_name = candidate_name
                check_existing_query.retweet_moving_average = retweet_moving_average
                check_existing_query.favorite_moving_average = favorite_moving_average

                session.dirty
                session.commit()

                # Update "Update" database
                datetime_now = dt.datetime.utcnow()
                time_now = datetime_now.time()
                date_now = datetime_now.date()

                update_type = "moving_averages - full"

                session.add(Update(update_time = time_now, update_date = date_now, update_datetime = datetime_now,
                    update_type = update_type, candidate_id_str = candidate_user_id))

                session.commit()
                print('existing_data')
                print(current_date_query)

            else:

                session.add(Moving_Averages(candidate_name = candidate_name, candidate_id_str = candidate_user_id,
                    date = current_date, retweet_moving_average = retweet_moving_average, favorite_moving_average = favorite_moving_average))
                
                session.commit()

                # Update "Update" database
                datetime_now = dt.datetime.utcnow()
                time_now = datetime_now.time()
                date_now = datetime_now.date()

                update_type = "moving_averages - full"

                session.add(Update(update_time = time_now, update_date = date_now, update_datetime = datetime_now,
                    update_type = update_type, candidate_id_str = candidate_user_id))

                session.commit()
                print('data updated')
                print(current_date_query)

    session.close()

    return "Complete"


# Route for updating 'Moving Average" graph with filtered selections
@app.route("/moving_average_filter", methods = ["GET", "POST"])
def moving_average_filter():
    #read data and convert to list of dictionary
    ma_data = request.data
    ma_filter_data = [json.loads(ma_data.decode('utf-8'))]

    # retrieve data variables
    ma_candidate_ids = ma_filter_data[0]["candidatesList"]
    ma_date_from = ma_filter_data[0]["dateFrom"]
    ma_date_to = ma_filter_data[0]["dateTo"]

    # Convert string dates into DATETIME objects
    datetime_from = dt.datetime.strptime(ma_date_from, "%b %d, %Y")
    datetime_to = dt.datetime.strptime(ma_date_to, "%b %d, %Y")

    #convert DATETIME objects into DATE objects
    ma_date_from_object = datetime_from.date()
    ma_date_to_object = datetime_to.date()

    session = Session(engine)

    moving_average_list = []

    moving_average_query = session.query(Moving_Averages.candidate_name,
        Moving_Averages.date,
        Moving_Averages.retweet_moving_average, 
        Moving_Averages.favorite_moving_average).\
        filter(Moving_Averages.candidate_id_str.in_(ma_candidate_ids)).\
        filter(Moving_Averages.date >= ma_date_from_object).\
        filter(Moving_Averages.date <= ma_date_to_object)
            
    keys = ("user_name", "moving_average_date", "retweet_moving_average", "favorite_moving_average")

    for query in moving_average_query:
        list_query = list(query)
        list_query[1] = dt.datetime.strftime(list_query[1], "%Y-%m-%d")
        moving_average_dict = dict(zip(keys, list_query))
        moving_average_list.append(moving_average_dict)

    print(moving_average_list)

    session.close()

    moving_average_json = json.dumps(moving_average_list)

    return moving_average_json



# Functions for converting string date data received from Twitter API into datetime objects
def convert_time(date_string):
    datetime_object = dt.datetime.strptime(date_string, "%a %b %d %H:%M:%S %z %Y")
    time_object = datetime_object.time()
    print(time_object)
    return time_object
def convert_date(date_string):
    datetime_object = dt.datetime.strptime(date_string, "%a %b %d %H:%M:%S %z %Y")
    date_object = datetime_object.date()
    print(date_object)
    return date_object
def convert_datetime(date_string):
    datetime_object = dt.datetime.strptime(date_string, "%a %b %d %H:%M:%S %z %Y")
    print(datetime_object)
    return datetime_object

@app.route("/foo")
def foo():

    session = Session(engine)
    ### Fetch Timeline Data
    response_list = []
    for x in range(len(candidates_list)):

    # for x in range(17, len(candidates_list)):

        candidate_name = candidates_list[x]['name']
        candidate_id = candidates_list[x]["twitter_user_id"]

        for y in range(0, 10):
            
            
            if y == 0:

                user_get = requests.get(f'https://api.twitter.com/1.1/statuses/user_timeline.json?id={candidate_id}&count=100', params = extended_payload, auth = auth)

            else:

                user_get = requests.get(f'https://api.twitter.com/1.1/statuses/user_timeline.json?id={candidate_id}&max_id={max_id}&count=100', params = extended_payload, auth = auth)

            user_json = user_get.json()
            # print(json.dumps(user_json[0], indent = 4))

            user_tweet_count = 0
            user_retweet_total = 0
            user_favorite_total = 0

            print(f'Retrieving Data for {candidate_name}: Iteration {y + 1}')


            for tweet in user_json:
                
                print(candidate_name)
                print(f'Tweet Count: {user_tweet_count}')
                print(f'Total Retweet Count: {user_retweet_total}')

                # We do not count retweets as user tweets. If retweeted_stats is true, we will continue to the next iteration
                try:
                    tweet["retweeted_status"]
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

                created_at_time = convert_time(created_at)
                created_at_date = convert_date(created_at)
                created_at_datetime = convert_datetime(created_at)

                #Store 'max id variable
                if y == 0:
                    max_id = tweet_id - 1

                if tweet_id < max_id:
                    max_id = tweet_id -1

                # Query the sql table and look for tweet_id_str

                tweet_query = session.query(Tweets)

                if tweet_query.filter_by(tweet_id_str = tweet_id_str).count() > 0:
                    # Select existing tweet from table
                    existing_tweet = tweet_query.filter_by(tweet_id_str = tweet_id_str)
                    #Update columns
                    existing_tweet.created_at = created_at
                    existing_tweet.tweet_id = tweet_id
                    existing_tweet.tweet_id_str = tweet_id_str
                    existing_tweet.full_text = full_text
                    existing_tweet.in_reply_to_status_id = in_reply_to_status_id
                    existing_tweet.in_reply_to_status_id_str = in_reply_to_status_id_str
                    existing_tweet.in_reply_to_user_id = in_reply_to_user_id
                    existing_tweet.in_reply_to_user_id_str = in_reply_to_user_id_str
                    existing_tweet.user_id = user_id
                    existing_tweet.user_id_str = user_id_str
                    existing_tweet.user_name = user_name
                    existing_tweet.user_screen_name = user_screen_name
                    existing_tweet.retweet_count = retweet_count
                    existing_tweet.favorite_count = favorite_count

                    existing_tweet.created_at_time = created_at_time
                    existing_tweet.created_at_date = created_at_date
                    existing_tweet.created_at_datetime = created_at_datetime

                    #stage update
                    session.dirty
                    #commit update
                    session.commit()

                    
                    # Update database with update records
                    datetime_now = dt.datetime.now()
                    time_now = datetime_now.time()
                    date_now = datetime_now.date()

                    update_type = "tweet_data - one_thousand_requests"
                    update_candidate_id = candidate_id

                    session.add(Update(update_time = time_now, update_date = date_now, update_datetime = datetime_now,
                        update_type = update_type, candidate_id_str = update_candidate_id))
                    
                    session.commit()

                    print("existing tweet")
                else:
                    print("adding tweet to db")
                    session.add(Tweets(created_at = created_at, created_at_time = created_at_time,
                        created_at_date = created_at_date,
                        created_at_datetime = created_at_datetime, 
                        tweet_id = tweet_id, tweet_id_str = tweet_id_str,
                        full_text = full_text, in_reply_to_status_id = in_reply_to_status_id,
                        in_reply_to_status_id_str = in_reply_to_status_id_str,
                        in_reply_to_user_id = in_reply_to_user_id, in_reply_to_user_id_str = in_reply_to_user_id_str,
                        user_id = user_id, user_id_str = user_id_str, user_name = user_name, user_screen_name = user_screen_name,
                        retweet_count = retweet_count, favorite_count = favorite_count))

                    session.commit()

                    # Update database with update records
                    datetime_now = dt.datetime.now()
                    time_now = datetime_now.time()
                    date_now = datetime_now.date()

                    update_type = "tweet_data - one_thousand_requests"
                    update_candidate_id = candidate_id

                    session.add(Update(update_time = time_now, update_date = date_now, update_datetime = datetime_now,
                        update_type = update_type, candidate_id_str = update_candidate_id))
                    
                    session.commit()

                ################################################

                user_tweet_count = user_tweet_count + 1
                user_retweet_total = user_retweet_total + retweet_count
                user_favorite_total = user_favorite_total + favorite_count
            try:
                retweet_average = user_retweet_total / user_tweet_count
                favorite_average = user_favorite_total / user_tweet_count
            except ZeroDivisionError:
                pass

        print(f'Retweet Average for User {user_name} is {retweet_average}')

        response_list.append({
            "user": user_name,
            "retweet_average": retweet_average,
            "favorite_average": favorite_average,
            "total_tweets_retrieved": user_tweet_count,
            "total_retweets_counted": user_retweet_total
        })

    session.close()

    response_json = json.dumps(response_list)


    return response_json

@app.route("/foo_update")
def foo_update():

    # Get current datetime
    today_datetime = dt.datetime.utcnow()
    # Make 'today_datetime' time-zone aware
    utc = pytz.UTC
    today_datetime = utc.localize(today_datetime)

    session = Session(engine)
    ### Fetch Timeline Data
    for x in range(len(candidates_list)):

    # for x in range(14, len(candidates_list)):

        candidate_name = candidates_list[x]['name']
        candidate_id = candidates_list[x]["twitter_user_id"]

        # Retrieve most recent date in dataset
        max_query = session.query(func.max(Tweets.created_at_date)).\
            filter(Tweets.user_id_str == candidate_id).first()
        max_date = max_query[0]

        # Use a date prior to max_date as a buffer in case recent updates had significant effects on data
        buffer_date = max_date - dt.timedelta(days = 5)
        # Retrieve first tweet_id that comes up for buffer_date
        ref_query = session.query(Tweets.tweet_id).\
            filter(Tweets.user_id_str == candidate_id).\
            filter(Tweets.created_at_date <= buffer_date).first()
        since_id_int = ref_query[0]

        # print(json.dumps(user_json[0], indent = 4))

        # Create threshold for while loop. Threshold will become true if tweets go past "since_id"
        threshold = False

        y = 0

        while threshold == False:

            y = y + 1

            if y == 1:
                user_get = requests.get(f'https://api.twitter.com/1.1/statuses/user_timeline.json?id={candidate_id}&count=100&', params = extended_payload, auth = auth)
            else:
                user_get = requests.get(f'https://api.twitter.com/1.1/statuses/user_timeline.json?id={candidate_id}&count=100&max_id={max_id}', params = extended_payload, auth = auth)

            user_json = user_get.json()

            print(f'Retrieving Data for {candidate_name}: Iteration {y}')

            for tweet in user_json:
                
                print(candidate_name)

                # We do not count retweets as user tweets. If retweeted_stats is true, we will continue to the next iteration
                try:
                    tweet["retweeted_status"]
                    continue
                except KeyError:
                    pass

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

                created_at_time = convert_time(created_at)
                created_at_date = convert_date(created_at)
                created_at_datetime = convert_datetime(created_at)

                #Check if threshold reached
                if tweet_id <= since_id_int:
                    threshold = True

                #Store 'max id variable
                if y == 1:
                    max_id = tweet_id - 1

                if tweet_id < max_id:
                    max_id = tweet_id -1

                # Query the sql table and look for tweet_id_str

                tweet_query = session.query(Tweets)

                if tweet_query.filter_by(tweet_id_str = tweet_id_str).count() > 0:
                    # Select existing tweet from table
                    existing_tweet = tweet_query.filter_by(tweet_id_str = tweet_id_str)
                    #Update columns
                    existing_tweet.created_at = created_at
                    existing_tweet.tweet_id = tweet_id
                    existing_tweet.tweet_id_str = tweet_id_str
                    existing_tweet.full_text = full_text
                    existing_tweet.in_reply_to_status_id = in_reply_to_status_id
                    existing_tweet.in_reply_to_status_id_str = in_reply_to_status_id_str
                    existing_tweet.in_reply_to_user_id = in_reply_to_user_id
                    existing_tweet.in_reply_to_user_id_str = in_reply_to_user_id_str
                    existing_tweet.user_id = user_id
                    existing_tweet.user_id_str = user_id_str
                    existing_tweet.user_name = user_name
                    existing_tweet.user_screen_name = user_screen_name
                    existing_tweet.retweet_count = retweet_count
                    existing_tweet.favorite_count = favorite_count

                    existing_tweet.created_at_time = created_at_time
                    existing_tweet.created_at_date = created_at_date
                    existing_tweet.created_at_datetime = created_at_datetime

                    #stage update
                    session.dirty
                    #commit update
                    session.commit()

                    
                    # Update database with update records
                    datetime_now = dt.datetime.now()
                    time_now = datetime_now.time()
                    date_now = datetime_now.date()

                    update_type = "tweet_data - update"
                    update_candidate_id = candidate_id

                    session.add(Update(update_time = time_now, update_date = date_now, update_datetime = datetime_now,
                        update_type = update_type, candidate_id_str = update_candidate_id))
                    
                    session.commit()

                    print("existing tweet")
                else:
                    print("adding tweet to db")
                    session.add(Tweets(created_at = created_at, created_at_time = created_at_time,
                        created_at_date = created_at_date,
                        created_at_datetime = created_at_datetime, 
                        tweet_id = tweet_id, tweet_id_str = tweet_id_str,
                        full_text = full_text, in_reply_to_status_id = in_reply_to_status_id,
                        in_reply_to_status_id_str = in_reply_to_status_id_str,
                        in_reply_to_user_id = in_reply_to_user_id, in_reply_to_user_id_str = in_reply_to_user_id_str,
                        user_id = user_id, user_id_str = user_id_str, user_name = user_name, user_screen_name = user_screen_name,
                        retweet_count = retweet_count, favorite_count = favorite_count))

                    session.commit()

                    # Update database with update records
                    datetime_now = dt.datetime.now()
                    time_now = datetime_now.time()
                    date_now = datetime_now.date()

                    update_type = "tweet_data - update"
                    update_candidate_id = candidate_id

                    session.add(Update(update_time = time_now, update_date = date_now, update_datetime = datetime_now,
                        update_type = update_type, candidate_id_str = update_candidate_id))
                    
                    session.commit()

                ################################################

    session.close()

    return "Complete"


@app.route("/foo_full")
def foo_full():

    session = Session(engine)

    ### Fetch Timeline Data

    # for x in range(len(candidates_list)):

    # for x in range(17, len(candidates_list)):
    for x in range(17, 18):


        candidate_name = candidates_list[x]['name']
        candidate_id = candidates_list[x]["twitter_user_id"]
        candidate_announcement = candidates_list[x]["announcement_date"]

        candidate_datetime = dt.datetime.strptime(candidate_announcement, "%B %d, %Y")
        candidate_date = candidate_datetime.date() - dt.timedelta(days = 30)

        n = 0

        announcement_date = False

        while announcement_date == False:            

            if n == 0:

                user_get = requests.get(f'https://api.twitter.com/1.1/statuses/user_timeline.json?id={candidate_id}&count=100', params = extended_payload, auth = auth)

            else:

                user_get = requests.get(f'https://api.twitter.com/1.1/statuses/user_timeline.json?id={candidate_id}&max_id={max_id}&count=100', params = extended_payload, auth = auth)

            n = n + 1
            
            try:
                user_json = user_get.json()
                # print(json.dumps(user_json[0], indent = 4))
            except IndexError:
                break

            print(f'Retrieving Data for {candidate_name}: Iteration {n}')


            for tweet in user_json:
                
                print(f'{candidate_name}')

                # We do not count retweets as user tweets. If retweeted_stats is true, we will continue to the next iteration
                try:
                    tweet["retweeted_status"]
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

                created_at_time = convert_time(created_at)
                created_at_date = convert_date(created_at)
                created_at_datetime = convert_datetime(created_at)

                if created_at_date <= candidate_date:
                    print(created_at_date <= candidate_date)
                    announcement_date = True
                else:
                    print(created_at_date <= candidate_date)

                #Store 'max id variable
                if n == 1:
                    max_id = tweet_id - 1

                if tweet_id < max_id:
                    max_id = tweet_id - 1

                # Query the sql table and look for tweet_id_str

                tweet_query = session.query(Tweets)

                if tweet_query.filter_by(tweet_id_str = tweet_id_str).count() > 0:
                    # Select existing tweet from table
                    existing_tweet = tweet_query.filter_by(tweet_id_str = tweet_id_str)
                    #Update columns
                    existing_tweet.created_at = created_at
                    existing_tweet.tweet_id = tweet_id
                    existing_tweet.tweet_id_str = tweet_id_str
                    existing_tweet.full_text = full_text
                    existing_tweet.in_reply_to_status_id = in_reply_to_status_id
                    existing_tweet.in_reply_to_status_id_str = in_reply_to_status_id_str
                    existing_tweet.in_reply_to_user_id = in_reply_to_user_id
                    existing_tweet.in_reply_to_user_id_str = in_reply_to_user_id_str
                    existing_tweet.user_id = user_id
                    existing_tweet.user_id_str = user_id_str
                    existing_tweet.user_name = user_name
                    existing_tweet.user_screen_name = user_screen_name
                    existing_tweet.retweet_count = retweet_count
                    existing_tweet.favorite_count = favorite_count

                    existing_tweet.created_at_time = created_at_time
                    existing_tweet.created_at_date = created_at_date
                    existing_tweet.created_at_datetime = created_at_datetime

                    #stage update
                    session.dirty
                    #commit update
                    session.commit()

                    # Update database with update records
                    datetime_now = dt.datetime.now()
                    time_now = datetime_now.time()
                    date_now = datetime_now.date()

                    update_type = "tweet_data - full"
                    update_candidate_id = candidate_id

                    session.add(Update(update_time = time_now, update_date = date_now, update_datetime = datetime_now,
                        update_type = update_type, candidate_id_str = update_candidate_id))
                    
                    session.commit()

                    print("existing tweet")
                else:
                    print("adding tweet to db")
                    session.add(Tweets(created_at = created_at, created_at_time = created_at_time,
                        created_at_date = created_at_date,
                        created_at_datetime = created_at_datetime, 
                        tweet_id = tweet_id, tweet_id_str = tweet_id_str,
                        full_text = full_text, in_reply_to_status_id = in_reply_to_status_id,
                        in_reply_to_status_id_str = in_reply_to_status_id_str,
                        in_reply_to_user_id = in_reply_to_user_id, in_reply_to_user_id_str = in_reply_to_user_id_str,
                        user_id = user_id, user_id_str = user_id_str, user_name = user_name, user_screen_name = user_screen_name,
                        retweet_count = retweet_count, favorite_count = favorite_count))

                    session.commit()

                    # Update database with update records
                    datetime_now = dt.datetime.now()
                    time_now = datetime_now.time()
                    date_now = datetime_now.date()

                    update_type = "tweet_data - full"
                    update_candidate_id = candidate_id

                    session.add(Update(update_time = time_now, update_date = date_now, update_datetime = datetime_now,
                        update_type = update_type, candidate_id_str = update_candidate_id))
                    
                    session.commit()

                ################################################


    session.close()

    return "Complete"

@app.route('/request_token')
def request_token():
    token_response_dict = {"oauth_token": oauth_token}
    return(jsonify(**token_response_dict))

if __name__ == "__main__":
        app.debug = True
        app.run()