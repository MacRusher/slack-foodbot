export const hello = (event, context, callback) => {
    const response = {
        message: 'Test message 6',
        input: event,
    };

    callback(null, {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(response),
    });
};
