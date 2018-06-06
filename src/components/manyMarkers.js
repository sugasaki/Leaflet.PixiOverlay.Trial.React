import React, { Component } from 'react'

//leaflet
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'

//pixi-overlay
import * as PIXI from "pixi.js";
import 'leaflet-pixi-overlay'

//ParticleContainerの拡張用JSをロードする
import './MarkerContainer'


export default class ManyMarker extends Component {
    state = {
        mapLayer: null
    }

    componentDidMount() {//ComponentがDOMツリーに追加された状態で呼ばれます。
        this.leafletInit();
    }

    componentDidUpdate() { //Componentが更新された後に呼ばれます。
        this.pixiOverlayInit(this.state.mapLayer);
    }


    getRandom(min, max) {
        return min + Math.random() * (max - min);
    }



    leafletInit() {
        var map = L.map('map-many-marker').setView([48.838565, 2.449264526367], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        //pixiOverlayでmapオブジェクトを参照できるようにstateにセット
        this.setState({ mapLayer: map });
    }


    pixiOverlayInit(mapLayer) {

        //マーカー最大個数
        var markersLength = 1000000;
        var getRandom = this.getRandom; //pixiOverlayからgetRandom関数にアクセスできるようにポインタ保存

        //Draw a marker
        var loader = new PIXI.loaders.Loader();
        loader.add('marker', './img/marker-icon.png'); //リソースにmarkerという名で'img/marker-icon.png'を登録
        loader.load(function (loader, resources) {  //リソース(marker)をロードする
            var texture = resources.marker.texture;

            var pixiContainer = new PIXI.Container();
            var innerContainer = new PIXI.particles.ParticleContainer(markersLength, { vertices: true });
            innerContainer.texture = texture;
            innerContainer.baseTexture = texture.baseTexture;
            innerContainer.anchor = { x: 0.5, y: 1 };
            pixiContainer.addChild(innerContainer);

            var firstDraw = true;
            var prevZoom;
            var initialScale;

            var pixiOverlay = L.pixiOverlay(function (utils) { //Leafletでズームやパンを行う度にコールされます。ドラッグ中はコールされない
                var zoom = utils.getMap().getZoom(); //Leafletのズーム率  ex. 0～18
                var container = utils.getContainer();
                var renderer = utils.getRenderer();
                var project = utils.latLngToLayerPoint; //Leaflet座標系LatLngからオーバーレイの座標系に投影されたL.Pointを返す。
                var scale = utils.getScale();
                var invScale = 1 / scale;

                if (firstDraw) {
                    var origin = project([(48.7 + 49) / 2, (2.2 + 2.8) / 2]);
                    innerContainer.x = origin.x;
                    innerContainer.y = origin.y;
                    initialScale = invScale / 8;
                    innerContainer.localScale = initialScale;
                    for (var i = 0; i < markersLength; i++) {
                        var x = getRandom(48.7, 49);
                        var y = getRandom(2.2, 2.8);
                        var coords = project([x, y]);
                        // our patched particleContainer accepts simple {x: ..., y: ...} objects as children:
                        innerContainer.addChild({
                            x: coords.x - origin.x,
                            y: coords.y - origin.y
                        });
                    }
                }

                if (firstDraw || prevZoom !== zoom) {
                    innerContainer.localScale = zoom < 8 ? 0.1 : initialScale;// 1 / scale;
                }

                firstDraw = false;
                prevZoom = zoom;
                renderer.render(container); //オーバーレイ上にあるオブジェクトの再描画する。
            }, pixiContainer);

            pixiOverlay.addTo(mapLayer);
        });
    }


    render() {
        return <div>
            <div id='map-many-marker'></div>
        </div>;
    }
}