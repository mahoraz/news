import http from 'http';
import app from './app';
import {config} from './config';

class News {
    articleName: String;
    constructor(name: String){
        this.articleName = name;
    }

    getInfo(){
        return `Article ${this.articleName}`;
    }

    save(){

    }
}



app.listen(config.server.port, config.server.host , () => {
    console.log(`Server running on ${config.server.host}:${config.server.port}`);
});