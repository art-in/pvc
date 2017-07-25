import fetch from 'node-fetch';
import parseXml from '../utils/xml-parser';
import config from '../../../config';
import types from 'prop-types';
import checkTypes from 'check-prop-types';

/**
 * Gets projects from service
 * @return {object}
 */
export async function getProjects() {
    const {defaultUrl, path} = config.projectsService;

    // 'content-type: application/json' does not take effect on service
    // 'application/xml' received anyway
    const response = await fetch(`${defaultUrl}${path}`);

    const contentType = response.headers.get('content-type');
    let data;

    switch (contentType) {
    case 'application/xml': {
        const xml = await response.text();
        data = await parseAndNormalizeXml(xml);
        break;
    }
    default:
        throw Error(`Unknown content type of response: "${contentType}"`);
    }

    validateProjectsResponse(data);

    return data;
}

/**
 * Parses and normalizes projects XML
 * @param {string} xml - projects XML
 * @return {object}
 */
async function parseAndNormalizeXml(xml) {
    const data = await parseXml(xml);
            
    // normalize
    data.projects.project = Array.isArray(data.projects.project)
        ? data.projects.project
        : [data.projects.project];

    data.projects.project.forEach(p => p.buildTypes.buildType =
        Array.isArray(p.buildTypes.buildType) ?
            p.buildTypes.buildType :
            [p.buildTypes.buildType]);

    return data;
}

/**
 * Validates projects object schema
 * @param {object} data
 */
function validateProjectsResponse(data) {

    const stringOrNumber = types.oneOfType([types.string, types.number]);

    const schema = {
        projects: types.shape({
            project: types.arrayOf(types.shape({
                id: stringOrNumber.isRequired,
                name: stringOrNumber.isRequired,
                buildTypes: types.shape({
                    buildType: types.arrayOf(types.shape({
                        id: stringOrNumber.isRequired,
                        name: stringOrNumber.isRequired
                    }))
                })
            }))
        }).isRequired
    };

    const error = checkTypes(schema, data, null, 'projects service response');

    if (error) {
        throw Error(error);
    }
}