var data = {};
(function() {

data.taglists = [];

data.commonTags = [];

data.taglist = function(name, text){
  var t = {name: name, tags: text, id: data.taglists.length};
  data.taglists.push(t);
  return t;
};

data.commonTag = function(name) {
  var ct = commonTag({name: name}, data.commonTags.length);
  data.commonTags.push(ct);
  return ct;
};

function commonTag(commonTag, i) {
  commonTag.id = i;
  commonTag.count = 0;

  commonTag.taglists = data.taglists.map(function(taglist) {
    var count = 0;

    var text = taglist.tags;
      
    count = text.split(commonTag.name).length - 1;

    commonTag.count += count;
    return {count: count};
  });

  return commonTag;
}

})();

function visualizeBubble(taglist1,taglist2,tagAll) {

data.taglists = [];

data.commonTags = [];

var width = 970, height = 540;

var collisionPadding = 12,
    minRadius = 20, // minimum collision radius
    maxRadius = 75; // also determines collision search radius

var tagStr1 = "";
var tagStr2 = "";

for (var i=0; i < taglist1.length; i++)
{
  tagStr1 = tagStr1 + " " + taglist1[i];
}

for (var i=0; i < taglist2.length; i++)
{
  tagStr2 = tagStr2 + " " + taglist2[i];
}

AddTag("keyword1", tagStr1);
AddTag("keyword2", tagStr2);


for (var j=0; j<tagAll.length;j++)
{
  AddCommonTag(tagAll[j]);
}

var r = d3.scale.sqrt()
    .domain([0, d3.max(data.commonTags, function(d) { return d.count; })])
    .range([0, maxRadius]);

var force = d3.layout.force()
    .size([width, height])
    .on("tick", tick);

var node = d3.select(".g-nodes").selectAll(".g-node"),
    label = d3.select(".g-labels").selectAll(".g-label"),
    arrow = d3.select(".g-nodes").selectAll(".g-note-arrow");

updatecommonTags(data.commonTags);

function AddCommonTag(name) {
  commonTag = data.commonTag(name);
  return commonTag;
}

function AddTag(name, text){
  taglist = data.taglist(name, text);
  return taglist;
}

// Update the known commonTags.
function updatecommonTags(commonTags) {
  commonTags.forEach(function(d) {
    d.r = r(d.count) + 7;
    d.cr = Math.max(minRadius, d.r);
    d.k = fraction(d.taglists[0].count, d.taglists[1].count);
    if (isNaN(d.k)) d.k = .5;
    if (isNaN(d.x)) d.x = (1 - d.k) * width + Math.random();
    d.y = (1 - d.k) * height + Math.random();
    d.bias = .5 - Math.max(.1, Math.min(.9, d.k));
  });
  force.nodes(data.commonTags = commonTags).start();
  updateNodes();
  updateLabels();
}

// Update the displayed nodes.
function updateNodes() {
  node = node.data(data.commonTags, function(d) { return d.name; });

  node.exit().remove();

  var nodeEnter = node.enter().append("a")
      .attr("class", "g-node");

  var tagList1Enter = nodeEnter.append("g")
      .attr("class", "g-tagList1");

  tagList1Enter.append("clipPath")
      .attr("id", function(d) { return "g-clip-tagList1-" + d.id; })
      .append("rect");

  tagList1Enter.append("circle");

  var tagList2Enter = nodeEnter.append("g")
      .attr("class", "g-tagList2");

  tagList2Enter.append("clipPath")
      .attr("id", function(d) { return "g-clip-tagList2-" + d.id; })
    .append("rect");

  tagList2Enter.append("circle");

  nodeEnter.append("line")
      .attr("class", "g-split");

  node.selectAll("rect")
      .attr("y", function(d) { return -d.r; })
      .attr("height", function(d) { return 2 * d.r; });

  node.select(".g-tagList1 rect")
      .attr("x", function(d) { return -d.r; })
      .attr("width", function(d) { return 2 * d.r * d.k; });

  node.select(".g-tagList2 rect")
      .attr("x", function(d) { return -d.r + 2 * d.r * d.k; })
      .attr("width", function(d) { return 2 * d.r; });

  node.select(".g-tagList1 circle")
      .attr("clip-path", function(d) { return d.k < 1 ? "url(#g-clip-tagList1-" + d.id + ")" : null; });

  node.select(".g-tagList2 circle")
      .attr("clip-path", function(d) { return d.k > 0 ? "url(#g-clip-tagList2-" + d.id + ")" : null; });

  node.selectAll("circle")
      .attr("r", function(d) { return r(d.count) + 5; });
}

// Update the displayed node labels.
function updateLabels() {
  label = label.data(data.commonTags, function(d) { return d.name; });

  label.exit().remove();

  var labelEnter = label.enter().append("a")
      .attr("class", "g-label")
      .attr("href", function(d) { return "#" + d.name; });

  labelEnter.append("div")
      .attr("class", "g-name")
      .text(function(d) { return d.name; });

  labelEnter.append("div")
      .attr("class", "g-value");

  label
      .style("font-size", function(d) { return Math.max(15, d.r / 2) + "px"; })
      .style("width", function(d) { return d.r * 2.5 + "px"; });

  // Create a temporary span to compute the true text width.
  label.append("span")
      .text(function(d) { return d.name; })
      .each(function(d) { d.dx = Math.max(d.r * 2.5, this.getBoundingClientRect().width); })
      .remove();

  label
      .style("width", function(d) { return d.dx + "px"; })
    .select(".g-value")
      .text(function(d) { 
        if (d.taglists[0].count == 0){
          return d.taglists[1].count;
        }          
        else if(d.taglists[1].count == 0){
          return d.taglists[0].count;
        }          
        else{
          return d.taglists[0].count + " - " + d.taglists[1].count;
        }     
      });

  // Compute the height of labels when wrapped.
  label.each(function(d) { d.dy = this.getBoundingClientRect().height; });
}

// Simulate forces and update node and label positions on tick.
function tick(e) {
  node
      .each(bias(e.alpha * 75))
      .each(collide(.5))
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  label
      .style("left", function(d) { return (d.x - d.dx / 2) + "px"; })
      .style("top", function(d) { return (d.y - d.dy / 2) + "px"; });
}

// A left-right bias causing commonTags to orient by taglist preference.
function bias(alpha) {
  return function(d) {
    d.x += d.bias * alpha;
  };
}

// Resolve collisions between nodes.
function collide(alpha) {
  var q = d3.geom.quadtree(data.commonTags);
  return function(d) {
    var r = d.cr + maxRadius + collisionPadding,
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
    q.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d) && d.other !== quad.point && d !== quad.point.other) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.cr + quad.point.r + collisionPadding;
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}

// Given two quantities a and b, returns the fraction to split the circle a + b.
function fraction(a, b) {
  var k = a / (a + b);
  return k;
}

};
