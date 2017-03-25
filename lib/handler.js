export const hello = (event, context, callback) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Test message',
            input: event,
        }),
    };
    callback(null, response);
};

