import React, { useState } from 'react';
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
import './ImageCarousel.css';
import BoxList from '../BoxList/BoxList';
import CallIcon from '@material-ui/icons/Call';
import MailIcon from '@material-ui/icons/Mail';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';

const useStyles = makeStyles((theme) => ({
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
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

  const boxListItems = [{"icon": callIcon(), "text": props.phone_number, "click": call}, {"icon": mailIcon(), "text": props.email, "click": redirectMail}];

  return (
    <Card className={props.complete === "true" ? "card complete" : "card"}>
      <CardHeader
        avatar={
          <Avatar aria-label="owner" src={props.photo}/>
        }
        title={props.name}
        subheader={props.date}
        action={ props.canDelete && props.complete === 'false' ? <DeleteForeverIcon className="delete-icon" fontSize="large" onClick={ () => props.canDelete( props.value ) }/> : null } 
      />
      <ImagePreview bulkImages={props.bulkImages}/>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {props.title}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        { props.complete === 'false' && props.canDelete ? 
          <IconButton onClick={ () => props.completeSell(props.value) }>
            <DoneOutlineIcon/> 
          </IconButton>
        : props.canDelete ?
          <Typography variant="body2" color="textSecondary" component="p">
            {"Completo em " + props.completionDate}
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
      <BoxList items={boxListItems} className="boxlist"/>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>{props.description}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default RecipeReviewCard;