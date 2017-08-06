import fetch from 'node-fetch';
import parseXml from '../utils/xml-parser';
import config from '../../../config';
import types from 'prop-types';
import checkTypes from 'check-prop-types';
import buildTree from '../../shared/utils/traversing/build-tree';

import mock from './mock/response.json';

/**
 * Gets projects from service
 * @return {object}
 */
export async function getProjects() {
    try {
        return await loadAndParseProjects();
    } catch (e) {
        console.error(
            `Error: unable to load projects from service: ${e.message}'`);
        console.warn('Using projects mock');
        return mock;
    }
}

/**
 * Loads and parses projects tree from service
 * @return {object}
 */
async function loadAndParseProjects() {

    const {defaultUrl, path} = config.projectsService;

    // 'content-type: application/json' does not take effect on service
    // 'application/xml' received anyway
    const response = await fetch(`${defaultUrl}${path}`);

    const contentType = response.headers.get('content-type');
    let data;

    switch (contentType) {
    case 'application/xml': {
        const xml = await response.text();
        data = await parseXml(xml);
        data = normalizeProjects(data);
        break;
    }
    default:
        throw Error(`Unknown content type of response: '${contentType}'`);
    }

    validateProjectsResponse(data);

    data = buildTree(data);

    return data;
}

/**
 * Normalizes projects data
 * @param {string} data - projects data
 * @return {object}
 */
function normalizeProjects(data) {

    // projects should be array
    data.projects.project = Array.isArray(data.projects.project)
        ? data.projects.project
        : [data.projects.project];

    data.projects.project.forEach(p => {

        p.buildTypes.buildType = p.buildTypes.buildType || [];

        // build types should be array
        p.buildTypes =
            Array.isArray(p.buildTypes.buildType) ?
                p.buildTypes.buildType :
                [p.buildTypes.buildType];
        
        // parent project id should not be inside object
        if (p.parentProject) {
            p.parentProjectId = p.parentProject.id;
        }
    });

    // map to remove unnecessary data
    data.projects.project = data.projects.project
        .map(p => ({
            id: p.id,
            name: p.name,
            parentProjectId: p.parentProjectId,
            buildTypes: p.buildTypes.map(b => ({
                id: b.id,
                name: b.name
            })),

            // add visibility params
            vis: {
                collapsed: true,
                visible: true
            }
        }));

    return data;
}

/**
 * Validates projects object schema
 * @param {object} projects
 */
function validateProjectsResponse(projects) {

    const schema = {
        projects: types.shape({
            project: types.arrayOf(types.shape({
                id: types.string.isRequired,
                name: types.string.isRequired,
                parentProjectId: types.string,
                buildTypes: types.arrayOf(types.shape({
                    id: types.string.isRequired,
                    name: types.string.isRequired
                })),
                childProjects: types.arrayOf(types.object)
            }))
        }).isRequired
    };

    const error = checkTypes(
        schema,
        projects,
        null,
        'projects service response');

    if (error) {
        throw Error(error);
    }
}