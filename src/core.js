/* Core Types & Functions (which enable functional programs) */

/* Types */

const None = (x) => ({
  type: "None",
  contents: () => x,
  chain: (f) => None(x),
  map: (f) => None(x),
  fold: (f, g) => f(x),
  inspect: () => `None(${x})`,
});

const Some = (x) => ({
  type: "Some",
  contents: () => x,
  chain: (f) => f(x),
  map: (f) => Some(f(x)),
  fold: (f, g) => g(x),
  inspect: () => `Some(${x})`,
});

/* Functions */

const compose = (f, g) => (x) => f(g(x));
const fromNullable = (x) => (x != null || undefined ? Some(x) : None(null));
const id = (x) => x;
const isNone = (x) => x.type === "None";

module.exports = { Some, None, fromNullable, isNone, id, compose };
