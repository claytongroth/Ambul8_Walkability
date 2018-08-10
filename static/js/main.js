/**This is the main loop for the custom defined javascript for the project

script only really launches when the DOM is finished loading. It call on and maniplates three different objects
defined in earlier modules.

**/
window.onload = function () {
    
    //establish objects needed by calling their establish methods
    //they are not called in advance because the dom might not be rendered fully yet.
    map.establish();
    stats.establish();
    graphs.establish();
    
}