var multiloader = function() {	
	var src;
	var _self = arguments.callee;
	var _args = [].slice.call(arguments); 
	var callback = _args.length > 1 && typeof _args[_args.length - 1] === 'function' ? _args.pop() : (new Function);

	if(_args.length > 1) return _self(_args, callback);
	if(_args.length !== 1) return;
	var a0 = _args[0];

	var a_rest = typeof a0 === 'string' ? [] : a0.splice(1);
	var s = document.createElement('script');
	if(a_rest.length > 0) {
		s.onload = function() {
			_self(a_rest, callback);
		};
	} else {
		s.onload = callback;
	}
	if(typeof a0 === 'string') {
		src = a0;
	} else {
		var a00 = a0[0];
		if(typeof a00 === 'object') {
			var a0_rest = a00.splice(1);
			if(a0_rest.length > 0) {
				s.onerror = function() {
					var _a_rest = [].slice.call(a_rest);
					_a_rest.unshift(a0_rest);
					_self(_a_rest, callback);
				};
			}
			src = a00[0];
		} else {
			src = a00;
		}
	}
	s.src = src;
	document.getElementsByTagName('head')[0].appendChild(s);
};
