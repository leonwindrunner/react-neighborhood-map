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

    var defaultIcon = self.makeMarkerIcon('0091ff');

    var highlightedIcon = self.makeMarkerIcon('FFFF24');

    this.setState({
      map:map,
      infowindow: largeInfoWindow
    });

    this.state.locations.map((location) => {
      var marker = new window.google.maps.Marker({
        position: location.location,
        map: map,
        title:location.name,
        animation: window.google.maps.Animation.DROP,
        icon: defaultIcon
      });

      marker.addListener("click", function() {
        self.populateInfoWindow(marker,largeInfoWindow);
      });

      marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
      });
      
      marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
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

  makeMarkerIcon(markerColor) {
    var markerImage = new window.google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new window.google.maps.Size(21, 34),
      new window.google.maps.Point(0, 0),
      new window.google.maps.Point(10, 34),
      new window.google.maps.Size(21,34));
    return markerImage;
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
