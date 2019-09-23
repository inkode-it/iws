/*
 *
 * MapPage reducer
 *
 */
import produce from 'immer';
import moment from 'moment';
import { TOGGLE_LAYER_VISIBILITY, ZOOM_IN, ZOOM_OUT, SET_VIEWPORT, 
  TOGGLE_LAYER_MEAN, REQUEST_INFO_LAYER, REQUEST_INFO_LAYER_SUCCESS, 
  POST_FAVOURITE, POST_FAVOURITE_SUCCESS, DELETE_FAVOURITE, 
  DELETE_FAVOURITE_SUCCESS, REQUEST_ERROR, CLOSE_INFO_LAYER } from './constants';

let currentTime = new Date();
currentTime.setUTCHours(0, 0, 0, 0);

const currentTimeDimention = moment(currentTime).format("YYYY-MM-DD");
const currentTimeDimentionOneYearBefore = moment(currentTime).subtract(1, "years").format("YYYY-MM-DD");

const tomorrow = new Date();
tomorrow.setDate(currentTime.getDate() + 1);
const timeInterval = currentTime.toISOString().slice(0,10) + "/" + tomorrow.toISOString().slice(0,10);
const ncdate = currentTime.toISOString().slice(0,10).replace(/-/g,"");
const proxyUrl = process.env.PROXY_URL;

const waveUrl = proxyUrl + "/thredds/wms/tmes/TMES_waves_" + ncdate + ".nc";
// const waveUrl = 'http://localhost:3000/thredds/wms/tmes/TMES_waves_20190620.nc';
const wmpMeanUrl = proxyUrl + "/thredds/wms/tmes/TMES_sea_level_" + ncdate + ".nc";

export const initialState = {
  bbox: [[46.286224,25.708008], [35.960223,11.733398]],
  mean: true,
  viewport: {
    longitude: 12.33265,
    latitude: 45.43713, 
    zoom: 5,
    // bearing: 3,
    // pitch: 0
  },
  style: {
    version: 8,
    sources: {
      backgroundLayer: {
        type: "raster",
        tiles: ["https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png"],
        // tiles: ["http://ows.emodnet-bathymetry.eu/wms?layers=emodnet:mean_atlas_land,coastlines&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&SRS=EPSG%3A3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256"],
        tileSize: 256,
        attribution: 'Map tiles by <a target="_top" rel="noopener" href="http://stamen.com">Stamen Design</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'
      }
    },
    layers: [{
      id: "backgroundLayer",
      type: "raster",
      source: "backgroundLayer",
      minzoom: 0,
      maxzoom: 22
    }]
  },
  WindGLLayer: {
    name: "Wave",
    id: "wmpMean",
    isVisible: true,
    isTimeseries: true,
  },
  BackgroundWindLayer: {
    name: "Wave background",
    id: "wmpMeanBg",
    isVisible: true,
    isTimeseries: true,
  },
  seaLevel: {
    name: "Sea Level",
    id: "seaLevel",
    isVisible: true,
    isTimeseries: true,
    type: 'raster',
    source: {
    type: 'raster',
      tiles: [
        waveUrl + '?LAYERS=wmp-mean&ELEVATION=0&TIME=' + currentTimeDimention + 'T00%3A00%3A00.000Z&TRANSPARENT=true&STYLES=boxfill%2Frainbow&COLORSCALERANGE=2.44%2C7.303&NUMCOLORBANDS=20&LOGSCALE=false&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&SRS=EPSG%3A3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256'
      ],
      width: 256,
      height: 256
    },
    paint: {
        // "raster-opacity": 0.5,
        "raster-opacity": 0.8,
        // 'raster-hue-rotate': 0,
        'raster-hue-rotate': 0.2,
        // "raster-resampling": "nearest"
    }
  },
  layers: {
    stationsWave: {
      name: "Station Wave",
      id: "stations-wave",
      isVisible: true,
      isTimeseries: false,
      type: 'circle',
      source: {
        type: 'geojson',
        data: 'https://iws.ismar.cnr.it/geoserver/wfs?srsName=EPSG%3A4326&typename=geonode%3AI_STORMS_monitoring_station_details_station_l&outputFormat=json&version=1.0.0&service=WFS&request=GetFeature',
      },
      paint: {
        'circle-color': '#d10000',
        // 'circle-radius': 4,
        "circle-radius": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          8,
          5
        ]
      }
    },
    stationsSeaLevel: {
      name: "Station Seal Level",
      id: "stations-sea-level",
      isVisible: true,
      isTimeseries: false,
      type: 'circle',
      source: {
        type: 'geojson',
        data: 'https://iws.ismar.cnr.it/geoserver/wfs?srsName=EPSG%3A4326&typename=geonode%3AI_STORMS_monitoring_station_details_station_l&outputFormat=json&version=1.0.0&service=WFS&request=GetFeature',
      },
      paint: {
        'circle-color': '#fa0',
        // 'circle-radius': 4,
        "circle-radius": [
          "case",
          ["boolean", ["feature-state", "hover"], true],
          8,
          5
        ]
      }
    }
  },
  popups: {
    loading: false,
    error: null,
    results: [],
    postfavourites: {
      loading: false,
      error: null,
      results: []
    }
  }
};



/* eslint-disable default-case, no-param-reassign */
const mapPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case TOGGLE_LAYER_MEAN:
        draft.mean = !draft.mean;
        break;
      case TOGGLE_LAYER_VISIBILITY:
        if(action.layer === "wmpMean") {
          draft.WindGLLayer.isVisible = !draft.WindGLLayer.isVisible;
        } else if(action.layer === "seaLevel") {
          draft.seaLevel.isVisible = !draft.seaLevel.isVisible;
        } else {
          draft.layers[action.layer].isVisible = !draft.layers[action.layer].isVisible;
        }
        break;
      case ZOOM_IN:
        draft.viewport.zoom = draft.viewport.zoom + .5;
      break;
      case ZOOM_OUT:
        draft.viewport.zoom = draft.viewport.zoom - .5;
      break;
      case SET_VIEWPORT:
        draft.viewport = action.viewport;
      break;
      case REQUEST_INFO_LAYER:
        draft.popups.loading = true;
        draft.popups.error = initialState.popups.error;
        draft.popups.results = []
      break;
      case REQUEST_INFO_LAYER_SUCCESS:
        draft.popups.loading = false;
        draft.popups.error = initialState.popups.error;
        draft.popups.results = [{...action.result, show: true}];
      break;
      case POST_FAVOURITE:
          draft.popups.postfavourites.loading = true;
          draft.popups.postfavourites.error = initialState.popups.postfavourites.error;
          draft.popups.postfavourites.results = []
        break;
      case POST_FAVOURITE_SUCCESS:
            draft.popups.postfavourites.loading = false;
            draft.popups.postfavourites.error = initialState.popups.postfavourites.error;
            draft.popups.postfavourites.results = action.results
        break;
      case DELETE_FAVOURITE:
          draft.loading = true;
          draft.popups.postfavourites.error = initialState.popups.postfavourites.error;
          draft.popups.postfavourites.results = []
        break;
      case DELETE_FAVOURITE_SUCCESS:
          draft.loading = false;
          draft.popups.postfavourites.results = []
        break;  
      case REQUEST_ERROR:
        console.log(action.error)
        console.log(action.error)
        console.log(action.error)
        draft.popups.loading = false;
        draft.popups.error = action.error;
      break;
      case CLOSE_INFO_LAYER:
        draft.popups.loading = false;
        draft.popups.error = initialState.popups.error;
        draft.popups.results = [];
        draft.popups.postfavourites.loading = false;
        draft.popups.postfavourites.error = initialState.popups.postfavourites.error;
        draft.popups.postfavourites.results = []
      break;
    }
  });


export default mapPageReducer;

