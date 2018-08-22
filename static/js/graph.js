/**
This module contains one object which is the graph object. The Graph object contains all of the methods and properties needed.
to interact with and change the "How does your City Compare?" information box
**/



var graphs = {};

//lists of values for all three data serises which will be used by d3 to drive construction of graphs
graphs.scoreList = [
    {walk : 45 , crime : 50, air : 50, barType : "choice", label : "Your Chooice, MA", color : "red"},//record that the end user choose, by default it is Madison WI
    {walk : 2 , crime : 10, air : 1, barType : "rural", label : "Norware, NS", color : "blue"},//record for rural example to compare with
    {walk : 95 , crime : 100, air : 75, barType : "urban", label : "New York, NY", color : "green"}//record for every urban good area to walk in
];

//the height and width for each svg object
graphs.width = 500;
graphs.height = 200;
graphs.paddingBetweenBars = 35;

//based on the inputs figure out the bar widths (factor in the padding between bars)
graphs.barWidth = (graphs.width / graphs.scoreList.length) - graphs.paddingBetweenBars;
graphs.paddingBarLabel = 5;

//set padding amounts for each of the different directions
graphs.paddingTop = 50;
graphs.paddingBottom = 50;
graphs.paddingLeft = 50;
graphs.paddingRight = 25;

//axis x and y spaces next to the interior of the graph
graphs.xAxisHeight = 25;
graphs.yAxisWidth = 25;

//create the svg elements and needed attributes
graphs.establish = function () {
	console.log("establish graphs Called")

	//define d3 selectors for each svg element
	graphs.svgWalk = d3.select("#graphWalkScore");
	graphs.svgAir = d3.select("#graphAirQualityScore");
	graphs.svgCrime = d3.select("#graphSafetyScore");

	//define the attribute that the svg uses
	graphs.svgWalk.attribute = "walk";
	graphs.svgAir.attribute = "air";
	graphs.svgCrime.attribute = "crime";

	//include information that will be used to title the graph
	graphs.svgWalk.graphTitle = "Walkability Score";
	graphs.svgAir.graphTitle = "Air Quality Score";
	graphs.svgCrime.graphTitle = "Crime Rate";

	//loop through each of the differnt svg selectors
	[graphs.svgWalk, graphs.svgAir, graphs.svgCrime].forEach(function(selection){

		console.log("Starting the graphing process for the svg: " + selection.graphTitle);

		//define return value function that will be used by scale functions
		selection.returnVal = function(element) {return element[selection.attribute];};

		//define scale that will be used
		selection.scale = d3.scaleLinear()
			.domain([d3.max(graphs.scoreList , selection.returnVal)  , d3.min(graphs.scoreList , selection.returnVal) ])
			.range([graphs.height - graphs.paddingBarLabel, 10]);
		
		var totalHeight = graphs.height + graphs.paddingTop + graphs.paddingBottom + graphs.xAxisHeight;
		var totalWidth = graphs.width + graphs.paddingLeft + graphs.paddingRight + graphs.yAxisWidth;

		//set some of the basic elements inside of the svgs
		selection.attr("height" , totalHeight)
			.attr("width" , totalWidth);
		
		//set and backround rectangle to color background
		selection.append("rect")
			.attr("x" , 0)
			.attr("y" , 0)
			.attr("height" , totalHeight)
			.attr("width" , totalWidth)
			.style("fill" , "white");
		
		console.log("Setting up SVG groups");
		//append a chart interior so the padding actually has an affect
		var InteriorGroup = selection.append("g")
			.attr("class" , "graphInterior")
			.attr("transform" , "translate(" + (graphs.paddingLeft + graphs.yAxisWidth) + " , " + graphs.paddingTop + " )");

		//append x and y interior groups so the axis with attributes have an effect
		var yAxisGroup = selection.append("g")
			.attr("class" , "yAxis")
			.attr("transform" , "translate(" + graphs.paddingLeft + " , " + graphs.paddingTop + " )");
		var xAxisGroup = selection.append("g")
			.attr("class" , "xAxis")
			.attr("transform" , "translate(" + (graphs.paddingLeft + graphs.yAxisWidth) + " , " + (graphs.paddingTop + graphs.height) + " )");



		console.log("Adding bars into SVG");
		//start adding bars elements into the svg object
		InteriorGroup.selectAll(".bar")
			.data(graphs.scoreList)
			.enter()
			.append("rect")
			.attr("class" , function(d){
				return "bar " + d.barType;
			})
			.attr("width" , graphs.barWidth)
			.attr("x" , function(d, i){
				return (i * graphs.width / graphs.scoreList.length) + (graphs.paddingBetweenBars / 2);
			})
			.attr("height" , function(d){
				return selection.scale(d[selection.attribute]);
			})
			.attr("y" , function(d){
				return graphs.height - selection.scale(d[selection.attribute]);
			})
			.style("fill" , function(d){
				return d.color;
			})
			.attr("title" , function(d){
				return d.label;
			});
		
		console.log("Putting Labels on top of bars");
		//include a set of # labels on top tops of each graph
		InteriorGroup.selectAll(".bar-number-value-label")
			.data(graphs.scoreList)
			.enter()
			.append("text")
			.attr("class" , "bar-number-value-label")
			.style("fill" , "black")
			.attr("text-anchor" , "middle")
			.text(function(d){
				return d[selection.attribute];
			})
			.attr("x" , function(d, i) {
				return (i * graphs.width / graphs.scoreList.length) + (graphs.paddingBetweenBars / 2) + (graphs.barWidth / 2);
			})
			.attr("y" , function(d){
				return graphs.height - selection.scale(d[selection.attribute]);
			});
		

		console.log("setting axis information");
		
		//each bar needs a label below it
		xAxisGroup.selectAll(".bar-catagory-label")
			.data(graphs.scoreList)
			.enter()
			.append("text")
			.style("fill" , "black")
			.attr("text-anchor" , "middle")
			.attr("class" , function(d){
				return "bar-catagory-label " + d.barType;
			})
			.text(function(d){
				return d.label;
			})
			.attr("x" , function(d,i){
				return (i * graphs.width / graphs.scoreList.length) + (graphs.barWidth / 2) + (graphs.paddingBetweenBars / 2);
			})
			.attr("y", graphs.xAxisHeight / 2);
		
		//add a title to the graph
		selection.append("text")
			.attr("class" , "svgTitle")
			.text(selection.graphTitle)
			.attr("y" , graphs.paddingTop / 2)
			.attr("x" , totalWidth / 2 )
			.attr("text-anchor" , "middle");

		//include an axis label to left of the graph
		yAxisGroup.append("text")
			.attr("class" , "axis-label")
			.text(selection.graphTitle)
			.attr("x" , -(graphs.height /  2) )
			.attr("y" , graphs.yAxisWidth / 2 )
			.attr("transform" , "rotate(-90)");

	});
};


//updates the graph to reflect changes in the dataset
graphs.update = function (svgID) {
	console.log("update graph function called");
	var selection = null;

	[graphs.svgWalk, graphs.svgAir, graphs.svgCrime].forEach(function(svgObj){
		console.log("comparing " + svgObj.attr("id") + " with " + svgID );
		if (svgObj.attr("id") === svgID) {
			selection = svgObj;
		}
	});

	//log the selectors id to the console.
	console.log(selection.attr("id"));

	//update the walkability score info
	graphs.scoreList[0].walk = current.WS;
	graphs.scoreList[0].label = current.city;

	console.log("This is the list that is going to be acted on");
	console.log(graphs.scoreList);

	//update the scale that will be used according to new values
	selection.scale.domain([d3.max(graphs.scoreList , selection.returnVal)  , d3.min(graphs.scoreList , selection.returnVal) ]);


	//change the bar info and height
	selection.selectAll(".bar")
		.transition()
		.attr("height" , function(d){
			return selection.scale(d[selection.attribute]);
		})
		.attr("y" , function(d){
			return graphs.height - selection.scale(d[selection.attribute]);
		})
		.attr("title" , function(d){
			return d.label;
		});

	
	//change the number labels
	selection.select(".bar-number-value-label")
		.transition()
		.text(function(d){
			return d[selection.attribute];
		})
		.attr("y" , function(d){
			return graphs.height - selection.scale(d[selection.attribute]);
		})


	//change the bar labels below graph
	selection.selectAll(".bar-catagory-label")
		.transition()
		.text(function(d){
			return d.label;
		});

};