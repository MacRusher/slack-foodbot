import test from './test';

export const hello = (event, context, callback) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Test message 2',
            test: test(),
            input: event,
        }),
    };
    callback(null, response);
};

