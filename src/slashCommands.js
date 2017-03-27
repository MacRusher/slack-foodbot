import {getTodayPosts} from './lib/facebook';

export const manufaktura = async ({data, response}) => {
    response({text: 'Manufaktura!'});

    const posts = await getTodayPosts({pageId: 'manufakturabezglutenowa'});

    console.log('posts', posts);

};