import React, { Component } from 'react';
import './App.css';
import DrawMarker from './components/drawMarker';
import ManyMarker from './components/manyMarkers';

class App extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <div className="App">
        <DrawMarker />
        <ManyMarker />
      </div>
    );
  }
}

export default App;