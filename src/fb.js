import moment from 'moment';
import fetch from 'node-fetch';
import has from 'lodash/has';
import map from 'lodash/map';

import settings from '../settings.json';

if (!has(settings, 'facebook.appId')) {
    throw new Error('Missing Facebook settings!');
}

const {appId, appSecret} = settings.facebook;

if (!appId || !appSecret) {
    throw new Error('Missing Facebook app credentials');
}
const accessToken = `${appId}|${appSecret}`;

const qs = params => map(params, (value, key) => encodeURIComponent(key) + '=' + encodeURIComponent(value)).join('&');

/**
 * Facebook Graph API wrapper
 * @param {string} resource - graph resource
 * @param {[string]} fields - fields to fetch
 * @param {*} params - any extra parameters for the call
 */
const fbApi = async (
    resource = '',
    {
        fields = [],
        ...params,
    } = {}
) => fetch(
    `https://graph.facebook.com/v2.8/${resource}?${qs({
        access_token: accessToken,
        fields: fields.join(','),
        ...params
    })}`)
    .then(res => res.json())
    .then(res => {
        if (res.error) {
            const {message, type, code} = res.error;
            throw new Error(`[${type}] ${message} (${code})`);
        }
        return res.data;
    });

/**
 * Fetch today posts for given Facebook page
 * @param {string} pageId - fbId or vanity url
 * @returns {{
 * id: string,
 * message: string,
 * full_picture: string,
 * created_time: string
 * }[]} array of today posts from oldest to newest
 */
export const getTodayPosts = async ({pageId}) => {
    const posts = await fbApi(`${pageId}/posts`, {
        fields: [
            'message',
            'full_picture',
            'created_time',
        ]
    });

    // Comparing based on UTC concept of a day - should not be an issue here
    return posts
        .filter(post => moment().isSame(post.created_time, 'day'))
        .sort((a, b) => a.created_time > b.created_time);
};
