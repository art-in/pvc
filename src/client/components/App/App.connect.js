import {connect} from 'react-redux';
import Component from './App';
import * as projects from '../../state/projects/actions';

const connected = connect(
    state => ({
        projects: state.projects
    }),
    dispatch => ({
        onComponentDidMount: () => {
            dispatch(projects.onInit());
        }
    })
)(Component);

export default connected;