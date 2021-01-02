import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import './BoxList.css';

const BoxList = props => (
    <React.Fragment>
        <List component="nav" aria-label="main mailbox folders" className={props.className}>
            { props.items.map( ( item, index ) => (
                <ListItem button key={index} onClick={() => item.click(item.text)}>
                    <ListItemIcon>
                        { item.icon }
                    </ListItemIcon>
                    <ListItemText primary={item.text} className="list-item-text"/>
                </ListItem>
            ) ) }
        </List> 
    </React.Fragment>
);

export default BoxList;