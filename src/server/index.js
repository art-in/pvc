import express from 'express';
import path from 'path';
import logger from 'morgan';

import config from '../../config';
import api from './api';

const app = express();

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '../client')));

app.use('/api', api);

const {host, port} = config.server;
app.listen(port, host, function(err) {
    if (err) {
        throw Error(err);
    }
    console.log(`Listening at ${host}:${port}`);
});