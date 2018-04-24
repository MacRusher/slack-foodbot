import {getPageInfo, getTodayPosts} from '../lib/facebook';
import {SlackMessage} from '../lib/slack';

/**
 * Prepares message for the main thread
 */
export const getFoodletterMessage = async (): Promise<SlackMessage> => ({
    // Customized multi-line welcome message
    text: `Hej, jestem Foodbot i witam was w codziennym przeglądzie opcji obiadowych.
Ofertę pobliskich restauracji znajdziecie w komentarzach do tej wiadomości.
Smacznego!`,
});

/**
 * Prepares messages based on given facebook pageId
 * @param pageId - id or vanity url
 */
export const getRestaurantMessage = async (pageId: string): Promise<SlackMessage> => {
    // Fetch data from Facebook
    const page = await getPageInfo(pageId);
    const posts = await getTodayPosts(pageId);

    if (posts.length === 0) {
        throw new Error(`No posts for ${page.name} today`);
    }

    return {
        attachments: posts.map(({message = '', picture, full_picture}, i) => ({
            // UX tweak: make it green for first post and gray for all other
            color: i > 0 ? '#cccccc' : 'good',
            fallback: message,
            image_url: full_picture,
            text: message,
            thumb_url: picture,
        })),
        icon_url: page.picture,
        username: page.name,
    };
};
