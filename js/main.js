var hash = []; //get the hashtags for each tweet
var hash1 = []; //get the hashtags for each tweet
//var tags;
//var tags1;
var hashtxt = []; //an array of all the hashtags related to a particular search query
var hashtxt1 = []; //an array of all the hashtags related to a particular search query

var tagArray = []; //an array of hashtags (without duplicates) related to a particular search query
var tagArray1 = []; //an array of hashtags (without duplicates) related to a particular search query
var tagFreq = {}; //Key value pairs. hashtag is the key and frequency is the value
var tagFreq1 = {}; //Key value pairs. hashtag is the key and frequency is the value

var query;
var tweets;


$(function() {

    
    // =================================================================
    // FUNCTIONS FOR GETTING TWEETS
    // =================================================================


    // function to get the tweets of the query tag
    function getTweets(input) {
       


            //tweets URL
           var tweetURL =  'http://search.twitter.com/search.json?q=' + query + '&callback=?&include_entities=true&rpp=100';
           // var tweetURL =  'http://search.twitter.com/search.json?q=%23' + query + '&callback=?&include_entities=true';

            //get tweets and process

            $.getJSON(tweetURL, function(json){

                

                tweets = json.results;
//                console.log(tweets); //tweets logged

  //              alert(tweets.length+"and input is"+input);


                    
                //check to see if we get a response
                if(tweets.length == 0){
                    $('#query').append(query + ' does not have any tweets.');
                    
                }
                // if we get a response, fill in the tags
                else {  

                    $('#query').prepend(query);
                    $('#relatedTags').show();

                 if(input==0)

                 {
                    for(var i = 0; i < tweets.length; i++)
                    {
                  //      tags = tweets[i].text;
                        hash.push(tweets[i].entities.hashtags);
                
                        //$('#tags').append('<p>'+ tags + '</p>')
                    }

                    

                    for (var j=0; j < hash.length; j++)
                    {
                        for (var k=0; k < hash[j].length; k++)
                        {
                            hashtxt.push(hash[j][k].text.toLowerCase());
                        }
                    }

                    hashtxt.sort();

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
                 console.log("0");
                 console.log(tagFreq);
                    var z;

                    for (z in tagFreq)
                {
                    $('#tags').append('<p>'+ z + ' (' + tagFreq[z] + ')' + '</p>');
                }

            //     $('#tags').fadeTo('slow', 1);

                }


                    if(input==1){

                 //   console.log(1);
                 //   console.log(tweets);
                    for(var i1 = 0; i1 < tweets.length; i1++)
                    {
                    //    tags1 = tweets[i1].text;
                        hash1.push(tweets[i1].entities.hashtags);
                
                        //$('#tags').append('<p>'+ tags + '</p>')
                    }

                    
                    for (var j1=0; j1 < hash1.length; j1++)
                    {
                        for (var k1=0; k1 < hash1[j1].length; k1++)
                        {
                            hashtxt1.push(hash1[j1][k1].text.toLowerCase());
                        }
                    }
                    
                    //console.log(hashtxt1);
                    hashtxt1.sort();

                    for (var x1=0; x1 < hashtxt1.length; x1++)
                    {
                       
                        if ($.inArray(hashtxt1[x1], tagArray1)==-1)
                        {
                            tagArray1.push(hashtxt1[x1]);
                            tagFreq1[hashtxt1[x1]]=1;
                        }
                        else 
                        {
                            tagFreq1[hashtxt1[x1]]+=1;
                        }
                                        
                    }
                    

                 console.log("0");
                 console.log(tagFreq1);
                    

                    for (z in tagFreq1)
                    {
                    $('#tags1').append('<p>'+ z + ' (' + tagFreq1[z] + ')' + '</p>');
                    }

                    } 
                 }   
                    
                });      
                    
                         
                
            
        
    }

    

  
    // =================================================================
    // EVENT FUNCTIONS
    // =================================================================

      


    $('#showme').on('click',function(e){

        alert("blah");
        $('#searchField').blur();
        $('#query').empty();
        $('#relatedTags').hide();
        query = $('#searchField').val();
        query = query.toLowerCase();            
        $('#tags').empty();
        getTweets(0);

        alert("blah1");
        $('#searchField1').blur();
        $('#query').empty();
        $('#relatedTags').hide();
        query = $('#searchField1').val();
        query = query.toLowerCase();            
        $('#tags1').empty();
        getTweets(1);

        });

    // Function for when user clicks on a term in #synonyms or #antonyms
    // or in #suggestions list
    $(document).on('click', '.term', function(e){
        $('#query').empty();
        $('#relatedTags').hide();
        var query = $(this).html();
        getTweets(query);
    });
            
    

});
