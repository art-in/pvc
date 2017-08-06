import {connect} from 'react-redux';
import Component from './ProjectList';

import * as projects from '../../state/projects/actions';

export default connect(
    state => ({
        rootProject: state.visibleRootProject,
        isConfiguring: state.isConfiguringVisibility,
        isSearching: state.search.running
    }),
    dispatch => ({
        onStartConfiguration: () =>
            dispatch(projects.startConfiguration()),
        onStopConfiguration: () =>
            dispatch(projects.stopConfiguration()),
        onCollapseAll: () =>
            dispatch(projects.collapseAll()),
        onExpandAll: () =>
            dispatch(projects.expandAll()),
        onSearch: searchStr =>
            dispatch(projects.search(searchStr))
    })
)(Component);