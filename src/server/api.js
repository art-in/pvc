import express from 'express';
import wrap from './utils/express-async-wrapper';
import {getProjects} from './service';
import * as sessionStorage from './session/storage';

import collapseProject from '../shared/utils/traversing/collapse-project';
import expandProject from '../shared/utils/traversing/expand-project';
import showProject from '../shared/utils/traversing/show-project';
import hideProject from '../shared/utils/traversing/hide-project';
import moveProject from '../shared/utils/traversing/move-project';

const api = new express.Router();

api.get('/projects',
    wrap(async (req, res) => {
        const projects = await getProjectsForSession(req);
        res.send(projects);
    }));

api.put('/projects/:projectId/vis/collapsed',
    wrap(async (req, res) => {
        const {projectId} = req.params;
        const rootProject = await getProjectsForSession(req);
        collapseProject(rootProject, projectId);
        res.status(200).send();
    }));

api.delete('/projects/:projectId/vis/collapsed',
    wrap(async (req, res) => {
        const {projectId} = req.params;
        const rootProject = await getProjectsForSession(req);
        expandProject(rootProject, projectId);
        res.status(200).send();
    }));

api.put('/projects/:projectId/vis/visible',
    wrap(async (req, res) => {
        const {projectId} = req.params;
        const rootProject = await getProjectsForSession(req);
        showProject(rootProject, projectId);
        res.status(200).send();
    }));

api.delete('/projects/:projectId/vis/visible',
    wrap(async (req, res) => {
        const {projectId} = req.params;
        const rootProject = await getProjectsForSession(req);
        hideProject(rootProject, projectId);
        res.status(200).send();
    }));

api.patch('/projects/:parentProjectId/child-projects/positions',
    wrap(async (req, res) => {
        const {parentProjectId} = req.params;
        const rootProject = await getProjectsForSession(req);
        const {oldIdx, newIdx} = req.body;
        moveProject(rootProject, parentProjectId, oldIdx, newIdx);
        res.status(200).send();
    }));

/**
 * Gets projects tree for passed session id
 * @param {object} req - request
 * @return {object} root project of projects tree
 */
async function getProjectsForSession(req) {
    
    const sessionId = req.query.session;
    if (!sessionId) {
        throw Error('Session ID not specified');
    }

    const sessionData = sessionStorage.get(sessionId);
    
    let rootProject;

    if (sessionData) {
        console.log('get projects from session');
        rootProject = sessionData.rootProject;
    } else {
        console.log('get projects from service');
        rootProject = await getProjects();
        sessionStorage.set(sessionId, {rootProject});
    }

    return rootProject;
}

export default api;