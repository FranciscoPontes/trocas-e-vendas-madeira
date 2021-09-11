import React, { Fragment, useState } from "react";
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
import MenuIcon from "@material-ui/icons/Menu";
import CustomButton from "../UI/Button";
import { routePaths } from "../App";
import { withRouter } from "react-router";

const NavBar = (props) => {
  const dispatch = useDispatch();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const logout = (value) => {
    if (value) props.logout();
    setShowConfirmation(false);
  };

  return (
    <Fragment>
      <ConfirmDialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        click={logout}
        title="Terminar sessão?"
      />
      <div className="navbar">
        <div
          onClick={() => dispatch({ type: TOGGLE_LEFT_PANEL })}
          style={{
            cursor: "pointer",
            height: "fit-content",
          }}
        >
          <MenuIcon fontSize="large" />
        </div>
        <TextDisplay
          text="Vendas Madeira"
          headingType="h5"
          className="navbar-heading"
        />
        <div className="google-account-info">
          {props.user ? (
            <Fragment>
              {props.location !== routePaths.NOVA_VENDA ? (
                <CustomButton
                  text="Vender"
                  className="navbar buttons blue"
                  click={() => props.history.replace(routePaths.NOVA_VENDA)}
                />
              ) : null}
              <Chip
                className="acc-chip"
                avatar={
                  <Avatar
                    alt={props.user.name}
                    src={props.user.photo}
                    className="acc-ava"
                  />
                }
                // label={props.user.name}
                onDelete={() => setShowConfirmation(true)}
              />
            </Fragment>
          ) : null}
        </div>
      </div>
    </Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavBar));
