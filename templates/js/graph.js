/**
This module contains one object which is the graph object. The Graph object contains all of the methods and properties needed.
to interact with and change the "How does your City Compare?" information box
**/

graphs = {};

//select out the svg objects from within the dom
graphs.scoreWalk = d3.select("#graphWalkScore");
graphs.scoreSaftey = d3.select("#graphSafetyScore");
graphs.scoreAirQuality = d3.select("#graphAirQualityScore");

//lists of values for all three data serises which will be used by d3 to drive construction of graphs
graphs.scoreWalkList = [1, 1, 1];
graphs.scoreSafteyList =[1, 1, 1];
graphs.scoreAirQualityList =[1, 1, 1];

//the height and width for each svg object
graphs.width = 300;
graphs.height = 300;
graphs.barPadding = 2;
graphs.svgPadding = 4;

//create the scales that will generate the height attributes of svg rectangles
graphs.heightScaleWalk = d3.scaleLinear();
graphs.heightScaleSaftey = d3.scaleLinear();
graphs.heightScaleAirQuality = d3.scaleLinear();


//generates the svg originally before they can be modified
//this method is not called immediately because it needs to wait for the dom to load before acting on dom elements such as the svgs tags
graphs.establish = function () {
	//set heights for svgs
	graphs.ScoreWalk.attr("height" , graphs.height);
	graphs.ScoreSaftey.attr("height" , graphs.height);
	graphs.scoreAirQuality.attr("height" , graphs.height);
	
	//set widths for svgs
	graphs.ScoreWalk.attr("width" , graphs.width);
	graphs.ScoreSaftey.attr("width" , graphs.width);
	graphs.scoreAirQuality.attr("width" , graphs.width);
	
	//create bars inside of the svgs
	graphs.ScoreWalk.selectAll(".bar")
		.data(graphs.scoreWalkList)
		.enter()
		.append("rec")
		.attr("height" , function (d) {
			return graphs.height - graphs.svgPadding;
		})
		.attr("width" , function (d) {
			return graphs.width / scoreWalkList.length
		});
	
};

//updates the graph to reflect changes in the dataset
graphs.reGraph = function () {
	
};