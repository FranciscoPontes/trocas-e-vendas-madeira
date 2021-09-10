import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FolderIcon from '@material-ui/icons/Folder';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { TOGGLE_LEFT_PANEL } from '../ReduxStore/actionTypes';
import HomeIcon from '@material-ui/icons/Home';

export const LeftNavigationBar = (props) => {
    
    const useStyles = makeStyles({
      list: {
        width: 250,
      },
      fullList: {
        width: 'auto',
      },
    });
    
    const redirect = (path) => {
        props.history.replace(path);
      };

      const classes = useStyles();
      const show = useSelector(state => state.showLeftPanel)
        const dispatch = useDispatch()
      const list = (anchor) => (
        <div
          className={clsx(classes.list, {
            [classes.fullList]: anchor === 'top' || anchor === 'bottom',
          })}
          role="presentation"
        //   onClick={toggleDrawer(anchor, false)}
        //   onKeyDown={toggleDrawer(anchor, false)}
        >
          <List>
              <ListItem button>
                <ListItemIcon onClick={() => redirect("/")}><HomeIcon/></ListItemIcon>
                <ListItemText primary={'Página Inicial'} />
              </ListItem>
              <ListItem button>
                <ListItemIcon><FolderIcon/></ListItemIcon>
                <ListItemText primary={'Minhas vendas'} />
              </ListItem>
              <ListItem button>
                <ListItemIcon><FavoriteIcon/></ListItemIcon>
                <ListItemText primary={'Favoritos'} />
              </ListItem>
          </List>
        </div>
      );
    
      return (
        <div>
              <Drawer anchor='left' open={show} onClose={() => dispatch({ type: TOGGLE_LEFT_PANEL })}>
                {list('left')}
              </Drawer>
        </div>
      );
    }
    

// return (<BottomNavigation
// value={currentTab}
// onChange={(event, newValue) => {
//     setCurrentTab(newValue);
// }}
// showLabels
// className="mobile-nav"
// >
// <BottomNavigationAction label="Minhas publicações" icon={<FolderIcon fontSize="large"/> } />
// <BottomNavigationAction label="Favoritos" icon={<FavoriteIcon fontSize="large"/>} />
// </BottomNavigation>)
// }