import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import CustomButton from "./Button";


let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("button has correct class and it is clicked the correct number of times", () => {
    const className="Test classname";
    const onClick = jest.fn();
  act(() => {
    render(<CustomButton className={className} click={onClick} />, container);
  });

  const button = document.getElementById("custom-button-id");
  
  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }))
  })

  expect(onClick).toHaveBeenCalledTimes(1)

  expect(button.className).toContain(className);

});