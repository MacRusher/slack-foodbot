import {getTodayPosts} from './lib/facebook';
import {getSenderUsernameLink} from './lib/slack';

export const manufaktura = async ({data, delayedResponse}) => {

    const posts = await getTodayPosts({pageId: 'manufakturabezglutenowa'});

    if (posts.length === 0) {
        return await delayedResponse({
            text: 'Nic nie wiem o dzisiejszym obiedzie :('
        });
    }

    await delayedResponse({
        text: `${getSenderUsernameLink(data)} chyba burczy w brzuchu :smile: \nDzisiaj Manufaktura zaprasza na:`,
        response_type: 'in_channel',
        attachments: posts.map(({message = '', picture, full_picture}) => ({
            color: 'good',
            fallback: message,
            text: message,
            thumb_url: picture,
            image_url: full_picture,
        }))
    });
};

export const precle = async ({data, delayedResponse}) => {

    const posts = await getTodayPosts({pageId: 'precle.covrigi'});

    if (posts.length === 0) {
        return await delayedResponse({
            text: 'Chyba dzisiaj precli nie będzie :('
        });
    }

    await delayedResponse({
        text: `${getSenderUsernameLink(data)} pytał(a) jakie dzisiaj będę precle, proszę bardzo:`,
        response_type: 'in_channel',
        attachments: posts.map(({message = '', picture, full_picture}) => ({
            color: 'good',
            fallback: message,
            text: message,
            thumb_url: picture,
            image_url: full_picture,
        }))
    });
};
