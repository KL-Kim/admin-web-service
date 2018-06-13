import React from 'react';
import _ from 'lodash';
import { Route, Redirect } from 'react-router-dom';

const ManagerRoute = ({ component: Component, ...rest }) => {
  const user = _.isUndefined(rest.location.state) ? null : rest.location.state.user;

  return (<Route
    {...rest}
    render={props =>
      user && (user.role === 'manager' || user.role === 'admin' || user.role === 'god') ? (
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

export default ManagerRoute;
