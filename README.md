
Twittviz
=====
This application will provide users with an easy interface that will allow people to 
quickly compare hashtags in twitter based on associated tags with two particular tags.
This allows us to visually explore the commonality arising due to social classification in 
terms of what other tags do the users associate the tags with, a concept we call "related tags".

We provide 2 visualizations:
1. Bubble Visualization:
This visualization provides Social classification of two different twitter tags to give insight where they are common and how they are separate from each other


2. Matrix Visualizaiton:
When any two hash tags in twitter are entered, visualization  provides the tag counts for common and uncommon tags, along with color gradientindicating the common
tag frequency.


Team Members
-----------------
Prabhavathi Matta,
Rohan Salantry,
Haroon Rasheed 

<!-- Team member responsibilities (i.e. what each person did on the project) -->

* Prabhavathi Matta  (prabha.matta@ischool.berkeley.edu)
    - Tag Analyzation, Bubble Visualization 

* Rohan Salantry  (rohans@ischool.berkeley.edu)
    - Tag Analyzation, Matrix Visualization 
    
* Haroon Rasheed (haroon@ischool.berkeley.edu)
    - Tag Analyzation, Bubble  Visualization 

 All the team have contributed to comments, code cleanup and javascript interactions.


URL of the repository on github
---
https://github.com/prabhamatta/iolab_project3


Live URL
---
http://people.ischool.berkeley.edu/~prabha.matta/iolab/

Browser support
---
Tested on Chrome, Firefox, IE7, Safari


Technologies Used
---
D3, jQuery, Javascript, CSS3, HTML5


Bugs
---
Since we call two API calls for getting data for two different tags, the calls being asynchronous, sometimes we dont get both the taglists to show the visualization


Sources
---
- The API used is a twitter public API. No Authentication is required.
- Ispiration from D3 examples (https://github.com/mbostock/d3/wiki/Gallery)
- Inspiratin from NYtimes website (http://www.nytimes.com/interactive/2012/09/06/us/politics/convention-word-counts.html)
