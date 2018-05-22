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

  filterRestaurants(event) {
    this.props.infowindow.close();
    this.props.locations.map((location) => {
      location.marker.setAnimation(null);
    })
  	var filterLocations = [];
    this.props.locations.map((location) => {
      if (location.name.toLowerCase().indexOf(event.target.value.toLowerCase()) >= 0) {
        location.marker.setVisible(true);
        filterLocations.push(location);
      } else {
        location.marker.setVisible(false);
      }
    });

    this.setState({
    	filterLocations: filterLocations
    });
  }

	render() {
    var sectionStyle = {
      width: "100%",
      backgroundImage: `url(${Background})`
    };

		return (
			<div className="filter-main" style={ sectionStyle }>
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