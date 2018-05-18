import React, { Component } from 'react';
import './App.css';
import scriptLoader from 'react-async-script-loader';
import { mapStyles } from './mapStyles.js';
import { restaurants } from './restaurants.js';

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

    this.setState({
      map:map,
      infowindow: largeInfoWindow
    });

    this.state.locations.map((location) => {
      var marker = new window.google.maps.Marker({
        position: location.location,
        map: map,
        title:location.name,
        animation: window.google.maps.Animation.DROP
      });

      marker.addListener("click", function() {
        self.populateInfoWindow(marker,largeInfoWindow);
      });

      bounds.extend(marker.position)
    });
    map.fitBounds(bounds);

  }

  populateInfoWindow(marker,infowindow) {
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(this.state.map, marker);
      infowindow.addListener('closeclick',function(){
        infowindow.setMarker = null;
      });
    }
  }

  render() {
    return (
      <div id="map">
        Hello world!
      </div>
    );
  }
}

export default scriptLoader(
    ['https://maps.googleapis.com/maps/api/js?key=AIzaSyA-rUwamlzivoSR2LHWUY_da7smbRs8iVc&v=3&callback=initMap']
)(App);
