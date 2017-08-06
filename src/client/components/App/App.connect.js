import {connect} from 'react-redux';
import Component from './App';
import onInit from 'client/state/projects/actions/on-init';

export default connect(
    state => ({
        rootProject: state.rootProject
    }),
    dispatch => ({
        onComponentDidMount: () => {
            dispatch(onInit());
        }
    })
)(Component);