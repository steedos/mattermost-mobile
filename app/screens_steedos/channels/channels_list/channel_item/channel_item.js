// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import {General} from 'mattermost-redux/constants';

import PropTypes from 'prop-types';
import {
    Animated,
    Platform,
    TouchableHighlight,
    Text,
    View,
} from 'react-native';
import {intlShape} from 'react-intl';

import Badge from 'app/components/badge';
import ChannelIcon from './channel_icon';
import {preventDoubleTap} from 'app/utils/tap';
import {changeOpacity, makeStyleSheetFromTheme} from 'app/utils/theme';

const {View: AnimatedView} = Animated;

export default class ChannelItem extends PureComponent {
    static propTypes = {
        channelId: PropTypes.string.isRequired,
        channel: PropTypes.object,
        currentChannelId: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired,
        isChannelMuted: PropTypes.bool,
        currentUserId: PropTypes.string.isRequired,
        isUnread: PropTypes.bool,
        hasDraft: PropTypes.bool,
        mentions: PropTypes.number.isRequired,
        navigator: PropTypes.object,
        onSelectChannel: PropTypes.func.isRequired,
        shouldHideChannel: PropTypes.bool,
        showUnreadForMsgs: PropTypes.bool.isRequired,
        theme: PropTypes.object.isRequired,
        unreadMsgs: PropTypes.number.isRequired,
        isSearchResult: PropTypes.bool,
        isBot: PropTypes.bool.isRequired,
        separator: PropTypes.bool,
    };

    static defaultProps = {
        mentions: 0,
    };

    static contextTypes = {
        intl: intlShape,
    };

    onPress = preventDoubleTap(() => {
        const {channelId, currentChannelId, displayName, onSelectChannel, channel} = this.props;
        const {type, fake} = channel;
        requestAnimationFrame(() => {
            onSelectChannel({id: channelId, display_name: displayName, fake, type}, currentChannelId);
        });
    });

    onPreview = () => {
        const {channelId, navigator} = this.props;
        if (Platform.OS === 'ios' && navigator && this.previewRef) {
            const {intl} = this.context;

            navigator.push({
                screen: 'ChannelPeek',
                previewCommit: false,
                previewView: this.previewRef,
                previewActions: [{
                    id: 'action-mark-as-read',
                    title: intl.formatMessage({id: 'mobile.channel.markAsRead', defaultMessage: 'Mark As Read'}),
                }],
                passProps: {
                    channelId,
                },
            });
        }
    };

    setPreviewRef = (ref) => {
        this.previewRef = ref;
    };

    showChannelAsUnread = () => {
        return this.props.mentions > 0 || (this.props.unreadMsgs > 0 && this.props.showUnreadForMsgs);
    };

    render() {
        const {
            channelId,
            currentChannelId,
            displayName,
            isChannelMuted,
            currentUserId,
            isUnread,
            hasDraft,
            mentions,
            shouldHideChannel,
            theme,
            isSearchResult,
            unreadMsgs,
            channel,
            isBot,
        } = this.props;

        const style = getStyleSheet(theme);

        const isArchived = channel.delete_at > 0;

        // Only ever show an archived channel if it's the currently viewed channel.
        // It should disappear as soon as one navigates to another channel.
        if (isArchived && (currentChannelId !== channelId) && !isSearchResult) {
            return null;
        }

        if (!this.showChannelAsUnread() && shouldHideChannel) {
            return null;
        }

        if (!this.props.displayName) {
            return null;
        }

        const {intl} = this.context;

        let channelDisplayName = displayName;
        let isCurrenUser = false;
        let teammateId = null;

        if (channel.type === General.DM_CHANNEL) {
            if (isSearchResult) {
                isCurrenUser = channel.id === currentUserId;
                teammateId = channel.id;
            } else {
                isCurrenUser = channel.teammate_id === currentUserId;
                teammateId = channel.teammate_id;
            }
        }
        if (isCurrenUser) {
            channelDisplayName = intl.formatMessage({
                id: 'channel_header.directchannel.you',
                defaultMessage: '{displayName} (you)',
            }, {displayname: displayName});
        }

        const isActive = channelId === currentChannelId;

        let extraItemStyle;
        let extraTextStyle;
        let extraBorder;
        let mutedStyle;

        if (isActive) {
            extraItemStyle = style.itemActive;
            extraTextStyle = style.textActive;

            extraBorder = (
                <View style={style.borderActive}/>
            );
        } else if (isUnread) {
            extraTextStyle = style.textUnread;
        }

        let badge;
        if (mentions) {
            badge = (
                <Badge
                    style={style.badge}
                    countStyle={style.mention}
                    count={mentions}
                    onPress={this.onPress}
                />
            );
        } else if (unreadMsgs) {
            badge = (
                <Badge
                    style={style.messageBg}
                    countStyle={style.mention}
                    count={unreadMsgs}
                    onPress={this.onPress}
                />
            );
        }

        if (isChannelMuted) {
            mutedStyle = style.muted;
        }

        const icon = (
            <ChannelIcon
                isActive={isActive}
                channelId={channelId}
                teammateId={teammateId}
                isUnread={isUnread}
                hasDraft={hasDraft && channelId !== currentChannelId}
                membersCount={displayName.split(',').length}
                size={40}
                status={channel.status}
                theme={theme}
                type={channel.type}
                isArchived={isArchived}
                isBot={isBot}
            />
        );

        return (
            <AnimatedView ref={this.setPreviewRef}>
                <TouchableHighlight
                    underlayColor={changeOpacity(theme.sidebarTextHoverBg, 0.5)}
                    onPress={this.onPress}
                    onLongPress={this.onPreview}
                >
                    <View style={[style.container, mutedStyle]}>
                        {/* {extraBorder} */}
                        <View style={[style.item, extraItemStyle]}>
                            <View style={style.iconContainer}>
                                {icon}
                            </View>
                            <View style={style.wrapper}>
                                <View style={style.labelContainer}>
                                    <Text
                                        style={[style.text]}
                                        ellipsizeMode='tail'
                                        numberOfLines={1}
                                    >
                                        {channelDisplayName}
                                    </Text>
                                    {badge}
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
            </AnimatedView>
        );
    }
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        wrapper: {
            flex: 1,
        },
        container: {
            alignItems: 'center',
            flex: 1,
            flexDirection: 'row',
            height: 60,
            backgroundColor: theme.mobileSectionItemBg,
        },
        borderActive: {
            backgroundColor: changeOpacity(theme.centerChannelColor, 0.1),
            width: 5,
        },
        item: {
            alignItems: 'center',
            flex: 1,
            flexDirection: 'row',

            //paddingLeft: 16,
        },
        itemActive: {

            //backgroundColor: changeOpacity(theme.centerChannelColor, 0.1),
            //paddingLeft: 11,
        },
        iconContainer: {
            width: 70,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
        },
        labelContainer: {
            alignItems: 'center',
            flex: 1,
            flexDirection: 'row',
        },
        text: {
            color: theme.mobileSectionItemTextColor,
            fontSize: 16,
            paddingRight: 40,
            alignItems: 'center',
            flex: 1,
            textAlignVertical: 'center',
            includeFontPadding: false,
        },
        textActive: {
            color: theme.centerChannelColor,
            fontWeight: '600',
        },
        textUnread: {
            color: theme.centerChannelColor,
            fontWeight: '600',
        },
        badge: {
            backgroundColor: '#fb3f38',
            borderColor: '#fb3f38',
            borderRadius: 10,
            borderWidth: 1,
            padding: 3,
            position: 'relative',
            right: 16,
        },
        mention: {
            color: '#ffffff',
            fontSize: 10,
            fontWeight: '600',
        },
        messageBg: {
            backgroundColor: theme.mobileSectionSeperator,
            padding: 3,
            position: 'relative',
            right: 16,
        },
        muted: {
            opacity: 0.5,
        },
    };
});
