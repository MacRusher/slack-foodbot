'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function test() {
    return 12;
}

const hello = (event, context, callback) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Test message 2',
            test: test(),
            input: event
        })
    };
    callback(null, response);
};

exports.hello = hello;
