import express from 'express';
import path from 'path';
import logger from 'morgan';
import {getProjects} from './projects-service';

import config from '../../config';

const app = express();

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '../client')));

app.get('/api/projects', async (req, res) => {
    try {
        const projects = await getProjects();
        res.send(projects);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

const {host, port} = config.server;
app.listen(port, host, function(err) {
    if (err) {
        throw Error(err);
    }
    console.log(`Listening at ${host}:${port}`);
});