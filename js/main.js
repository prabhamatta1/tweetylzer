

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
                 
                    for(var i = 0; i < tweets.length; i++)
                    {
                        var tags = tweets[i].text;
                
                        $('#tags').append('<p>'+ tags + '</p>')
                    }

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
