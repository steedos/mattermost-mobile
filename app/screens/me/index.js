import Me from './me';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {logout, setStatus} from 'mattermost-redux/actions/users';
import {getTheme} from 'mattermost-redux/selectors/entities/preferences';
import {getCurrentUser, getStatusForUserId} from 'mattermost-redux/selectors/entities/users';

import {getDimensions} from 'app/selectors/device';


function mapStateToProps(state) {

    const currentUser = getCurrentUser(state) || {};
    const status = getStatusForUserId(state, currentUser.id);
    
    return {
        ...getDimensions(state),
        theme: getTheme(state),
        currentUser: currentUser,
        status: status
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            logout,
            setStatus,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(Me);
