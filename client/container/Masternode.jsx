import Actions from '../core/Actions';
import Component from '../core/Component';
import MasternodesList from '../component/MasternodesList';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ChartComponent from '../component/ChartComponent'
import { TimeIntervalType } from '../../lib/timeInterval'
import HorizontalRule from '../component/HorizontalRule';

class Masternode extends Component {
  static propTypes = {
    getMNs: PropTypes.func.isRequired
  };
  render() {
    return (
      <div>
        <MasternodesList title="Masternodes" isPaginationEnabled={true} getMNs={this.props.getMNs} />
      </div>
    );
  };
}

const mapDispatch = dispatch => ({
  getMNs: query => {
    return Actions.getMNs(query);
  }
});

export default connect(null, mapDispatch)(Masternode);
