var data = {};
(function() {

data.taglists = [];

data.commonTags = [];

data.taglist = function(name, text){
  var p = {name: name, tags: text, id: data.taglists.length};
  data.taglists.push(p);
  return p;
}

data.commonTag = function(name) {
  var t = commonTag({name: name}, data.commonTags.length);
  data.commonTags.push(t);
  return t;
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

// taglist1 = ["fun", "fun", "fun", "fun", "fun", "fun", "rain", "rain", "good", "fun", "fun", "fun", "good", "good", "rain", "one", "one", "one"];
// taglist2 = ["fun", "fun", "rain", "rain", "rain", "fun", "fun", "fun", "rain", "rain", "rain", "rain", "rain", "fun", "fun", "good", "good", "rain", "two", "two"];
// tagAll = ["one", "two", "fun", "good", "rain"];
// visualizeBubble(taglist1,taglist2,tagAll);

})();

function visualizeBubble(taglist1,taglist2,tagAll) {

var width = 970,
    height = 540;

var collisionPadding = 4,
    clipPadding = 4,
    minRadius = 16, // minimum collision radius
    maxRadius = 65, // also determines collision search radius
    activeCommonTag; // currently-displayed commonTag

tagStr1 = "";
tagStr2 = "";

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
    .charge(0)
    .size([width, height - 80])
    .on("tick", tick);

var node = d3.select(".g-nodes").selectAll(".g-node"),
    label = d3.select(".g-labels").selectAll(".g-label"),
    arrow = d3.select(".g-nodes").selectAll(".g-note-arrow");

d3.select(".g-nodes").append("rect")
    .attr("class", "g-overlay")
    .attr("width", width)
    .attr("height", height)
    .on("click", clear);

d3.select(window)
    .on("hashchange", hashchange);

d3.select("#g-form")
    .on("submit", submit);

updatecommonTags(data.commonTags);

// Update the known commonTags.
function updatecommonTags(commonTags) {
  commonTags.forEach(function(d) {
    d.r = r(d.count);
    d.cr = Math.max(minRadius, d.r);
    d.k = fraction(d.taglists[0].count, d.taglists[1].count);
    if (isNaN(d.k)) d.k = .5;
    if (isNaN(d.x)) d.x = (1 - d.k) * width + Math.random();
    d.bias = .5 - Math.max(.1, Math.min(.9, d.k));
  });
  force.nodes(data.commonTags = commonTags).start();
  updateNodes();
  updateLabels();
  tick({alpha: 0}); // synchronous update
}

// Returns the commonTag matching the specified name, approximately.
// If no matching commonTag is found, returns undefined.
function findCommonTag(name) {
  for (var i = 0, n = data.commonTags.length, t; i < n; ++i) {
    if ((t = data.commonTags[i]).name === name) {
      return t;
    }
  }
}

// Returns the commonTag matching the specified name, approximately.
// If no matching commonTag is found, a new one is created.
function findOrAddCommonTag(name) {
  var commonTag = findCommonTag(name);
  if (!commonTag) {
    commonTag = data.commonTag(name);
    commonTag.y = 0;
    updatecommonTags(data.commonTags);
  }
  return commonTag;
}

function AddCommonTag(name) {
  commonTag = data.commonTag(name);
  commonTag.y = 0;
  commonTag.r = commonTag.count;
  commonTag.cr = Math.max(minRadius, commonTag.r);
  commonTag.k = fraction(commonTag.taglists[0].count, commonTag.taglists[1].count);
    if (isNaN(commonTag.k)) commonTag.k = .5;
    if (isNaN(commonTag.x)) commonTag.x = (1 - commonTag.k) * width + Math.random();
    commonTag.y = (1 - commonTag.k) * height + Math.random();
    commonTag.bias = .5 - Math.max(.1, Math.min(.9, commonTag.k));
  /*force.nodes(data.commonTags = commonTags).start();
  updateNodes();
  updateLabels();
  tick({alpha: 0}); // synchronous update*/
  return commonTag;
}

function AddTag(name, text){
  taglist = data.taglist(name, text);
  return taglist;
}

// Update the displayed nodes.
function updateNodes() {
  node = node.data(data.commonTags, function(d) { return d.name; });

  node.exit().remove();

  var nodeEnter = node.enter().append("a")
      .attr("class", "g-node")
      .attr("xlink:href", function(d) { return "#" + encodeURIComponent(d.name); })
      .call(force.drag)
      .call(linkCommonTag);

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
      .attr("y", function(d) { return -d.r - clipPadding; })
      .attr("height", function(d) { return 2 * d.r + 2 * clipPadding; });

  node.select(".g-tagList1 rect")
      .style("display", function(d) { return d.k > 0 ? null : "none" })
      .attr("x", function(d) { return -d.r - clipPadding; })
      .attr("width", function(d) { return 2 * d.r * d.k + clipPadding; });

  node.select(".g-tagList2 rect")
      .style("display", function(d) { return d.k < 1 ? null : "none" })
      .attr("x", function(d) { return -d.r + 2 * d.r * d.k; })
      .attr("width", function(d) { return 2 * d.r; });

  node.select(".g-tagList1 circle")
      .attr("clip-path", function(d) { return d.k < 1 ? "url(#g-clip-tagList1-" + d.id + ")" : null; });

  node.select(".g-tagList2 circle")
      .attr("clip-path", function(d) { return d.k > 0 ? "url(#g-clip-tagList2-" + d.id + ")" : null; });

  node.select(".g-split")
      .attr("x1", function(d) { return -d.r + 2 * d.r * d.k; })
      .attr("y1", function(d) { return -Math.sqrt(d.r * d.r - Math.pow(-d.r + 2 * d.r * d.k, 2)); })
      .attr("x2", function(d) { return -d.r + 2 * d.r * d.k; })
      .attr("y2", function(d) { return Math.sqrt(d.r * d.r - Math.pow(-d.r + 2 * d.r * d.k, 2)); });

  node.selectAll("circle")
      .attr("r", function(d) { return r(d.count); });
}

// Update the displayed node labels.
function updateLabels() {
  label = label.data(data.commonTags, function(d) { return d.name; });

  label.exit().remove();

  var labelEnter = label.enter().append("a")
      .attr("class", "g-label")
      .attr("href", function(d) { return "#" + encodeURIComponent(d.name); })
      .call(force.drag)
      .call(linkCommonTag);

  labelEnter.append("div")
      .attr("class", "g-name")
      .text(function(d) { return d.name; });

  labelEnter.append("div")
      .attr("class", "g-value");

  label
      .style("font-size", function(d) { return Math.max(8, d.r / 2) + "px"; })
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

// Assign event handlers to commonTag links.
function linkCommonTag(a) {
  a   .on("click", click)
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);
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

// Fisher–Yates shuffle.
function shuffle(array) {
  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

// Given two quantities a and b, returns the fraction to split the circle a + b.
function fraction(a, b) {
  var k = a / (a + b);
  if (k > 0 && k < 1) {
    var t0, t1 = Math.pow(12 * k * Math.PI, 1 / 3);
    for (var i = 0; i < 10; ++i) { // Solve for theta numerically.
      t0 = t1;
      t1 = (Math.sin(t0) - t0 * Math.cos(t0) + 2 * k * Math.PI) / (1 - Math.cos(t0));
    }
    k = (1 - Math.cos(t1 / 2)) / 2;
  }
  return k;
}

// Update the active commonTag on hashchange, perhaps creating a new commonTag.
function hashchange() {
  var name = decodeURIComponent(location.hash.substring(1)).trim();
}

// Trigger a hashchange on submit.
function submit() {
  var name = this.search.value.trim();
  location.hash = name ? encodeURIComponent(name) : "!";
  this.search.value = "";
  d3.event.preventDefault();
}

// Clear the active commonTag when clicking on the chart background.
function clear() {
  location.replace("#!");
}

// Rather than flood the browser history, use location.replace.
function click(d) {
  location.replace("#" + encodeURIComponent(d === activeCommonTag ? "!" : d.name));
  d3.event.preventDefault();
}

function mouseover(d) {
  node.classed("g-hover", function(p) { return p === d; });
}

function mouseout(d) {
  node.classed("g-hover", false);
}

};
