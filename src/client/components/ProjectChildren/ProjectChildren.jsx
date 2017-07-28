import React from 'react';
import {SortableContainer} from 'react-sortable-hoc';

import SortableProject from '../Project/Project.sortable';
import ConnectedProject from '../Project/Project.connect';

/**
 * Projects sortable container
 */
// eslint-disable-next-line new-cap
export default SortableContainer(({className, projectIds, sortable}) =>
    <div className={className}>
        {projectIds.map((id, idx) => (
            sortable ?
                <SortableProject key={id} projectId={id} index={idx} />
                :
                // do not wrap into sortable if not in sorting mode,
                // to fix issue when wrapper state gets corrupted after
                // hiding sortable item
                // (repro: enable visibility configuration,
                // hide one of projects, disable visibility configuration,
                // enable again and try to change position of hidden project)
                // https://github.com/clauderic/react-sortable-hoc/issues/103 
                <ConnectedProject key={id} projectId={id} />
        ))}
    </div>
);