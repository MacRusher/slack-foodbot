import fetch from 'node-fetch';
import once from 'lodash/once';
import before from 'lodash/before';

const {
    SLACK_TOKEN,
} = process.env || {};

/**
 * Will throw an error if provided token is different than set in env variable
 * @param {string} token - slack token to verify
 * @returns {boolean} true on success
 * @throws {Error}
 */
export const verifySlackToken = async token => {
    if (token !== SLACK_TOKEN) {
        throw new Error('Invalid Slack token!');
    }
    return true;
};

/**
 * Prepare response is slack data format
 * @param {string} [response_type='ephemeral'] - Type of response, either ephemeral or in_channel
 * @param {string} text - text to display
 * @param {*} params - other slack message params
 */
const wrapResponse = ({response_type = 'ephemeral', text = '', ...params} = {}) => ({
    statusCode: 200,
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        text,
        ...params
    }),
});

/**
 * Take lambda callback and return a function to send a initial response.
 * @param {function} cb - lambda callback
 * @returns {function} Function that can be called only once and must be called within next 1.5 second
 */
export const setupInitialResponse = cb => {
    const response = once(async params => {
        cb(null, wrapResponse(params));
        return true; // We assume that it was a success
    });

    const timeout = setTimeout(response, 1500, {
        text: 'We\'re processing your request, please wait... and hope we will do anything :)'
    });

    return async params => {
        clearTimeout(timeout);
        return response(params);
    }
};

/**
 * Take lambda callback and return a function to send a initial response.
 * @param {string} responseUrl - lambda callback
 * @returns {function} Function that can be called max 4 times within next 30 minutes
 */
export const setupDelayedResponse = (responseUrl) => {
    if (!responseUrl) {
        throw new Error('Missing slack response url');
    }

    return before(5, async params => {
        const {headers, body} = wrapResponse(params);
        return fetch(responseUrl, {
            method: 'POST',
            headers,
            body,
        })
        .then(() => true) // Return only status whether it succeed, not the actual response
        .catch(() => false);
    });
};
