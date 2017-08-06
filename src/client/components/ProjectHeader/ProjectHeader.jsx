import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Marker from '../Marker';

import classes from './ProjectHeader.css';

export default class ProjectHeader extends Component {

    static propTypes = {
        name: PropTypes.string.isRequired,
        visible: PropTypes.bool.isRequired,

        isConfiguring: PropTypes.bool.isRequired,
        collapsed: PropTypes.bool.isRequired,
        searchStr: PropTypes.string,

        DragHandle: PropTypes.func,

        onExpand: PropTypes.func.isRequired,
        onCollapse: PropTypes.func.isRequired,

        onShow: PropTypes.func.isRequired,
        onHide: PropTypes.func.isRequired,

        onMoveUp: PropTypes.func.isRequired,
        onMoveDown: PropTypes.func.isRequired
    }

    render() {
        const {isConfiguring, collapsed, onExpand, onCollapse} = this.props;
        const {name, visible, searchStr, onShow, onHide} = this.props;
        const {onMoveUp, onMoveDown, DragHandle} = this.props;

        // TODO: show drag-handle in modern browsers,
        //       up/down buttons - in old ones (#1)
        return (
            <div className={classes.header}>
                <span className={cx({
                    [classes.collapse]: !collapsed,
                    [classes.expand]: collapsed})}
                onClick={collapsed ? onExpand : onCollapse}>
                    {collapsed ? 'expand' : 'collapse'}
                </span>

                <Marker className={classes.name}
                    str={name} markStr={searchStr} />

                {isConfiguring &&
                    <span className={classes.config}>

                        {DragHandle && <DragHandle />}

                        <span className={classes.up}
                            onClick={onMoveUp}>
                            {'up'}
                        </span>
                        <span className={classes.down}
                            onClick={onMoveDown}>
                            {'down'}
                        </span>

                        <span className={cx({
                            [classes.hide]: visible,
                            [classes.show]: !visible})}
                        onClick={visible ? onHide : onShow}>
                            {visible ? 'hide' : 'show'}
                        </span>
                    </span>
                }
            </div>
        );
    }
}