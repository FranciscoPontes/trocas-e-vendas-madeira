import React, { useState } from "react";
import "./NavBar.css";
import Flag from "../images/madeira-flag.png";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import { connect, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import TextDisplay from "../UI/TextDisplay";
import { logout } from "../ReduxStore/reducer";
import ConfirmDialog from "../UI/ConfirmDialog/ConfirmDialog";
import { TOGGLE_LEFT_PANEL } from "../ReduxStore/actionTypes";

const NavBar = (props) => {
  const dispatch = useDispatch();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const logout = (value) => {
    if (value) props.logout();
    setShowConfirmation(false);
  };

  return (
    <div className="navbar">
      <img
        src={Flag}
        alt="madeira-flag"
        height="100%"
        style={{
          cursor: "pointer",
        }}
        onClick={() => dispatch({ type: TOGGLE_LEFT_PANEL })}
      />
      <TextDisplay
        text="Vendas Madeira"
        headingType="h5"
        className="navbar-heading"
      />
      <div className="google-account-info">
        {props.user ? (
          <Chip
            className="acc-chip"
            avatar={
              <Avatar
                alt={props.user.name}
                src={props.user.photo}
                className="acc-ava"
              />
            }
            label={props.user.name}
            onDelete={() => setShowConfirmation(true)}
          />
        ) : null}
      </div>
      <ConfirmDialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        click={logout}
        title="Terminar sessão?"
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
