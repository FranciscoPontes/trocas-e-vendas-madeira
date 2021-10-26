import React, { Fragment, useEffect } from "react";
import { store } from "../index.js";

/**
 * Render child component only if user is logged in
 * @param ChildComponent the component to wrap
 * @returns
 */
export const withLoginDone =
  (ChildComponent) =>
  ({ ...props }) => {
    const state = store.getState();
    const { user } = state;
    console.log(user);
    // useEffect(() => {
    //   throw new Error("Testing error boundary in withLoginDone HOC");
    // }, []);

    return user ? <ChildComponent {...props} /> : null;
  };
