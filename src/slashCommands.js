import {getTodayPosts} from './lib/facebook';

export const manufaktura = async ({data, initialResponse, delayedResponse}) => {
    const res1 = await initialResponse({text: 'Manufaktura initial response'});

    const res2 = await delayedResponse({text: 'Manufaktura delayed response'});

    const posts = await getTodayPosts({pageId: 'manufakturabezglutenowa'});

    console.log('posts', posts);
};