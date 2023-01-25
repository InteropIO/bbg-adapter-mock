const start = async () => {
    const glue = await window.Glue();
    window.glue = glue;
    console.log('Glue initialized. Version: ', glue.version);

    const bbgMarketData = window.BBGMarketData.default(glue.interop);
    window.bbgMarketData = bbgMarketData;
    console.log('BBGMarketData initialized. Version: ', bbgMarketData.version);

    bbgMarketData.onConnectionStatusChanged((status) => console.log('Connection Status: ', status))
};

// Entry point.
start();

const createSubscriptionRequest = async () => {
    const subscriptions = [
        {
            subscriptionId: new BBGMarketData.CorrelationId(),
            security: "IBM",
            fields: ["PX_LAST"]
        },
        {
            subscriptionId: new BBGMarketData.CorrelationId(),
            security: "VOD",
            fields: ["PX_LAST"]
        }
    ];

    // Creating the request.
    const request = bbgMarketData.createMarketDataRequest(subscriptions);
    window.subsRequest = request;

    request.onData(function handleSubscriptionsData(subscriptionsData) {
        // Handle subscription updates.

        console.log('Subscriptions data: ', subscriptionsData);
    });

    // The callback in the `onFail()` method will be invoked when a subscription for a security
    // fails on the Bloomberg side. E.g., you may have sent a request with
    // five subscriptions for five different securities and two of the subscriptions fail.
    request.onFail(function handleSubscriptionsError(
        subscriptionErrors
    ) {
        // Handle subscription errors.
        console.warn('Subscriptions fail: ', subscriptionErrors);
    });

    // The callback in the `onError()` method will be invoked whenever an error occurs with
    // the request itself. E.g., error in creating or sending the request.
    request.onError(function handleRequestError(error) {
        // Handle request error.
        console.warn('Subscriptions request error: ', error);
    });

    // Sending the request to a Bloomberg service.
    await request.open();
}

const closeSubscriptionRequest = async () => {
    if(window.subsRequest) {
        await window.subsRequest.close();
    }
}

const createFieldSearchRequest = async () => {
    const requestArgs = {
        searchSpec: "PX_LAST"
    };

    // Creating the request.
    const request = window.bbgMarketData.createFieldSearchRequest(requestArgs);
    window.fieldSearchReq = request;

    request.onData(function handleResponse(response) {
        if (response.isLast) {
            // Handle the final response.

            console.log('Response: ', response.data);
        } else {
            // Handle partial responses.

            console.log('Partial response: ', response.data);
        }
    });

    // Sending the request to a Bloomberg service.
    const allData = await request.open();
    console.log('All data: ', allData);
};

/**
 * This will throw an exception as the mock bridge does not support Historical Data requests.
 */
const createHistoricalDataRequest = async () => {
    const requestArgs = {
        securities: ["IBM US Equity", "MSFT US Equity"],
        fields: ["LAST_PRICE"],
        startDate: "20190101",
        endDate: "20191231"
    };

    // Creating the request.
    const request = window.bbgMarketData.createHistoricalDataRequest(requestArgs);
    window.historicalReq = request;

    request.onData(function handleResponse(response) {
        if (response.isLast) {
            // Handle the final response.

            console.log('Response: ', response.data);
        } else {
            // Handle partial responses.

            console.log('Partial response: ', response.data);
        }
    });

    // Sending the request to a Bloomberg service.
    const allData = await request.open();
    console.log('All data: ', allData.flat());
};