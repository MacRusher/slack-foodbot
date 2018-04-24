import {postMessage} from '../lib/slack';
import {getFoodletterMessage, getRestaurantMessage} from './helpers';

// List of nearby restaurants Facebook page ids
const restaurants = [
    'precle.covrigi',
    'goodtimeswroclaw',
    'manufakturabezglutenowa',
    'meetandeatpegaz',
];

/**
 * Main function that should be invoked once a day
 */
export async function sendFoodletter(event, context, callback) {
    // Send welcome message to start the thread
    const threadTs = await getFoodletterMessage().then(postMessage);

    if (!threadTs) {
        throw new Error(`Missing thread ts`);
    }

    restaurants.forEach(async pageId => {
        try {
            // Add replies to the thread for each supported restaurant
            await postMessage({
                ...await getRestaurantMessage(pageId),
                thread_ts: threadTs,
            });
        } catch (e) {
            // Ok it could fail, not a problem
            console.error(e);
        }
    });

    // Execution was successful
    callback(null, {
        body: threadTs,
        statusCode: 200,
    });
}
