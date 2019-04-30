// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import DeviceInfo from 'react-native-device-info';

import {DEFAULT_LOCALE} from 'mattermost-redux/constants/general';
import {getCurrentUserLocale} from 'mattermost-redux/selectors/entities/i18n';

// Not a proper selector since the device locale isn't in the redux store
export function getCurrentLocale(state) {
    let deviceLocale = DeviceInfo.getDeviceLocale();
    switch (deviceLocale) {
    case 'zh-Hans-CN':
        deviceLocale = 'zh-CN';
        break;
    case 'zh-Hans-TW':
        deviceLocale = 'zh-TW';
        break;
    default:
        deviceLocale = deviceLocale.split('-')[0];
    }
    const defaultLocale = deviceLocale || DEFAULT_LOCALE;

    return getCurrentUserLocale(state, defaultLocale);
}
