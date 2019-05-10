// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {PureComponent} from 'react';
import PropTypes from 'prop-types';
import PushNotifications from 'app/push_notifications';

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
            theme,
        } = this.props;

        let mentions = mentionCount;
        let messages = messageCount;

        const members = Object.values(myTeamMembers).filter((m) => m.team_id !== currentTeamId);
        members.forEach((m) => {
            mentions += (m.mention_count || 0);
            messages += (m.msg_count || 0);
        });

        if (mentions) {
            this.props.navigator.setTabBadge({
                tabIndex: 0,
                badge: mentions.toString(),
                badgeColor: theme.mentionBg,
            });
            PushNotifications.setApplicationIconBadgeNumber(mentions);
        } else if (messages) {
            this.props.navigator.setTabBadge({
                tabIndex: 0,
                badge: '•',
                badgeColor: theme.mentionBg,
            });
            PushNotifications.setApplicationIconBadgeNumber(0);
        } else {
            this.props.navigator.setTabBadge({
                tabIndex: 0,
                badge: null,
            });
            PushNotifications.setApplicationIconBadgeNumber(0);
        }

        return null;
    }
}
