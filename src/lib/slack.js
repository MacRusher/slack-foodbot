import fetch from 'node-fetch';
import once from 'lodash/once';
import before from 'lodash/before';

const {
    SLACK_TOKENS = '',
} = process.env || {};

const allowedTokens = SLACK_TOKENS.split(',');

/**
 * Will throw an error if provided token is different than set in env variable
 * @param {string} token - slack token to verify
 * @returns {boolean} true on success
 * @throws {Error}
 */
export const verifySlackToken = async token => {
    if (!allowedTokens.includes(token)) {
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
const wrapResponse = ({response_type = 'ephemeral', text, ...params} = {}) => text ? ({
    statusCode: 200,
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        response_type,
        text,
        ...params
    }),
}) : ({
    // If there is no text then return plain code 200
    statusCode: 200
});

/**
 * Take lambda callback and return a function to send a initial response.
 * @param {function} cb - lambda callback
 * @returns {function} Function that can be called only once and must be called within next second
 */
export const setupInitialResponse = cb => {
    const response = once(async params => {
        cb(null, wrapResponse(params));
        return true; // We assume that it was a success
    });

    // If there will be no initial response in next second
    // then return empty response to prevent slack from showing error
    const timeout = setTimeout(response, 1000);

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

export const getSenderUsernameLink = (data = {}) => `<@${data.user_id}|${data.user_name}>`;
