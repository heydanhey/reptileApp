import React, { Component } from 'react';
import Add from './Add';
import './App.css';
import firebase from './firebase';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import ReactChartkick, { ColumnChart } from 'react-chartkick'
import Chart from 'chart.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
ReactChartkick.addAdapter(Chart)

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      fav_reptile: '',
      reptiles: [],
      tab: 'chart'
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
      console.log(reptiles)
    })
  }

  handleChange = (value) => {
    this.setState({ inputValue: value });
  }

  handleTabClick = (event) => {
    const { name } = event.target;
    this.setState({ tab: name })
  }

  add = (reptile) => {
    let id = new Date().getTime().toString()
    localStorage.setItem('fav_reptile', JSON.stringify(reptile))
    firebase.firestore().collection('reptiles').doc(id).set({
      reptile: reptile,
      id: id
    }).then(() => {
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
        acc[curr.reptile.name] = { count: 1, species: curr.reptile.species };
      } else {
        acc[curr.reptile.name].count += 1;
      }
      return acc;
    }, {});

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
                    <>
                      <p className="p-2" style={{color:'grey'}}> Current favorite: {this.state.fav_reptile.name } </p>

                      <ul class="nav nav-tabs">
                        <li class="nav-item">
                          <button name="chart" class={`nav-link ${this.state.tab === 'chart' ? 'active' : ''}`} onClick={this.handleTabClick}>Chart</button>
                        </li>
                        <li class="nav-item">
                          <button name="table" class={`nav-link ${this.state.tab === 'table' ? 'active' : ''}`} onClick={this.handleTabClick}>Table</button>
                        </li>
                      </ul>

                      <ReactCSSTransitionGroup
                        transitionName="example"
                        transitionEnterTimeout={400}
                        transitionLeaveTimeout={300}
                      >
                        { this.state.tab === 'chart' && (
                          <div class="mt-4">
                            <ColumnChart
                              data={
                                Object.keys(chartData).map((key) => {
                                  return [key, chartData[key].count]
                                })
                              }
                              colors={['#808080']}
                            />
                          </div>
                        )}

                        {
                          this.state.tab === 'table' && (
                            <table class="table table-dark"> 
                              <thead>
                                <tr>
                                  <th>Reptile</th>
                                  <th>Species</th>
                                  <th>Votes</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.keys(chartData).map(name => (
                                  <tr key={name}>
                                    <td>{name}</td>
                                    <td>{chartData[name].species}</td>
                                    <td>{chartData[name].count}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )
                        }
                      </ReactCSSTransitionGroup>
                    </>
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
