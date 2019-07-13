import tweepy

import os


# from config import consumer_key, consumer_secret, access_token, access_token_secret

# auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
# auth.set_access_token(access_token, access_token_secret)

# api = tweepy.API(auth)

# public_tweets = api.home_timeline()
# for tweet in public_tweets:
#     print(tweet.text)

# try:
#     redirect_url = auth.get_authorization_url()
#     print(redirect_url)
# except tweepy.TweepError:
#     print("Error! Failed to get request token")
# api.get_user("marwilliamson")
# 
directory = os.path.abspath(__file__)
print(directory)

basedirectory = os.path.basename(__file__)
print(basedirectory)

directory_name = os.path.dirname(__file__)
print(directory_name)

expand_user = os.path.expanduser(__file__)
print(expand_user)

some_dir = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
print(some_dir)

current_wd = os.getcwd()
print(current_wd)

joined_path = os.path.join(current_wd, directory_name)
print(joined_path)

print('//////////')
print(some_dir)
print(os.path.split(some_dir))

print('////////')
print(os.path.abspath(__file__))
print(os.path.realpath(__file__))

real_path = os.path.realpath(__file__)
print(os.path.dirname(real_path))
print(os.path.basename(real_path))
print(current_wd)
print(__file__)