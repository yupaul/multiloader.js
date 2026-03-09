(function (window) {
  function _load_next(queue, cb) {
    if (queue.length === 0) {
      cb();
      return;
    }

    const item = queue[0];
    const remaining = queue.slice(1);
    let src, fallbacks;

    if (typeof item === 'string') {
      src = item;
      fallbacks = [];
    } else if (Array.isArray(item) && item.length > 0 && typeof item[0] === 'string') {
      src = item[0];
      fallbacks = item.slice(1);
    } else {
      return;
    }

    const script = window.document.createElement('script');
    script.onload = () => _load_next(remaining, cb);
    script.onerror = fallbacks.length > 0
      ? () => _load_next([fallbacks, ...remaining], cb)
      : () => {};
    script.src = src;
    window.document.head.appendChild(script);
  }

  window.multiloader = function (...args) {
    const cb = args.length > 0 && typeof args[args.length - 1] === 'function'
      ? args.pop()
      : () => {};

    // Accept either a single array or variadic args
    const queue = args.length === 1 && Array.isArray(args[0]) ? args[0].slice() : args;

    if (queue.length > 0) _load_next(queue, cb);
  };
})(window);
