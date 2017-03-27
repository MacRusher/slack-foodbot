import 'babel-polyfill';
import once from 'lodash/once';
import qs from 'qs';

import {verifySlackToken} from './lib/slack';
import * as slashCommands from './slashCommands';

/**
 * Entry point for all Slack Slash Commands
 * @see https://api.slack.com/slash-commands
 * @void
 */
export const slash = async ({body}, context, callback) => {
    // Parse Slack input data info useful object
    const data = qs.parse(body);

    // Verify if request is actually coming from slack
    await verifySlackToken(data.token);

    // Slack provide command with slash at the beginning
    const command = data.command.substring(1);

    // Helper to return response right away
    const response = once(({ephemeral = true, text = ''}) => callback(null, {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            response_type: ephemeral === false ? 'in_channel' : 'ephemeral',
            text,
        }),
    }));

    console.log('slack data', data);

    // Verify if we support this command
    if (!(command in slashCommands)) {
        return response({text: `Unknown command: ${command}`});
    }

    // Run actual slash command code
    try {
        await slashCommands[command]({data, response});
    } catch (e) {
        console.error(e);
        response({text: 'We\'re sorry, there was an error :('})
    }
};
