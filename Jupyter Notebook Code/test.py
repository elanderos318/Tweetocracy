import tweepy

from config import consumer_key, consumer_secret, access_token, access_token_secret

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

api = tweepy.API(auth)

# public_tweets = api.home_timeline()
# for tweet in public_tweets:
#     print(tweet.text)

# try:
#     redirect_url = auth.get_authorization_url()
#     print(redirect_url)
# except tweepy.TweepError:
#     print("Error! Failed to get request token")

api.get_user("marwilliamson")