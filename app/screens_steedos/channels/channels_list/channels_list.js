// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
    Platform,
    View,
    Text,
} from 'react-native';
import {intlShape} from 'react-intl';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import SearchBar from 'app/components/search_bar';
import {ViewTypes} from 'app/constants';
import {changeOpacity, makeStyleSheetFromTheme} from 'app/utils/theme';

import List from './list';
import SwitchTeamsButton from './switch_teams_button';

const {ANDROID_TOP_PORTRAIT} = ViewTypes;
let FilteredList = null;

export default class ChannelsList extends PureComponent {
    static propTypes = {
        navigator: PropTypes.object,
        onJoinChannel: PropTypes.func.isRequired,
        onSearchEnds: PropTypes.func.isRequired,
        onSearchStart: PropTypes.func.isRequired,
        onSelectChannel: PropTypes.func.isRequired,
        onShowTeams: PropTypes.func.isRequired,
        onRefresh: PropTypes.func.isRequired,
        theme: PropTypes.object.isRequired,
        drawerOpened: PropTypes.bool,
    };

    static contextTypes = {
        intl: intlShape.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            searching: false,
            term: '',
        };

        MaterialIcon.getImageSource('close', 20, this.props.theme.sidebarHeaderTextColor).then((source) => {
            this.closeButton = source;
        });
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.drawerOpened && this.props.drawerOpened) {
            this.cancelSearch();
        }
    }

    onSelectChannel = (channel, currentChannelId) => {
        if (channel.fake) {
            this.props.onJoinChannel(channel, currentChannelId);
        } else {
            this.props.onSelectChannel(channel, currentChannelId);
        }

        if (this.refs.search_bar) {
            this.refs.search_bar.cancel();
        }
    };

    onSearch = (term) => {
        this.setState({term});
    };

    onSearchFocused = () => {
        if (!FilteredList) {
            FilteredList = require('./filtered_list').default;
        }
        this.setState({searching: true});
        this.props.onSearchStart();
    };

    cancelSearch = () => {
        this.props.onSearchEnds();
        this.setState({searching: false});
        this.onSearch('');
    };

    render() {
        const {intl} = this.context;
        const {
            navigator,
            onShowTeams,
            theme,
        } = this.props;

        const {searching, term} = this.state;
        const styles = getStyleSheet(theme);

        let list;
        if (searching) {
            list = (
                <FilteredList
                    onSelectChannel={this.onSelectChannel}
                    styles={styles}
                    term={term}
                />
            );
        } else {
            list = (
                <List
                    navigator={navigator}
                    onSelectChannel={this.onSelectChannel}
                    onRefresh={this.props.onRefresh}
                    styles={styles}
                />
            );
        }

        const searchBarInput = {
            backgroundColor: changeOpacity(theme.sidebarHeaderTextColor, 0.2),
            color: theme.sidebarHeaderTextColor,
            fontSize: 15,
            ...Platform.select({
                android: {
                    marginBottom: -5,
                },
            }),
        };

        const searchbar = (
            <View style={styles.searchContainer}>
                <SearchBar
                    ref='search_bar'
                    placeholder={intl.formatMessage({id: 'mobile.channel_drawer.search', defaultMessage: 'Jump to...'})}
                    cancelTitle={intl.formatMessage({id: 'mobile.post.cancel', defaultMessage: 'Cancel'})}
                    backgroundColor='transparent'
                    inputHeight={34}
                    inputStyle={searchBarInput}
                    placeholderTextColor={changeOpacity(theme.sidebarHeaderTextColor, 0.5)}
                    tintColorSearch={changeOpacity(theme.sidebarHeaderTextColor, 0.5)}
                    tintColorDelete={changeOpacity(theme.sidebarHeaderTextColor, 0.5)}
                    titleCancelColor={theme.sidebarHeaderTextColor}
                    selectionColor={changeOpacity(theme.sidebarHeaderTextColor, 0.5)}
                    onSearchButtonPress={this.onSearch}
                    onCancelButtonPress={this.cancelSearch}
                    onChangeText={this.onSearch}
                    onFocus={this.onSearchFocused}
                    value={term}
                />
            </View>
        );

        let teamName = '华信';
        if (this.props.currentTeam)
            teamName = this.props.currentTeam.display_name;
        const teamTitle = (
            <View style={styles.headerTitleWrapper}>
                <Text
                    ellipsizeMode='tail'
                    numberOfLines={1}
                    style={styles.headerTitle}
                >
                    {teamName}
                </Text>
            </View>
        );

        return (
            <View
                style={styles.container}
            >
                {/* <View style={styles.statusBar}>
                    <View style={styles.headerContainer}>
                        <View style={styles.switchContainer}>
                            <SwitchTeamsButton
                                searching={searching}
                                onShowTeams={onShowTeams}
                            />
                        </View>
                        {searchbar}
                        {teamTitle}
                    </View>
                </View> */}
                {list}
            </View>
        );
    }
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        container: {
            backgroundColor: changeOpacity(theme.centerChannelColor, 0.06),
            flex: 1,
        },
        statusBar: {
            backgroundColor: theme.sidebarHeaderBg,
        },
        itemContainer: {
            backgroundColor: theme.itemBg,
        },
        headerContainer: {
            alignItems: 'center',
            backgroundColor: theme.sidebarHeaderBg,
            flexDirection: 'row',
            borderBottomWidth: 0,
            top: 0, 
            borderBottomColor: changeOpacity(theme.sidebarHeaderTextColor, 0.10),
            ...Platform.select({
                android: {
                    height: ANDROID_TOP_PORTRAIT,
                },
                ios: {
                    height: 44,
                },
            }),
        },
        headerTitleWrapper: {
            alignItems: 'flex-start',
            top: -1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
        },
        headerTitle: {
            color: theme.sidebarHeaderTextColor,
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
        },
        switchContainer: {
            position: 'relative',
            top: -1,
        },
        titleContainer: { // These aren't used by this component, but they are passed down to the list component
            alignItems: 'center',
            flex: 1,
            flexDirection: 'row',
            //paddingTop: 16,
            height: 36,
            paddingLeft: 16,
            backgroundColor: theme.sectionHeaderBg,
        },
        title: {
            flex: 1,
            color: theme.sectionHeaderTextColor,
            opacity: 1,
            fontSize: 13,
            fontWeight: '400',
            letterSpacing: 0.8,
            lineHeight: 18,
        },
        searchContainer: {
            flex: 1,
            paddingRight: 10,
            ...Platform.select({
                android: {
                    marginBottom: 1,
                },
                ios: {
                    marginBottom: 3,
                },
            }),
        },
        itemDivider: {
            backgroundColor: theme.itemSeperator,
            //color: changeOpacity(theme.centerChannelColor, 0.0),
            height: 0.5,
            marginLeft: 50,
        },
        divider: {
            backgroundColor: theme.itemSeperator,
            height: 0,
        },
        actionContainer: {
            alignItems: 'center',
            height: 48,
            justifyContent: 'center',
            width: 50,
        },
        action: {
            color: theme.sectionHeaderText,
            fontSize: 20,
            fontWeight: '500',
            lineHeight: 18,
        },
        above: {
            backgroundColor: theme.mentionBg,
            top: 9,
        },
    };
});
