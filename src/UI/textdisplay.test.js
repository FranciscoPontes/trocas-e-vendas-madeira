import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import TextDisplay from "./TextDisplay";


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

it("text shows correct content", () => {
    const testLabel = "Basic test"
  act(() => {
    render(<TextDisplay text={testLabel} />, container);
  });

  const text = document.getElementById("text-display-id");
  expect(text.innerHTML).toBe(testLabel);

});