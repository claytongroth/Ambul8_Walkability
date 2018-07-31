/**
This module deals with all of the behavior of the basic statistics panel. this includes text replacement and color coding of text
**/


//master object for the statistics module
stats = {};

//jquery references to scores in the basic stats box
stats.totalScore = d3.select("#statTotalScore");
stats.streetDensity = d3.select("#statStreetDensity");
stats.NodeDensity = d3.select("statNodeDensity");
stats.segCount = d3.select("statSegCount");
stats.crime = d3.select("statCrime");

//picks the correct color for the given data value
stats.color = function(d) {
	
}

//Pastes the scores into the interface and color codes the scores using classes
stats.appyScores = function () {
	
	return this;
}