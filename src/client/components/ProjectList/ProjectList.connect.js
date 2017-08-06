import {connect} from 'react-redux';
import Component from './ProjectList';

import startConfig from 'client/state/projects/actions/start-configuration';
import stopConfig from 'client/state/projects/actions/stop-configuration';
import collapseAll from 'client/state/projects/actions/collapse-all';
import expandAll from 'client/state/projects/actions/expand-all';
import search from 'client/state/projects/actions/search';

export default connect(
    state => ({
        rootProject: state.visibleRootProject,
        isConfiguring: state.isConfiguringVisibility,
        isSearching: state.search.running
    }),
    dispatch => ({
        onStartConfiguration: () =>
            dispatch(startConfig()),
        onStopConfiguration: () =>
            dispatch(stopConfig()),
        onCollapseAll: () =>
            dispatch(collapseAll()),
        onExpandAll: () =>
            dispatch(expandAll()),
        onSearch: searchStr =>
            dispatch(search(searchStr))
    })
)(Component);