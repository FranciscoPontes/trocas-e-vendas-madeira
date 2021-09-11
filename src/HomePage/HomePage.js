import React, { useState, useEffect } from "react";
import Button from "../UI/Button";
import "./HomePage.css";
import { connect, useSelector } from "react-redux";
import * as ReducerAPI from "../ReduxStore/reducer";
import Card from "../UI/Card/Card";
import Spinner from "../UI/Spinner";
import * as actionTypes from "../ReduxStore/actionTypes";
import TextDisplay from "../UI/TextDisplay";
import OtherSells from "../UI/DisplayOtherSells/DisplayOtherSells";
import { routePaths } from "../App";

const HomePage = (props) => {
  const [cachedCredential, setCachedCredential] = useState(
    sessionStorage.getItem("cp-persuasive-user")
  );

  const [autoLoginStarted, setAutoLoginStarted] = useState(false);

  const loginButtonClick = () => props.login();

  const otherSells = useSelector((state) => state.otherSells);

  const generateSells = (
    <div className="sells-content">
      {otherSells
        ? Object.keys(otherSells).map((sell) => (
            <Card
              key={otherSells[sell].docId}
              docData={otherSells[sell]}
              value={otherSells[sell].docId}
            />
          ))
        : null}
    </div>
  );

  /**
   *
   * Handles login functionality.
   */
  useEffect(() => {
    // auto login
    if (cachedCredential && !props.user) loginButtonClick();
    // manual login
    else if (
      !cachedCredential &&
      !props.user &&
      sessionStorage.getItem("login-init") === "true"
    ) {
      props.login(true);
      setAutoLoginStarted(true);
    }
    // login failed
    else if (props.user === "ERROR") {
      console.log("Error trying auto login");
      setCachedCredential(false);
      sessionStorage.removeItem("cp-persuasive-user");
      props.clearUser();
    }
    // login done
    else if (autoLoginStarted && props.user) setAutoLoginStarted(false);
  }, [props, cachedCredential, autoLoginStarted]);

  /**
   * Get user like list
   */
  useEffect(() => {
    if (!props.user || props.user === "ERROR") return;
    props.initFetch();
    props.getLikeList(props.user.id);
  }, [props.user]);

  /**
   * Fetch data (after likeList was fetched)
   */
  useEffect(() => {
    if (props.user && props.user !== "ERROR" && props.likeList) {
      props.fetchData(props.user.id, true);
    }
  }, [props.user, props.likeList]);

  return (
    <React.Fragment>
      <div className="homepage-content">
        {!props.fetchDone ||
        (cachedCredential && !props.user && props.user !== "ERROR") ||
        autoLoginStarted ? (
          <Spinner />
        ) : null}

        {!props.user ? (
          <React.Fragment>
            <div className="homepage-buttons">
              <div className="login-display">
                {!cachedCredential && !autoLoginStarted ? (
                  <Button
                    color="primary"
                    text="Login"
                    className="buttons login"
                    click={loginButtonClick}
                  />
                ) : null}
              </div>
            </div>
          </React.Fragment>
        ) : null}

        {props.user && !props.searching ? (
          <React.Fragment>
            <div id="recommendation-container">
              <TextDisplay text="Produtos" headingType="h5" />
            </div>
            {generateSells}
          </React.Fragment>
        ) : null}
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    fetchDone: state.fetchDone,
    searching: state.searching,
    likeList: state.userLikes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (value) => dispatch(ReducerAPI.tryLogin(value)),
    initFetch: () => dispatch({ type: actionTypes.START_FETCH }),
    fetchData: (uId, limit = false) =>
      dispatch(ReducerAPI.fetchOtherSells(uId, limit)),
    getLikeList: (uId) => dispatch(ReducerAPI.getUserLikeList(uId)),
    clearUser: () => dispatch({ type: actionTypes.LOGIN_USER, data: null }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
