// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {intlShape} from 'react-intl';
import {
    BackHandler,
    InteractionManager,
    Keyboard,
    ScrollView,
    View, Text,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {General} from 'mattermost-redux/constants';
import EventEmitter from 'mattermost-redux/utils/event_emitter';

import SafeAreaView from 'app/components/safe_area_view';
import DrawerLayout from 'app/components/sidebars/drawer_layout';
import UserStatus from 'app/components/user_status';
import {NavigationTypes} from 'app/constants';
import {confirmOutOfOfficeDisabled} from 'app/utils/status';
import {preventDoubleTap} from 'app/utils/tap';
import {changeOpacity, makeStyleSheetFromTheme} from 'app/utils/theme';
import {t} from 'app/utils/i18n';

import DrawerItem from './drawer_item';
import UserInfo from 'app/components/sidebars/settings/user_info';
import StatusLabel from 'app/components/sidebars/settings/status_label';
import {setNavigatorStyles} from 'app/utils/theme';

const DRAWER_INITIAL_OFFSET = 80;

export default class Me extends PureComponent {
    static propTypes = {
        actions: PropTypes.shape({
            logout: PropTypes.func.isRequired,
            setStatus: PropTypes.func.isRequired,
        }).isRequired,
        children: PropTypes.node,
        currentUser: PropTypes.object.isRequired,
        navigator: PropTypes.object,
        status: PropTypes.string,
        theme: PropTypes.object.isRequired,
    };

    static defaultProps = {
        currentUser: {},
        status: 'offline',
    };

    static contextTypes = {
        intl: intlShape,
    };

    constructor(props) {
        super(props);

        MaterialIcon.getImageSource('close', 20, props.theme.sidebarHeaderTextColor).then((source) => {
            this.closeButton = source;
        });
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentDidUpdate(prevProps) {
        const {navigator, theme} = this.props;

        if (theme !== prevProps.theme) {
            setNavigatorStyles(navigator, theme);
        }
    }
    
    onNavigatorEvent(event) {
        switch (event.id) {
        case 'willAppear':
            // const {theme} = this.props;
            // this.props.navigator.setStyle({
            //     statusBarHidden: false,
            //     statusBarHideWithNavBar: false,
            //     navBarTextColor: theme.sidebarHeaderTextColor,
            //     navBarBackgroundColor: theme.sidebarHeaderBg,
            //     navBarButtonColor: theme.sidebarHeaderTextColor,
            //     screenBackgroundColor: theme.bodyBg
            // });
            break;
        case 'didAppear': {
            break;
        }
        case 'willDisappear':
            break;
        case 'didDisappear':
            break;
        case 'willCommitPreview':
            break;
        }
    }

    handleSetStatus = preventDoubleTap(() => {
        const items = [{
            action: () => this.setStatus(General.ONLINE),
            text: {
                id: t('mobile.set_status.online'),
                defaultMessage: 'Online',
            },
        }, {
            action: () => this.setStatus(General.AWAY),
            text: {
                id: t('mobile.set_status.away'),
                defaultMessage: 'Away',
            },
        }, {
            action: () => this.setStatus(General.DND),
            text: {
                id: t('mobile.set_status.dnd'),
                defaultMessage: 'Do Not Disturb',
            },
        }, {
            action: () => this.setStatus(General.OFFLINE),
            text: {
                id: t('mobile.set_status.offline'),
                defaultMessage: 'Offline',
            },
        }];

        this.props.navigator.showModal({
            screen: 'OptionsModal',
            title: '',
            animationType: 'none',
            passProps: {
                items,
            },
            navigatorStyle: {
                navBarHidden: true,
                statusBarHidden: false,
                statusBarHideWithNavBar: false,
                screenBackgroundColor: 'transparent',
                modalPresentationStyle: 'overCurrentContext',
            },
        });
    });

    goToEditProfile = preventDoubleTap(() => {
        const {currentUser} = this.props;
        const {formatMessage} = this.context.intl;

        this.openModal(
            'EditProfile',
            formatMessage({id: 'mobile.routes.edit_profile', defaultMessage: 'Edit Profile'}),
            {currentUser}
        );
    });

    goToFlagged = preventDoubleTap(() => {
        const {formatMessage} = this.context.intl;

        this.navigateTo(
            'FlaggedPosts',
            formatMessage({id: 'search_header.title3', defaultMessage: 'Flagged Posts'}),
        );
    });

    goToMentions = preventDoubleTap(() => {
        const {intl} = this.context;

        this.navigateTo(
            'RecentMentions',
            intl.formatMessage({id: 'search_header.title2', defaultMessage: 'Recent Mentions'}),
        );
    });

    goToSettings = preventDoubleTap(() => {
        const {intl} = this.context;

        this.navigateTo(
            'SteedosSettings',
            intl.formatMessage({id: 'mobile.routes.settings', defaultMessage: 'Settings'}),
        );
    });

    logout = preventDoubleTap(() => {
        const {logout} = this.props.actions;

        //this.closeSettingsSidebar();
        logout();
    });

    navigateTo= (screen, title, passProps) => {
        const {navigator, theme} = this.props;

        // navigator.toggleTabs({
        //     to: 'hidden', // required, 'hidden' = hide navigation bar, 'shown' = show navigation bar
        //     animated: false // does the toggle have transition animation or does it happen immediately (optional). By default animated: true
        // });
        InteractionManager.runAfterInteractions(() => {
            navigator.push({
                screen,
                title,
                animated: true,
                backButtonTitle: '',
                navigatorStyle: {
                    navBarHidden: false,
                    navBarTextColor: theme.sidebarHeaderTextColor,
                    navBarBackgroundColor: theme.sidebarHeaderBg,
                    navBarButtonColor: theme.sidebarHeaderTextColor,
                    tabBarHidden: true,
                },
                passProps,
            });
        });
    };

    openModal = (screen, title, passProps) => {
        const {navigator, theme} = this.props;

        InteractionManager.runAfterInteractions(() => {
            navigator.showModal({
                screen,
                title,
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
                        id: 'close-settings',
                        icon: this.closeButton,
                    }],
                },
                passProps,
            });
        });
    };

    renderUserStatusIcon = (userId) => {
        return (
            <UserStatus
                size={18}
                userId={userId}
            />
        );
    };

    renderUserStatusLabel = (userId) => {
        return (
            <StatusLabel userId={userId}/>
        );
    };

    render() {
        const {currentUser, navigator, theme} = this.props;
        const style = getStyleSheet(theme);

        return (
            <View style={style.container}>
                <ScrollView
                    contentContainerStyle={style.wrapper}
                >
                    <View style={style.separator}/>
                    <View style={style.block}>
                        <UserInfo
                            onPress={this.goToEditProfile}
                            user={currentUser}
                        />
                    </View>
                    <View style={style.separator}/>
                    <View style={style.block}>
                        <DrawerItem
                            labelComponent={this.renderUserStatusLabel(currentUser.id)}
                            leftComponent={this.renderUserStatusIcon(currentUser.id)}
                            separator={false}
                            onPress={this.handleSetStatus}
                            theme={theme}
                        />
                    </View>
                    <View style={style.separator}/>
                    <View style={style.block}>
                        <DrawerItem
                            defaultMessage='Recent Mentions'
                            i18nId='search_header.title2'
                            iconName='ios-at'
                            iconType='ion'
                            onPress={this.goToMentions}
                            separator={true}
                            theme={theme}
                        />
                        <DrawerItem
                            defaultMessage='Flagged Posts'
                            i18nId='search_header.title3'
                            iconName='ios-flag'
                            iconType='ion'
                            onPress={this.goToFlagged}
                            separator={false}
                            theme={theme}
                        />
                    </View>
                    <View style={style.separator}/>
                    <View style={style.block}>
                        <DrawerItem
                            defaultMessage='Settings'
                            i18nId='mobile.routes.settings'
                            iconName='ios-options'
                            iconType='ion'
                            onPress={this.goToSettings}
                            separator={false}
                            theme={theme}
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }

    confirmReset = (status) => {
        const {intl} = this.context;
        confirmOutOfOfficeDisabled(intl, status, this.updateStatus);
    };

    updateStatus = (status) => {
        const {currentUser: {id: currentUserId}} = this.props;
        this.props.actions.setStatus({
            user_id: currentUserId,
            status,
        });
    };

    setStatus = (status) => {
        const {status: currentUserStatus, navigator} = this.props;

        if (currentUserStatus === General.OUT_OF_OFFICE) {
            navigator.dismissModal({
                animationType: 'none',
            });

            //this.closeSettingsSidebar();
            this.confirmReset(status);
            return;
        }
        this.updateStatus(status);
        EventEmitter.emit(NavigationTypes.NAVIGATION_CLOSE_MODAL);
    };
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        container: {
            flex: 1,
            backgroundColor: theme.mobileBg,
        },
        wrapper: {
            flex: 1,
            paddingTop: 0,
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
