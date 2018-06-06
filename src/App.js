import React, { Component, StrictMode } from 'react';
import './App.css';
import DrawMarker from './components/drawMarker';
import ManyMarker from './components/manyMarkers';

class App extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <StrictMode>
        <h1>Leaflet.PixiOverlayをReactで使うサンプル</h1>
        <h2>Draw a marker</h2>
        <p>１個のマーカーを表示</p>
        <DrawMarker />
        <h2>many markers</h2>
        <p>1,000,000個のマーカーを表示</p>
        <ManyMarker />
      </StrictMode>
    );
  }
}

export default App;