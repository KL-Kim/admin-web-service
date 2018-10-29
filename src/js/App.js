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
import BusinessListPage from './components/BusinessListPage';
import SingleBusinessPage from './components/SingleBusinessPage';
import BusinessSamplePage from './components/BusinessSamplePage';
import CategoriesListPage from './components/CategoriesListPage';
import TagsListPage from './components/TagsListPage';
import ReviewsListPage from './components/ReviewsListPage';
import PostsListPage from './components/PostsListPage';
import SinglePostPage from './components/SinglePostPage';
import CommentsListPage from './components/CommentsListPage';
import UsersListPage from './components/UsersListPage';
import SingleUserPage from './components/SingleUserPage';
import NotificationPage from './components/NotificationPage'
import ErrorsListPage from './components/ErrorsListPage';
import SearchesListPage from './components/SearchesListPage';

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
          <AdminRoute path="/category" component={CategoriesListPage} />
          <AdminRoute path="/tag" component={TagsListPage} />
          <AdminRoute path="/review" component={ReviewsListPage} />
          <AdminRoute path="/post/s/:id" component={SinglePostPage} />
          <AdminRoute path="/post" component={PostsListPage} />
          <AdminRoute path="/comment" component={CommentsListPage} />
          <AdminRoute exact path="/user" component={UsersListPage} />
          <AdminRoute path="/user/s/:username" component={SingleUserPage} />
          <AdminRoute path="/error" component={ErrorsListPage} />
          <AdminRoute path="/query" component={SearchesListPage} />

          {/*  Error Routes */}
          <Route component={NoMatchPage} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
