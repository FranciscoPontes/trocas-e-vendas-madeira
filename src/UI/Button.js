import React from "react";
import Button from "@material-ui/core/Button";

const CustomButton = (props) => (
  <Button
    variant="contained"
    color={props.color}
    className={props.className}
    onClick={props?.click}
    size={props.size || "large"}
  >
    {props.text}
  </Button>
);

export default CustomButton;
