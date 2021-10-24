import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import Card from "./Card";


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

it("card displays correct information", () => {
  act(() => {
    render(<Card value={123} 
            docData={{
                title: "Iphone 13"
            }} />, container);
  });

  const cardTitle = document.getElementById("card-title");
  expect(cardTitle.innerHTML).toBe("Iphone 13");

});