// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import Badge from './badge';

import {connect} from 'react-redux';

import {getTheme} from 'mattermost-redux/selectors/entities/preferences';

import {getCurrentTeamId, makeGetBadgeCountForTeamId, getTeamMemberships, getMyTeamsCount} from 'mattermost-redux/selectors/entities/teams';
import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';
import {getUnreadsInCurrentTeam} from 'mattermost-redux/selectors/entities/channels';

function mapStateToProps(state) {
    const getBadgeCountForTeamId = makeGetBadgeCountForTeamId();
    const currentTeamId = getCurrentTeamId(state);
    const currentUser = getCurrentUser(state) || {};

    return {
        currentTeamId,
        currentUser,
        mentionCount: getBadgeCountForTeamId(state, currentTeamId),
        myTeamMembers: getTeamMemberships(state),
        theme: getTheme(state),
        ...getUnreadsInCurrentTeam(state),
    };
}

export default connect(mapStateToProps)(Badge);
