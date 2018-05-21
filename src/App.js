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

  initMap() {
    var self = this;
    var map = new window.google.maps.Map(document.getElementById("map"), {
      center: {lat: 33.993991, lng: -117.901344},
      zoom: 13,
      styles:mapStyles
    });

    var largeInfoWindow = new window.google.maps.InfoWindow();
    var bounds = new window.google.maps.LatLngBounds();

    var defaultIcon = self.makeMarkerIcon('ff6666');

    var highlightedIcon = self.makeMarkerIcon('ccc');


    var locations = [];
    this.state.locations.map((location) => {
      var marker = new window.google.maps.Marker({
        position: location.location,
        map: map,
        title:location.name,
        animation: window.google.maps.Animation.DROP,
        icon: defaultIcon
      });

      marker.addListener("click", function() {
        self.populateInfoWindow(marker);
      });

      marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
      });

      marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
      });

      bounds.extend(marker.position);

      location.marker = marker;

      locations.push(location);
    });
    map.fitBounds(bounds);

    this.setState({
      map:map,
      infowindow: largeInfoWindow,
      locations: locations
    });
  }

  populateInfoWindow(marker) {
    this.state.locations.map((location) => {
      location.marker.setAnimation(null);
    })
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(window.google.maps.Animation.BOUNCE);
    }
    this.state.infowindow.setContent('Loading data from Foursquare...');

    var self = this;

    var clientId = "5JEUZASPQG4DDOIBHRH5YNMROSLJIHFR0SBNAFARDUEUTX4U";
    var clientSecret = "VDGBRS3G5ZBVG3EE0DQJLRZHGOGKS2143QGEPSKQBESURRBU";
    var url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";

    fetch(url)
      .then(function(response) {
        if (response.status !== 200) {
          var errorContent = "Sorry Foursquare data can't be loaded";
          self.state.infowindow.setContent(errorContent);
          return;
        }

        response.json().then(function(data) {
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

    this.state.infowindow.addListener('closeclick',function(){
      self.state.infowindow.setMarker = null;
    });
  }

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

  render() {
    return (
      <div>
        <FilterList locations={this.state.locations} onPopulateInfoWindow={this.populateInfoWindow}/>
        <div id="map"></div>
      </div>
    );
  }
}

export default scriptLoader(
    ['https://maps.googleapis.com/maps/api/js?key=AIzaSyA-rUwamlzivoSR2LHWUY_da7smbRs8iVc&v=3&callback=initMap']
)(App);
