import React from 'react';
import ReactDOM from 'react-dom';

import List from './Components/List.jsx';
import Overview from './Components/Overview.jsx';
import Sort from './Components/Sort.jsx';
import { Button, FourStars } from './Styling/Styles.jsx';

class Reviews extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      allData: ['some data here'],
      sortOptions: ['most recent', 'highest rated', 'lowest rated', 'most helpful'],
      filterOptions: ['5 stars', '4 stars', '3 stars', '2 stars', '1 star'],
      sortCurrent: 'most recent',
      filterCurrent: [],
      filtered: false,
      filteredData: ['filtered data here']
    };
  }



  componentDidMount() {

    let productId = window.location.pathname.slice(1) || 1;
    console.log('product_id: ', productId);

    fetch(`http://localhost:3004/api/reviews/${productId}`)
      .then(data => {
        return data.json();
      })
      .then(data => {
        this.setState({
          allData: this.sortReviews(data, 'most recent')
        })

      })
  }
  // ==== NOT VERY DRY ==== //
  sortReviews(data, option) {
    if (option === 'most recent') {
    return data.sort(function compare(a, b) {
        var aTime = a.createdAt;
        var bTime = b.createdAt;
        return bTime.localeCompare(aTime);
      });
    } else if (option === 'highest rated') {
      return data.sort(function compare(a, b) {
        var aTime = a.stars.toString();
        var bTime = b.stars.toString();
        return bTime.localeCompare(aTime);
      });
    } else if (option === 'lowest rated') {
      return data.sort(function compare(a, b) {
        var aTime = a.stars.toString();
        var bTime = b.stars.toString();
        return aTime.localeCompare(bTime);
      });
    } else if (option === 'most helpful') {
      return data.sort(function compare(a, b) {
        var aTime = a.helpfulVotes.toString();
        var bTime = b.helpfulVotes.toString();
        return bTime.localeCompare(aTime);
      });
    }
  }

  filterStars(data, num) {
    var output = []
    for (var i = 0; i < data.length; i++) {
      if (data[i].stars === num) {
        output.push(data[i]);
      }
    }
    return output;
  }

  sortByChange(event) {
    this.setState({
      sortCurrent: event.target.value
    }, function() {
      if (this.state.sortCurrent === 'most recent') {
        this.setState({
          allData: this.sortReviews(this.state.allData, 'most recent')
        })
      } else if (this.state.sortCurrent === 'highest rated') {
        this.setState({
          allData: this.sortReviews(this.state.allData, 'highest rated')
        })
      } else if (this.state.sortCurrent === 'lowest rated') {
        this.setState({
          allData: this.sortReviews(this.state.allData, 'lowest rated')
        })
      } else if (this.state.sortCurrent === 'most helpful') {
        this.setState({
          allData: this.sortReviews(this.state.allData, 'most helpful')
        })
      }
    })

  }

  filterByChange(event) {
    this.setState({
      filterCurrent: Number(event.target.value.slice(0, 1)),
      filtered: true
    }, () => {
      this.setState({
        filteredData: this.filterStars(this.state.allData, this.state.filterCurrent)
      })
    })
  }

  renderList() {
    if (this.state.filtered) {
      return (
        <div>
          <List data={this.state.filteredData} />
        </div>
      )
    } else {
      return (
        <div>
          <List data={this.state.allData} />
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        <Overview />
        <Button>Write a review</Button>
        <Sort
        sortOptions={this.state.sortOptions}
        filterOptions={this.state.filterOptions}
        sortOnChange={this.sortByChange.bind(this)}
        filterOnChange={this.filterByChange.bind(this)}
        />
        <div>
          {this.renderList()}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Reviews />, document.getElementById('reviews'));

export default Reviews;