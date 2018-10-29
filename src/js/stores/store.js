import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk';

// Dev Tools 
import { composeWithDevTools } from 'redux-devtools-extension';

// Production Build
import { compose } from 'redux';

import reducers from '../reducers';

const configureState = () => {
  
  const store =createStore(
    reducers, 
    composeWithDevTools(applyMiddleware(thunkMiddleware))
    // compose(applyMiddleware(thunkMiddleware))
  );

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(reducers);
    });
  }

  return store;
}

export default configureState;
