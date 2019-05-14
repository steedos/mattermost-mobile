// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {TouchableHighlight, View, Text} from 'react-native';

import FormattedText from 'app/components/formatted_text';
import VectorIcon from 'app/components/vector_icon.js';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {changeOpacity, makeStyleSheetFromTheme} from 'app/utils/theme';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {preventDoubleTap} from 'app/utils/tap';

export default class DrawerItem extends PureComponent {
    static propTypes = {
        navigator: PropTypes.object,
        centered: PropTypes.bool,
        defaultMessage: PropTypes.string,
        i18nId: PropTypes.string,
        iconName: PropTypes.string,
        iconType: PropTypes.oneOf(['fontawesome', 'foundation', 'ion', 'material']),
        isDestructor: PropTypes.bool,
        labelComponent: PropTypes.node,
        leftComponent: PropTypes.node,
        onPress: PropTypes.func,
        uri: PropTypes.string,
        separator: PropTypes.bool,
        showArrow: PropTypes.bool,
        theme: PropTypes.object.isRequired,
    };

    static defaultProps = {
        defaultMessage: '',
        isDestructor: false,
        separator: true,
        showArrow: true,
    };

    onPress = () => {
        const {uri, onPress} = this.props;
        if (uri) {
            this.openBrowser(uri);
        } else if (onPress) {
            onPress();
        }
    }

    openBrowser = preventDoubleTap(async (url) => {
        const {navigator, theme, defaultMessage} = this.props;
        navigator.push({
            screen: 'Browser',
            backButtonTitle: '',
            title: defaultMessage,
            animated: true,
            navigatorStyle: {
                navBarTextColor: theme.sidebarHeaderTextColor,
                navBarBackgroundColor: theme.sidebarHeaderBg,
                navBarButtonColor: theme.sidebarHeaderTextColor,
                screenBackgroundColor: theme.centerChannelBg,
                tabBarHidden: true,
            },
            passProps: {
                url,
            },
        });
    })

    gotoWeb = preventDoubleTap(async (url) => {
        const {theme} = this.props;

        try {
            if (InAppBrowser && await InAppBrowser.isAvailable()) {
                await InAppBrowser.open(url, {

                    // iOS Properties
                    dismissButtonStyle: 'close',
                    preferredBarTintColor: theme.mobileNavBarBg,
                    preferredControlTintColor: theme.mobileNavBarTextColor,
                    readerMode: false,

                    // Android Properties
                    showTitle: true,
                    toolbarColor: theme.mobileNavBarBg,
                    secondaryToolbarColor: theme.mobileNavBarBg,
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
                    },
                });
            }
        } catch (e) {
            //Alert.alert(e.message);
        }
    });

    render() {
        const {
            centered,
            defaultMessage,
            i18nId,
            iconName,
            iconType,
            isDestructor,
            labelComponent,
            leftComponent,
            separator,
            showArrow,
            theme,
        } = this.props;
        const style = getStyleSheet(theme);

        const destructor = {};
        if (isDestructor) {
            destructor.color = theme.errorTextColor;
        }

        let divider;
        if (separator) {
            divider = (<View style={style.divider}/>);
        }

        let icon;
        if (leftComponent) {
            icon = leftComponent;
        } else if (iconType && iconName) {
            icon = (
                <VectorIcon
                    name={iconName}
                    type={iconType}
                    style={[style.icon, destructor]}
                />
            );
        }

        let label;
        if (labelComponent) {
            label = labelComponent;
        } else if (i18nId) {
            label = (
                <FormattedText
                    id={i18nId}
                    defaultMessage={defaultMessage}
                    style={[style.label, destructor, centered ? style.centerLabel : {}]}
                />
            );
        } else if (defaultMessage) {
            label = (
                <Text 
                    style={[style.label, destructor, centered ? style.centerLabel : {}]}>
                    {defaultMessage}
                </Text>
            )
        }

        let additionalComponent;
        if (showArrow) {
            additionalComponent = (
                <FontAwesomeIcon
                    name='angle-right'
                    style={style.arrow}
                />
            );
        }

        return (
            <TouchableHighlight
                onPress={this.onPress}
                underlayColor={changeOpacity(theme.centerChannelColor, 0.1)}
                style={style.highlight}
            >
                <View style={style.container}>
                    {icon && 
                    <View style={style.iconContainer}>
                        {icon}
                    </View>
                    }
                    <View style={style.wrapper}>
                        <View style={style.labelContainer}>
                            {label}
                            {Boolean(additionalComponent) &&
                            <View style={style.arrowContainer}>
                                {additionalComponent}
                            </View>
                            }
                        </View>
                        {divider}
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        highlight: {
            backgroundColor: theme.centerChannelBg,
        },
        container: {
            alignItems: 'center',
            flexDirection: 'row',
            minHeight: 50, 
        },
        iconContainer: {
            minWidth: 50,
            minHeight: 50,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 5,
        },
        icon: {
            color: theme.linkColor,
            fontSize: 22,
        },
        wrapper: {
            flex: 1,
        },
        labelContainer: {
            alignItems: 'center',
            flex: 1,
            flexDirection: 'row',
        },
        centerLabel: {
            textAlign: 'center',
            textAlignVertical: 'center',
        },
        label: {
            color: theme.centerChannelColor,
            flex: 1,
            fontSize: 17,
            textAlignVertical: 'center',
            includeFontPadding: false,
        },
        divider: {
            backgroundColor: changeOpacity(theme.centerChannelColor, 0.1),
            height: 0.5,
        },
        arrowContainer: {
            justifyContent: 'center',
            paddingRight: 15,
        },
        arrow: {
            color: changeOpacity(theme.centerChannelColor, 0.25),
            fontSize: 18,
        },
    };
});
