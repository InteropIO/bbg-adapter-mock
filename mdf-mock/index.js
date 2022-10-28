const CREATE_REQUEST_METHOD_NAME = 'T42.MDFApi.CreateRequest';
const CREATE_SUBS_REQUEST_METHOD_NAME = 'T42.MDFApi.CreateSubscriptionRequest';
const CANCEL_REQUEST_METHOD_NAME = 'T42.MDFApi.CancelRequests';

const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

const getRandomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
}

/**
 * A dummy subscriptions data generator. 
 * Subscriptions' fields are ignored. Instead, the generator only streams random data for 'PX_LAST' to all subscriptions.
 * The generator will stream data 5 times / 100ms.
 */
const createMockSubscriptionsDataGenerator = ({ subscriptions, callbackMethod, requestCorrelationId }) => {
    const STREAMING_INTERVAL_MS = 100;
    const MAX_TIMES = 5;

    const mapSubscriptionToBloombergEventMessage = (subscription) => {
        return {
            MarketDataEvents: {
                PX_LAST: Number(getRandomNumber(50, 100).toFixed(2)),
            },
            correlationIds: [subscription.subscriptionId]
        };
    }

    let times = 0;
    const generateAndSend = async () => {
        /* Once a Subscription is established to Bloomberg, the stream will supply Messages in SUBSCRIPTION_DATA Events, structurally similar to:
            {
                "eventType": "SUBSCRIPTION_DATA",
                "eventMessages": [
                    {
                        MarketDataEvents: { // Object keys corresponds to field names.
                            PX_LAST: 100,
                        },
                        correlationIds: []
                    }
                ]
            }
        */
        const event = {
            eventType: 'SUBSCRIPTION_DATA',
            eventMessages: subscriptions.map(mapSubscriptionToBloombergEventMessage)
        };

        const callbackMethodArgs = {
            msg: event,
            requestCorrelationId
        }

        await window.glue.interop.invoke(callbackMethod, callbackMethodArgs);
    };

    const start = () => {
        const interval = setInterval(() => {
            // This dummy stream completes after 5 times.
            if (times === MAX_TIMES) {
                clearInterval(interval);
                return;
            }

            generateAndSend();
            times++;
        }, STREAMING_INTERVAL_MS);
    };

    return {
        start
    };
};

/**
 * A dummy request/response data generator. 
 * Supports only FieldSearch requests - https://docs.glue42.com/connectors/bloomberg-connector/market-data/javascript/index.html#request_types-field_search.
 * Always returns the example data for FieldSearch requests ("operationArgs" are ignored).
 */
const createRequestResponseMockDataGenerator = ({ operationArgs, operation, requestCorrelationId, callbackMethod }) => {
    const responses = {
        'FieldSearchRequest': window.fieldSearchResponse || [] // See the response structure in fields-search-responses.js
    };

    const events = responses[operation];
    if (events == null) {
        throw new Error(`[MDF Mock] Unknown operation "${operation}".`);
    }

    const RESPONSES_INTERVAL_MS = 50;

    const start = async () => {
        await sleep(0);

        // Simulate partial responses being returned every 50ms.
        for (const event of events) {
            // Callback arguments - the Bloomberg event is provided in a "msg" property.
            // It is REQUIRED to provide the "requestCorrelationId".            
            const args = {
                msg: event,
                requestCorrelationId
            };

            // Return partial response to the requester.
            await window.glue.interop.invoke(callbackMethod, args);

            // Simulate delay.
            await sleep(RESPONSES_INTERVAL_MS);
        }
    };

    return {
        start
    };
};

/**
 * **Mock** implementation of the "T42.MDFApi.CreateSubscriptionRequest" method. This method is invoked from a Glue42 app (using the @glue42/bbg-market-data), 
 * when making a request of type: Market Data Subscription.
 * 
 * All supported request types - https://docs.glue42.com/connectors/bloomberg-connector/market-data/javascript/index.html#request_types.
 *
 * @param {string} args.requestCorrelationId - A unique string to correlate responses to requests. Auto-generated from the @glue42/bbg-market-data lib.
 * @param {string} args.callbackMethod - An interop method used to handle the Bloomberg responses. Registered by the @glue42/bbg-market-data lib.
 * @param {string} args.subscriptions - The actual subscriptions, see https://docs.glue42.com/connectors/bloomberg-connector/market-data/javascript/index.html#request_types-market_data_subscription.
 * **Note** that the @glue42/bbg-market-data lib makes transformations to what you provide as request arguments when using the lib API.
 * 
 * @returns {TerminalResult.correlationId} - Required. Corresponds to "args.requestCorrelationId".
 * @returns {TerminalResult.success} - Required. Indicates whether the request succeeded or failed.
 */
const createSubscriptionRequestHandler = async (args) => {
    console.log(`${CREATE_SUBS_REQUEST_METHOD_NAME} method invoked with: `, args);

    const dataGenerator = createMockSubscriptionsDataGenerator(args);
    dataGenerator.start();

    const terminalResult = {
        correlationId: args.requestCorrelationId,
        success: true,
        message: 'Request created.'
    };

    // Required.
    return Promise.resolve({
        result: terminalResult
    });
};

/**
 * @glue42/bbg-market-data invokes this method to clean up resources. At least needs to be registered.
 * @param {*} args
 */
const cancelRequestsHandler = async (args) => {
    console.log(`${CANCEL_REQUEST_METHOD_NAME} method invoked with: `, args);

    const terminalResult = args.requestCorrelationIds.map(id => ({
        correlationId: id,
        success: true,
        message: 'Request closed.'
    }))

    return Promise.resolve({
        result: terminalResult
    });
}

/**
 * **Mock** implementation of the "T42.MDFApi.CreateRequest" method. This method is invoked from a Glue42 app (using the @glue42/bbg-market-data), 
 * when making a request of type: Historical Data, Reference Data, Instrument List, Intraday Bar, Snapshot, Field List, Field Search, User Entitlements. 
 * 
 * All supported request types - https://docs.glue42.com/connectors/bloomberg-connector/market-data/javascript/index.html#request_types.
 * 
 * The mock implementation is capable of handling only Field Search request and always responds with the same example data. See the implementation for more details.
 * How to make a Field Search request - https://docs.glue42.com/connectors/bloomberg-connector/market-data/javascript/index.html#request_types-field_search.
 * 
 * @param {string} args.requestCorrelationId - A unique string to correlate responses to requests. Auto-generated from the @glue42/bbg-market-data lib.
 * @param {string} args.callbackMethod - An interop method used to handle the Bloomberg responses. Registered by the @glue42/bbg-market-data lib.
 * @param {string} args.operation - An enum corresponding to the request type. Provided by the @glue42/bbg-market-data lib.
 * @param {string} args.operationArgs - The specific request arguments, see https://docs.glue42.com/connectors/bloomberg-connector/market-data/javascript/index.html#request_types. 
 *  **Note** that the @glue42/bbg-market-data lib makes transformations to what you provide as request arguments when using the lib API.
 * 
 * @returns {TerminalResult.correlationId} - Required. Corresponds to "args.requestCorrelationId".
 * @returns {TerminalResult.success} - Required. Indicates whether the request succeeded or failed.
 * @returns {TerminalResult.message} - Status message to the caller.
 */
const createRequestHandler = (args) => {
    console.log(`${CREATE_REQUEST_METHOD_NAME} invoked with: `, args);

    let terminalResult;
    try {
        const dataGenerator = createRequestResponseMockDataGenerator(args);
        dataGenerator.start();

        terminalResult = {
            correlationId: args.requestCorrelationId,
            success: true, // Indicating that request creation was succeeded.
            message: 'Request Created'
        };
    } catch (error) {
        terminalResult = {
            correlationId: args.requestCorrelationId,
            success: false, // Indicating that request creation was failed.
            message: error.message || 'Failed to create request.'
        };
    }

    // Required.
    return Promise.resolve({
        result: terminalResult
    });
};

const registerApiMethods = async () => {
    await glue.interop.register(CREATE_REQUEST_METHOD_NAME, createRequestHandler);
    console.log(`${CREATE_REQUEST_METHOD_NAME} method registered.`);

    await glue.interop.register(CREATE_SUBS_REQUEST_METHOD_NAME, createSubscriptionRequestHandler);
    console.log(`${CREATE_SUBS_REQUEST_METHOD_NAME} method registered.`);

    await glue.interop.register(CANCEL_REQUEST_METHOD_NAME, cancelRequestsHandler);
    console.log(`${CANCEL_REQUEST_METHOD_NAME} method registered.`);
}

const start = async () => {
    console.log('--- JS MDF Mock ---');

    const glue = await window.Glue();
    window.glue = glue;
    console.log('Glue initialized. Version: ', glue.version);

    await registerApiMethods();
};

// Entry point.
start();
