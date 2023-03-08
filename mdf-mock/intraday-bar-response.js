/* Example that is structurally similar to:
{
    "eventType": "PARTIAL_RESPONSE", // or RESPONSE
    "eventMessages": [
        {
            "IntradayBarResponse": {
                "barData": {                        
                    "eidData": [], // numbers
                    "barTickData": [
                        {
                            "open": 50.0,
                            "time": "2014-05-22", // glue date                   
                            "high": 200.0,
                            "low": 120.0,
                            "close": 150.0,
                            "volume": 100,
                            "numEvents": 5,
                            "value": "" // could be integer, double, string, data, time, datetime?                        
                        }
                    ],
                    "descendingOrder": true, // Adjust per requirements.
                    "delayedSecurity": true // Adjust per requirements.
                }
            },
            "correlationIds": []
        }
    ]
}
 */

window.intradayBarResponse = [
    {
        "eventType": "RESPONSE",
        "eventMessages": [
            {
                "IntradayBarResponse": {
                    "barData": {
                        "eidData": [],
                        "barTickData": [
                            {
                                "open": 50.0,
                                "time": new Date(), // glue date                            
                                "high": 200.0,
                                "low": 120.0,
                                "close": 150.0,
                                "volume": 100,
                                "numEvents": 5,
                                "value": "" // could be integer, double, string, data, time, datetime?                        
                            }
                        ],
                        "descendingOrder": true, // Adjust per requirements.
                        "delayedSecurity": true // Adjust per requirements.
                    }
                },
                "correlationIds": []
            }
        ]
    }
]