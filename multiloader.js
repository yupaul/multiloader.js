(function (window) {
  // Map of already loaded script sources, e.g. { 'https://example.com/a.js': true }.
  // Kept on window so every multiloader call (and every copy of this file) sees it.
  window._multiloader_loaded = window._multiloader_loaded || {};

  function _is_loaded(src) {
    return Object.prototype.hasOwnProperty.call(window._multiloader_loaded, src) &&
      window._multiloader_loaded[src] === true;
  }

  function _mark_loaded(srcs) {
    srcs.forEach((src) => {
      window._multiloader_loaded[src] = true;
    });
  }

  // Parses a queue item into { srcs, once, _all } or null if it is not valid.
  // Backward compatible forms:
  //   'a.js'
  //   ['a.js', 'b.js']                              (alternatives)
  // New forms:
  //   { src: 'a.js' }
  //   { src: ['a.js', 'b.js'] }                     (src may be a list)
  //   { src: 'a.js', once: true }
  //   { src: ['a.js', 'b.js'], once: true }
  function _parse(item) {
    let srcs;
    let once = false;

    if (typeof item === 'string') {
      srcs = [item];
    } else if (Array.isArray(item) && item.length > 0 && typeof item[0] === 'string') {
      srcs = item.slice();
    } else if (item && typeof item === 'object' && item.src !== undefined) {
      if (typeof item.src === 'string') {
        srcs = [item.src];
      } else if (Array.isArray(item.src) && item.src.length > 0 && typeof item.src[0] === 'string') {
        srcs = item.src.slice();
      } else {
        return null;
      }
      once = item.once === true;
    } else {
      return null;
    }

    // _all keeps every alternative of the original item, so that all of them
    // are flagged once any one of them loads (also across fallback retries).
    const all = item && Array.isArray(item._all) ? item._all : srcs.slice();
    return { srcs, once, _all: all };
  }

  function _load_next(queue, cb) {
    if (queue.length === 0) {
      cb();
      return;
    }

    const item = _parse(queue[0]);
    const remaining = queue.slice(1);

    if (item === null) {
      // Invalid entry: skip it instead of aborting the whole queue.
      return _load_next(remaining, cb);
    }

    if (item.once && item.srcs.some(_is_loaded)) {
      // One of the alternatives was already loaded by a previous call.
      return _load_next(remaining, cb);
    }

    const src = item.srcs[0];
    const fallbacks = item.srcs.slice(1);

    const script = window.document.createElement('script');
    script.onload = () => {
      _mark_loaded(item._all);
      _load_next(remaining, cb);
    };
    script.onerror = fallbacks.length > 0
      ? () => _load_next([{ src: fallbacks, once: item.once, _all: item._all }, ...remaining], cb)
      : () => {};
    script.src = src;
    window.document.head.appendChild(script);
  }

  window.multiloader = function (...args) {
    const cb = args.length > 0 && typeof args[args.length - 1] === 'function'
      ? args.pop()
      : () => {};

    const queue = args.length === 1 && Array.isArray(args[0]) ? args[0].slice() : args;

    if (queue.length > 0) _load_next(queue, cb);
  };
})(window);
