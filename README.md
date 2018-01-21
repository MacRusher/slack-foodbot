# FoodBot for Slack

> Automating lunch with your team since 2016 :)

Slack bot using AWS Lambda (with Serverless) to handle daily food newsletter, inquiries about meals and managing company lunch trips. 

**Probably not very useful for you if you're not eating near Podwale 7 in Wrocław (Poland)**, but still may be some inspiration to create something similar

### Installation

1. Clone repository and `npm install` all dependencies.
1. Configure your AWS credentials according to [Serverless docs](https://serverless.com/framework/docs/providers/aws/guide/credentials/).
1. Tweak data in `serverless.yml` and `foodletter/handlers.ts`.
1. Deploy with `npm run full-deploy`.
1. Register Facebook app. No special requirements for it, we'll just need app's access token to fetch data.
1. Create Slack bot for your workspace.
1. Set environment variables for your deployed Lambda in AWS Console:
    - FACEBOOK_APP_ID - Id of your Facebook app
    - FACEBOOK_APP_SECRET - FB app secret - can be found in developer panel
    - SLACK_BOT_TOKEN - Bot token from Slack settings
    - SLACK_FOOD_CHANNEL - Channel where FoodBot will post messages (Your bot must be invited to this channel!)
