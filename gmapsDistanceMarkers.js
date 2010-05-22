/**
* Written by Shane Tomlinson 2010
* http://www.shanetomlinson.com
* Released under Creative Commons Attribution Licence 3.0
* http://creativecommons.org/licenses/by/3.0/
* Uses LatLon, Spherical formulas from Chris Veness
* http://www.movable-type.co.uk/scripts/latlong.html
*/

/**
* This is a subclass of DistanceMarkerPointsCalculator that can
*	work with GMaps API v3.  It's loadLine takes a Polyline
*	and places GMarkers at the specified interval.
*
* @class GMapsDistanceMarkers
*/
function GMapsDistanceMarkers() {
	DistanceMarkerPointsCalculator.apply( this, arguments );
}
GMapsDistanceMarkers.prototype = new DistanceMarkerPointsCalculator();


GMapsDistanceMarkers.prototype.init = function( config ) {
	this.map = config.map;
	
	DistanceMarkerPointsCalculator.prototype.init.apply( this, arguments );
};


/**
* Load an object that represents a line and convert each point to 
*	a LatLon.  For each point in the line, call this.addLatLon with
*	the LatLon version of the point
* @method loadLine
* @param {object} line - line to load.
*/
GMapsDistanceMarkers.prototype.loadLine = function( line ) {
	var path = line.getPath();
	var me=this;
	
	path.forEach( function( latLng, index ) {
		var latLon = new LatLon( latLng.lat(), latLng.lng() );
		me.addLatLon( latLon );
	} );
	
	this.currMarker = 0;
};

/**
* This method converts a LatLon used by the calculator to a point
*	that can be used by the user of the calculator.  This could be
*	to convert it to a user defined point for storage or to a point
*	to place on a map.
* @method latLonToDistanceMarker
* @param {object} latLon - a LatLon object.
* @return {object} an object that represents a point.
*/
GMapsDistanceMarkers.prototype.latLonToDistanceMarker = function( latLon ) {
	var latLng = new google.maps.LatLng( latLon.lat(), latLon.lon() );
	
	this.currMarker++;
	var marker = new google.maps.Marker( {
		map: this.map,
		position: latLng,
		visible: true,
		title: this.currMarker
	} );
	
	return marker;
};
