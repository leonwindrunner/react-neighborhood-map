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
      locations: restaurants
    };

    this.initMap = this.initMap.bind(this);
  }

  componentDidMount() {
    window.initMap = this.initMap;
  }

  initMap() {
    var map = new window.google.maps.Map(document.getElementById("map"), {
      center: {lat: 33.993991, lng: -117.901344},
      zoom: 13,
      styles:mapStyles
    });

    this.setState({
      map:map
    });

    this.state.locations.map((location) => {
      var marker = new window.google.maps.Marker({
        position: location.location,
        map: map,
        title:location.name,
        animation: window.google.maps.Animation.DROP
      });
    });

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
