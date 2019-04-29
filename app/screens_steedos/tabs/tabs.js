// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {Navigation} from 'react-native-navigation';

import {
    app,
} from 'app/mattermost';
import {t} from 'app/utils/i18n';

export default class Tabs extends PureComponent {
    static propTypes = {
        theme: PropTypes.object.isRequired,
    };

    static defaultProps = {
        theme: {},
    };

    render() {
        const translations = app.getTranslations();
        const {theme} = this.props;

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
                navBarTextColor: theme.mobileNavBarTextColor,
                navBarBackgroundColor: theme.mobileNavBarBg,
                navBarButtonColor: theme.mobileNavBarTextColor,
                screenBackgroundColor: theme.mobileBg,
                navBarTitleTextCentered: false,
            },
            drawer: { // optional, add this if you want a side menu drawer in your app
                left: { // optional, define if you want a drawer from the left
                    screen: 'SwitchTeam', // unique ID registered with Navigation.registerScreen
                    passProps: {}, // simple serializable object that will pass as props to all top screens (optional),
                    fixedWidth: 500, // a fixed width you want your left drawer to have (optional)
                },
                style: { // ( iOS only )
                    drawerShadow: true, // optional, add this if you want a side menu drawer shadow
                    contentOverlayColor: 'rgba(0,0,0,0.25)', // optional, add this if you want a overlay color when drawer is open
                    leftDrawerWidth: 50, // optional, add this if you want a define left drawer width (50=percent)
                    rightDrawerWidth: 50, // optional, add this if you want a define right drawer width (50=percent)
                    shouldStretchDrawer: true, // optional, iOS only with 'MMDrawer' type, whether or not the panning gesture will “hard-stop” at the maximum width for a given drawer side, default : true
                },
                type: 'MMDrawer', // optional, iOS only, types: 'TheSideBar', 'MMDrawer' default: 'MMDrawer'
                animationType: 'door', //optional, iOS only, for MMDrawer: 'door', 'parallax', 'slide', 'slide-and-scale'
                disableOpenGesture: false, // optional, can the drawer be opened with a swipe instead of button
            },

            animationType: 'slide-down',
        });

        return null;
    }
}
