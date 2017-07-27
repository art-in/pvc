import express from 'express';
import wrap from './utils/express-async-wrapper';
import {getProjects} from './service';

const api = new express.Router();

api.get('/projects', wrap(async (req, res) => {
    const projects = await getProjects();
    res.send(projects);
}));

export default api;