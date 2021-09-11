import React, { useState, useEffect } from "react";
import Button from "../UI/Button";
import "./HomePage.css";
import { connect } from "react-redux";
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

  const [fetchWithPersonalization, setFetchWithPersonalization] =
    useState(false);

  const [recommendedSells, setRecommendedSells] = useState(null);

  const [notRecommendedSells, setNotRecommendedSells] = useState(null);

  const redirect = (path) => {
    props.history.replace(path);
  };

  const loginButtonClick = () => props.login();

  const generateSells = () => (
    <div className="sells-content">
      {recommendedSells.map((sell) => (
        <Card key={sell.docId} docData={sell} value={sell.docId} />
      ))}
    </div>
  );

  useEffect(() => {
    if (
      props.user &&
      props.user !== "ERROR" &&
      props.likeList &&
      !fetchWithPersonalization
    ) {
      props.fetchData(props.user.id, true);
    }
  }, [props.user, props.likeList, fetchWithPersonalization]);

  useEffect(() => {
    if (cachedCredential && !props.user) loginButtonClick();
    else if (
      !cachedCredential &&
      !props.user &&
      sessionStorage.getItem("login-init") === "true"
    ) {
      props.login(true);
      setAutoLoginStarted(true);
    } else if (props.user === "ERROR") {
      console.log("Error trying auto login");
      setCachedCredential(false);
      sessionStorage.removeItem("cp-persuasive-user");
      props.clearUser();
    } else if (autoLoginStarted && props.user) setAutoLoginStarted(false);
  });

  useEffect(() => {
    if (!props.user || props.user === "ERROR") return;
    props.initFetch();
    props.getLikeList(props.user.id);
  }, [props.user]);

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
              <TextDisplay text="Recomendados" headingType="h5" />
            </div>
            {recommendedSells ? (
              <React.Fragment>
                {generateSells()}
                <OtherSells notRecommendedSells={notRecommendedSells} />
              </React.Fragment>
            ) : null}
          </React.Fragment>
        ) : null}
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    // otherSells: state.otherSells,
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
