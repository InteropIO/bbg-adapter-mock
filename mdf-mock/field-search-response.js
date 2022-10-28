/* Example that is structurally similar to:
{
    "eventType": "PARTIAL_RESPONSE", // or RESPONSE
    "eventMessages": [
        {
            "fieldResponse": {
                "fieldData": [
                    {
                        "id": "PR005",
                        "fieldInfo": {
                            "mnemonic": "PX_LAST",
                            "description": "Last Price",
                            "categoryName": [
                                "Market Activity/Last"
                            ],
                            "property": [],
                            "overrides": [],
                            "datatype": "Double",
                            "documentation": "",
                            "ftype": "Price"
                        }
                    }
                ]
            },
            "correlationIds": []
        }
    ]
}
 */
window.fieldSearchResponse = [
    {
        "eventType": "PARTIAL_RESPONSE",
        "eventMessages": [
            {
                "fieldResponse": {
                    "fieldData": [
                        {
                            "id": "PR005",
                            "fieldInfo": {
                                "mnemonic": "PX_LAST",
                                "description": "Last Price",
                                "categoryName": [
                                    "Market Activity/Last"
                                ],
                                "property": [],
                                "overrides": [],
                                "datatype": "Double",
                                "documentation": "Last price for the security...",
                                "ftype": "Price"
                            }
                        },
                        {
                            "id": "PR910",
                            "fieldInfo": {
                                "mnemonic": "CRNCY_ADJ_PX_LAST",
                                "description": "Currency Adjusted Last Price",
                                "categoryName": [
                                    "Market Activity/Last"
                                ],
                                "property": [],
                                "overrides": [
                                    "DS215"
                                ],
                                "datatype": "Double",
                                "documentation": "The last price at which the security traded...",
                                "ftype": "Price"
                            }
                        }
                    ]
                },
                "correlationIds": []
            }
        ]
    },
    {
        "eventType": "PARTIAL_RESPONSE",
        "eventMessages": [
            {
                "fieldResponse": {
                    "fieldData": [
                        {
                            "id": "IN117",
                            "fieldInfo": {
                                "mnemonic": "GEN_EST_PE_NEXT_YR_AGGTE",
                                "description": "General Estimated P/E Next Year Aggte",
                                "categoryName": [
                                    "Fundamentals/Index Fundamentals"
                                ],
                                "property": [],
                                "overrides": [],
                                "datatype": "Double",
                                "documentation": "Index general estimated P/E (price/earnings) next year...",
                                "ftype": "Real"
                            }
                        },
                        {
                            "id": "F0198",
                            "fieldInfo": {
                                "mnemonic": "PX_TO_DILUTED_EPS_BEF_XO_ITEMS",
                                "description": "Price to Diluted EPS before Extraordinary Items",
                                "categoryName": [
                                    "Fundamentals/Bloomberg Fundamentals/Financial Ratios/Earnings"
                                ],
                                "property": [],
                                "overrides": [],
                                "datatype": "Double",
                                "documentation": "INDUSTRIALS, BANKS, FINANCIALS, INSURANCE, UTILITIES, & REITS",
                                "ftype": "Real"
                            }
                        }
                    ]
                },
                "correlationIds": []
            }
        ]
    },
    {
        "eventType": "RESPONSE",
        "eventMessages": [
            {
                "fieldResponse": {
                    "fieldData": [
                        {
                            "id": "PQ423",
                            "fieldInfo": {
                                "mnemonic": "OPEN_TRADE_PX",
                                "description": "Open Trade Price",
                                "categoryName": [
                                    "Market Activity/Open"
                                ],
                                "property": [],
                                "overrides": [],
                                "datatype": "Double",
                                "documentation": "First trade of the day that was Last Price (PR005, PX_LAST) eligible...",
                                "ftype": "Real"
                            }
                        },
                        {
                            "id": "IN116",
                            "fieldInfo": {
                                "mnemonic": "POS_EST_PE_FY3_AGGTE",
                                "description": "Positive Estimated P/E FY3 Aggte",
                                "categoryName": [
                                    "Fundamentals/Index Fundamentals"
                                ],
                                "property": [],
                                "overrides": [],
                                "datatype": "Double",
                                "documentation": "Index positive estimated P/E (price/earnings) next year...",
                                "ftype": "Real"
                            }
                        }
                    ]
                },
                "correlationIds": []
            }
        ]
    }
]