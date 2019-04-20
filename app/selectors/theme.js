// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {createSelector} from 'reselect';

import Preferences from 'mattermost-redux/constants/preferences';
import {getConfig} from 'mattermost-redux/selectors/entities/general';
import {getTheme} from 'mattermost-redux/selectors/entities/preferences';

export const getAllowedThemes = createSelector(
    getConfig,
    getTheme,
    (config) => {
        const allThemes = Object.keys(Preferences.THEMES).map((key) => ({
            ...Preferences.THEMES[key],
            key,
        }));
        let acceptableThemes = allThemes;
        const allowedThemeKeys = (config.AllowedThemes || '').split(',').filter(String);
        if (allowedThemeKeys.length) {
            acceptableThemes = allThemes.filter((theme) => allowedThemeKeys.includes(theme.key));
        }
        return acceptableThemes;
    }
);

export const getCustomTheme = createSelector(
    getConfig,
    getTheme,
    (config, activeTheme) => {
        if (config.AllowCustomThemes === 'true' && activeTheme.type === 'custom') {
            return {
                ...activeTheme,
                key: 'custom',
            };
        }
        return null;
    }
);

export const getMobileTheme = createSelector(
    getConfig,
    getTheme,
    (config, activeTheme) => {
        return {
            ...activeTheme,
            screenBg: "#F0F0F0",
            itemSeperator: "#A7A7A7",
            itemBg: "#FFFFFF",
            itemTextColor: "#000000",
            sectionHeaderBg: "#ECECF2",
            sectionHeaderTextColor: "#666666",
        };
    }
);