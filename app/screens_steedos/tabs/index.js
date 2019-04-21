// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {getTheme} from 'mattermost-redux/selectors/entities/preferences';
import {getMobileTheme} from 'app/selectors/theme';

import {Navigation, NativeEventsReceiver} from 'react-native-navigation';

import {
    app,
    store,
} from 'app/mattermost';
import {t} from 'app/utils/i18n';

export default startTabs = () => {
    const {dispatch, getState} = store;
    const theme = getMobileTheme(getState());
    const translations = app.getTranslations();

    Navigation.startTabBasedApp({
        tabs: [{
            title: translations[t('mobile.tabs.channels')],
            label: translations[t('mobile.tabs.channels')],
            screen: 'Channels',
            icon: require('assets/images/tabs/chat.png'),
            navigatorStyle: {
                navBarHidden: false,
                statusBarHidden: false,
                statusBarHideWithNavBar: false,
                statusBarTextColorScheme: 'light',
                navBarTextColor: theme.navBarTextColor,
                navBarBackgroundColor: theme.navBarBg,
                navBarButtonColor: theme.navBarTextColor,
                screenBackgroundColor: theme.bodyBg,
            },
        },

        // {
        //     label: translations[t('mobile.tabs.channels')],
        //     screen: 'Channel',
        //     icon: require('assets/images/tabs/chat.png'),
        //     navigatorStyle: {
        //         navBarHidden: true,
        //         statusBarHidden: false,
        //         statusBarHideWithNavBar: false,
        //     },
        // },
        {
            label: translations[t('mobile.tabs.me')],
            title: translations[t('mobile.tabs.me')],
            screen: 'Me',
            icon: require('assets/images/tabs/me.png'),
            navigatorStyle: {
                navBarHidden: false,
                statusBarHidden: false,
                statusBarHideWithNavBar: false,
                navBarTextColor: theme.navBarTextColor,
                navBarBackgroundColor: theme.navBarBg,
                navBarButtonColor: theme.navBarTextColor,
                screenBackgroundColor: theme.bodyBg,
            },
        }],
        tabsStyle: { // optional, add this if you want to style the tab bar beyond the defaults
            tabBarButtonColor: theme.tabTextColor, // optional, change the color of the tab icons and text (also unselected). On Android, add this to appStyle
            tabBarSelectedButtonColor: theme.tabSelectedTextColor, // optional, change the color of the selected tab icon and text (only selected). On Android, add this to appStyle
            tabBarBackgroundColor: theme.tabBg, // optional, change the background color of the tab bar
            initialTabIndex: 0, // optional, the default selected bottom tab. Default: 0. On Android, add this to appStyle
        },
        appStyle: {
            orientation: 'auto',
            tabBarButtonColor: theme.tabTextColor, // optional, change the color of the tab icons and text (also unselected). On Android, add this to appStyle
            tabBarSelectedButtonColor: theme.tabSelectedTextColor, // optional, change the color of the selected tab icon and text (only selected). On Android, add this to appStyle
            tabBarBackgroundColor: theme.tabBg, // optional, change the background color of the tab bar
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
