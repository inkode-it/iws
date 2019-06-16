/**
 *
 * LoginForm
 *
 */
import iso8601 from 'iso8601-js-period';
window.nezasa = {iso8601: iso8601}

import React from 'react';
import PropTypes from 'prop-types';

import 'leaflet/dist/leaflet.css';
import "leaflet-timedimension/dist/leaflet.timedimension.control.css";
import L from 'leaflet';
L.Icon.Default.imagePath = 'https://npmcdn.com/leaflet@1.0.1/dist/images/';
import "leaflet-timedimension/src/leaflet.timedimension";
import "leaflet-timedimension/src/leaflet.timedimension.util";
import "leaflet-timedimension/src/leaflet.timedimension.control";
import "leaflet-timedimension/src/leaflet.timedimension.layer";
import "leaflet-timedimension/src/leaflet.timedimension.layer.wms";
import "leaflet-timedimension/src/leaflet.timedimension.player";


import { FormattedMessage } from 'react-intl';
import messages from './messages';

import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { bindActionCreators } from '../../../../../../../Users/marco/AppData/Local/Microsoft/TypeScript/3.5/node_modules/redux';

const styles = (theme) => {
  return {
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    }
  }
};

class Map extends React.Component {
  

  constructor(props) {
    super(props);

    this.state = {
      map: null
    };

    this.flyTo = this.flyTo.bind(this);
    this.setView = this.setView.bind(this);
  }

  getChildContext() {
    return { map: this.state.map };
  }

  componentDidMount() {
    console.info("did mount");
    const { options } = this.props;
    const setView = this.setView;
    const map = L.map(this.refs.map, options);
    //map.on('moveend', this.handleChange);

    this.setState({ map }, () => {
      setView(options);
    });
  }

  componentWillUnmount() { 
    const { map } = this.state;
    map.off(); 
    map.remove(); 
  }

  componentWillReceiveProps(nextProps) {
    console.info("receive props");
    const { map } = this.state;
    const options = nextProps.options;
    //map.invalidateSize();
    let timeout = null;
    this.flyTo(options);
      if(timeout) {
        clearTimeout(timeout);
        timeout = null;  
      }
      timeout = setTimeout(() => {
        if(map) {
          map.invalidateSize();
        }
      }, 180);
  }

  componentDidUpdate(nextProps) {
    console.info("update component");
    const { map } = this.state;
    const options = nextProps.options;
    //this.setView(options);
    //map.invalidateSize();
  }

  flyTo(options) {
    //this.state.map.invalidateSize();
    this.state.map.flyTo([options.center[0], options.center[1]], options.zoom, {
      animate: true,
      duration: 1.5
    });
  }

  setView(options) {
    //this.state.map.invalidateSize();
    this.state.map.setView([options.center[0], options.center[1]], options.zoom, {
      reset: false,
      animate: true,
      pan: {
        animate: true,
        duration: 1.5
      },
      zoom: {
        animate: true
      }
    });
  }

  render () {
    return (
      <div ref="map" style={{ height: 'calc(100vh - 64px)', width: '100%', minHeight: '100%', minWidth: '100%' }}>
        { this.state.map ? this.props.children : undefined }
      </div>
    )
  }
}
Map.childContextTypes = {
  map: PropTypes.object
};
export default withStyles(styles, {withTheme: true})(Map);
