// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Keyboard,
    Image,
    TouchableHighlight,
    ActivityIndicator,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';

// keeps the reference to the browser
let browserRef = null;

// initial url for the browser
const url = 'http://www.steedos.com';

// functions to search using different engines
const searchEngines = {
    google: (uri) => `https://www.google.com/search?q=${uri}`,
    bing: (uri) => `https://www.bing.com/search?q=${uri}`
};

// upgrade the url to make it easier for the user:
//
// https://www.facebook.com => https://www.facebook.com
// facebook.com => https://www.facebook.com
// facebook => https://www.google.com/search?q=facebook
function upgradeURL(uri, searchEngine = 'bing') {
    const isURL = uri.split(' ').length === 1 && uri.includes('.');
    if (isURL) {
        if (!uri.startsWith('http')) {
            return 'https://www.' + uri;
        }
        return uri;
    }

    // search for the text in the search engine
    const encodedURI = encodeURI(uri);
    return searchEngines[searchEngine](encodedURI);
}

// javascript to inject into the window
const injectedJavaScript = `
      window.ReactNativeWebView.postMessage('injected javascript works!');
      true; // note: this is required, or you'll sometimes get silent failures   
`;

class Browser extends Component {
    static propTypes = {
        navigator: PropTypes.object,
        theme: PropTypes.object.isRequired,
        url: PropTypes.string.isRequired,
    };

    state = {
        currentURL: url,
        urlText: url,
        title: '',
        canGoForward: false,
        canGoBack: false,
        incognito: false,

        // change configurations so the user can
        // better control the browser
        config: {
            detectorTypes: 'all',
            allowStorage: true,
            allowJavascript: true,
            allowCookies: true,
            allowLocation: true,
            allowCaching: true,
            defaultSearchEngine: 'bing',
        },
    };

    constructor(props) {
        super(props);

        Promise.all([
            Icon.getImageSource('ios-arraw-back', 24),
            Icon.getImageSource('ios-arraw-forward', 24),
            Icon.getImageSource('ios-refresh', 24),
            Icon.getImageSource('ios-globe', 24),
            Icon.getImageSource('ios-eye', 24),
        ]).then((sources) => {
            this.arrowBackIcon = sources[0];
            this.arrowNextIcon = sources[1];
            this.refreshIcon = sources[2];
            this.webIcon = sources[3];
            this.incognitoIcon = sources[4];

            this.rightButtons = [
                {
                    icon: this.refreshIcon, // for a textual button, provide the button title (label)
                    id: 'buttonRefresh', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                },
            ];

            this.props.navigator.setButtons({
                rightButtons: this.rightButtons,
            });
        });
    }

    onNavigatorEvent(event) {
        switch (event.id) {
        case 'willAppear':
            break;
        case 'didAppear':
            break;
        case 'willDisappear':
            break;
        case 'didDisappear':
            break;
        case 'willCommitPreview':
            break;
        case 'buttonRefresh':
            this.reload();
            break;
        }
    }

    // get the configuration, this allows us to change
    // configurations for incognito mode
    getConfig = () => {
        const {incognito, config} = this.state;
        if (incognito) {
            return {
                ...config,
                allowStorage: false,
                allowCookies: false,
                allowLocation: false,
                allowCaching: false,
            };
        }
        return config;
    };

    // toggle incognito mode
    toggleIncognito = () => {
        this.setState({
            incognito: !this.state.incognito,
        });
        this.reload();
    };

    // load the url from the text input
    loadURL = () => {
        const {config, urlText} = this.state;
        const {defaultSearchEngine} = config;
        const newURL = upgradeURL(urlText, defaultSearchEngine);

        this.setState({
            currentURL: newURL,
            urlText: newURL,
        });
        Keyboard.dismiss();
    };

    // update the text input
    updateUrlText = (text) => {
        this.setState({
            urlText: text,
        });
    };

    // go to the next page
    goForward = () => {
        if (browserRef && this.state.canGoForward) {
            browserRef.goForward();
        }
    };

    // go back to the last page
    goBack = () => {
        if (browserRef && this.state.canGoBack) {
            browserRef.goBack();
        }
    };

    // reload the page
    reload = () => {
        if (browserRef) {
            browserRef.reload();
        }
    };

    // set the reference for the browser
    setBrowserRef = (browser) => {
        if (!browserRef) {
            browserRef = browser;
        }
    };

    // called when there is an error in the browser
    onBrowserError = (syntheticEvent) => {
        const {nativeEvent} = syntheticEvent;
        console.warn('WebView error: ', nativeEvent)
    };

    // called when the webview is loaded
    onBrowserLoad = (syntheticEvent) => {
        const {canGoForward, canGoBack, title} = syntheticEvent.nativeEvent;
        this.setState({
            canGoForward,
            canGoBack,
            title,
        })
    };

    // called when the navigation state changes (page load)
    onNavigationStateChange = (navState) => {
        const {canGoForward, canGoBack, title} = navState;
        this.setState({
            canGoForward,
            canGoBack,
            title,
        })
    };

    // can prevent requests from fulfilling, good to log requests
    // or filter ads and adult content.
    filterRequest = (request) => {
        return true;
    };

    // called when the browser sends a message using "window.ReactNativeWebView.postMessage"
    onBrowserMessage = (event) => {
        console.log('*'.repeat(10));
        console.log('Got message from the browser:', event.nativeEvent.data);
        console.log('*'.repeat(10));
    };

    render() {
        const {state} = this;
        const {canGoForward, canGoBack, title, incognito} = state;
        const {url} = this.props;
        const config = this.getConfig();

        // this.props.navigator.setTitle({
        //     title: url,
        // });

        return (
            <View style={styles.browserContainer}>
                <WebView
                    ref={this.setBrowserRef}
                    originWhitelist={['*']}
                    source={{uri: url}}
                    onLoad={this.onBrowserLoad}
                    onError={this.onBrowserError}
                    onNavigationStateChange={this.onNavigationStateChange}
                    renderLoading={() => <ActivityIndicator size='large' color='#0000ff' /> }
                    onShouldStartLoadWithRequest={this.filterRequest}
                    onMessage={this.onBrowserMessage}
                    dataDetectorTypes={config.detectorTypes}
                    thirdPartyCookiesEnabled={config.allowCookies}
                    domStorageEnabled={config.allowStorage}
                    javaScriptEnabled={config.allowJavascript}
                    geolocationEnabled={config.allowLocation}
                    cacheEnabled={config.allowCaching}
                    injectedJavaScript={injectedJavaScript}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    browser: {
        flex: 1,
    },
    icon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    disabled: {
        opacity: 0.3,
    },
    browserTitleContainer: {
        height: 30,
        justifyContent: 'center',
        paddingLeft: 8,
    },
    browserTitle: {
        fontWeight: 'bold',
    },
    browserBar: {
        height: 40,
        backgroundColor: 'steelblue',
        flexDirection: 'row',
        alignItems: 'center',
    },
    browserAddressBar: {
        height: 40,
        backgroundColor: 'white',
        borderRadius: 3,
        flex: 1,
        borderWidth: 0,
        marginRight: 8,
        paddingLeft: 8,
    },
    browserContainer: {
        flex: 2,
    }
});

export default Browser;