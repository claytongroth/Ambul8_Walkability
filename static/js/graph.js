/**
This module contains one object which is the graph object. The Graph object contains all of the methods and properties needed.
to interact with and change the "How does your City Compare?" information box
**/

var graphs = {};

//lists of values for all three data serises which will be used by d3 to drive construction of graphs
graphs.scoreList = [
    {walk : 45 , saftey : 1, airQuality : 1, barType : "choice", label : "Your Chooice, MA", color : "red"},//record that the end user choose, by default it is Madison WI
    {walk : 2 , saftey : 1, airQuality : 1, barType : "rural", label : "Norware, NS", color : "blue"},//record for rural example to compare with
    {walk : 95 , saftey : 1, airQuality : 1, barType : "urban", label : "New York, NY", color : "green"}//record for every urban good area to walk in
]

//the height and width for each svg object
graphs.width = 500;
graphs.height = 200;
graphs.barPadding = 35;

//based on the inputs figure out the bar widths (factor in the padding between bars)
graphs.barWidth = (graphs.width / graphs.scoreList.length) - graphs.barPadding;
graphs.paddingBarLabel = 5;

//set padding amounts for each of the different directions
graphs.paddingTop = 50;
graphs.paddingBoom = 50;
graphs.paddingLeft = 50;
graphs.paddingRight = 25;

//return function for use with max and min for setting domains
graphs.returnWalk = function(element) {return element.walk;};
graphs.returnSaftey = function(element) {return element.saftey;};
graphs.returnAirQuality = function(element) {return element.returnAirQuality;};


//create the scales that will generate the height attributes of svg rectangles
graphs.heightScaleWalk = d3.scaleLinear()
	.domain([d3.max(graphs.scoreList , graphs.returnWalk)  , d3.min(graphs.scoreList , graphs.returnWalk) ])
	.range([graphs.height - graphs.paddingBarLabel, 10]);

graphs.heightScaleSaftey = d3.scaleLinear()
	.domain([d3.max(graphs.scoreList , graphs.returnSaftey)  , d3.min(graphs.scoreList , graphs.returnSaftey) ])
	.range([graphs.height - graphs.paddingBarLabel, 10]);
graphs.heightScaleAirQuality = d3.scaleLinear()
	.domain([d3.max(graphs.scoreList , graphs.returnAirQuality)  , d3.min(graphs.scoreList , graphs.returnAirQuality) ])
	.range([graphs.height - graphs.paddingBarLabel, 10]);


//generates the svg originally before they can be modified
//this method is not called immediately because it needs to wait for the dom to load before acting on dom elements such as the svgs tags
graphs.establish = function () {
	
	console.log("establish graphs Called")

    //select out the svg objects from within the dom
    graphs.scoreWalk = d3.select("#graphWalkScore");
    graphs.scoreSaftey = d3.select("#graphSafetyScore");
    graphs.scoreAirQuality = d3.select("#graphAirQualityScore");
	
	//set up some of the standard inside elements of each of these svg bar graphs
	[graphs.scoreAirQuality, graphs.scoreSaftey, graphs.scoreWalk].forEach(function(selection){
		
		//set the height and width of the entire svg
		selection.attr("height" , graphs.height + graphs.paddingTop + graphs.paddingBoom)
			.attr("width" , graphs.width + graphs.paddingLeft + graphs.paddingRight);

		//set and backround rectangle to color background
		selection.append("rect")
			.attr("x" , 0)
			.attr("y" , 0)
			.attr("height" , graphs.height + graphs.paddingTop + graphs.paddingBoom)
			.attr("width" , graphs.width + graphs.paddingLeft + graphs.paddingRight)
			.style("fill" , "white");

		//append a chart interior so the padding actually has an affect
		selection.append("g")
			.attr("class" , "graphInterior")
			.attr("transform" , "translate(" + graphs.paddingLeft + " , " + graphs.paddingTop + " )");

	});
	
	//set the attributes and spacing for each of the differnt bars
	graphs.scoreWalk.select(".graphInterior")
		.selectAll(".bar")
		.data(graphs.scoreList)
		.enter()
		.append("rect")
		.attr("class" , function(d){
			return "bar " + d.barType;
		})
		.attr("width" , graphs.barWidth)
		.attr("x" , function(d, i){
			return (i * graphs.width / graphs.scoreList.length) + (graphs.barPadding / 2);
		})
		.attr("height" , function(d){
			return graphs.heightScaleWalk(d.walk);
		})
		.attr("y" , function(d){
			return graphs.height - graphs.heightScaleWalk(d.walk);
		})
		.style("fill" , function(d){
			return d.color;
		})
		.attr("title" , function(d){
			return d.label;
		});
	
	//include a set of # labels on top tops of each graph
	graphs.scoreWalk.select(".graphInterior")
		.selectAll(".bar-value")
		.data(graphs.scoreList)
		.enter()
		.append("text")
		.style("fill" , "black")
		.attr("class" , function(d){
			return "bar-value " + d.barType;
		})
		.attr("text-anchor" , "middle")
		.text(function(d){
			return d.walk;
		})
		.attr("x" , function(d, i) {
			return (i * graphs.width / graphs.scoreList.length) + (graphs.barPadding / 2) + (graphs.barWidth / 2);
		})
		.attr("y" , function(d){
			return graphs.height - graphs.heightScaleWalk(d.walk) - 1;
		});


	//each of the bars needs a label below it
	graphs.scoreWalk.selectAll(".bar-label")
		.data(graphs.scoreList)
		.enter()
		.append("text")
		.style("fill" , "black")
		.attr("class" , function(d){
			return "bar-label " + d.barType; 
		})
		.attr("text-anchor" , "middle")
		.text(function(d){
			return d.label;
		})
		.attr("x" , function(d,i){
			return (i * graphs.width / graphs.scoreList.length) + (graphs.barWidth / 2) + graphs.paddingLeft + (graphs.barPadding / 2);
		})
		.attr("y" , (graphs.height + graphs.paddingTop) + (graphs.paddingBoom / 2) )
		;
	
	//give the graph a title
	graphs.scoreWalk.append("text")
		.attr("class" , "svgTitle")
		.text("Overall Walkability Score")
		.attr("y" , graphs.paddingTop / 2)
		.attr("x" , graphs.paddingLeft + (graphs.width / 2) )
		.attr("text-anchor" , "middle");
	
	//include an axis label to the left of the graph
	graphs.scoreWalk.append("text")
		.attr("class" , "axis-label")
		.text("Walkability Score")
		.attr("x" , -((graphs.height /  2) + graphs.paddingTop) )
		.attr("y" , graphs.paddingLeft / 2 )
		.attr("transform" , "rotate(-90)");


	//be sure to include graph axis


	//repeat this process for the other two graphs
	
};

//updates the graph to reflect changes in the dataset
graphs.update = function () {
	console.log("update graph function called");

	//update the walkability score info
	graphs.scoreList[0].walk = current.WS;
	graphs.scoreList[0].label = current.city;

	console.log("This is the list that is going to be acted on");
	console.log(graphs.scoreList);

	//update the d3 scales according to the new min max values
	graphs.heightScaleWalk.domain([d3.max(graphs.scoreList , graphs.returnWalk)  , d3.min(graphs.scoreList , graphs.returnWalk) ]);
	graphs.heightScaleSaftey.domain([d3.max(graphs.scoreList , graphs.returnSaftey)  , d3.min(graphs.scoreList , graphs.returnSaftey) ]);
	graphs.heightScaleAirQuality.domain([d3.max(graphs.scoreList , graphs.returnAirQuality)  , d3.min(graphs.scoreList , graphs.returnAirQuality) ]);

	//change the bar height
	d3.selectAll(".bar")
		.attr("y" , function(d){
			return graphs.height - graphs.heightScaleWalk(d.walk);
		})
		.attr("height" , function(d){
			return graphs.heightScaleWalk(d.walk);
		});

	//change the bar labels below graph
	d3.selectAll(".bar-label")
		.text(function(d){
			return d.label;
		})

	//change the number labels
	d3.select(".bar-value")
		.text(function(d){
			return d.walk;
		})
		.attr("y" , function(d){
			return graphs.height - graphs.heightScaleWalk(d.walk) - 1;
		});

};