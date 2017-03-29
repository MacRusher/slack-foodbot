import 'babel-polyfill';
import qs from 'qs';

import {
    verifySlackToken,
    setupInitialResponse,
    setupDelayedResponse,
} from './lib/slack';
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

    // Helpers to return responses back to Slack
    const initialResponse = setupInitialResponse(callback);
    const delayedResponse = setupDelayedResponse(data.response_url);

    // Verify if we support this command
    if (!(command in slashCommands)) {
        return initialResponse({text: `Unknown command: ${command}`});
    }

    // Run actual slash command code
    try {
        await slashCommands[command]({data, initialResponse, delayedResponse});
    } catch (e) {
        console.error(e);
        delayedResponse({text: 'We\'re sorry, there was an error :('})
    }
};
