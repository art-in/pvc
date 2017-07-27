import projects from './projects/handlers';
import initialState from './initial-state';

export default (state = initialState, action) => {
    state = projects(state, action);
    return state;
};