import fetch from 'node-fetch';

const {
    SLACK_BOT_TOKEN = null,
    SLACK_FOOD_CHANNEL = null,
} = process.env || {};

if (!SLACK_BOT_TOKEN) {
    throw new Error('You must provide SLACK_BOT_TOKEN env variable');
}
if (!SLACK_FOOD_CHANNEL) {
    throw new Error('You must provide SLACK_FOOD_CHANNEL env variable');
}

export interface SlackMessage {
    attachments?: SlackMessageAttachment[];
    icon_emoji?: string;
    icon_url?: string;
    text?: string;
    thread_ts?: string;
    username?: string;
}

export interface SlackMessageAttachment {
    color?: string;
    fallback?: string;
    image_url?: string;
    text: string;
    thumb_url?: string;
}

export interface SlackMessageResponse {
    channel?: string;
    error?: string;
    message?: {
        attachments?: SlackMessageAttachment[]
        bot_id?: string
        subtype?: string
        text?: string
        ts: string,
        type?: string
        username?: string,
    };
    ok: boolean;
    ts?: string;
}

/**
 * Post message in pre-configured slack channel
 */
export const postMessage = async (message: SlackMessage): Promise<string> => {
    return fetch('https://slack.com/api/chat.postMessage', {
        body: JSON.stringify({
            ...message,
            as_user: !message.username,
            channel: SLACK_FOOD_CHANNEL,
            link_names: true,
            parse: 'none',
            reply_broadcast: false,
            unfurl_links: false,
            unfurl_media: true,
        }),
        headers: {
            'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
            'Content-type': 'application/json',
        },
        method: 'POST',
        timeout: 5000,
    })
        .then(res => res.json())
        .then((res: SlackMessageResponse) => {
            if (res.ok && res.ts) {
                return res.ts;
            }
            throw new Error(`Slack API error: ${res.error}`);
        });
};
