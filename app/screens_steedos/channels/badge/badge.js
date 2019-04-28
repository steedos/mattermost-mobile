// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {PureComponent} from 'react';
import PropTypes from 'prop-types';

export default class Badge extends PureComponent {
    static propTypes = {
        navigator: PropTypes.object,
        messageCount: PropTypes.number,
        mentionCount: PropTypes.number,
        myTeamMembers: PropTypes.object,
        currentTeamId: PropTypes.string.isRequired,
        theme: PropTypes.object.isRequired,
    };

    static defaultProps = {
        theme: {},
        messageCount: 0,
        mentionCount: 0,
    };

    render() {
        const {
            currentTeamId,
            mentionCount,
            messageCount,
            myTeamMembers,
        } = this.props;

        let mentions = mentionCount;
        let messages = messageCount;

        const members = Object.values(myTeamMembers).filter((m) => m.team_id !== currentTeamId);
        members.forEach((m) => {
            mentions += (m.mention_count || 0);
            messages += (m.msg_count || 0);
        });

        let badgeCount = '';
        if (mentions) {
            badgeCount = mentions.toString();
        } else if (messages) {
            badgeCount = ' ';
        }

        this.props.navigator.setTabBadge({
            tabIndex: 0,
            badge: badgeCount,
        });

        return null;
    }
}
