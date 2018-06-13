import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class ProperName extends Component {
  render() {
    const { user } = this.props;

    const name = _.isEmpty(user) ? '' :((_.isEmpty(user.firstName) && _.isEmpty(user.lastName))
      ? user.username
      : ((_.isEmpty(user.firstName) ? '' : user.firstName) + ' ' + (_.isEmpty(user.lastName) ? '' : user.lastName)));

    return name;
  }
}

ProperName.propTypes = {
  "user": PropTypes.object.isRequired,
}

export default ProperName;
