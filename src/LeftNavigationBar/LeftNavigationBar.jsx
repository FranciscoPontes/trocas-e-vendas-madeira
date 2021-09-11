import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FolderIcon from "@material-ui/icons/Folder";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { TOGGLE_LEFT_PANEL } from "../ReduxStore/actionTypes";
import HomeIcon from "@material-ui/icons/Home";
import { withRouter } from "react-router";
import { routePaths } from "../App";

const LeftNavigationBar = (props) => {
  const useStyles = makeStyles({
    list: {
      width: 250,
    },
    fullList: {
      width: "auto",
    },
  });

  const redirect = (path) => {
    props.history.replace(path);
  };

  const linksMetadata = [
    {
      title: "Página Inicial",
      icon: <HomeIcon />,
      onClickHandler: () => redirect(routePaths.HOME),
    },
    {
      title: "Minhas Vendas",
      icon: <FolderIcon />,
      onClickHandler: () => redirect(routePaths.MINHAS_VENDAS),
    },
    {
      title: "Favoritos",
      icon: <FavoriteIcon />,
      onClickHandler: () => redirect(routePaths.FAVORITOS),
    },
  ];

  const classes = useStyles();
  const show = useSelector((state) => state.showLeftPanel);
  const dispatch = useDispatch();
  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={() => dispatch({ type: TOGGLE_LEFT_PANEL })}
      onKeyDown={() => dispatch({ type: TOGGLE_LEFT_PANEL })}
    >
      <List>
        {linksMetadata.map((link) => (
          <ListItem button onClick={link.onClickHandler} key={link.title}>
            <ListItemIcon>{link.icon}</ListItemIcon>
            <ListItemText primary={link.title} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div>
      <Drawer
        anchor="left"
        open={show}
        onClose={() => dispatch({ type: TOGGLE_LEFT_PANEL })}
      >
        {list("left")}
      </Drawer>
    </div>
  );
};

export default withRouter(LeftNavigationBar);
