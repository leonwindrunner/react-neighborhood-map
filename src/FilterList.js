import React, { Component } from 'react';
import Background from './bgimg.jpg';

class FilterList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterLocations: ""
    };
    this.filterRestaurants = this.filterRestaurants.bind(this);
  }

  componentWillMount() {
    this.setState({
      filterLocations: this.props.locations
    });
  }

  //Filter Locations based on user input
  filterRestaurants(event) {
    //Make sure other infowindow and markers animation close when input something
    this.props.infowindow.close();
    this.props.locations.map((location) => {
      location.marker.setAnimation(null);
    })

    // Create a new blank array for the filtering locations.
  	var filterLocations = [];
    //Filter locations
    //Make locations visibile which match the user input, and others unvisible
    this.props.locations.map((location) => {
      if (location.name.toLowerCase().indexOf(event.target.value.toLowerCase()) >= 0) {
        location.marker.setVisible(true);
        filterLocations.push(location);
      } else {
        location.marker.setVisible(false);
      }
    });

    //Set state for filter list use
    this.setState({
    	filterLocations: filterLocations
    });
  }

  //Render fot FilterList
	render() {
    //Add a background image
    var sectionStyle = {
      width: "100%",
      backgroundImage: `url(${Background})`
    };

		return (
			<div className="filter-main" role="filter box" style={ sectionStyle }>
        <h1>Restaurants Near me</h1>
          <div className="filter-input">
            <label>Search</label> 
            <input 
              role="search" 
              aria-labelledby="filter" 
              type="text" 
              placeholder="Restaurant name" 
              onChange={this.filterRestaurants} 
            />
          </div>
        <ul className="filter-list">
          {this.state.filterLocations.map((location) => (
            <li 
              key={location.name} 
              role="button"
              tabIndex="0"              
              onClick={() => this.props.onPopulateInfoWindow(location.marker)}
            >
              {location.name}
            </li>
          ))}
        </ul>
			</div>
		)
	}
}

export default FilterList;