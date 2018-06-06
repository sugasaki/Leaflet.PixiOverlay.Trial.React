import React, { Component } from 'react';
import './App.css';
import DrawMarker from './components/drawMarker';

class App extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <div className="App">
        <DrawMarker />
      </div>
    );
  }
}

export default App;
