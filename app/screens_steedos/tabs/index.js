// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {Navigation} from 'react-native-navigation';

import {
    app,
} from 'app/mattermost';
import {t} from 'app/utils/i18n';
import {changeOpacity} from 'app/utils/theme';

export default function startTabs(theme) {
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
                navBarTextColor: theme.sidebarHeaderTextColor,
                navBarBackgroundColor: theme.sidebarHeaderBg,
                navBarButtonColor: theme.sidebarHeaderTextColor,
                screenBackgroundColor: theme.centerChannelBg,
                navBarNoBorder: true,
                navBarTranslucent: false,
                navBarHideOnScroll: false,
                drawUnderNavBar: false,
                largeTitle: false,
            },
        },
        {
            title: translations[t('mobile.tabs.contacts')],
            label: translations[t('mobile.tabs.contacts')],
            screen: 'Contacts',
            icon: require('assets/images/tabs/contacts.png'),
            selectedIcon: require('assets/images/tabs/contacts_selected.png'),
            navigatorStyle: {
                navBarHidden: false,
                statusBarHidden: false,
                statusBarHideWithNavBar: false,
                statusBarTextColorScheme: 'light',
                navBarTextColor: theme.sidebarHeaderTextColor,
                navBarBackgroundColor: theme.sidebarHeaderBg,
                navBarButtonColor: theme.sidebarHeaderTextColor,
                screenBackgroundColor: theme.centerChannelBg,
            },
        },
        {
            title: translations[t('mobile.tabs.apps')],
            label: translations[t('mobile.tabs.apps')],
            screen: 'Apps',
            icon: require('assets/images/tabs/apps.png'),
            selectedIcon: require('assets/images/tabs/apps.png'),
            navigatorStyle: {
                navBarHidden: false,
                statusBarHidden: false,
                statusBarHideWithNavBar: true,
                statusBarTextColorScheme: 'light',
                navBarTextColor: theme.sidebarHeaderTextColor,
                navBarBackgroundColor: theme.sidebarHeaderBg,
                navBarButtonColor: theme.sidebarHeaderTextColor,
                screenBackgroundColor: theme.centerChannelBg,
                navBarNoBorder: true,
                largeTitle: false,
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
                statusBarTextColorScheme: 'light',
                navBarTextColor: theme.sidebarHeaderTextColor,
                navBarBackgroundColor: theme.sidebarHeaderBg,
                navBarButtonColor: theme.sidebarHeaderTextColor,
                screenBackgroundColor: theme.centerChannelBg,
                navBarNoBorder: true,
                largeTitle: false,
            },
        }],
        tabsStyle: { // optional, add this if you want to style the tab bar beyond the defaults
            tabBarButtonColor: changeOpacity(theme.centerChannelColor, 0.5), // optional, change the color of the tab icons and text (also unselected). On Android, add this to appStyle
            tabBarSelectedButtonColor: theme.centerChannelColor, // optional, change the color of the selected tab icon and text (only selected). On Android, add this to appStyle
            tabBarBackgroundColor: theme.centerChannelBg, // optional, change the background color of the tab bar
            initialTabIndex: 0, // optional, the default selected bottom tab. Default: 0. On Android, add this to appStyle
            tabBarTranslucent: true,
        },
        appStyle: {
            orientation: 'auto',
            tabBarButtonColor: changeOpacity(theme.centerChannelColor, 0.5), // optional, change the color of the tab icons and text (also unselected). On Android, add this to appStyle
            tabBarSelectedButtonColor: theme.centerChannelColor, // optional, change the color of the selected tab icon and text (only selected). On Android, add this to appStyle
            tabBarBackgroundColor: theme.centerChannelBg, // optional, change the background color of the tab bar
            initialTabIndex: 0, // optional, the default selected bottom tab. Default: 0. On Android, add this to appStyle
            tabBarTranslucent: true,
            forceTitlesDisplay: true,
            navBarTextColor: theme.sidebarHeaderTextColor,
            navBarBackgroundColor: theme.sidebarHeaderBg,
            navBarButtonColor: theme.sidebarHeaderTextColor,
            screenBackgroundColor: theme.centerChannelBg,
            navBarTitleTextCentered: false,
        },
        animationType: 'fade',
    });

    return null;
}