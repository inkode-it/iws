/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, {useEffect}  from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { Redirect, Route } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';


import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
/* import { toggleDrawerMini, toggleDrawer } from './actions'; */
import makeSelectFavourites from './selectors';
import reducer from './reducer';
import saga from './saga';
import HeaderBar from "../../components/HeaderBar";
import { FavoriteIcon, ListIcon } from '../../utils/icons';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { requestFavourites, deleteFavourite, postFavourite } from "./actions";
import { setViewport } from '../App/actions';
import SidebarSubNav from 'components/SidebarSubNav';
import continuousColorLegend from 'react-vis/dist/legends/continuous-color-legend';

function FavouritesPage(props) {
  useInjectReducer({ key: 'favourites', reducer });
  useInjectSaga({ key: 'favourites', saga });
  console.info("Favourite Page");
  

  /* const linkTo = (path) => {
    if(isCurrentPage(path)) { 
      props.history.push(`/favourites`) 
    } else {
      props.history.push(`/${path}`)
    }
  }  */
  
  const isCurrentPage = (pagePath) => {
    const check = pagePath === props.location.pathname ? true : false
    //return new RegExp(`^\/${(pagePath).replace("/", "\/")}(.*?)`).test(props.location.pathname);
    return check
  };

  /* const _delete = (id) => {
    props.dispatch(deleteFavourite(id))
  }; */

  useEffect(() => {
    console.log('Favourite Page Mount')  
    if(props.favourites.loading == false && props.favourites.results.length == 0 )
      props.dispatch(requestFavourites())

   return () => {
     console.log('Favourite Page Unmount')
   }   
  }, [])

  useEffect(() => {
    if(props.match.params.id && props.favourites.results.length > 0){
      const FavouritesResults = props.favourites.results;
      if(FavouritesResults.some(result => result.id == props.match.params.id )){
        const selectedFav = FavouritesResults.filter(function(result) {
          return result.id == props.match.params.id;
        });
        props.dispatch(setViewport({longitude: selectedFav[0].longitude, latitude: selectedFav[0].latitude, zoom: 8})) 
        console.log('dispatch set viewport fav')
      }else{
        props.history.push(`/favourites`) 
      }
    }
  })

  return (
    <>
      <SidebarSubNav 
        location={props.location}
        deleteFunc={(id) => props.dispatch(deleteFavourite(id))}
        Title="Favourites List" 
        Icon={ListIcon} 
        Results={props.favourites.results} 
        />
    </>
  );
}  
 

const mapStateToProps = createStructuredSelector({
  favourites: makeSelectFavourites(),
})

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  }
  
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(FavouritesPage);
