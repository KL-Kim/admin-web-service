import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

// Redux Store
import configureStore from './stores/store';

// Private Route Components
import AdminRoute from './helpers/AdminRoute';
import ManagerRoute from './helpers/ManagerRoute';

// React Compontens
import HomePage from './components/HomePage';
import NoMatchPage from './components/404';
import SigninPage from './components/SigninPage';
import DashboardPage from './components/DashboardPage';
import BusinessListPage from './components/BusinessList';
import SingleBusinessPage from './components/SingleBusinessPage';
import CategoriesList from './components/CategoriesList';
import TagsList from './components/TagsList';
import ReviewsList from './components/ReviewsList';
import PostsList from './components/PostsList';
import CommentsList from './components/CommentsList';
import UsersList from './components/UsersList';
import NotificationPage from './components/NotificationPage'

import { loadFromStorage } from './helpers/webStorage';
import webStorageTypes from './constants/webStorage.types';

// Actions
import { getMyself } from './actions/user.actions';

const App = () => {
  const store = configureStore();

  const uid = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_KEY);

  if (uid) {
    store.dispatch(getMyself(uid));
  }

  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/signin" component={SigninPage} />
          <Route path="/notification" component={NotificationPage} />
          <ManagerRoute exact path="/dashboard" component={DashboardPage} />
          <ManagerRoute exact path="/business" component={BusinessListPage} />
          <ManagerRoute path="/business/s/:id" component={SingleBusinessPage} />
          <ManagerRoute path="/category" component={CategoriesList} />
          <ManagerRoute path="/tag" component={TagsList} />
          <ManagerRoute path="/review" component={ReviewsList} />
          <ManagerRoute path="/post" component={PostsList} />
          <ManagerRoute path="/comment" component={CommentsList} />
          <AdminRoute path="/user" component={UsersList} />


          {/*  Error Routes */}
          <Route component={NoMatchPage} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
