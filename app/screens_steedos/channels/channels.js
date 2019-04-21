// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    BackHandler,
    Keyboard,
    StyleSheet,
    View,
    InteractionManager,
} from 'react-native';
import {intlShape} from 'react-intl';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {General, WebsocketEvents} from 'mattermost-redux/constants';
import EventEmitter from 'mattermost-redux/utils/event_emitter';

import SafeAreaView from 'app/components/safe_area_view';
import DrawerLayout from 'app/components/sidebars/drawer_layout';
import StatusBar from 'app/components/status_bar';
import tracker from 'app/utils/time_tracker';
import {t} from 'app/utils/i18n';
import {preventDoubleTap} from 'app/utils/tap';
import {app} from 'app/mattermost';

import ChannelsList from './channels_list';
import DrawerSwiper from 'app/components/sidebars/main/drawer_swipper';
import TeamsList from 'app/components/sidebars/main/teams_list';
import NetworkIndicator from 'app/components/network_indicator';

const DRAWER_INITIAL_OFFSET = 0;
const DRAWER_LANDSCAPE_OFFSET = 0;

export default class ChannelSidebar extends Component {
    static propTypes = {
        actions: PropTypes.shape({
            getTeams: PropTypes.func.isRequired,
            makeDirectChannel: PropTypes.func.isRequired,
            setChannelDisplayName: PropTypes.func.isRequired,
            setChannelLoading: PropTypes.func.isRequired,
            unselectChannel: PropTypes.func.isRequired,
        }).isRequired,

        //blurPostTextBox: PropTypes.func.isRequired,
        children: PropTypes.node,
        currentTeamId: PropTypes.string.isRequired,
        currentUserId: PropTypes.string.isRequired,
        currentChannelId: PropTypes.string.isRequired,
        deviceWidth: PropTypes.number.isRequired,
        isLandscape: PropTypes.bool.isRequired,
        isTablet: PropTypes.bool.isRequired,
        navigator: PropTypes.object,
        teamsCount: PropTypes.number.isRequired,
        theme: PropTypes.object.isRequired,
    };

    static contextTypes = {
        intl: intlShape.isRequired,
    };

    constructor(props) {
        super(props);

        let openDrawerOffset = DRAWER_INITIAL_OFFSET;
        if (props.isLandscape || props.isTablet) {
            openDrawerOffset = DRAWER_LANDSCAPE_OFFSET;
        }

        this.swiperIndex = 1;
        this.state = {
            show: true,
            openDrawerOffset,
            drawerOpened: true,
        };

        MaterialIcon.getImageSource('close', 20, this.props.theme.sidebarHeaderTextColor).then((source) => {
            this.closeButton = source;
        });

        MaterialIcon.getImageSource('add-circle-outline', 20, this.props.theme.sidebarHeaderTextColor).then((source) => {
            this.addButton = source;

            this.props.navigator.setButtons({
                rightButtons: [
                {
                    icon: this.addButton, // for a textual button, provide the button title (label)
                    id: 'buttonAddChannel', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                    disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
                }
                ]
            });
        });


        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        switch(event.id) {
            case 'willAppear':
                const {theme} = this.props;
                this.props.navigator.setStyle({
                    statusBarHidden: false,
                    statusBarHideWithNavBar: false,
                    navBarTextColor: theme.sidebarHeaderTextColor,
                    navBarBackgroundColor: theme.sidebarHeaderBg,
                    navBarButtonColor: theme.sidebarHeaderTextColor,
                    screenBackgroundColor: theme.bodyBg
                });
                this.props.actions.unselectChannel();
                break;
            case 'didAppear':
                break;
            case 'willDisappear':
                break;
            case 'didDisappear':
                break;
            case 'willCommitPreview':
                break;
            case 'buttonAddChannel':
                this.showCreateChannelOptions()
        }
    }

    componentWillMount() {
        this.props.actions.getTeams();

        if (this.props.currentTeamId) {
            this.loadChannels(this.props.currentTeamId);
        } else {
            this.props.actions.selectDefaultTeam();
        }

        // if (this.props.currentChannelId) {
        //     PushNotifications.clearChannelNotifications(this.props.currentChannelId);
        // }

    }

    onRefresh = async () => {
        const {
            loadChannelsIfNecessary,
            loadProfilesAndTeamMembersForDMSidebar,
            selectInitialChannel,
        } = this.props.actions;
        return await loadChannelsIfNecessary(this.props.currentTeamId);
    }

    showCreateChannelOptions = () => {
        const {canCreatePrivateChannels, navigator} = this.props;

        const items = [];
        const moreChannels = {
            action: this.goToMoreChannels,
            text: {
                id: 'more_channels.title',
                defaultMessage: 'More Channels',
            },
        };
        const createPublicChannel = {
            action: this.goToCreatePublicChannel,
            text: {
                id: 'mobile.create_channel.public',
                defaultMessage: 'New Public Channel',
            },
        };
        const createPrivateChannel = {
            action: this.goToCreatePrivateChannel,
            text: {
                id: 'mobile.create_channel.private',
                defaultMessage: 'New Private Channel',
            },
        };
        const newConversation = {
            action: this.goToDirectMessages,
            text: {
                id: 'mobile.more_dms.title',
                defaultMessage: 'New Conversation',
            },
        };

        items.push(moreChannels, createPublicChannel);
        if (canCreatePrivateChannels) {
            items.push(createPrivateChannel);
        }
        items.push(newConversation);

        navigator.showModal({
            screen: 'OptionsModal',
            title: '',
            animationType: 'none',
            passProps: {
                items,
                onItemPress: () => navigator.dismissModal({
                    animationType: 'none',
                }),
            },
            navigatorStyle: {
                navBarHidden: true,
                statusBarHidden: false,
                statusBarHideWithNavBar: false,
                screenBackgroundColor: 'transparent',
                modalPresentationStyle: 'overCurrentContext',
            },
        });
    }

    goToCreatePublicChannel = preventDoubleTap(() => {
        const {navigator, theme} = this.props;
        const {intl} = this.context;

        navigator.showModal({
            screen: 'CreateChannel',
            animationType: 'slide-up',
            title: intl.formatMessage({id: 'mobile.create_channel.public', defaultMessage: 'New Public Channel'}),
            backButtonTitle: '',
            animated: true,
            navigatorStyle: {
                navBarTextColor: theme.sidebarHeaderTextColor,
                navBarBackgroundColor: theme.sidebarHeaderBg,
                navBarButtonColor: theme.sidebarHeaderTextColor,
                screenBackgroundColor: theme.centerChannelBg,
            },
            passProps: {
                channelType: General.OPEN_CHANNEL,
                closeButton: this.closeButton,
            },
        });
    });

    goToCreatePrivateChannel = preventDoubleTap(() => {
        const {navigator, theme} = this.props;
        const {intl} = this.context;

        navigator.showModal({
            screen: 'CreateChannel',
            animationType: 'slide-up',
            title: intl.formatMessage({id: 'mobile.create_channel.private', defaultMessage: 'New Private Channel'}),
            backButtonTitle: '',
            animated: true,
            navigatorStyle: {
                navBarTextColor: theme.sidebarHeaderTextColor,
                navBarBackgroundColor: theme.sidebarHeaderBg,
                navBarButtonColor: theme.sidebarHeaderTextColor,
                screenBackgroundColor: theme.centerChannelBg,
            },
            passProps: {
                channelType: General.PRIVATE_CHANNEL,
                closeButton: this.closeButton,
            },
        });
    });

    goToDirectMessages = preventDoubleTap(() => {
        const {navigator, theme} = this.props;
        const {intl} = this.context;

        navigator.showModal({
            screen: 'MoreDirectMessages',
            title: intl.formatMessage({id: 'mobile.more_dms.title', defaultMessage: 'New Conversation'}),
            animationType: 'slide-up',
            animated: true,
            backButtonTitle: '',
            navigatorStyle: {
                navBarTextColor: theme.sidebarHeaderTextColor,
                navBarBackgroundColor: theme.sidebarHeaderBg,
                navBarButtonColor: theme.sidebarHeaderTextColor,
                screenBackgroundColor: theme.centerChannelBg,
            },
            navigatorButtons: {
                leftButtons: [{
                    id: 'close-dms',
                    icon: this.closeButton,
                }],
            },
        });
    });

    goToMoreChannels = preventDoubleTap(() => {
        const {navigator, theme} = this.props;
        const {intl} = this.context;

        navigator.showModal({
            screen: 'MoreChannels',
            animationType: 'slide-up',
            title: intl.formatMessage({id: 'more_channels.title', defaultMessage: 'More Channels'}),
            backButtonTitle: '',
            animated: true,
            navigatorStyle: {
                navBarTextColor: theme.sidebarHeaderTextColor,
                navBarBackgroundColor: theme.sidebarHeaderBg,
                navBarButtonColor: theme.sidebarHeaderTextColor,
                screenBackgroundColor: theme.centerChannelBg,
            },
            passProps: {
                closeButton: this.closeButton,
            },
        });
    });
    
    loadChannels = (teamId) => {
        const {
            loadChannelsIfNecessary,
            loadProfilesAndTeamMembersForDMSidebar,
            selectInitialChannel,
        } = this.props.actions;

        loadChannelsIfNecessary(teamId).then(() => {
            loadProfilesAndTeamMembersForDMSidebar(teamId);

            if (app.startAppFromPushNotification) {
                app.setStartAppFromPushNotification(false);
            } else {
                //selectInitialChannel(teamId);
            }
        });
    };

    componentDidMount() {
        EventEmitter.on('close_channel_drawer', this.closeChannelDrawer);
        EventEmitter.on('renderDrawer', this.handleShowDrawerContent);
        EventEmitter.on(WebsocketEvents.CHANNEL_UPDATED, this.handleUpdateTitle);
        BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBack);
    }

    componentWillReceiveProps(nextProps) {
        const {isLandscape} = this.props;
        if (nextProps.isLandscape !== isLandscape) {
            if (this.state.openDrawerOffset !== 0) {
                let openDrawerOffset = DRAWER_INITIAL_OFFSET;
                if (nextProps.isLandscape || this.props.isTablet) {
                    openDrawerOffset = DRAWER_LANDSCAPE_OFFSET;
                }
                this.setState({openDrawerOffset});
            }
        }

        if (nextProps.currentTeamId && this.props.currentTeamId !== nextProps.currentTeamId) {
            this.loadChannels(nextProps.currentTeamId);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {currentUserId, currentTeamId, deviceWidth, isLandscape, teamsCount} = this.props;
        const {openDrawerOffset} = this.state;

        if (nextState.openDrawerOffset !== openDrawerOffset || nextState.show !== this.state.show) {
            return true;
        }

        const shouldUpdate = nextProps.currentUserId !== currentUserId ||
            nextProps.currentTeamId !== currentTeamId ||
            nextProps.isLandscape !== isLandscape || nextProps.deviceWidth !== deviceWidth ||
            nextProps.teamsCount !== teamsCount;
        return shouldUpdate;
    }

    componentWillUnmount() {
        EventEmitter.off('close_channel_drawer', this.closeChannelDrawer);
        EventEmitter.off(WebsocketEvents.CHANNEL_UPDATED, this.handleUpdateTitle);
        EventEmitter.off('renderDrawer', this.handleShowDrawerContent);
        BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBack);
    }

    handleAndroidBack = () => {
        if (this.state.drawerOpened && this.refs.drawer) {
            this.refs.drawer.closeDrawer();
            return true;
        }

        return false;
    };

    handleShowDrawerContent = () => {
        this.setState({show: true});
    };

    closeChannelDrawer = () => {
        if (this.state.drawerOpened && this.refs.drawer) {
            this.refs.drawer.closeDrawer();
        }
    };

    drawerSwiperRef = (ref) => {
        this.drawerSwiper = ref;
    };

    handleDrawerClose = () => {
        this.setState({
            drawerOpened: false,
        });
        this.resetDrawer();
        Keyboard.dismiss();
    };

    handleDrawerOpen = () => {
        this.setState({
            drawerOpened: true,
        });
    };

    handleUpdateTitle = (channel) => {
        let channelName = '';
        if (channel.display_name) {
            channelName = channel.display_name;
        }
        this.props.actions.setChannelDisplayName(channelName);
    };

    openChannelSidebar = () => {
        //this.props.blurPostTextBox();

        if (this.refs.drawer) {
            this.refs.drawer.openDrawer();
        }
    };

    selectChannel = (channel, currentChannelId, closeDrawer = true) => {
        const {setChannelLoading} = this.props.actions;
        this.handleUpdateTitle(channel);

        tracker.channelSwitch = Date.now();

        if (closeDrawer) {
            this.closeChannelDrawer();
            setChannelLoading(channel.id !== currentChannelId);
        }

        if (!channel) {
            const utils = require('app/utils/general');
            const {intl} = this.context;

            const unableToJoinMessage = {
                id: t('mobile.open_unknown_channel.error'),
                defaultMessage: "We couldn't join the channel. Please reset the cache and try again.",
            };
            const erroMessage = {};

            utils.alertErrorWithFallback(intl, erroMessage, unableToJoinMessage);
            setChannelLoading(false);
            return;
        }

        const {navigator, theme, currentTeamId} = this.props;

        InteractionManager.runAfterInteractions(() => {
            navigator.push({
                screen: 'ChannelSimple',
                title: channel.display_name,
                animated: true,
                backButtonTitle: '',
                navigatorStyle: {
                    navBarHidden: true,
                    tabBarHidden: true,
                },
                passProps: {
                    channel,
                },
            });
        });
    };

    joinChannel = (channel, currentChannelId) => {
        const {intl} = this.context;
        const {
            actions,
            currentTeamId,
            currentUserId,
        } = this.props;

        const {
            joinChannel,
            makeDirectChannel,
        } = actions;

        this.closeChannelDrawer();
        actions.setChannelLoading(channel.id !== currentChannelId);

        setTimeout(async () => {
            const displayValue = {displayName: channel.display_name};
            const utils = require('app/utils/general');

            let result;
            if (channel.type === General.DM_CHANNEL) {
                result = await makeDirectChannel(channel.id, false);

                if (result.error) {
                    const dmFailedMessage = {
                        id: t('mobile.open_dm.error'),
                        defaultMessage: "We couldn't open a direct message with {displayName}. Please check your connection and try again.",
                    };
                    utils.alertErrorWithFallback(intl, result.error, dmFailedMessage, displayValue);
                }
            } else {
                result = await joinChannel(currentUserId, currentTeamId, channel.id);

                if (result.error || !result.data || !result.data.channel) {
                    const joinFailedMessage = {
                        id: t('mobile.join_channel.error'),
                        defaultMessage: "We couldn't join the channel {displayName}. Please check your connection and try again.",
                    };
                    utils.alertErrorWithFallback(intl, result.error, joinFailedMessage, displayValue);
                }
            }

            if (result.error || (!result.data && !result.data.channel)) {
                actions.setChannelLoading(false);
                return;
            }

            requestAnimationFrame(() => {
                this.selectChannel(result.data.channel || result.data, currentChannelId, false);
            });
        }, 200);
    };

    onPageSelected = (index) => {
        this.swiperIndex = index;

        if (this.refs.drawer) {
            if (this.swiperIndex === 0) {
                this.refs.drawer.canClose = false;
            } else {
                this.refs.drawer.canClose = true;
            }
        }
    };

    onSearchEnds = () => {
        //hack to update the drawer when the offset changes
        const {isLandscape, isTablet} = this.props;

        let openDrawerOffset = DRAWER_INITIAL_OFFSET;
        if (isLandscape || isTablet) {
            openDrawerOffset = DRAWER_LANDSCAPE_OFFSET;
        }
        if (this.refs.drawer) {
            this.refs.drawer.canClose = true;
        }
        this.setState({openDrawerOffset});
    };

    onSearchStart = () => {
        if (this.refs.drawer) {
            this.refs.drawer.canClose = false;
        }
        this.setState({openDrawerOffset: 0});
    };

    showTeams = () => {
        // if (this.drawerSwiper && this.swiperIndex === 1 && this.props.teamsCount > 1) {
        //     this.drawerSwiper.getWrappedInstance().showTeamsPage();
        // }
        const {navigator} = this.props;
        
        navigator.showModal({
            screen: 'SwitchTeam',
            title: '',
            animationType: 'none',
            navigatorStyle: {
                navBarHidden: true,
                statusBarHidden: false,
                statusBarHideWithNavBar: false,
                screenBackgroundColor: 'transparent',
                modalPresentationStyle: 'overCurrentContext',
            },
        });
    };

    resetDrawer = () => {
        if (this.drawerSwiper && this.swiperIndex !== 1) {
            this.drawerSwiper.getWrappedInstance().resetPage();
        }
    };

    render() {
        if (!this.props.currentUserId) {
            return (
                <View/>
            );
        }
        const {
            navigator,
            teamsCount,
            theme,
        } = this.props;

        const {
            show,
            openDrawerOffset,
        } = this.state;

        if (!show) {
            return null;
        }

        const multipleTeams = teamsCount > 1;
        const showTeams = openDrawerOffset !== 0 && multipleTeams;
        if (this.drawerSwiper) {
            if (multipleTeams) {
                this.drawerSwiper.getWrappedInstance().runOnLayout();
            } else if (!openDrawerOffset) {
                this.drawerSwiper.getWrappedInstance().scrollToStart();
            }
        }

        return (

            // <SafeAreaView
            //     backgroundColor={theme.sidebarHeaderBg}
            //     footerColor={theme.sidebarHeaderBg}
            //     navigator={navigator}
            //     excludeHeader={true}
            // >
            <View
                key='channels'
                style={style.swiperContent}
                excludeHeader={true}
            >
                <StatusBar/>
                <ChannelsList
                    navigator={navigator}
                    onSelectChannel={this.selectChannel}
                    onJoinChannel={this.joinChannel}
                    onShowTeams={this.showTeams}
                    onSearchStart={this.onSearchStart}
                    onSearchEnds={this.onSearchEnds}
                    onRefresh={this.onRefresh}
                    theme={theme}
                    drawerOpened={this.state.drawerOpened}
                />
                <NetworkIndicator/>
            </View>

        // </SafeAreaView>
        );
    }
}

const style = StyleSheet.create({
    swiperContent: {
        flex: 1,
    },
});
