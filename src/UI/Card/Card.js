import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ImagePreview from '../BulkImagePreview/BulkImagePreview';
import './Card.css';
import BoxList from '../BoxList/BoxList';
import CallIcon from '@material-ui/icons/Call';
import MailIcon from '@material-ui/icons/Mail';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import $ from 'jquery';
import { connect } from 'react-redux';
import * as ReducerAPI from '../../ReduxStore/reducer';

const useStyles = makeStyles((theme) => ({
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    // transition: theme.transitions.create('transform', {
    //   duration: theme.transitions.duration.shortest,
    // }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  }
}));

const RecipeReviewCard = props => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const callIcon = () => <CallIcon />;
  const mailIcon = () => <MailIcon />;

  const call = phoneNumber => window.open("tel:" + phoneNumber);
  const redirectMail = mail => { window.location.href = "mailto:" + mail };

  const boxListItems = [{"icon": callIcon(), "text": props.docData.phone_number, "click": call}, {"icon": mailIcon(), "text": props.docData.email, "click": redirectMail}];

  const [ likeClickedTimeout, setLikeClickedTimeout ] = useState( false );

  useEffect( () => {
    if ( likeClickedTimeout ) {
      setTimeout( () =>  { 
        setLikeClickedTimeout( false );
      }, 1000);
    } 
  }, [likeClickedTimeout] )

  const addFav = e => {
    // prevent multiple quick clicks
    if ( likeClickedTimeout ) return;

    setLikeClickedTimeout( true );
    let result = getParsedLikeList();

    const docData = { ...props.otherSells[props.value] };

    if ( result && !result.includes( "" + props.value + "" ) ) {
      result.push(props.value);
      $(e.target).parent().parent().parent().addClass("clicked");
      $(e.target).addClass("clicked");
      docData["likeCount"] = parseInt( docData.likeCount ) + 1;
    }
    else if ( result && result.includes( "" + props.value + "" ) ) {
      result.splice( result.indexOf( props.value ), 1 );
      $(e.target).removeClass("clicked");
      $(e.target).parent().removeClass("clicked");
      docData["likeCount"] = parseInt( docData.likeCount ) - 1;
    }
    else result = [props.value];

    let likeList = {};
    likeList["likeList"] = JSON.stringify( result );

    props.updateLikeCount( props.loggedUserId, props.value , docData , likeList);
  }

  // check whether the sell has already been liked by the current user
  const wasAlreadyLiked = () => {
    const likeList = getParsedLikeList();
    return ( likeList && likeList.includes( "" + props.value + "" ) );
  }

  const getParsedLikeList = () => {
    Object.size = obj => {
      var size = 0, key;
      for (key in obj) {
          if (obj.hasOwnProperty(key)) size++;
      }
      return size;
    };

    let result;
    if ( Object.size(props.userLikes) > 0 ) result = JSON.parse(props.userLikes.likeList);
    else result = [];
    return result;
  }

  const isMySells = () => props.location === '/minhas-vendas';


  return (
    <Card className={props.docData.complete === "true" ? "card complete" : "card"}>
      <CardHeader
        avatar={
          <Avatar aria-label="owner" src={props.docData.profile_photo}/>
        }
        title={props.docData.owner}
        subheader={props.docData.date}
        action={ props.canDelete && props.docData.complete === 'false' ? <DeleteForeverIcon className="delete-icon" fontSize="large" onClick={ () => props.canDelete( props.value ) }/> : null } 
      />
      <ImagePreview bulkImages={props.docData.imagesUrl} objectId={props.value}/>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          <b>{props.docData.title}</b> <br/> { props.docData.price + " €"} <br/><br/>Descrição: <br/> {props.docData.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <React.Fragment>
          <IconButton aria-label="add to favorites"  
            onClick={(e) => addFav(e) } 
            className={ isMySells() ? "favButton my-own-sells" : wasAlreadyLiked() ? "favButton clicked" : "favButton"}>
            <FavoriteIcon />
          </IconButton>
          <span>{props.docData.objectID ? props.otherSells[props.docData.objectID].likeCount : props.docData.likeCount}</span>
        </React.Fragment>
        { props.docData.complete === 'false' && props.canDelete ? 
            <IconButton onClick={ () => props.completeSell(props.value) }>
              <DoneOutlineIcon/> 
            </IconButton>
        : props.docData.complete === 'true' ?
          <Typography variant="body2" color="textSecondary" component="p">
            <br/> <br/><br/>{"Vendido em " + props.docData.completionDate}
          </Typography>
        : null
        }
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" className="collapse-style">
        <CardContent >
          <BoxList items={boxListItems} />
        </CardContent>
      </Collapse>
    </Card>
  );
}

const mapStateToProps = state => {
  return {
    userLikes: state.userLikes,
    otherSells: state.otherSells,
    loggedUserId: state.user.id
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateLikeCount: (uId, docId, data, likeList) => dispatch( ReducerAPI.updateLikeCount(uId, docId, data, likeList) )
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(RecipeReviewCard);