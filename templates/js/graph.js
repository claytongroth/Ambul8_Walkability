/**
This module contains one object which is the graph object. The Graph object contains all of the methods and properties needed.
to interact with and change the "How does your City Compare?" information box
**/

var graphs = {};

//lists of values for all three data serises which will be used by d3 to drive construction of graphs
graphs.scoreList = [
    {walk : 1 , Saftey : 1, airQuality : 1, barType : "Choice"},//record that the end user choose, by default it is Madison WI
    {walk : 1 , Saftey : 1, airQuality : 1, barType : "rural"},//record for rural example to compare with
    {walk : 1 , Saftey : 1, airQuality : 1, barType : "urban"}//record for every urban good area to walk in
]

//the height and width for each svg object
graphs.width = 500;
graphs.height = 200;
graphs.barPadding = 2;
graphs.svgPadding = 4;

//create the scales that will generate the height attributes of svg rectangles
graphs.heightScaleWalk = d3.scaleLinear();
graphs.heightScaleSaftey = d3.scaleLinear();
graphs.heightScaleAirQuality = d3.scaleLinear();


//generates the svg originally before they can be modified
//this method is not called immediately because it needs to wait for the dom to load before acting on dom elements such as the svgs tags
graphs.establish = function () {
    
    //select out the svg objects from within the dom
    graphs.scoreWalk = d3.select("#graphWalkScore");
    graphs.scoreSaftey = d3.select("#graphSafetyScore");
    graphs.scoreAirQuality = d3.select("#graphAirQualityScore");
    
	//set heights for svgs
	graphs.scoreWalk.attr("height" , graphs.height);
	graphs.scoreSaftey.attr("height" , graphs.height);
	graphs.scoreAirQuality.attr("height" , graphs.height);
	
	//set widths for svgs
	graphs.scoreWalk.attr("width" , graphs.width);
	graphs.scoreSaftey.attr("width" , graphs.width);
	graphs.scoreAirQuality.attr("width" , graphs.width);
	
	//create bars inside of the svgs
	graphs.scoreWalk.selectAll(".bar")
		.data(graphs.scoreList)
		.enter()
		.append("rec")
		.attr("height" , function (d) {
			return graphs.height - graphs.svgPadding;
		})
		.attr("width" , function (d) {
			return graphs.width / graphs.scoreList.length
		});
	
};

//updates the graph to reflect changes in the dataset
graphs.update = function () {
	
};

//do any needed element binding to event listeners in this function
graphs.bindEvents = function () {
    ;
}