# JS Mock Bloomberg Connector

An example of a **mock** representation of the [Glue42 Bloomberg Connector](https://docs.glue42.com/connectors/bloomberg-connector/overview/index.html).

## Prerequisites

- [**Glue42 Enterprise**](https://glue42.com/enterprise/)
- node
- npm

## Setup

- Copy the `js-mock-bbg-connector.json` configuration file and paste it in the **Glue42 Enterprise** application configuration folder (`%LocalAppData%\Tick42\UserData\<ENV>-<REG>\apps` where you must replace `<ENV>-<REG>` with the region and environment folder name used for the deployment of your **Glue42 Enterprise** - e.g., `T42-DEMO`).  
- Open a command prompt in the base directory and run `npm install` to install all dependencies. 
- Run `npm start` to start a server at port 3001 where the applications will be hosted.
- Start **Glue42 Enterprise**. 

Now you will be able to start the mock mdf app from the **Glue42 Enterprise** Toolbar.

**Note** that you must shutdown the real Bloomberg Connector, so that your application can target the mock representation.

## Market Data API Mock

Market Data Protocol - https://docs.glue42.com/connectors/bloomberg-connector/market-data/bbg-mdf-protocol/index.html\
JavaScript library - https://docs.glue42.com/connectors/bloomberg-connector/market-data/javascript/index.html

Once the [mdf mock app](./mdf-mock) starts, it registers the Market Data API methods `T42.MDFApi.CreateRequest`, `T42.MDFApi.CreateSubscriptionRequest` and `T42.MDFApi.CancelRequests`.

The mock representation only returns sample data (see implementation). 
**You can implement additional interop helper methods, so that e.g., you can control the response data being returned in your tests.**

There is a [client app](./client) which initializes the [JavaScript library](https://docs.glue42.com/connectors/bloomberg-connector/market-data/javascript/index.html) for testing.