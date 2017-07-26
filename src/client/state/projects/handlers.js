import {types} from './actions';
import {clone} from '../helpers';

export default (oldState, action) => {

    const state = clone(oldState);

    switch (action.type) {
    case types.PROJECTS_LOADED:
        state.projects = action.data;
        break;

    default:
        return oldState;
    }

    return state;
};