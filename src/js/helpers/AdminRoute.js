import React from 'react';
import _ from 'lodash';
import { Route, Redirect } from 'react-router-dom';

const AdminRoute = ({ component: Component, ...rest }) => {
  const admin = _.isUndefined(rest.location.state) ? null : rest.location.state.admin;

  return (<Route
    {...rest}
    render={props =>
      admin && (admin.role === 'manager' || admin.role === 'admin' || admin.role === 'god') ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/404",
            state: { from: props.location }
          }}
        />
      )
    }
  />);
};

export default AdminRoute;
