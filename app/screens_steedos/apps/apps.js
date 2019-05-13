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
import VectorIcon from 'app/components/vector_icon.js';

import DrawerItem from '../me/drawer_item';

import LocalConfig from 'assets/config';

export default class Apps extends PureComponent {
    static propTypes = {
        currentTeam: PropTypes.object,
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

    onNavigatorEvent = (event) => {
        if (event.id === 'willAppear') {
            setNavigatorStyles(this.props.navigator, this.props.theme);
        }
    };

    render() {
        if (!this.props.currentUserId)
            return null

        const {navigator, theme} = this.props;
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
                            uri={'https://cn.steedos.com/workflow/'}
                            navigator={navigator}
                            separator={false}
                            showArrow={showArrow}
                            theme={theme}
                            leftComponent={
                                <View style={style.iconContainer}>
                                    <VectorIcon
                                        name='ios-list'
                                        type='ion'
                                        style={[style.icon]}
                                    />
                                </View>
                            }
                        />
                        <DrawerItem
                            defaultMessage='邮件'
                            uri={'https://mail.steedos.cn/'}
                            navigator={navigator}
                            separator={false}
                            showArrow={showArrow}
                            theme={theme}
                            leftComponent={
                                <View style={style.iconContainer}>
                                    <VectorIcon
                                        name='ios-mail'
                                        type='ion'
                                        style={[style.icon]}
                                    />
                                </View>
                            }
                        />
                        <DrawerItem
                            defaultMessage='Contacts'
                            i18nId='mobile.tabs.contacts'
                            onPress={this.gotoContacts}
                            navigator={navigator}
                            separator={false}
                            showArrow={showArrow}
                            theme={theme}
                            leftComponent={
                                <View style={style.iconContainer}>
                                    <VectorIcon
                                        name='ios-people'
                                        type='ion'
                                        style={[style.icon]}
                                    />
                                </View>
                            }
                        />
                    </View>

                    <View style={style.separator}/>
                    <View style={style.block}>
                        <DrawerItem
                            defaultMessage='天气'
                            uri={'https://xw.tianqi.qq.com/'}
                            navigator={navigator}
                            separator={false}
                            showArrow={showArrow}
                            theme={theme}
                            leftComponent={
                                <View style={style.iconContainer}>
                                    <VectorIcon
                                        name='ios-sunny'
                                        type='ion'
                                        style={[style.icon]}
                                    />
                                </View>
                            }
                        />
                        <DrawerItem
                            defaultMessage='地图'
                            uri={'https://map.qq.com/m/index/map'}
                            navigator={navigator}
                            separator={false}
                            showArrow={showArrow}
                            theme={theme}
                            leftComponent={
                                <View style={style.iconContainer}>
                                    <VectorIcon
                                        name='ios-compass'
                                        type='ion'
                                        style={[style.icon]}
                                    />
                                </View>
                            }
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
            borderBottomColor: changeOpacity(theme.centerChannelColor, 0.0),
            borderBottomWidth: 1,
            borderTopColor: changeOpacity(theme.centerChannelColor, 0.0),
            borderTopWidth: 1,
        },
        divider: {
            backgroundColor: changeOpacity(theme.centerChannelColor, 0.0),
            height: 1,
        },
        separator: {
            marginTop: 20,
        },
        iconContainer: {
            width: 30,
            height: 30,
            backgroundColor: theme.buttonBg,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 10,
        },
        icon: {
            color: theme.buttonColor,
            fontSize: 20,
        },
    };
});