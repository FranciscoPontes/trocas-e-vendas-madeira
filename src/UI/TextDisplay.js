import React from 'react';
import Typography from '@material-ui/core/Typography';

const TextDisplay = props => <Typography className={props.className} variant={props.headingType} color="textPrimary" gutterBottom>{props.text}</Typography>;

export default TextDisplay;