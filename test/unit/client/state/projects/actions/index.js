import * as mockFetch from 'test/utils/mock-fetch';

describe('actions', () => {

    after(() => {
        mockFetch.restore();
    });

    require('./load-children.test');
    require('./collapse-project.test');
    require('./expand-project.test');
    require('./collapse-all.test');
    require('./expand-all.test');
    require('./show-project.test');
    require('./hide-project.test');
    require('./move-project-up.test');
    require('./move-project-down.test');
    require('./move-project.test');
    require('./search.test');

});