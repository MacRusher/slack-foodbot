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