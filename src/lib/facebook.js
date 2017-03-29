import moment from 'moment';
import fetch from 'node-fetch';
import qs from 'qs';

const {
    FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET,
} = process.env || {};

if (!FACEBOOK_APP_ID || !FACEBOOK_APP_SECRET) {
    throw new Error('You must provide Facebook App Environment variables: FACEBOOK_APP_ID and FACEBOOK_APP_SECRET');
}
const accessToken = `${FACEBOOK_APP_ID}|${FACEBOOK_APP_SECRET}`;

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
    `https://graph.facebook.com/v2.8/${resource}?${qs.stringify({
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
            'picture',
            'full_picture',
            'created_time',
        ]
    });

    // Comparing based on UTC concept of a day - should not be an issue here
    return posts
        .filter(post => moment().isSame(post.created_time, 'day'))
        .sort((a, b) => a.created_time > b.created_time);
};
