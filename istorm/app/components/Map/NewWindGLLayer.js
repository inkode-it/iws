import React, {createElement} from 'react';
import PropTypes from 'prop-types'
import { BaseControl } from 'react-map-gl';
import WindGL from '../../utils/wind-gl';
import request from '../../utils/request';

class WindLayer {
  constructor(id, ctx, windImageSrc, windImageMeta) {
    this.id = id;
    this.loading = false; 
    this.type = 'custom';
    this.ctx = ctx;
    this.renderingMode = '2d';
    this.animationFrame = null;
    this.windImageSrc =  windImageSrc;
    this.windImageMeta =  windImageMeta;
    this.state = {wind: null, map: null};
    //this.render = this.render.bind(this)
    this.drawWind = this.drawWind.bind(this);
    this.updateWindScale = this.updateWindScale.bind(this);
  }

  onAdd(map, gl) {
    this.loading = true;
    const updateWindScale = this.updateWindScale
    this.state.map = map
    const wind = new WindGL(this.ctx);
    wind.numParticles = this.calcNumParticles(map.transform.width, map.transform.height);

    request(this.windImageMeta)
     .then(windJson => {
        const windImage = new Image();
        let windData = windJson;
        windData.image = windImage;
        windImage.crossOrigin = "*";
        windImage.src = this.windImageSrc;
        windImage.onload = function () {
          wind.setWind(windData);
          updateWindScale(wind, map);
          this.loading = false;
        };
        windData.windData = windImage;
        wind.setWind(windData)
        this.state.wind = wind
        this.updateWindScale(wind, map)
        this.drawWind();
      })
  }

  onRemove() {
    cancelAnimationFrame(this.animationFrame);
  }

  drawWind() {
    if (this.state.wind && this.state.wind.windData) {
      this.state.wind.draw();
    }
    this.animationFrame = requestAnimationFrame(this.drawWind);
  }

  render(gl, matrix) {
    const map = this.state.map;
    const wind = this.state.wind;
    
    this.updateWindScale(wind, map)
  }

  calcNumParticles(width, height) {
    // console.log('calcNumParticles')
    return Math.min(Math.floor(width / 20 * height / 20),
      1200
    );
  }


  updateWindScale(wind, map) {
    // console.log('updateWindScale')
    if (!wind || !wind.windData || !this.loading) {
      return;
    }
    let data = wind.windData;
    // console.log(map)
    // let resolution = 1024.0;
    // Spx = C * cos(latitude) / 2 ^ (zoomlevel + 8)
    // 40075016.686
    // let resolution = 40075016.686 * Math.cos(map.transform._center.lat) / 2 ^ (map.transform._zoom + 8)
    let constRes = 5.01; // * window.devicePixelRatio
    let resolution = 40075016.686 * Math.cos(0) / Math.pow(2, (map.getZoom()) + 8) / constRes
    // let resolution = 40075016.686 * Math.cos(0) / Math.pow(2, (5 + 8))
    // console.log('resolution')
    // // console.log(resolution)
    // console.log(Math.pow(2, map.transform._zoom + 8))
    // let resolution = map.transform.width;
    let scale = data.resolution / resolution;
    let position = map.project([data.lo1, data.la1]);
    position = [
      position.x,
      position.y
    ]
    if (!position) {
      return;
    }

    let offset = [
      Math.max(-position[0] / scale, 0),
      Math.max(-position[1] / scale, 0)
    ];

    wind.move(position[0], position[1]);
    wind.offset(offset[0], offset[1]);
    wind.zoom(scale);
    wind.reset();
  }
}


class NewWindGLLayer extends BaseControl {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const map = this._context.map;
    const { layer, layerInfo } = this.props;
    const canvas = this._containerRef.current;
    if (canvas) {
      this._canvas = canvas;
      this._ctx = canvas.getContext('webgl', {antialiasing: false});
    }
    map.addLayer(new WindLayer(layer.id, this._ctx, layerInfo.wave_image, layerInfo.wave_metadata));
  }

  componentWillReceiveProps(newProps) {
    const map = this._context.map;
    const { layer, layerInfo } = newProps;
    const source = map.getLayer(layer.id)
    if(source && JSON.stringify(newProps.layerInfo) !== JSON.stringify(this.props.layerInfo)) {
      map.removeLayer(layer.id);
      map.addLayer(new WindLayer(layer.id, this._ctx, layerInfo.wave_image, layerInfo.wave_metadata));
    }
  }

  componentWillUnmount() {
    const map = this._context.map;
    const { layer } = this.props;
    const source = map.getLayer(layer.id)
    if(source) {
      map.removeLayer(layer.id);
    }
  }

  _render() {
    // const pixelRatio = window.devicePixelRatio || 1;
    const pixelRatio = 1;
    const _this$_context$viewpo = this._context.viewport,
          width = _this$_context$viewpo.width,
          height = _this$_context$viewpo.height;

    // this._redraw();

    return createElement('canvas', {
      ref: this._containerRef,
      width: width * pixelRatio,
      height: height * pixelRatio,
      style: {
        width: "".concat(width, "px"),
        height: "".concat(height, "px"),
        position: 'absolute',
        left: 0,
        top: 0
      }
    });
  }


};

export default NewWindGLLayer;
