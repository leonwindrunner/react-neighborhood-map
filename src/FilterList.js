import React, { Component } from 'react';

class FilterList extends Component {
  constructor(props) {
    super(props);

    this.filterRestaurants = this.filterRestaurants.bind(this);
  }

  filterRestaurants(event) {
    this.props.locations.map((location) => {
      if (location.name.toLowerCase().indexOf(event.target.value.toLowerCase()) >= 0) {
        location.marker.setVisible(true);
      } else {
        location.marker.setVisible(false);
      }
    });
  }

	render() {
		return (
			<div>
				<input type="text" placeholder="Filter Restaurants" onChange={this.filterRestaurants} />
        <ul>
          {this.props.locations.map((location) => (
            <li>{location.name}</li>
          ))}
        </ul>
			</div>
		)
	}
}

export default FilterList;