var _ = require('lodash');
var GoogleMapsLoader = require('google-maps');
var MarkerClusterer = require('node-js-marker-clusterer');

export default class Auth0MapWidget {

  constructor (options) {
    this.options = options;
    this.name = options.name;

    GoogleMapsLoader.load((google) => this.initMap(google));
  }

  initMap(google) {

    this.bounds = new google.maps.LatLngBounds();

    var map_settings = {
      center: {lat: 0, lng: 0},
      minZoom: 1,
      maxZoom: 15,
      streetViewControl: false,
      mapTypeControl:false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP
      }
    };

    if (this.options.map_styles) {
      map_settings.styles = this.options.map_styles;
    }

    this.map = new google.maps.Map(document.getElementById(this.options.wrapper_selector), map_settings);

  }

  onClick(){
    //dummy 
  }

  update(raw_data) { 
    if (this.markerCluster) {
      this.markerCluster.clearMarkers();
    }

    var data = this.process_data(raw_data);

    var _this = this;
    function addMarker(latitude, longitude) {

        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(latitude, longitude)
        });
        
        _this.bounds.extend(marker.position);

        return marker;
    }

    var markers = data.map(function(d){
        return addMarker(d.location.latitude, d.location.longitude);
    });
     
    this.markerCluster = new MarkerClusterer(this.map, markers);

    this.map.fitBounds(this.bounds);
  }

  process_data (raw_data) {
    
    var data = raw_data.filter( user => (user.location !== null));

    return data;

  }

}
          
