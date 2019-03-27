import React, { Component } from 'react';
import Add from './Add';
import './App.css';
import firebase from './firebase';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import ReactChartkick, { BarChart } from 'react-chartkick'
import Chart from 'chart.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
ReactChartkick.addAdapter(Chart)

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      fav_reptile: '',
      reptiles: []
    };
  }

  componentDidMount() {
    const fav_reptile = localStorage.getItem('fav_reptile')
    firebase.firestore().collection('reptiles').onSnapshot(snapshot => {
      let reptiles = [];
      snapshot.forEach(doc => {
        reptiles.push(doc.data());
      })
      this.setState({
        reptiles: reptiles,
        fav_reptile: JSON.parse(fav_reptile)
      });
    })
  }

  handleChange = (value) => {
    console.log(value)
    this.setState({ inputValue: value });
  }

  add = (reptile) => {
    console.log(reptile)
    let id = new Date().getTime().toString()
    localStorage.setItem('fav_reptile', JSON.stringify(reptile))
    firebase.firestore().collection('reptiles').doc(id).set({
      reptile: reptile,
      id: id
    }).then(() => {
      console.log("successfully added document")
      this.setState({
        fav_reptile: reptile
      })
      NotificationManager.success('That\'s a nice Reptile, thanks for sharing!')
    }).catch((error) => {
      console.log("error adding document", error)
    })
  }

  remove = (id) => {
    firebase.firestore().collection('reptiles').doc(id).delete().then(() => {
      console.log("Document successfully deleted!");
    }).catch((error) => {
      console.error("Error removing document: ", error);
    });
  }

  render() {
    const chartData = this.state.reptiles.reduce((acc, curr) => {
      if (typeof acc[curr.reptile.name] == 'undefined') {
        acc[curr.reptile.name] = 1;
      } else {
        acc[curr.reptile.name] += 1;
      }
      return acc;
    }, {});
    console.log(chartData)
    return (
      <div className="App">
        <NotificationContainer/>
        <div className="container">
          <div className="jumbotron" style={{backgroundColor: 'transparent'}}>
            <h1 style={{color:'white'}}>What is your favorite reptile?</h1>
            <Add
              inputValue={this.state.inputValue}
              handleChange={this.handleChange}
              add={this.add}
            />
              <ReactCSSTransitionGroup
                transitionName="example"
                transitionEnterTimeout={400}
                transitionLeaveTimeout={300}
              >
              {
                this.state.fav_reptile && (
                  <p className="p-2" style={{color:'grey'}}> Current favorite: {this.state.fav_reptile.name } </p>
                )
              }
              {
                this.state.fav_reptile && (
                  <BarChart
                    data={
                      Object.keys(chartData).map((key) => {
                        return [key, chartData[key]]
                      })
                    }
                    colors={['#808080']}
                  />
                )
              }
            </ReactCSSTransitionGroup>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
