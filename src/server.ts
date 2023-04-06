import http from 'http';
import app from './app';
import {config} from './config';


app.listen(config.server.port, config.server.host , () => {
    console.log(`Server running on ${config.server.host}:${config.server.port}`);
});