import React, { Component } from 'react';

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
		return (
			<div>
				<input type="text" placeholder="Filter Restaurants" onChange={this.filterRestaurants} />
        <ul>
          {this.state.filterLocations.map((location) => (
            <li>{location.name}</li>
          ))}
        </ul>
			</div>
		)
	}
}

export default FilterList;