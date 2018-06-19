import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

// Redux Store
import configureStore from './stores/store';

// Private Route Components
import AdminRoute from './helpers/AdminRoute';

// React Compontens
import HomePage from './components/HomePage';
import NoMatchPage from './components/404';
import SigninPage from './components/SigninPage';
import DashboardPage from './components/DashboardPage';
import BusinessListPage from './components/BusinessList';
import SingleBusinessPage from './components/SingleBusinessPage';
import BusinessSamplePage from './components/BusinessSamplePage';
import CategoriesList from './components/CategoriesList';
import TagsList from './components/TagsList';
import ReviewsList from './components/ReviewsList';
import PostsList from './components/PostsList';
import CommentsList from './components/CommentsList';
import UsersList from './components/UsersList';
import SingleUserPage from './components/SingleUserPage';
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
          <AdminRoute exact path="/dashboard" component={DashboardPage} />
          <AdminRoute exact path="/business" component={BusinessListPage} />
          <AdminRoute path="/business/s/:slug" component={SingleBusinessPage} />
          <AdminRoute path="/business/sample/:slug" component={BusinessSamplePage} />
          <AdminRoute path="/category" component={CategoriesList} />
          <AdminRoute path="/tag" component={TagsList} />
          <AdminRoute path="/review" component={ReviewsList} />
          <AdminRoute path="/post" component={PostsList} />
          <AdminRoute path="/comment" component={CommentsList} />
          <AdminRoute exact path="/user" component={UsersList} />
          <AdminRoute path="/user/s/:username" component={SingleUserPage} />

          {/*  Error Routes */}
          <Route component={NoMatchPage} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
