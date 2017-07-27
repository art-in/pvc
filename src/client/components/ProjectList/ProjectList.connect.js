import {connect} from 'react-redux';
import Component from './ProjectList';

import * as projects from '../../state/projects/actions';

export default connect(
    state => ({
        rootProject: state.rootProject,
        isConfiguring: state.isConfiguringVisibility
    }),
    dispatch => ({
        onStartConfiguration: () =>
            dispatch(projects.startConfiguration()),
        onStopConfiguration: () =>
            dispatch(projects.stopConfiguration())
    })
)(Component);