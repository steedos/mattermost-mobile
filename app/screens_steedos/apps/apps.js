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

export default class Apps extends PureComponent {
    static propTypes = {
        currentTeam: PropTypes.object.isRequired,
        currentUserId: PropTypes.string.isRequired,
        navigator: PropTypes.object,
        theme: PropTypes.object,
    };

    static contextTypes = {
        intl: intlShape,
    };

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    gotoContacts = preventDoubleTap((url) => {
        const {navigator, theme} = this.props;
        const {intl} = this.context;
        navigator.push({
            screen: 'Contacts',
            backButtonTitle: '',
            title: intl.formatMessage({id: 'mobile.tabs.contacts', defaultMessage: 'Contacts'}),
            animated: true,
            navigatorStyle: {
                navBarTextColor: theme.sidebarHeaderTextColor,
                navBarBackgroundColor: theme.sidebarHeaderBg,
                navBarButtonColor: theme.sidebarHeaderTextColor,
                screenBackgroundColor: theme.centerChannelBg,
            },
        });
    });

    gotoApp = preventDoubleTap((url) => {
        const {navigator, theme} = this.props;
        const {intl} = this.context;
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

    onNavigatorEvent = (event) => {
        if (event.id === 'willAppear') {
            setNavigatorStyles(this.props.navigator, this.props.theme);
        }
    };

    render() {
        const {theme} = this.props;
        const style = getStyleSheet(theme);
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
                            defaultMessage='Contacts'
                            i18nId='mobile.tabs.contacts'
                            iconName='ios-people'
                            iconType='ion'
                            onPress={this.gotoContacts}
                            separator={true}
                            showArrow={showArrow}
                            theme={theme}
                        />
                    </View>

                    <View style={style.separator}/>
                    <View style={style.block}>
                        <DrawerItem
                            defaultMessage='审批'
                            i18nId='审批'
                            iconName='ios-list'
                            iconType='ion'
                            onPress={this.gotoApp}
                            separator={false}
                            theme={theme}
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
            backgroundColor: theme.mobileBg,
        },
        wrapper: {
            flex: 1,
        },
        block: {
            backgroundColor: theme.mobileSectionItemBg,
            borderBottomColor: theme.mobileSectionSeperator,
            borderBottomWidth: 1,
            borderTopColor: theme.mobileSectionSeperator,
            borderTopWidth: 1,
        },
        divider: {
            backgroundColor: theme.mobileSectionSeperator,
            height: 1,
        },
        separator: {
            marginTop: 35,
        },
    };
});