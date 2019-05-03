// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {getTheme} from 'mattermost-redux/selectors/entities/preferences';
import {getCurrentTeam} from 'mattermost-redux/selectors/entities/teams';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';

import Browser from './browser';

function mapStateToProps(state) {
    return {
        currentTeam: getCurrentTeam(state),
        currentUserId: getCurrentUserId(state),
        theme: getTheme(state),
    };
}

export default connect(mapStateToProps, null)(Browser);
