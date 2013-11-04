# `diehard`

Diehard is a node.js module that helps you gracefully clean up your program at termination with multiple sync and/or async handlers. Wraps the [`death`](https://github.com/jprichardson/node-death) npm module.

# Why?

[`death`](https://github.com/jprichardson/node-death) is an incredibly useful module that abstracts out the need to handle the various kinds of termination events, but ultimately only supports a single handler. I've found that in more complex projects you often have multiple loose ends to clean up, and I desired a solution that would allow me to properly isolate the responsibility for cleaning up each individual resource into dedicated handlers that would are run in parallel. `diehard` solves that problem.

# Usage

```javascript
var diehard = require('diehard');

setTimeout(function () {
  console.log('Blah blah blah.'); // keeps running until we CTRL+C
}, 250);

diehard(function () {
  //TODO: clean up some resource
  // this is a synchronous handler
});

diehard(function (done) {
  //TODO: clean up some resource
  done(); // async, ftw!
});

diehard(function (signal, done) {
  //TODO: clean up some resource
  // we also have the `signal` that terminated the process here, in case we care
  done();
});

diehard(function (signal, uncaughtErr, done) {
  //TODO: clean up some resource
  // if an uncaught error was the reason the process is terminating, we can access that, too
  done();
});
```

In the above example, all five termination handlers will be run (in parallel) before the process exits.

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)

## Author

[Troy Goode](https://github.com/TroyGoode) ([troygoode@gmail.com](mailto:troygoode@gmail.com))

