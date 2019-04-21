// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import PropTypes from 'prop-types';
import {
    Image,
    Text,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {General} from 'mattermost-redux/constants';

import {changeOpacity, makeStyleSheetFromTheme} from 'app/utils/theme';
import ProfilePicture from 'app/components/profile_picture';

export default class ChannelIcon extends React.PureComponent {
    static propTypes = {
        channelId: PropTypes.string,
        teammateId: PropTypes.string,
        isActive: PropTypes.bool,
        isInfo: PropTypes.bool,
        isUnread: PropTypes.bool,
        hasDraft: PropTypes.bool,
        membersCount: PropTypes.number,
        size: PropTypes.number,
        status: PropTypes.string,
        theme: PropTypes.object.isRequired,
        type: PropTypes.string.isRequired,
        isArchived: PropTypes.bool.isRequired,
        isBot: PropTypes.bool.isRequired,
    };

    static defaultProps = {
        isActive: false,
        isInfo: false,
        isUnread: false,
        size: 12,
    };

    render() {
        const {
            isActive,
            isUnread,
            isInfo,
            hasDraft,
            membersCount,
            size,
            status,
            theme,
            type,
            isArchived,
            isBot,
            channelId,
            teammateId,
        } = this.props;
        const style = getStyleSheet(theme);

        let activeIcon;
        let unreadIcon;
        let activeGroupBox;
        let unreadGroupBox;
        let activeGroup;
        let unreadGroup;
        let offlineColor = changeOpacity(theme.centerChannelColor, 0.5);

        if (isUnread) {
            unreadIcon = style.iconUnread;
            unreadGroupBox = style.groupBoxUnread;
            unreadGroup = style.groupUnread;
        }

        if (isActive) {
            activeIcon = style.iconActive;
            activeGroupBox = style.groupBoxActive;
            activeGroup = style.groupActive;
        }

        if (isInfo) {
            activeIcon = style.iconInfo;
            activeGroupBox = style.groupBoxInfo;
            activeGroup = style.groupInfo;
            offlineColor = changeOpacity(theme.centerChannelColor, 0.5);
        }

        let icon;
        if (isArchived) {
            icon = (
                <View style={[style.groupBox, unreadGroupBox, activeGroupBox, {width: size, height: size}]}>
                    <Icon
                        name='archive'
                        style={[style.icon, unreadIcon, activeIcon, {fontSize: size * 0.618}]}
                    />
                </View>
            );
        } else if (isBot) {
            icon = (
                <View style={[style.groupBox, unreadGroupBox, activeGroupBox, {width: size, height: size}]}>
                    <Icon
                        name='robot'
                        style={[style.icon, unreadIcon, activeIcon, {fontSize: size * 0.618}, style.iconBot]}
                    />
                </View>
            );
        } else if (hasDraft) {
            icon = (                
                <View style={[style.groupBox, unreadGroupBox, activeGroupBox, {width: size, height: size}]}>
                    <Icon
                        name='pencil'
                        style={[style.icon, unreadIcon, activeIcon, {fontSize: size * 0.618}]}
                    />
                </View>
            );
        } else if (type === General.OPEN_CHANNEL) {
            icon = (
                <View style={[style.groupBox, unreadGroupBox, activeGroupBox, {width: size, height: size}]}>
                    <Icon
                        name='globe'
                        style={[style.icon, unreadIcon, activeIcon, {fontSize: size * 0.618}]}
                    />
                </View>
            );
        } else if (type === General.PRIVATE_CHANNEL) {
            icon = (
                <View style={[style.groupBox, unreadGroupBox, activeGroupBox, {width: size, height: size}]}>
                    <Icon
                        name='lock'
                        style={[style.icon, unreadIcon, activeIcon, {fontSize: size * 0.618}]}
                    />
                </View>
            );
        } else if (type === General.GM_CHANNEL) {
            icon = (
                <View style={[style.groupBox, unreadGroupBox, activeGroupBox, {width: size, height: size}]}>
                    <Text style={[style.group, unreadGroup, activeGroup, {fontSize: (size * 0.618)}]}>
                        {membersCount}
                    </Text>
                </View>
            );
        } else if (type === General.DM_CHANNEL) {
            icon = (
                <ProfilePicture
                    userId={teammateId}
                    size={size}
                    status={status}
                    statusBorderWidth={1}
                    statusSize={12}
                />);
            // switch (status) {
            // case General.AWAY:
            //     icon = (
            //         <Image
            //             source={require('assets/images/status/away_avatar.png')}
            //             style={{width: size, height: size, tintColor: theme.awayIndicator}}
            //         />
            //     );
            //     break;
            // case General.DND:
            //     icon = (
            //         <Image
            //             source={require('assets/images/status/dnd_avatar.png')}
            //             style={{width: size, height: size, tintColor: theme.dndIndicator}}
            //         />
            //     );
            //     break;
            // case General.ONLINE:
            //     icon = (
            //         <Image
            //             source={require('assets/images/status/online_avatar.png')}
            //             style={{width: size, height: size, tintColor: theme.onlineIndicator}}
            //         />
            //     );
            //     break;
            // default:
            //     icon = (
            //         <Image
            //             source={require('assets/images/status/offline_avatar.png')}
            //             style={{width: size, height: size, tintColor: offlineColor}}
            //         />
            //     );
            //     break;
            // }
        }

        return (
            <View style={[style.container, {width: size, height: size}]}>
                {icon}
            </View>
        );
    }
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        container: {
            //marginRight: 12,
            alignItems: 'center',
            justifyContent: 'center',
        },
        icon: {
            color: changeOpacity(theme.centerChannelColor, 0.4),
        },
        iconActive: {
            color: theme.itemTextColor,
        },
        iconUnread: {
            color: theme.itemTextColor,
        },
        iconInfo: {
            color: theme.itemTextColor,
        },
        iconBot: {
            marginLeft: -5,
        },
        groupBox: {
            alignSelf: 'flex-start',
            alignItems: 'center',
            borderWidth: 0,
            backgroundColor: changeOpacity(theme.itemSeperator, 0.3),
            justifyContent: 'center',
            borderRadius: 6,
        },
        groupBoxActive: {
            borderColor: theme.itemTextColor,
        },
        groupBoxUnread: {
            borderColor: theme.itemTextColor,
        },
        groupBoxInfo: {
            borderColor: theme.itemTextColor,
        },
        group: {
            color: theme.itemTextColor,
            fontSize: 10,
            fontWeight: '600',
        },
        groupActive: {
            color: theme.itemTextColor,
        },
        groupUnread: {
            color: theme.itemTextColor,
        },
        groupInfo: {
            color: theme.itemTextColor,
        },
    };
});
