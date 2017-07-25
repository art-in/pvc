export const types = {
    PROJECTS_LOADED: 'projects loaded'
};

/**
 * Handles on app init event
 * @return {function}
 */
export const onInit = () => async dispatch => {

    const response = await fetch('api/projects');
    const data = await response.json();

    dispatch({
        type: types.PROJECTS_LOADED,
        data: data.projects.project
    });
};