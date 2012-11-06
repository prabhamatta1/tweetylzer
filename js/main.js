

$(function() {

    
    // =================================================================
    // FUNCTIONS FOR GETTING TWEETS
    // =================================================================


    // function to get the tweets of the query tag
    function getTweets(query) {

        $('#tags').fadeTo('slow', 0, function(){  
            //tweets URL
           var tweetURL =  'http://search.twitter.com/search.json?q=%23' + query + '&callback=?&include_entities=true&rpp=100';
           // var tweetURL =  'http://search.twitter.com/search.json?q=%23' + query + '&callback=?&include_entities=true';

            //get tweets and process

            $.getJSON(tweetURL, function(json){
                tweets = json.results;
                
                $('#tags').empty();
                //check to see if we get a response
                if(tweets.length == 0){
                    $('#query').append(query + ' does not have any tweets.');
                    
                }
                // if we get a response, fill in the tags
                else {  

                    $('#query').prepend(query);
                    $('#relatedTags').show();

                    var hash = []; //get the hashtags for each tweet
                 
                    for(var i = 0; i < tweets.length; i++)
                    {
                        var tags = tweets[i].text;
                        hash.push(tweets[i].entities.hashtags);
                
                        //$('#tags').append('<p>'+ tags + '</p>')
                    }

                    var hashtxt = []; //an array of all the hashtags related to a particular search query

                    for (var j=0; j < hash.length; j++)
                    {
                        for (var k=0; k < hash[j].length; k++)
                        {
                            hashtxt.push(hash[j][k].text.toLowerCase());
                        }
                    }

                    var tagArray = []; //an array of hashtags (without duplicates) related to a particular search query
                    var tagFreq = {}; //Key value pairs. hashtag is the key and frequency is the value

                    for (var x=0; x < hashtxt.length; x++)
                    {
                        if ($.inArray(hashtxt[x], tagArray)==-1)
                        {
                            tagArray.push(hashtxt[x]);
                            tagFreq[hashtxt[x]]=1;
                        }
                        else 
                        {
                            tagFreq[hashtxt[x]]+=1;
                        }

                    }

                }

                var z;
                for (z in tagFreq)
                {
                    $('#tags').append('<p>'+ z + ' (' + tagFreq[z] + ')' + '</p>')
                }
                
                $('#tags').fadeTo('slow', 1);
            }); 

        });
    }

  

  
    // =================================================================
    // EVENT FUNCTIONS
    // =================================================================

    // Function for when user submits search form
    $('#searchForm').on('submit', function(e){
    
        e.preventDefault();
        
        //hides keyboard in iOS after hitting go
        $('#searchField').blur();
        $('#query').empty();
        $('#relatedTags').hide();
        var query = $('#searchField').val();
        query = query.toLowerCase();            
        getTweets(query);

    });

    // Function for when user clicks on a term in #synonyms or #antonyms
    // or in #suggestions list
    $(document).on('click', '.term', function(e){
        $('#query').empty();
        $('#relatedTags').hide();
        var query = $(this).html();
        getTweets(query);
    })
            
    

});
