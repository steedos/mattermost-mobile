// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {getCurrentTeam} from 'mattermost-redux/selectors/entities/teams';

import {getTheme} from 'mattermost-redux/selectors/entities/preferences';

import ChannelsList from './channels_list';

function mapStateToProps(state) {
    return {
        theme: getTheme(state),
        currentTeam: getCurrentTeam(state),
    };
}

export default connect(mapStateToProps)(ChannelsList);
