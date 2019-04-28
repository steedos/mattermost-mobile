// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {General} from 'mattermost-redux/constants';
import {joinChannel} from 'mattermost-redux/actions/channels';
import {getTeams} from 'mattermost-redux/actions/teams';
import {getTheme} from 'mattermost-redux/selectors/entities/preferences';
import {getCurrentUserId, getCurrentUserRoles} from 'mattermost-redux/selectors/entities/users';
import {getCurrentTeamId, getMyTeamsCount} from 'mattermost-redux/selectors/entities/teams';
import {getCurrentChannelId} from 'mattermost-redux/selectors/entities/channels';
import {showCreateOption} from 'mattermost-redux/utils/channel_utils';

import {setChannelDisplayName, setChannelLoading} from 'app/actions/views/channel';
import {makeDirectChannel} from 'app/actions/views/more_dms';
import {isLandscape, isTablet, getDimensions} from 'app/selectors/device';

import {startPeriodicStatusUpdates, stopPeriodicStatusUpdates, logout} from 'mattermost-redux/actions/users';
import {RequestStatus} from 'mattermost-redux/constants';
import {isAdmin as checkIsAdmin, isSystemAdmin as checkIsSystemAdmin} from 'mattermost-redux/utils/user_utils';

import {
    loadChannelsIfNecessary,
    loadProfilesAndTeamMembersForDMSidebar,
    selectInitialChannel,
    unselectChannel,
} from 'app/actions/views/channel';
import {getConfig, getLicense} from 'mattermost-redux/selectors/entities/general';
import {connection} from 'app/actions/device';
import {recordLoadTime} from 'app/actions/views/root';
import {selectDefaultTeam} from 'app/actions/views/select_team';
import {makeGetBadgeCountForTeamId} from 'mattermost-redux/selectors/entities/teams';

import Channels from './channels';

const getBadgeCountForTeamId = makeGetBadgeCountForTeamId();

function mapStateToProps(state) {
    const config = getConfig(state);
    const license = getLicense(state);
    const roles = getCurrentUserId(state) ? getCurrentUserRoles(state) : '';
    const currentTeamId = getCurrentTeamId(state);
    const isAdmin = checkIsAdmin(roles);
    const isSystemAdmin = checkIsSystemAdmin(roles);
    const {myChannels: channelsRequest} = state.requests.channels;
    const {currentUserId} = state.entities.users;

    return {
        ...getDimensions(state),
        canCreatePrivateChannels: showCreateOption(
            state,
            config,
            license,
            currentTeamId,
            General.PRIVATE_CHANNEL,
            isAdmin,
            isSystemAdmin
        ),
        channelsRequestFailed: channelsRequest.status === RequestStatus.FAILURE,
        currentTeamId: currentTeamId,
        currentUserId,
        currentChannelId: getCurrentChannelId(state),
        isLandscape: isLandscape(state),
        isTablet: isTablet(state),
        teamsCount: getMyTeamsCount(state),
        mentionCount: getBadgeCountForTeamId(state, currentTeamId),
        theme: getTheme(state),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            connection,
            loadChannelsIfNecessary,
            loadProfilesAndTeamMembersForDMSidebar,
            logout,
            selectDefaultTeam,
            selectInitialChannel,
            unselectChannel,
            recordLoadTime,
            startPeriodicStatusUpdates,
            stopPeriodicStatusUpdates,
            getTeams,
            joinChannel,
            makeDirectChannel,
            setChannelDisplayName,
            setChannelLoading,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(Channels);
