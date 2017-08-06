import {connect} from 'react-redux';
import Component from './Project';
import findProject from 'shared/utils/traversing/find-project';

import expandProject from 'client/state/projects/actions/expand-project';
import collapseProject from 'client/state/projects/actions/collapse-project';
import showProject from 'client/state/projects/actions/show-project';
import hideProject from 'client/state/projects/actions/hide-project';
import moveProjectUp from 'client/state/projects/actions/move-project-up';
import moveProjectDown from 'client/state/projects/actions/move-project-down';
import moveProject from 'client/state/projects/actions/move-project';

export default connect(
    (state, ownProps) => ({
        // get project data from state instead of direct props,
        // because this allows to implement render optimization.
        // - in case project data passed through props we cannot
        //   use 'shouldComponentUpdate' to prevent re-render, because
        //   returning 'false' from root component will prevent re-render
        //   of the whole tree.
        // - in case project data passed through state,
        //   each component is directly connected to its own state fragment,
        //   and redux will force component update on that fragment change.
        //   in this case re-render will be called separately on each project 
        //   component, which allows us to use 'shouldComponentUpdate'
        project: findProject(state.visibleRootProject, ownProps.projectId),

        isConfiguring: state.isConfiguringVisibility,
        isFiltering: state.filter.projectIds !== null ||
            state.filter.buildTypeIds !== null,

        collapsable: ownProps.collapsable,
        movable: ownProps.movable,

        searchStr: state.search.str,

        useDragAndDrop: state.useDragAndDrop,
        DragHandle: ownProps.DragHandle
    }),
    dispatch => ({
        onExpand: projectId =>
            dispatch(expandProject(projectId)),
        onCollapse: projectId =>
            dispatch(collapseProject(projectId)),
        onShow: projectId =>
            dispatch(showProject(projectId)),
        onHide: projectId =>
            dispatch(hideProject(projectId)),
        onMoveUp: projectId =>
            dispatch(moveProjectUp(projectId)),
        onMoveDown: projectId =>
            dispatch(moveProjectDown(projectId)),
        onMove: (projectId, {oldIndex, newIndex}) =>
            dispatch(moveProject(projectId, oldIndex, newIndex))
    })
)(Component);