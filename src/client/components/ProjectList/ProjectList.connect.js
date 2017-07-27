import {connect} from 'react-redux';
import Component from './ProjectList';

export default connect(
    state => ({
        rootProject: state.rootProject
    })
)(Component);