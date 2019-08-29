# Tweetocracy

This project explores the Twitter accounts of candidates running for the presidency of the United States in the 2020 elections. This is a full-stack project which is
deployed at:

<dl>
  <dd>https://tweetocracy.herokuapp.com/</dd>

</dl>

Flask(Python) was used for the back-end, HTML/CSS/Javascript was used for the front-end, and sqlite was used for the database

The project retrieves data from Twitter's API using OAuth authentication. It is designed to be as flexible as possible and provide as much control as possible to the 
front-end user - using D3 for visualization construction, the data presentation can be constructed with seemingly endless combinations of different candidates, metrics,
date ranges, etc. This was done because: a) to break away from the static, narrow presentations of data used in most visualizations we see online which give a perception
of 'data' as being much less complex than it actually is, and b) to provide a coding challenge. While there are limitations to this approach, it encourages users to draw 
their own conclusions using the variety of options available. Furthermore many of the data points used in separate graphs were combined and used as 'features' for the
Random Forest Model on display under the "Machine Learning" section of the project.

Because one of the aims was to provide a comprehensive picture of tweet data over many months, tweet data is not retrieved from the Twitter API on session start 
but rather collected and entered into a sqlite database - the package used for interacting with the database is sqlalchemy. Database queries allow for much faster
data retrieval and modification rather than using the (very limited) Twitter API calls for every instance. The graphs are initialized with default settings using 
endpoint calls to the Flask backend, with different endpoints used for customization later on. 

The main metrics used for the graphs were Retweets and Favorites. In most cases, these metrics were averaged which turned out to not be a great indicator for summarizing data.
The home page displays a set of graphs which are designed with different ideas in mind - general overview of data, comparison between candidates, more detailed views on 
specific data points, distributions, etc. A final section displays the actual tweets from candidates which earned the highest engagment numbers (because the retweet/favorite
distributions were very highly skewed, tweets which have extreme values provide great insight into what rhetoric/style/topics demand social media attention). Much of the 
challenge existed in creating the visualizations themselves which often differed greatly in kind. Not only did the JS code need to change across sections, the data
retrieval and modification differed on the backend too, since a variety of combinations of data types were used for filtering.

Since there exist many different data points surrounding a tweet and because it is possible to retrieve tens of thousands of them, the natural next step is to try to 
construct a machine learning model. The classification model attempts to discern the author of a tweet using the same data presented in the home page analysis (retweets,
favorites, day/time of publishing), except that in order to develop a more sophisticated and accurate model, language data needed to be introduced since, at a glance, it 
is much richer indicator of who is the author of a tweet. After all, language is the medium through which social media exists, and thus Natural Language (NLP) Processing became a 
major part of the "Machine Learning" section of the project. Jupyter notebook was the main process used to develop and experiment with data pre-processing, different 
NLP techinques (N-Gram/Count-Vectorizer vs TF-IDF), different types of models, hyper-parameter tuning, pipelines, etc., and the result of this work was condensed into 
a final process for analyzing tweet/text data in the Flask app. I encourage a look at the jupyter notebook code, and espeically the 'Random Forest Classifier' and 'RF Model 
Pipeline' which turned out to be used as the final machine learning application. 

However, because of the heavy data size introduced as a result of the NLP, the actual model deployed online had to be modified many times, even with sparse matrices. 
At first, a deep learning model with one hidden layer was trained on tens thousands of tweets with tens of thousands of different features with the aim of classifying
'all' candidates (28). This changed to a deep learning model which was trained on the top 6 candidates and then eventually settling into a random forest model 
which classifies tweets from the top 5 candidates. Even so, the final model is fairly large. While the deep learning model delivered the best accuracy on test data, 
the random forest did not experience a significant drop in performance, and unlike the deep learning model, it provides greater information as to what exactly 
contributed to the results. Also, I found developing the random forest and hyper-tuning paramters to be more satisfying and rewarding, though more time-consuming. 
Though the final application of the model in the app is simple (comparing user predictions and model predictions on random tweets) it is easy to see the potential 
application and functionality of models using NLP which is why it is such a fast-growing field of machine learning.