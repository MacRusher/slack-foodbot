import {postMessage} from '../lib/slack';
import {getFoodletterMessage, getRestaurantMessage} from './helpers';

/**
 * Main function that should be invoked once a day
 */
export async function sendFoodletter(event, context, callback) {
    // Send welcome message to start the thread
    const thread_ts = await getFoodletterMessage().then(postMessage);

    if (!thread_ts) {
        throw new Error(`Missing thread ts`)
    }

    // List of nearby restaurants Facebook page ids
    ['precle.covrigi', 'manufakturabezglutenowa', 'meetandeatpegaz'].forEach(async pageId => {
        try {
            // Add replies to the thread for each supported restaurant
            await postMessage({
                ...await getRestaurantMessage(pageId),
                thread_ts,
            })
        } catch (e) {
            // Ok it could fail, not a problem
            console.error(e);
        }
    });

    // Execution was successful
    callback(null, {
        statusCode: 200,
        body: thread_ts,
    });
}
