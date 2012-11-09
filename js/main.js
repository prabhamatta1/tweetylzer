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

var hashCommon = [];
var tagCommon = {};

var query;
var query1,query2;
var tweets;
var width = 960, height = 500;


$(function() {

    // =================================================================
    // FUNCTIONS FOR GETTING TWEETS
    // =================================================================


    // function to get the tweets of the query tag
    function getTweets(input) {
        //tweets URL
        var tweetURL =  'http://search.twitter.com/search.json?q=%23' + query + '&callback=?&include_entities=true&rpp=100';
        // var tweetURL =  'http://search.twitter.com/search.json?q=%23' + query + '&callback=?&include_entities=true';

        //get tweets and process

        $.getJSON(tweetURL, function(json){
            tweets = json.results;
            //check to see if we get a response
            if(tweets.length == 0)
            {
                $('#query').append(query + ' does not have any tweets.');
                    
            }
            // if we get a response, fill in the tags
            else 
            {  
                $('#query').prepend(query);
                $('#relatedTags').show();

                if(input==0)
                {
                    query1 = query;
                    for(var i = 0; i < tweets.length; i++)
                    {
                        hash.push(tweets[i].entities.hashtags);
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

                    //$('#tags').fadeTo('slow', 1);
                }

                if(input==1)
                {
                    query2 = query;
                    for(var i1 = 0; i1 < tweets.length; i1++)
                    {
                        hash1.push(tweets[i1].entities.hashtags);
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

                    for (var i=0; i<hashtxt.length; i++)
                    {
                        if ($.inArray(hashtxt[i], hashtxt1) > -1)
                        {
                            if ($.inArray(hashtxt[i], hashCommon) == -1)
                            {
                                hashCommon.push(hashtxt[i]);
                            }
                        }
                    }

                    console.log("5");
                    console.log(hashCommon);
                    var temp1, temp2;

                    for (var j=0; j<hashCommon.length; j++)
                    {
                        temp1 = tagFreq[hashCommon[j]];
                        temp2 = tagFreq1[hashCommon[j]];

                        if (temp1 < temp2)
                        {
                            tagCommon[hashCommon[j]] = temp1;
                        }
                        else
                        {
                            tagCommon[hashCommon[j]] = temp2;
                        }
                    }

                    console.log(tagCommon);
                    getMap(query1,tagFreq,query2,tagFreq1,tagCommon);


                } 
            }   
        });      
    }

    // =================================================================
    // EVENT FUNCTIONS
    // =================================================================
   
    $('#showme').on('click',function(e){

        $('#searchField').blur();
        $('#query').empty();
        $('#relatedTags').hide();
        query = $('#searchField').val();
        query = query.toLowerCase();            
        $('#tags').empty();
        getTweets(0);

        $('#searchField1').blur();
        $('#query').empty();
        $('#relatedTags').hide();
        query = $('#searchField1').val();
        query = query.toLowerCase();            
        $('#tags1').empty();
        getTweets(1);

    });

    // Function for when user clicks on a term 
    $(document).on('click', '.term', function(e){
        $('#query').empty();
        $('#relatedTags').hide();
        var query = $(this).html();
        getTweets(query);
    });

    // d3 visualization of tags

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

    var force = d3.layout.force()
        .gravity(.05)
        .distance(100)
        .charge(-100)
        .size([width, height]);

    function getMap(query1,tagFreq1,query2,tagFreq2,tagCommon){
        var data ={};
        var nodept = [];
        var linkpt = [];
        nodedict ={};
        nodedict["name"]=  query1;
        nodedict["group"]=  1;
        nodept.push(nodedict);
        linkdict ={};
        linkdict["value"] = 1;
        linkdict["target"] = 0;
        linkdict["source"] = 1;
        linkpt.push(linkdict);

        var i=0;
        for (key1 in tagFreq1){

            nodedict ={};
            nodedict["name"]=  key1;
            nodedict["group"]=  1;
            nodept.push(nodedict);
            linkdict ={};
            linkdict["value"] = (i+1) *2;
            linkdict["target"] = 0

            if (i<tagFreq1.length)
            {
              linkdict["source"] = i+1;
            }
            else
            {
              linkdict["source"] = i;
            } 
            linkpt.push(linkdict);
            i += 1;

          }
      data["nodes"] = nodept;
      data["links"] = linkpt;
      generategraph(data);
       
    };

    //generate word-map graph from the data
    function generategraph(json) {

        force
        .nodes(json.nodes)
        .links(json.links)
        .start();

        var link = svg.selectAll(".link")
        .data(json.links)
        .enter().append("line")
        .attr("class", "link")
        .attr("stroke-width", 2)
        .attr("stroke", "#3a3a3d");

        var node = svg.selectAll(".node")
        .data(json.nodes)
        .enter().append("g")
        .attr("class", "node")        
        .call(force.drag);

        node.append("image")
        .attr("xlink:href", "img/circle.png")
        .attr("x", -8)
        .attr("y", -8)
        .attr("width", 16)
        .attr("height", 16);

        node.append("text")
        .attr("class", "term")
        .attr("dx", 12)
        .attr("dy", 7)
        .on("click", function(d){ mapclick(d.name);})
        .text(function(d) { return d.name });

        force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

            node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        });
    };
            
});
