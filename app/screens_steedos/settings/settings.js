// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {intlShape, injectIntl} from 'react-intl';
import {
    Linking,
    Platform,
    ScrollView,
    View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import SettingsItem from 'app/screens/settings/settings_item';
import FormattedText from 'app/components/formatted_text';
import StatusBar from 'app/components/status_bar';
import {preventDoubleTap} from 'app/utils/tap';
import {changeOpacity, makeStyleSheetFromTheme, setNavigatorStyles} from 'app/utils/theme';
import {isValidUrl} from 'app/utils/url';
import {t} from 'app/utils/i18n';

import DrawerItem from '../me/drawer_item';

import LocalConfig from 'assets/config';

class Settings extends PureComponent {
    static propTypes = {
        actions: PropTypes.shape({
            clearErrors: PropTypes.func.isRequired,
            purgeOfflineStore: PropTypes.func.isRequired,
            logout: PropTypes.func.isRequired,
        }).isRequired,
        config: PropTypes.object.isRequired,
        currentTeamId: PropTypes.string.isRequired,
        currentUserId: PropTypes.string.isRequired,
        currentUrl: PropTypes.string.isRequired,
        errors: PropTypes.array.isRequired,
        intl: intlShape.isRequired,
        joinableTeams: PropTypes.array.isRequired,
        navigator: PropTypes.object,
        theme: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    errorEmailBody = () => {
        const {config, currentUserId, currentTeamId, errors} = this.props;
        let contents = [
            'Please share a description of the problem:\n\n',
            `Current User Id: ${currentUserId}`,
            `Current Team Id: ${currentTeamId}`,
            `Server Version: ${config.Version} (Build ${config.BuildNumber})`,
            `App Version: ${DeviceInfo.getVersion()} (Build ${DeviceInfo.getBuildNumber()})`,
            `App Platform: ${Platform.OS}`,
        ];
        if (errors.length) {
            const errorArray = errors.map((e) => {
                const {error} = e;
                const stack = error.stack || '';
                return `Date: ${e.date}\nMessage: ${error.message}\nStack trace:\n${stack}\n\n`;
            }).join('');

            contents = contents.concat([
                '',
                'Errors:',
                errorArray,
            ]);
        }
        return contents.join('\n');
    };

    goToAbout = preventDoubleTap(() => {
        const {intl, navigator, theme} = this.props;
        navigator.push({
            screen: 'About',
            title: intl.formatMessage({id: 'about.title', defaultMessage: 'About Mattermost'}),
            animated: true,
            backButtonTitle: '',
            navigatorStyle: {
                navBarTextColor: theme.sidebarHeaderTextColor,
                navBarBackgroundColor: theme.sidebarHeaderBg,
                navBarButtonColor: theme.sidebarHeaderTextColor,
            },
        });
    });

    goToNotifications = preventDoubleTap(() => {
        const {intl, navigator, theme} = this.props;
        navigator.push({
            screen: 'NotificationSettings',
            backButtonTitle: '',
            title: intl.formatMessage({id: 'user.settings.modal.notifications', defaultMessage: 'Notifications'}),
            animated: true,
            navigatorStyle: {
                navBarTextColor: theme.sidebarHeaderTextColor,
                navBarBackgroundColor: theme.sidebarHeaderBg,
                navBarButtonColor: theme.sidebarHeaderTextColor,
                screenBackgroundColor: theme.centerChannelBg,
            },
        });
    });

    goToDisplaySettings = preventDoubleTap(() => {
        const {intl, navigator, theme} = this.props;
        navigator.push({
            screen: 'DisplaySettings',
            title: intl.formatMessage({id: 'user.settings.modal.display', defaultMessage: 'Display'}),
            animated: true,
            backButtonTitle: '',
            navigatorStyle: {
                navBarTextColor: theme.sidebarHeaderTextColor,
                navBarBackgroundColor: theme.sidebarHeaderBg,
                navBarButtonColor: theme.sidebarHeaderTextColor,
                screenBackgroundColor: theme.centerChannelBg,
            },
        });
    });

    goToAdvancedSettings = preventDoubleTap(() => {
        const {intl, navigator, theme} = this.props;
        navigator.push({
            screen: 'AdvancedSettings',
            title: intl.formatMessage({id: 'mobile.advanced_settings.title', defaultMessage: 'Advanced Settings'}),
            animated: true,
            backButtonTitle: '',
            navigatorStyle: {
                navBarTextColor: theme.sidebarHeaderTextColor,
                navBarBackgroundColor: theme.sidebarHeaderBg,
                navBarButtonColor: theme.sidebarHeaderTextColor,
                screenBackgroundColor: theme.centerChannelBg,
            },
        });
    });

    goToSelectTeam = preventDoubleTap(() => {
        const {currentUrl, intl, navigator, theme} = this.props;

        navigator.push({
            screen: 'SelectTeam',
            title: intl.formatMessage({id: 'mobile.routes.selectTeam', defaultMessage: 'Select Team'}),
            animated: true,
            backButtonTitle: '',
            navigatorStyle: {
                navBarTextColor: theme.sidebarHeaderTextColor,
                navBarBackgroundColor: theme.sidebarHeaderBg,
                navBarButtonColor: theme.sidebarHeaderTextColor,
                screenBackgroundColor: theme.centerChannelBg,
            },
            passProps: {
                currentUrl,
                theme,
            },
        });
    });

    goToClientUpgrade = preventDoubleTap(() => {
        const {intl, theme} = this.props;

        this.props.navigator.push({
            screen: 'ClientUpgrade',
            title: intl.formatMessage({id: 'mobile.client_upgrade', defaultMessage: 'Upgrade App'}),
            animated: true,
            backButtonTitle: '',
            navigatorStyle: {
                navBarHidden: false,
                navBarTextColor: theme.sidebarHeaderTextColor,
                navBarBackgroundColor: theme.sidebarHeaderBg,
                navBarButtonColor: theme.sidebarHeaderTextColor,
            },
            passProps: {
                userCheckedForUpgrade: true,
            },
        });
    });

    onNavigatorEvent = (event) => {
        if (event.id === 'willAppear') {
            setNavigatorStyles(this.props.navigator, this.props.theme);
        }

        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'close-settings') {
                this.props.navigator.dismissModal({
                    animationType: 'slide-down',
                });
            }
        }
    };

    openErrorEmail = preventDoubleTap(() => {
        const {config} = this.props;
        const recipient = config.SupportEmail;
        const subject = `Problem with ${config.SiteName} React Native app`;
        const mailTo = `mailto:${recipient}?subject=${subject}&body=${this.errorEmailBody()}`;

        Linking.canOpenURL(mailTo).then((supported) => {
            if (supported) {
                Linking.openURL(mailTo);
                this.props.actions.clearErrors();
            }
        });
    });

    openHelp = preventDoubleTap(() => {
        const {config} = this.props;
        const link = config.HelpLink ? config.HelpLink.toLowerCase() : '';

        Linking.canOpenURL(link).then((supported) => {
            if (supported) {
                Linking.openURL(link);
            }
        });
    });

    logout = preventDoubleTap(() => {
        const {logout} = this.props.actions;

        //this.closeSettingsSidebar();
        logout();
    });

    render() {
        const {config, joinableTeams, theme} = this.props;
        const style = getStyleSheet(theme);
        const showTeams = joinableTeams.length > 0;
        const showHelp = isValidUrl(config.HelpLink);
        const showArrow = Platform.OS === 'ios';

        return (
            <View style={style.container}>
                <StatusBar/>
                <ScrollView
                    contentContainerStyle={style.wrapper}
                    alwaysBounceVertical={false}
                >

                    <View style={style.separator}/>
                    <View style={style.block}>
                        <DrawerItem
                            defaultMessage='Notifications'
                            i18nId='user.settings.modal.notifications'
                            iconName='ios-notifications'
                            iconType='ion'
                            onPress={this.goToNotifications}
                            separator={true}
                            showArrow={showArrow}
                            theme={theme}
                        />
                        <DrawerItem
                            defaultMessage='Display'
                            i18nId='user.settings.modal.display'
                            iconName='ios-apps'
                            iconType='ion'
                            onPress={this.goToDisplaySettings}
                            separator={true}
                            showArrow={showArrow}
                            theme={theme}
                        />
                        {showTeams &&
                        <DrawerItem
                            defaultMessage='Open teams you can joins'
                            i18nId='mobile.select_team.join_open'
                            iconName='list'
                            iconType='foundation'
                            onPress={this.goToSelectTeam}
                            separator={true}
                            showArrow={showArrow}
                            theme={theme}
                        />
                        }

                        {showHelp &&
                        <DrawerItem
                            defaultMessage='Help'
                            i18nId='mobile.help.title'
                            iconName='md-help'
                            iconType='ion'
                            onPress={this.openHelp}
                            separator={true}
                            showArrow={showArrow}
                            theme={theme}
                        />
                        }

                        <DrawerItem
                            defaultMessage='Report a Problem'
                            i18nId='sidebar_right_menu.report'
                            iconName='exclamation'
                            iconType='fontawesome'
                            onPress={this.openErrorEmail}
                            separator={true}
                            showArrow={showArrow}
                            theme={theme}
                        />

                        <DrawerItem
                            defaultMessage='Advanced Settings'
                            i18nId='mobile.advanced_settings.title'
                            iconName='ios-hammer'
                            iconType='ion'
                            onPress={this.goToAdvancedSettings}
                            separator={false}
                            showArrow={showArrow}
                            theme={theme}
                        />
                    </View>

                    <View style={style.separator}/>
                    <View style={style.block}>
                        {LocalConfig.EnableMobileClientUpgrade && LocalConfig.EnableMobileClientUpgradeUserSetting &&
                        <DrawerItem
                            defaultMessage='Check for Upgrade'
                            i18nId='mobile.settings.modal.check_for_upgrade'
                            iconName='update'
                            iconType='material'
                            onPress={this.goToClientUpgrade}
                            separator={true}
                            showArrow={showArrow}
                            theme={theme}
                        />
                        }
                        <DrawerItem
                            defaultMessage='About'
                            i18nId='about.title'
                            iconName='ios-options'
                            iconType='ion'
                            onPress={this.goToAbout}
                            separator={false}
                            theme={theme}
                        />
                    </View>

                    <View style={style.separator}/>
                    <View style={style.block}>
                        <DrawerItem
                            centered={true}
                            defaultMessage='Logout'
                            i18nId='sidebar_right_menu.logout'
                            isDestructor={true}
                            onPress={this.logout}
                            separator={false}
                            theme={theme}
                            showArrow={false}
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        container: {
            flex: 1,
            backgroundColor: theme.centerChannelBg,
        },
        wrapper: {
            flex: 1,
            backgroundColor: changeOpacity(theme.centerChannelColor, 0.06),
        },
        block: {
            backgroundColor: theme.centerChannelBg,
            borderBottomColor: changeOpacity(theme.centerChannelColor, 0.1),
            borderBottomWidth: 0.5,
            borderTopColor: changeOpacity(theme.centerChannelColor, 0.1),
            borderTopWidth: 0.5,
        },
        divider: {
            backgroundColor: changeOpacity(theme.centerChannelColor, 0.1),
            height: 1,
        },
        separator: {
            marginTop: 20,
        },
    };
});

export default injectIntl(Settings);
