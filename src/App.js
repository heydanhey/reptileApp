import React, { Component } from 'react';
import './App.css';
import Home from './Home';


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div>
        <Home />
      </div>
    )
  }
}

export default App