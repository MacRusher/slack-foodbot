import 'babel-polyfill';

import {getTodayPosts} from './fb';

/**
 * Entry point for all Slack Slash Commands
 * @see https://api.slack.com/slash-commands
 * @param event
 * @param context
 * @param callback
 * @void
 */
export const slash = async (event, context, callback) => {

    const manufakturaPosts = await getTodayPosts({pageId: 'manufakturabezglutenowa'});

    console.log('event', event);

    const response = {
        response_type: 'ephemeral',
        text: 'works',
    };

    callback(null, {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(response),
    });
};
