// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
    View,
    AppState,
    Platform,
} from 'react-native';

import DeviceInfo from 'react-native-device-info';

import {setSystemEmojis} from 'mattermost-redux/actions/emojis';
import {Client4} from 'mattermost-redux/client';
import EventEmitter from 'mattermost-redux/utils/event_emitter';
import {Navigation, NativeEventsReceiver} from 'react-native-navigation';

import {
    app,
    store,
} from 'app/mattermost';
import {ViewTypes} from 'app/constants';
import PushNotifications from 'app/push_notifications';
import {stripTrailingSlashes} from 'app/utils/url';
import {wrapWithContextProvider} from 'app/utils/wrap_context_provider';

import ChannelLoader from 'app/components/channel_loader';
import EmptyToolbar from 'app/components/start/empty_toolbar';
import Loading from 'app/components/loading';
import SafeAreaView from 'app/components/safe_area_view';
import StatusBar from 'app/components/status_bar';
import {t} from 'app/utils/i18n';
import startTabs from 'app/screens_steedos/tabs';

const lazyLoadSelectServer = () => {
    return require('app/screens/select_server').default;
};

const lazyLoadChannel = () => {
    return require('app/screens/channel').default;
};

const lazyLoadPushNotifications = () => {
    return require('app/utils/push_notifications').configurePushNotifications;
};

const lazyLoadReplyPushNotifications = () => {
    return require('app/utils/push_notifications').onPushNotificationReply;
};

/**
 * Entry Component:
 * With very little overhead navigate to
 *  - Login or
 *  - Channel Component
 *
 * The idea is to render something to the user as soon as possible
 */
export default class Entry extends PureComponent {
    static propTypes = {
        theme: PropTypes.object,
        navigator: PropTypes.object,
        isLandscape: PropTypes.bool,
        enableTimezone: PropTypes.bool,
        deviceTimezone: PropTypes.string,
        initializeModules: PropTypes.func,
        actions: PropTypes.shape({
            autoUpdateTimezone: PropTypes.func.isRequired,
            setDeviceToken: PropTypes.func.isRequired,
        }).isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            launchLogin: false,
            launchChannel: false,
        };
    }

    componentDidMount() {
        Client4.setUserAgent(DeviceInfo.getUserAgent());
        this.unsubscribeFromStore = store.subscribe(this.listenForHydration);

        EventEmitter.on(ViewTypes.LAUNCH_LOGIN, this.handleLaunchLogin);
        EventEmitter.on(ViewTypes.LAUNCH_CHANNEL, this.handleLaunchChannel);
    }

    componentWillUnmount() {
        EventEmitter.off(ViewTypes.LAUNCH_LOGIN, this.handleLaunchLogin);
        EventEmitter.off(ViewTypes.LAUNCH_CHANNEL, this.handleLaunchChannel);
    }

    handleLaunchLogin = (initializeModules) => {
        this.setState({launchLogin: true});

        if (initializeModules) {
            this.props.initializeModules();
        }

        this.launchSelectServer();
    };

    handleLaunchChannel = (initializeModules) => {
        this.setState({launchChannel: true});

        if (initializeModules) {
            this.props.initializeModules();
        }

        this.launchTabs();
    };


    launchTabs = () => {
        const {theme} = this.props;
        const translations = app.getTranslations();

        Navigation.startTabBasedApp({
            tabs: [{
                title: translations[t('mobile.tabs.channels')],
                label: translations[t('mobile.tabs.channels')],
                screen: 'Channels',
                icon: require('assets/images/tabs/chat.png'),
                selectedIcon: require('assets/images/tabs/chat_selected.png'),
                navigatorStyle: {
                    navBarHidden: false,
                    statusBarHidden: false,
                    statusBarHideWithNavBar: false,
                    statusBarTextColorScheme: 'light',
                    navBarTextColor: theme.mobileNavBarTextColor,
                    navBarBackgroundColor: theme.mobileNavBarBg,
                    navBarButtonColor: theme.mobileNavBarTextColor,
                    screenBackgroundColor: theme.mobileBg,
                },
            },
            {
                title: translations[t('mobile.channel_list.members')],
                label: translations[t('mobile.channel_list.members')],
                screen: 'Contacts',
                icon: require('assets/images/tabs/contacts.png'),
                selectedIcon: require('assets/images/tabs/contacts_selected.png'),
                navigatorStyle: {
                    navBarHidden: false,
                    statusBarHidden: false,
                    statusBarHideWithNavBar: false,
                    statusBarTextColorScheme: 'light',
                    navBarTextColor: theme.mobileNavBarTextColor,
                    navBarBackgroundColor: theme.mobileNavBarBg,
                    navBarButtonColor: theme.mobileNavBarTextColor,
                    screenBackgroundColor: theme.mobileBg,
                },
            },
            {
                label: translations[t('mobile.tabs.me')],
                title: translations[t('mobile.tabs.me')],
                screen: 'Me',
                icon: require('assets/images/tabs/settings.png'),
                selectedIcon: require('assets/images/tabs/settings_selected.png'),
                navigatorStyle: {
                    navBarHidden: false,
                    statusBarHidden: false,
                    statusBarHideWithNavBar: false,
                    navBarTextColor: theme.mobileNavBarTextColor,
                    navBarBackgroundColor: theme.mobileNavBarBg,
                    navBarButtonColor: theme.mobileNavBarTextColor,
                    screenBackgroundColor: theme.mobileBg,
                },
            }],
            tabsStyle: { // optional, add this if you want to style the tab bar beyond the defaults
                tabBarButtonColor: theme.mobileTabTextColor, // optional, change the color of the tab icons and text (also unselected). On Android, add this to appStyle
                tabBarSelectedButtonColor: theme.mobileTabSelectedTextColor, // optional, change the color of the selected tab icon and text (only selected). On Android, add this to appStyle
                tabBarBackgroundColor: theme.mobileTabBg, // optional, change the background color of the tab bar
                initialTabIndex: 0, // optional, the default selected bottom tab. Default: 0. On Android, add this to appStyle
            },
            appStyle: {
                orientation: 'auto',
                tabBarButtonColor: theme.mobileTabTextColor, // optional, change the color of the tab icons and text (also unselected). On Android, add this to appStyle
                tabBarSelectedButtonColor: theme.mobileTabSelectedTextColor, // optional, change the color of the selected tab icon and text (only selected). On Android, add this to appStyle
                tabBarBackgroundColor: theme.mobileTabBg, // optional, change the background color of the tab bar
                initialTabIndex: 0, // optional, the default selected bottom tab. Default: 0. On Android, add this to appStyle
                forceTitlesDisplay: true,
                navBarTextColor: theme.navBarTextColor,
                navBarBackgroundColor: theme.navBarBg,
                navBarButtonColor: theme.navBarTextColor,
                screenBackgroundColor: theme.bodyBg,
            },
            animationType: 'fade',
        });
    };

    launchSelectServer = () => {
        Navigation.startSingleScreenApp({
            screen: {
                screen: 'SelectServer',
                navigatorStyle: {
                    navBarHidden: true,
                    statusBarHidden: false,
                    statusBarHideWithNavBar: false,
                    screenBackgroundColor: 'transparent',
                },
            },
            passProps: {
                allowOtherServers: app.allowOtherServers,
            },
            appStyle: {
                orientation: 'auto',
            },
            animationType: 'fade',
        });
    };

    listenForHydration = () => {
        const {
            actions: {
                autoUpdateTimezone,
            },
            enableTimezone,
            deviceTimezone,
        } = this.props;
        const {getState} = store;
        const state = getState();

        if (!app.isNotificationsConfigured) {
            this.configurePushNotifications();
        }

        if (state.views.root.hydrationComplete) {
            this.unsubscribeFromStore();

            if (enableTimezone) {
                autoUpdateTimezone(deviceTimezone);
            }

            this.setAppCredentials();
            this.setStartupThemes();
            this.handleNotification();
            this.loadSystemEmojis();

            if (Platform.OS === 'android') {
                this.launchForAndroid();
                return;
            }

            this.launchForiOS();
        }
    };

    configurePushNotifications = () => {
        const configureNotifications = lazyLoadPushNotifications();
        configureNotifications();
    };

    setAppCredentials = () => {
        const {
            actions: {
                setDeviceToken,
            },
        } = this.props;
        const {getState} = store;
        const state = getState();

        const {credentials} = state.entities.general;
        const {currentUserId} = state.entities.users;

        if (app.deviceToken) {
            setDeviceToken(app.deviceToken);
        }

        if (credentials.token && credentials.url) {
            Client4.setToken(credentials.token);
            Client4.setUrl(stripTrailingSlashes(credentials.url));
        } else if (app.waitForRehydration) {
            app.waitForRehydration = false;
        }

        if (currentUserId) {
            Client4.setUserId(currentUserId);
        }

        app.setAppCredentials(app.deviceToken, currentUserId, credentials.token, credentials.url);
    };

    setStartupThemes = () => {
        const {theme} = this.props;
        if (app.toolbarBackground === theme.sidebarHeaderBg) {
            return;
        }

        app.setStartupThemes(
            theme.sidebarHeaderBg,
            theme.sidebarHeaderTextColor,
            theme.centerChannelBg
        );
    };

    handleNotification = async () => {
        const notification = PushNotifications.getNotification();

        // If notification exists, it means that the app was started through a reply
        // and the app was not sitting in the background nor opened
        if (notification || app.replyNotificationData) {
            const onPushNotificationReply = lazyLoadReplyPushNotifications();
            const notificationData = notification || app.replyNotificationData;
            const {data, text, badge, completed} = notificationData;

            // if the notification has a completed property it means that we are replying to a notification
            if (completed) {
                onPushNotificationReply(data, text, badge, completed);
            }
            PushNotifications.resetNotification();
        }
    };

    launchForAndroid = () => {
        app.launchApp();
    };

    launchForiOS = () => {
        const appNotActive = AppState.currentState !== 'active';

        if (appNotActive) {
            // for iOS replying from push notification starts the app in the background
            app.setShouldRelaunchWhenActive(true);
        } else {
            app.launchApp();
        }
    };

    loadSystemEmojis = () => {
        const EmojiIndicesByAlias = require('app/utils/emojis').EmojiIndicesByAlias;
        setSystemEmojis(EmojiIndicesByAlias);
    };

    render() {
        const {
            navigator,
            isLandscape,
        } = this.props;

        let toolbar = null;
        let loading = null;
        const backgroundColor = app.appBackground ? app.appBackground : '#ffff';
        if (app.token && app.toolbarBackground) {
            const toolbarTheme = {
                sidebarHeaderBg: app.toolbarBackground,
                sidebarHeaderTextColor: app.toolbarTextColor,
            };

            toolbar = (
                <View>
                    <StatusBar headerColor={app.toolbarBackground}/>
                    <EmptyToolbar
                        theme={toolbarTheme}
                        isLandscape={isLandscape}
                    />
                </View>
            );

            loading = (
                <ChannelLoader
                    backgroundColor={backgroundColor}
                    channelIsLoading={true}
                />
            );
        } else {
            loading = <Loading/>;
        }

        return (
            <SafeAreaView
                navBarBackgroundColor={app.toolbarBackground}
                backgroundColor={backgroundColor}
                navigator={navigator}
            >
                {toolbar}
                {loading}
            </SafeAreaView>
        );
    }
}
