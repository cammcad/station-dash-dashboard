const React = require("react");
const ReactDOM = require("react-dom");
const { app } = require("./dashboard");

const App = () =>
  React.createElement("div", {}, [
    React.createElement("h1", {}, "Transfer Stations"),
    React.createElement(
      "div",
      {},
      React.createElement("ul", { id: "stations" })
    ),
  ]);

ReactDOM.render(React.createElement(App), document.getElementById("root"));

let s = document.getElementById("stations");
const facilities = app();
facilities.forEach((facility) => {
  let item = document.createElement("li");
  item.append(facility);
  s.append(item);
});
