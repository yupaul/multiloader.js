(function(_window) {	
	_window.multiloader = function() {
		let src;
		const _self = arguments.callee;
		let _args = [].slice.call(arguments); 

		const _had_state = _args.length > 1 && _args[_args.length - 1] === true ? _args.pop() : false;
		
		const callback = _args.length > 1 && typeof _args[_args.length - 1] === 'function' ? _args.pop() : (new Function);

		if(_args.length < 1) return;
		if(_args.length > 1 || (!_had_state && Array.isArray(_args[0]) && _args[0].length > 1)) return _self(_args, callback, true);

		let arg0 = _args[0];

		const a_rest = Array.isArray(arg0) ? arg0.splice(1) : [];
		const s = _window.document.createElement('script');
		if(a_rest.length > 0) {
			s.onload = () => _self(a_rest, callback, true);
		} else {
			s.onload = callback;
		}
		if(typeof arg0 === 'string') {
			src = arg0;
		} else {
			if(!arg0.hasOwnProperty('0')) return;
			let arg00 = arg0[0];
			if(Array.isArray(arg00)) {
				const arg0_rest = arg00.splice(1);
				if(arg0_rest.length > 0) {
					s.onerror = () => {
						let _a_rest = [].slice.call(a_rest);
						_a_rest.unshift(arg0_rest);
						_self(_a_rest, callback, true);
					};
				}
				src = arg00[0];
			} else {
				src = arg00;
			}
			if(typeof src !== 'string') return;
		}
		s.src = src;
		_window.document.getElementsByTagName('head')[0].appendChild(s);
	}
})(window);
