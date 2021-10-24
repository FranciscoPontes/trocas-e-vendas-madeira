import React, { useState, useEffect } from "react";
import Button from "../UI/Button";
import "./HomePage.css";
import { connect, useSelector } from "react-redux";
import * as ReducerAPI from "../ReduxStore/reducer";
import Card from "../UI/Card/Card";
import Spinner from "../UI/Spinner";
import * as actionTypes from "../ReduxStore/actionTypes";
import TextDisplay from "../UI/TextDisplay";

const getCredential = () => sessionStorage.getItem("cp-persuasive-user");

const HomePage = (props) => {
  const {user, likeList} = props;
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
    // auto login - credential remembered via sessionStorage
    if (getCredential() && !user) loginButtonClick();
    // manual login
    else if (
      !getCredential() &&
      !user &&
      sessionStorage.getItem("login-init") === "true"
    ) {
      props.login(true);
      setAutoLoginStarted(true);
    }
    // login failed
    else if (user === "ERROR") {
      console.log("Error trying auto login");
      sessionStorage.removeItem("cp-persuasive-user");
      props.clearUser();
    }
    // login done
    else if (autoLoginStarted && user) setAutoLoginStarted(false);
  }, [props, getCredential(), autoLoginStarted]);

  /**
   * Get user like list
   */
  useEffect(() => {
    if (!user || user === "ERROR") return;
    props.initFetch();
    props.getLikeList(user.id);
  }, [user]);

  /**
   * Fetch data (after likeList was fetched)
   */
  useEffect(() => {
    if (user && user !== "ERROR" && likeList) {
      props.fetchData(user.id, true);
    }
  }, [user, likeList]);

  return (
    <React.Fragment>
      <div className="homepage-content">
        {!props.fetchDone ||
        (getCredential() && !user && user !== "ERROR") ||
        autoLoginStarted ? (
          <Spinner />
        ) : null}

        {!user ? (
          <React.Fragment>
            <div className="homepage-buttons">
              <div className="login-display">
                {!getCredential() && !autoLoginStarted ? (
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

        {user && !props.searching ? (
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
