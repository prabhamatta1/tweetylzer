
$(function() {

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
var width = 960, height = 700;



    // =================================================================
    // FUNCTIONS FOR GETTING TWEETS
    // =================================================================


    // function to get the tweets of the query tag
    function getTweets(input) {
        //tweets URL
        var tweetURL =  'http://search.twitter.com/search.json?q=%23' + query + '&callback=?&include_entities=true&rpp=100';

        //get tweets and process

        $.getJSON(tweetURL, function(json){
            tweets = json.results;
            //check to see if we get a response
            if(tweets.length == 0)
            {
                $('#errorMsg').empty();
                $('#errorMsg').append( 'One of the Tag word does not have any tweets.');
                    
            }
            // if we get a response, fill in the tags
            else 
            {  
                $('#query').prepend(query);

                if(input==0)
                {
                    query1 = query;
                    hashtxt=[];
                    hash =[];
                    for(var i = 0; i < tweets.length; i++)
                    {
                        hash.push(tweets[i].entities.hashtags);
                    }

                    for (var j=0; j < hash.length; j++)
                    {
                        for (var k=0; k < hash[j].length; k++)
                        {
                            if (hash[j][k].text.length > 2)
                            {
                                hashtxt.push(hash[j][k].text.toLowerCase());
                            }                            
                        }
                    }


                    console.log("hashtxt ");
                    console.log(hashtxt);
                    //hashtxt.sort();
                }

                if(input==1)
                {
                    query2 = query;
                    hashtxt1=[];
                    hash1=[];
                    for(var i1 = 0; i1 < tweets.length; i1++)
                    {
                        hash1.push(tweets[i1].entities.hashtags);
                    }

                    
                    for (var j1=0; j1 < hash1.length; j1++)
                    {
                        for (var k1=0; k1 < hash1[j1].length; k1++)
                        {
                            if (hash1[j1][k1].text.length > 2)
                            {
                                hashtxt1.push(hash1[j1][k1].text.toLowerCase());
                            }  
                        }
                    }
                    console.log("hashtxt1 ");
                    console.log(hashtxt1);
                        
                    // Preparing data for Visualization
                                        
                    var hashTemp=hashtxt.concat(hashtxt1)

                    var x, len = hashTemp.length, hashAll = [], obj = {};
                        
                    /*for (x = 0; x < len; x++) {
                        obj[hashTemp[x]] = 0;
                    }*/

                    var hashTemp1 = [];
                    var hashFreq = {};

                    for (var i=0; i < hashTemp.length; i++)
                    {
                      if ($.inArray(hashTemp[i], hashTemp1)==-1)
                      {
                        hashTemp1.push(hashTemp[i]);
                        hashFreq[hashTemp[i]]=1;
                      }
                      else
                      {
                        hashFreq[hashTemp[i]]+=1;
                      }
                    }
                    console.log("t");
                    console.log(hashTemp1);
                    console.log(hashFreq);


                    for (x in hashFreq) 
                    {
                      if (hashFreq[x] > 1)
                      {
                        hashAll.push(x);
                      }                        
                    }
                   

                     jQuery.unique(hashAll); // remove duplicates
                    console.log(hashAll.length);
                    console.log(hashAll);

                    // calling function for d3 visualization of tags 
                    if (hashtxt.length===0 || hashtxt1.length===0){
                      console.log(" one of the hashtxt is empty");
                    
                  }
                  else{
                    visualizeBubble(hashtxt,hashtxt1,hashAll);
                  }
                }
            }   
        });      
    }


    // =================================================================
    // EVENT FUNCTIONS
    // =================================================================
   
    $('#showme').on('click',function(e){
      $('#errorMsg').empty();

      hashtxt, hashtxt1=[],[];
      // check if both the tags are given 
      if(!($('#searchField').val()) || !($('#searchField1').val())){
        $('#errorMsg').append('Please enter both the tag words');
        return;
      }

        $('#g-nodes').empty();
        $('#g-labels').empty();

        $('#searchField').blur();
        query = $('#searchField').val();
        query = query.toLowerCase();            
        // $('#tags').empty();
        getTweets(0);

        $('#searchField1').blur();
        query = $('#searchField1').val();
        query = query.toLowerCase();            
        // $('#tags1').empty();
        getTweets(1);

        visualizeSquare();

    });

    function visualizeSquare()
    {

        //prabha - can you work on creating a string using tags and counts , after which the function will display it in the grid format.
        //nodes - appear on the x and y axis
        //links will connect a source and target node with a specific color, here source = target with value = no of tags in common.
             
        var jsontag = {"nodes":[{"name":"rohan","group":0},{"name":"haroon","group":1},{"name":"prabha","group":2},{"name":"tag1","group":3},{"name":"tag2","group":4},{"name":"tag3","group":5},{"name":"tag4","group":6},{"name":"tag5","group":7},{"name":"sayantan","group":8}],
        "links":[{"source":1,"target":1,"value":4},{"source":5,"target":5,"value":20},{"source":8,"target":8,"value":7}]};

        jQuery.parseJSON(jsontag);

        var margin = {top: 80, right: 0, bottom: 10, left: 80},
            width = 400,
            height = 400;

        var x = d3.scale.ordinal().rangeBands([0, width]),
            z = d3.scale.linear().domain([0, 4]).clamp(true),
            c = d3.scale.category10().domain(d3.range(10));

        var svg = d3.select("vizualizeSquare").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("margin-left", 100 + "px")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


          var matrix = [],
              nodes = jsontag.nodes,
              n = nodes.length;

          // Compute index per node.
          nodes.forEach(function(node, i) {
            node.index = i;
            node.count = 0;
            matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
          });

          // Convert links to matrix; count character occurrences.
          jsontag.links.forEach(function(link) {
            matrix[link.source][link.target].z += link.value;
            //matrix[link.target][link.source].z += link.value;
            //matrix[link.source][link.source].z += link.value;
            //matrix[link.target][link.target].z += link.value;
            //nodes[link.source].count += link.value;
            nodes[link.target].count += link.value;
          });

          // Precompute the orders.
          var orders = {
            name: d3.range(n).sort(function(a, b) { return d3.ascending(nodes[a].name, nodes[b].name); }),
            count: d3.range(n).sort(function(a, b) { return nodes[b].count - nodes[a].count; }),
            group: d3.range(n).sort(function(a, b) { return nodes[b].group - nodes[a].group; })
          };

          // The default sort order.
          x.domain(orders.name);

          
          svg.append("rect")
              .attr("class", "background")
              .attr("width", width)
              .attr("height", height);

          var row = svg.selectAll(".row")
              .data(matrix)
            .enter().append("g")
              .attr("class", "row")
              .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
              .each(row);

          row.append("line")
              .attr("x2", width);

          row.append("text")
              .attr("x", -6)
              .attr("y", x.rangeBand() / 2)
              .attr("dy", ".32em")
              .attr("text-anchor", "end")
              .text(function(d, i) { return nodes[i].name; });

          var column = svg.selectAll(".column")
              .data(matrix)
            .enter().append("g")
              .attr("class", "column")
              .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

          column.append("line")
              .attr("x1", -width);

          column.append("text")
              .attr("x", 6)
              .attr("y", x.rangeBand() / 2)
              .attr("dy", ".32em")
              .attr("text-anchor", "start")
              .text(function(d, i) { return nodes[i].name; });

          function row(row) {
            var cell = d3.select(this).selectAll(".cell")
                .data(row.filter(function(d) { return d.z; }))
              .enter().append("rect")
                .attr("class", "cell")
                .attr("x", function(d) { return x(d.x); })
                .attr("width", x.rangeBand())
                .attr("height", x.rangeBand())
                .style("fill-opacity", function(d) { return z(d.z); })
                .style("fill", function(d) { return nodes[d.x].group == nodes[d.y].group ? c(nodes[d.x].group) : null; })
                .on("mouseover", mouseover)
                .on("mouseout", mouseout);
          }

          function mouseover(p) {
            d3.selectAll(".row text").classed("active", function(d, i) { return i == p.y; });
            d3.selectAll(".column text").classed("active", function(d, i) { return i == p.x; });
          }

          function mouseout() {
            d3.selectAll("text").classed("active", false);
          }

          d3.select("#order").on("change", function() {
            clearTimeout(timeout);
            order(this.value);
          

          function order(value) {
            x.domain(orders[value]);

            var t = svg.transition().duration(2500);

            t.selectAll(".row")
                .delay(function(d, i) { return x(i) * 4; })
                .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
              .selectAll(".cell")
                .delay(function(d) { return x(d.x) * 4; })
                .attr("x", function(d) { return x(d.x); });

            t.selectAll(".column")
                .delay(function(d, i) { return x(i) * 4; })
                .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
          }

          var timeout = setTimeout(function() {
            order("group");
            d3.select("#order").property("selectedIndex", 2).node().focus();
          }, 5000);
        });



    }

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
