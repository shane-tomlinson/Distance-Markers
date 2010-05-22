/**
* Written by Shane Tomlinson 2010
* http://www.shanetomlinson.com
* Released under Creative Commons Attribution Licence 3.0
* http://creativecommons.org/licenses/by/3.0/
* Uses LatLon, Spherical formulas from Chris Veness
* http://www.movable-type.co.uk/scripts/latlong.html
*/

/**
* Finds distance distanceMarkers on a line defined by a series of points.
* @class DistanceMarkerPointsCalculator
*/
function DistanceMarkerPointsCalculator() {
}

DistanceMarkerPointsCalculator.prototype = {
	init: function( config ) {
		this.latLons = [];
		if( config && config.line ) {
			this.loadLine( config.line );
		}
	},
	
	loadLine: function( line ) {
		// overload for specific source like GMaps, Yahoo maps, etc.
		// overridden function should create a LatLng and add it via addLatLon
	},

	/**
	* Add a LatLon point representing a point on the line.
	* @method addLatLon
	* @param {object} latLon - LatLon object
	*/
	addLatLon: function( latLon ) {
		this.latLons.push( latLon );
	},
	
	/**
	* convert a LatLon to a point that we can use in our own application.
	* @method latLonToDistanceMarker
	* @param {object} latLon - LatLon object
	* @return {object} - point we can use in our application.
	*/
	latLonToDistanceMarker: function( latLon ) {
		// overload to convert from a LatLon to create a distance marker point.
		return latLon;
	},
	
	/**
	* Gets the distance marker points, each point having a lat and lng field.
	* @method getDistanceMarkerPoints
	* @param {number} distanceBetweenMarkers - distance in kilometers between distanceMarkers.
	*/
	getDistanceMarkerPoints: function( distanceBetweenMarkers ) {
		var distanceMarkers = [];

		
		var startLatLon = this.latLons[ 0 ];
		var distanceSinceLastMarker = 0;
		
		// Basic idea is to keep passing points until we have gone too far.
		//	Once we have gone too far, fill in all the points up to the current
		//	location.  Repeat.
		for( var index = 1, latLon; latLon = this.latLons[ index ]; ++index ) {
			distanceSinceLastMarker += parseFloat( startLatLon.distanceTo( latLon, 6 ) );
			
			var currPoint = latLon;
			
			var bearingToStartLatLon = currPoint.bearingTo( startLatLon );
			while( distanceSinceLastMarker > distanceBetweenMarkers ) {
				var distanceToMarker = distanceSinceLastMarker - distanceBetweenMarkers;
				
				var markerLatLon = currPoint.destinationPoint( bearingToStartLatLon, distanceToMarker );
				var distanceMarker = this.latLonToDistanceMarker( markerLatLon );
				distanceMarkers.push( distanceMarker );
				
				distanceSinceLastMarker = distanceToMarker;
			}
			
			startLatLon = latLon;
		}
		
		return distanceMarkers;
	}
};