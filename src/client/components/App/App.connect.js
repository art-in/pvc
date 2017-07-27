import {connect} from 'react-redux';
import Component from './App';
import * as projects from '../../state/projects/actions';

export default connect(
    state => ({
        rootProject: state.rootProject
    }),
    dispatch => ({
        onComponentDidMount: () => {
            dispatch(projects.onInit());
        }
    })
)(Component);