import React, { Component } from 'react';
import './App.css';
import scriptLoader from 'react-async-script-loader';
import { mapStyles } from './mapStyles.js';
import { restaurants } from './restaurants.js';
import FilterList from './FilterList.js'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: "",
      locations: restaurants,
      infowindow:""
    };

    this.initMap = this.initMap.bind(this);
    this.populateInfoWindow = this.populateInfoWindow.bind(this);
  }

  componentDidMount() {
    window.initMap = this.initMap;
  }

  //Initial Google map and markers
  initMap() {
    var self = this;
    //Constructor creates a new map
    var map = new window.google.maps.Map(document.getElementById("map"), {
      center: {lat: 33.993991, lng: -117.901344},
      zoom: 13,
      styles:mapStyles
    });

    var largeInfoWindow = new window.google.maps.InfoWindow();
    var bounds = new window.google.maps.LatLngBounds();

    // Style the markers a bit. This will the listing marker icon.
    var defaultIcon = self.makeMarkerIcon('ff6666');

    // Create a "highlighted location" marker color for when the user mouses over the marker.
    var highlightedIcon = self.makeMarkerIcon('ccc');

    // Create a new blank array for all the listing locations.
    var locations = [];
    // The following group uses the locations array to create an array of markers on initialize.
    this.state.locations.map((location) => {
      var marker = new window.google.maps.Marker({
        position: location.location,
        map: map,
        title:location.name,
        animation: window.google.maps.Animation.DROP,
        icon: defaultIcon
      });

      // Create an onclick event to open the large infowindow at each marker.
      marker.addListener("click", function() {
        self.populateInfoWindow(marker);
      });

      // Two event listeners - one for mouseover, one for mouseout, to change the colors back and forth.
      marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
      });

      marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
      });

      // Extend the boundaries of the map for each marker and display the marker
      bounds.extend(marker.position);

      location.marker = marker;

      // Push the location to our array of locations.
      locations.push(location);
    });
    map.fitBounds(bounds);

    //Set the state 
    this.setState({
      map:map,
      infowindow: largeInfoWindow,
      locations: locations
    });
  }

  // This function populates the infowindow when the marker is clicked. It'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position.
  populateInfoWindow(marker) {
    //Make sure other infowindow and markers animation close when click a marker
    this.state.infowindow.close();
    this.state.locations.map((location) => {
      location.marker.setAnimation(null);
    })

    //Some animations when click a marker
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(window.google.maps.Animation.BOUNCE);
    }

    //Make this marker at the center of the map
    this.state.map.setCenter(marker.getPosition());

    this.state.infowindow.setContent('Loading data from Foursquare...');

    //Get the location data from the Foursquare 
    var self = this;

    // Add the api keys for foursquare and build the api endpoint
    var clientId = "5JEUZASPQG4DDOIBHRH5YNMROSLJIHFR0SBNAFARDUEUTX4U";
    var clientSecret = "VDGBRS3G5ZBVG3EE0DQJLRZHGOGKS2143QGEPSKQBESURRBU";
    var url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";

    fetch(url)
      .then(function(response) {
        //When response failed
        if (response.status !== 200) {
          var errorContent = "Sorry Foursquare data can't be loaded";
          self.state.infowindow.setContent(errorContent);
          return;
        }

        //When response successed
        response.json().then(function(data) {
          //Get date from response and put them in variables
          var restaurants_data = data.response.venues[0];

          var name, address, id;
          if(restaurants_data.name) {
            name =  restaurants_data.name;
          }
          if(restaurants_data.location.formattedAddress[0]) {
            address =  restaurants_data.location.formattedAddress[0];
          }
          if(restaurants_data.id) {
            id =  restaurants_data.id;
          }

          //infoContent format
          var infoContent = `<h1 class="info-name"><strong>${name}</strong></h1>
                             <hr>
                             <h2 class="info-address">Address:</h2>
                             <p class="info-addressDetail">${address}</p>
                             <hr>
                             <a class="info-readmore" href="https://foursquare.com/v/${id}" target="_blank">Read More on <strong>Foursquare Website</strong></a>
                            `
          self.state.infowindow.setContent(infoContent);
        });
      })
      .catch(function(err) {
        var errorContent = "Sorry Foursquare data can't be loaded";
        self.state.infowindow.setContent(errorContent);
      });

    this.state.infowindow.open(this.state.map, marker);

    // Make sure the marker property is cleared if the infowindow is closed.
    this.state.infowindow.addListener('closeclick',function(){
      self.state.infowindow.setMarker = null;
    });
  }

  // This function takes in a COLOR, and then creates a new marker
  // icon of that color. The icon will be 30 px wide by 50 high, have an origin
  // of 0, 0 and be anchored at 10, 34).
  makeMarkerIcon(markerColor) {
    var markerImage = new window.google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new window.google.maps.Size(30, 50),
      new window.google.maps.Point(0, 0),
      new window.google.maps.Point(10, 34),
      new window.google.maps.Size(30,50));
    return markerImage;
  }

  //Render for App
  render() {
    return (
      <div>
        <FilterList locations={this.state.locations} infowindow={this.state.infowindow} onPopulateInfoWindow={this.populateInfoWindow}/>
        <div id="map"></div>
      </div>
    );
  }
}

export default scriptLoader(
    ['https://maps.googleapis.com/maps/api/js?key=AIzaSyA-rUwamlzivoSR2LHWUY_da7smbRs8iVc&v=3&callback=initMap']
)(App);
