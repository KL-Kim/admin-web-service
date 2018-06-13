import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import reducers from '../reducers';

// Dev
import DevTools from '../components/utils/DevTools';

const configureState = (preloadedState) => {
  const loggerMiddleware = createLogger();
  const store =createStore(reducers, compose(applyMiddleware(thunkMiddleware, loggerMiddleware), DevTools.instrument()));

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(reducers);
    });
  }

  return store;
}

export default configureState;
