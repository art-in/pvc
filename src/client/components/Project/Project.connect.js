import {connect} from 'react-redux';
import Component from './Project';
import * as projects from '../../state/projects/actions';
import findProject from 'shared/utils/traversing/find-project';

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
        project: findProject(state.rootProject, ownProps.projectId),

        isConfiguring: state.isConfiguringVisibility
    }),
    dispatch => ({
        onExpand: projectId =>
            dispatch(projects.expandProject(projectId)),
        onCollapse: projectId =>
            dispatch(projects.collapseProject(projectId)),
        onShow: projectId =>
            dispatch(projects.showProject(projectId)),
        onHide: projectId =>
            dispatch(projects.hideProject(projectId))
    })
)(Component);