type State = Object;
class Store {
	constructor(reducer: Function, preloadedState: State){
		this.reducer = reducer;
		this.state = preloadedState;
		this.listeners = []
	}

	private state: State;
	private reducer: Function;
	
	getState(){
		return this.state;
	}

	replaceReducer(reducer: Function){
		this.reducer = reducer;
		this.dispatch({
			type: Store.actions.replace
		});
	}

	private listeners: Function[];

	dispatch(action) {
		try {
			this.state = this.reducer(this.state, action);
		} catch(e){}
		this.listeners.forEach(listener => listener());
		return action;
	}

	subscribe(listener) {
		this.listeners.push(listener);

		return () => {
			// в оригинальном redux indexOf тоже не проверяется на -1
			this.listeners.splice(this.listeners.indexOf(listener), 1);
		};
	}

	static actions = {
		replace: '@redux/replace'
	}
}

function createStore(reducer: Function, preloadedState: State, enhancer?: Function) {
	if (enhancer) {
		return enhancer(createStore)(reducer, preloadedState);
	}
	return new Store(reducer, preloadedState);
}
