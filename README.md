Feature prototype for TC.  

Proof of concept: visibility configuration can be implemented entirely inside main projects list (instead of separate popup)
- for user: no distraction from separate UI control, using familiar UX of project list  
- for developer: less to maintain, reusing tree rendering and search logic

Show me
---
![gif](https://user-images.githubusercontent.com/671082/29008651-568fd3fa-7b23-11e7-9bbb-294c9d0ba03e.gif)

Install
---
```
git clone https://github.com/artin-phares/pvc
cd pvc
npm install
npm run serve
```

Config
---
config.js:  

`projectsService.defaultUrl` - URL of service to load projects from  
`server.host` / `server.port` - hosting params (default `Listening at 0.0.0.0:3000`)

Tasks
---
`npm run serve` - prod build and serve  
`npm run build` - just prod build  

`npm start` / `npm run watch` - dev build (watch mode)  [has issue [#13](https://github.com/artin-phares/pvc/issues/13)]  
`npm run test` - run unit tests  
`npm run test:watch` - run unit tests (watch mode)
