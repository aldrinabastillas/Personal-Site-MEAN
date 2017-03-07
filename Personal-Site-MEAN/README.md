# [aldrinabastillas.com](http://www.aldrinabastillas.com)

## Background
This is my personal site with a links to projects I've worked on my free time, links to past projects, and contact information.  

## Technologies
* Web-app framework: [Express.js](http://expressjs.com/), [Node.js](https://nodejs.org/en/)
* Front-end frameworks: [AngularJS](https://angularjs.org/), [Bootstrap](http://getbootstrap.com/), 
					    [Semantic UI](http://semantic-ui.com/)
* Database: [MongoDB](https://www.mongodb.com/)
* Testing: [Karma](https://karma-runner.github.io/1.0/index.html), [Jasmine](https://jasmine.github.io/), [SixPack](http://sixpack.seatgeek.com/) 
* Home page layout: [Start Bootstrap](https://startbootstrap.com/template-overviews/grayscale/)
* Game engine: [Unity3D](https://unity3d.com/)
* JavaScript Libraries: [jQuery](http://jquery.com/)
* Web Services: [Microsoft Azure Machine Learning Studio](https://studio.azureml.net/), 
                [Spotify Web API](https://developer.spotify.com/web-api/), 
                [Setlist.fm API](http://api.setlist.fm/docs/index.html)

## Files
Some notable files for the main site and the Billboard Hot 100 Predictor project include:

#### Server Side
* [server.js](https://github.com/aldrinabastillas/Personal-Site-MEAN/blob/master/Personal-Site-MEAN/server.js)
  Starts the server with Node.js and Express.js
* [router.js](https://github.com/aldrinabastillas/Personal-Site-MEAN/blob/master/Personal-Site-MEAN/router.js)
  Main middleware app to route requests and load other module's routers
* [spotifyQueryModule.js](https://github.com/aldrinabastillas/Personal-Site-MEAN/blob/master/Personal-Site-MEAN/modules/shared/server/spotifyQueryModule.js)
  Wrappers around GET requests to Spotify Web APIs
* [predictionModule.js](https://github.com/aldrinabastillas/Personal-Site-MEAN/blob/master/Personal-Site-MEAN/modules/spotify/server/predictionModule.js)
  Calls the Microsoft Machine Learning Studio Web API
* [tableModule.js](https://github.com/aldrinabastillas/Personal-Site-MEAN/blob/master/Personal-Site-MEAN/modules/spotify/server/tableModule.js)
  Queries the MongoDB database


#### Client Behavior
* [predictionController.js](https://github.com/aldrinabastillas/Personal-Site-MEAN/blob/master/Personal-Site-MEAN/modules/spotify/client/controllers/predictionController.js)
  Does a free-text search for songs in the Spotify library, and issues a request to get a prediction
* [tableController.js](https://github.com/aldrinabastillas/Personal-Site-MEAN/blob/master/Personal-Site-MEAN/modules/spotify/client/controllers/predictionController.js)
  Populates the table of Billboard Hot 100 songs and issues requests to the database

## Things I Learned
List of new things I had to learn, issues I encountered during this project, or concepts realized in general.

#### Data Science
* Higher accuracy doesn't necessarily lead to a better model.  In this case, accuracy was increasing
due to a higher rate of false positives, but other metrics of performance decreased, like precision, the ratio
of true positives.  
* Common metrics to evaluate performance of a binary classification model. For more info, see 
[link1](https://docs.microsoft.com/en-us/azure/machine-learning/machine-learning-evaluate-model-performance#evaluating-a-binary-classification-model)
and [link2](https://blogs.msdn.microsoft.com/andreasderuiter/2015/02/09/performance-measures-in-azure-ml-accuracy-precision-recall-and-f1-score/).
* How to extrapolate quantifiable data to describe subjective qualities, like using the Billboard Hot 100 chart as a proxy for popularity.
* Difficulties with obtaining a data set with exactly the features you want and how to change your hypotheses based on what data is available.
* A more in depth discussion can be found in the panels at the bottom of the [app](http://aldrinabastillas.com/Spotify/Index)

#### Web apps
* Ensure asynchronous calls run sequentially by using [Promise objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

#### Game Development 
* How to use different programming paradigms like working with Unity's 
  [event functions](https://docs.unity3d.com/Manual/ExecutionOrder.html) rather than using traditional OOP
  concepts, like constructors for example.
* How and when to implement creational design patterns, like the Factory Method pattern.
* Basic vector algebra