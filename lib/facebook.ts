import {get} from 'lodash';
import * as moment from 'moment';
import fetch from 'node-fetch';
import {stringify} from 'qs';

const {
    FACEBOOK_APP_ID = null,
    FACEBOOK_APP_SECRET = null,
} = process.env || {};

if (!FACEBOOK_APP_ID || !FACEBOOK_APP_SECRET) {
    throw new Error('You must provide Facebook App Environment variables: FACEBOOK_APP_ID and FACEBOOK_APP_SECRET');
}
const accessToken = `${FACEBOOK_APP_ID}|${FACEBOOK_APP_SECRET}`;

interface FbApiParams {
    fields?: string[];
    [param: string]: any;
}
export interface FbPost {
    created_time: string;
    full_picture?: string;
    id: string;
    message: string;
    picture?: string;
}
export interface FbPage {
    id: string;
    name: string;
    picture?: string;
}

/**
 * Facebook Graph API wrapper
 * @param resource - graph resource
 * @param fields - fields to fetch
 * @param params - any extra parameters for the call
 */
const fbApi = async (resource: string = '', {fields = [], ...params}: FbApiParams = {}): Promise<any> => {
    return fetch(
        `https://graph.facebook.com/v2.11/${resource}?${stringify({
            access_token: accessToken,
            fields: fields.join(','),
            ...params,
        })}`)
        .then(res => res.json())
        .then(res => {
            if (res.error) {
                const {message, type, code} = res.error;
                throw new Error(`[${type}] ${message} (${code})`);
            }
            return res;
        });
};

/**
 * Fetch today posts for given Facebook page
 * @param pageId - fbId or vanity url
 */
export const getPageInfo = async (pageId: string): Promise<FbPage> => {
    const page = await fbApi(`${pageId}`, {
        fields: [
            'name',
            'picture',
        ],
    });
    return {
        ...page,
        picture: get(page, 'picture.data.url'),
    };
};

/**
 * Fetch today posts for given Facebook page
 * @param pageId - fbId or vanity url
 */
export const getTodayPosts = async (pageId: string): Promise<FbPost[]> => {
    const posts = await fbApi(`${pageId}/posts`, {
        fields: [
            'message',
            'picture',
            'full_picture',
            'created_time',
        ],
    }).then(res => res.data);

    // Comparing based on UTC concept of a day - should not be an issue here
    const now = moment();
    return posts
        .filter(post => now.isSame(post.created_time, 'day'))
        .sort((a, b) => a.created_time > b.created_time);
};
