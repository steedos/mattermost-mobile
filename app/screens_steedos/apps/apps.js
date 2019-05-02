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
    Alert,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import SettingsItem from 'app/screens/settings/settings_item';
import FormattedText from 'app/components/formatted_text';
import StatusBar from 'app/components/status_bar';
import {preventDoubleTap} from 'app/utils/tap';
import {changeOpacity, makeStyleSheetFromTheme, setNavigatorStyles} from 'app/utils/theme';
import {isValidUrl} from 'app/utils/url';
import {t} from 'app/utils/i18n';
import InAppBrowser from 'react-native-inappbrowser-reborn';

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

    gotoContacts = preventDoubleTap(() => {
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

    gotoApp = () => {
        return this.gotoWeb('https://cn.steedos.com/workflow/');
    };

    gotoAbout = () => {
        return this.gotoWeb('https://www.steedos.com/cn/workflow/');
    };
    
    gotoWeb = preventDoubleTap( async (url) => {
        const {navigator, theme} = this.props;

        try {
            if (InAppBrowser && await InAppBrowser.isAvailable()) {
                const result = await InAppBrowser.open(url, {
                    // iOS Properties
                    dismissButtonStyle: 'close',
                    preferredBarTintColor: "#FFFFFF",
                    preferredControlTintColor: theme.linkColor,
                    readerMode: false,
                    // Android Properties
                    showTitle: true,
                    toolbarColor: '#6200EE',
                    secondaryToolbarColor: 'black',
                    enableUrlBarHiding: true,
                    enableDefaultShare: true,
                    forceCloseOnRedirection: false,
                    // Specify full animation resource identifier(package:anim/name)
                    // or only resource name(in case of animation bundled with app).
                    animations: {
                    startEnter: 'slide_in_right',
                    startExit: 'slide_out_left',
                    endEnter: 'slide_in_right',
                    endExit: 'slide_out_left',
                    },
                    headers: {
                    //'my-custom-header': 'my custom header value'
                    },
                })
            }
        } catch (e) {
            Alert.alert(e.message)
        }
        
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
                <ScrollView
                    contentContainerStyle={style.wrapper}
                    alwaysBounceVertical={false}
                >

                    <View style={style.separator}/>
                    <View style={style.block}>
                        <DrawerItem
                            defaultMessage='审批'
                            iconName='ios-list'
                            iconType='ion'
                            onPress={this.gotoApp}
                            separator={true}
                            showArrow={showArrow}
                            theme={theme}
                        />
                        <DrawerItem
                            defaultMessage='Contacts'
                            i18nId='mobile.tabs.contacts'
                            iconName='ios-people'
                            iconType='ion'
                            onPress={this.gotoContacts}
                            separator={false}
                            showArrow={showArrow}
                            theme={theme}
                        />
                    </View>

                    <View style={style.separator}/>
                    <View style={style.block}>
                        <DrawerItem
                            defaultMessage='关于'
                            iconName='ios-information-circle-outline'
                            iconType='ion'
                            onPress={this.gotoAbout}
                            separator={false}
                            showArrow={showArrow}
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