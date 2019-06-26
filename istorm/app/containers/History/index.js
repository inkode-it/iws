/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

import { withStyles } from '@material-ui/core/styles';

const styles = (theme, style) => {
  console.info("themeeeeeeeeeeeeeeeee");
  console.info(theme, style);
  return {
    subNav: {
      position: "absolute", 
      top: 0, 
      left: 0, 
      zIndex: 10000, 
      width: 250,
      backgroundColor: "rgba(255,255,255,.8)",
      height: "calc(100vh - 64px)"
    },
  }
};

function HistoryPage(props) {
  return (
    <div className={props.classes.subNav}>
      <div>HistoryPage</div>
    </div>
  );
}

export default withStyles(styles, {withTheme: true})(HistoryPage);