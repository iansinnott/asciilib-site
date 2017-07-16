export default function exposeGlobals(root, other) {
  Object.assign(root, other);
  root.Observable = require('rxjs').Observable;
  root.asciilib = {
    lib: require('asciilib').lib,
    ordered: require('asciilib').ordered,
    find: require('asciilib/find'),
  };
}
