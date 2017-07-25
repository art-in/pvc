import projects from './projects/handlers';
import defaultState from './default-state';

export default (state = defaultState, action) => {
    state = projects(state, action);
    return state;
};