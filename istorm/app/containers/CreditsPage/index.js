/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
// import { useInjectReducer } from 'utils/injectReducer';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

import { withStyles } from '@material-ui/core/styles';
// import HeaderBar from "../../components/HeaderBar";
// import HistoryForm from "../../components/HistoryForm";
// import { HistoryIcon } from '../../utils/icons';

// import SidebarSubNav from 'components/SidebarSubNav';


const styles = (theme, style) => {

  return {
    subNav: {
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 10,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(105, 131, 151,.8)",

    },
  }
};

function CreditsPage(props) {

  return (
    <>
      <div className={props.classes.subNav}>
      CREDITS PAGE..
      </div>
    </>
  );
}

const mapStateToProps = createStructuredSelector({

});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(withStyles(styles, {withTheme: true})(CreditsPage));
