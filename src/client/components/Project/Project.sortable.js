import React from 'react';
import {SortableElement, SortableHandle} from 'react-sortable-hoc';

import ConnectedProject from './Project.connect';

import classes from './Project.css';

/**
 * Project sortable item
 */
// eslint-disable-next-line new-cap
export default SortableElement(({projectId}) =>
    <ConnectedProject
        projectId={projectId}
        // eslint-disable-next-line new-cap
        DragHandle={SortableHandle(() =>
            <span
                className={classes['drag-handle']}
                title={'Move project'}>
                ::::
            </span>)}/>
);