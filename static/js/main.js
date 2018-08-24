/**This is the main loop for the custom defined javascript for the project

script only really launches when the DOM is finished loading. It call on and maniplates three different objects
defined in earlier modules.

**/
window.onload = function () {
    
    //establish objects needed by calling their establish methods
    //they are not called in advance because the dom might not be rendered fully yet.
    map.establish();
    map2.establish();
    stats.establish();
    graphs.establish();

    //This binds the more info button so that more information is shown when it is clicked on
    d3.select("#moreInfoButton").on("click" , function(){
        console.log("showing more detailed information DIVs");
        d3.selectAll(".panel , #bottom-row")
            .classed("hidden" , false);
        
        //pan over to the ancor of the first div which stats in it.
        document.location.hash = "bottom-row";

        d3.select("#moreInfoButton").classed("hidden" , true);

    })
};