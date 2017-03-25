import fetch from 'node-fetch';
import has from 'lodash-es/has';

import settings from '../settings.js';

if (!has(settings, 'facebook.token')) {
    throw new Error('Missing Facebook App Token!');
}

const queryString = params => Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');

const apiCall = async (resource = '', params = {}) => fetch(
    `https://graph.facebook.com/v2.6/${resource}?${queryString({
        access_token: settings.facebook.token,
        ...params
    })}`
);

//
// export const getLastPost = async pageId => fbApi(`${pageId}/posts`, {
//     limit: 1,
//     fields: [
//         'message',
//         'full_picture',
//         'created_time'
//     ].join(',')
// })
//     .then(({data}) => data[0]);


export const getTodayPosts = ({pageId}) => {

};
