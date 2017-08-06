import timer from 'shared/utils/timer';
import forEachProject from 'shared/utils/traversing/for-each-project';

import collapseProject from './collapse-project';

/**
 * Collapses all visible projects
 * @return {function}
 */
export default () => (dispatch, getState) => {
    const state = getState();
    const tasks = [];
    forEachProject(state.rootProject, p =>
        (state.isConfiguringVisibility || p.vis.visible) &&
        !p.vis.collapsed &&
        tasks.push(timer(() => dispatch(collapseProject(p.id)))));
    return Promise.all(tasks);
};