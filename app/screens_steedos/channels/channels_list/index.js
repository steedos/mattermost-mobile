// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {getCurrentTeam} from 'mattermost-redux/selectors/entities/teams';

import {getMobileTheme} from 'app/selectors/theme';

import ChannelsList from './channels_list';

function mapStateToProps(state) {
    return {
        theme: getMobileTheme(state),
        currentTeam: getCurrentTeam(state),
    };
}

export default connect(mapStateToProps)(ChannelsList);
