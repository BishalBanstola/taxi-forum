const paypal = require('@paypal/checkout-server-sdk');

exports.handler = async (event) => {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
    let client = new paypal.core.PayPalHttpClient(environment);

    const fixedAmount = "100.00"; // Fixed amount
    const currencyCode = "USD"; // Currency code

    const action = event.action; // 'create' or 'capture'
    const orderId = event.orderId; // For capture, orderId is needed

    try {
        if (action === 'create') {
            let request = new paypal.orders.OrdersCreateRequest();
            request.requestBody({
                "intent": "CAPTURE",
                "purchase_units": [
                    {
                        "amount": {
                            "currency_code": currencyCode,
                            "value": fixedAmount
                        }
                    }
                ]
            });

            let response = await client.execute(request);
            console.log(JSON.stringify(response));
            
            return {
                statusCode: 200,
                body: JSON.stringify(response.result),
            };

        } else if (action === 'capture') {
            if (!orderId) {
                throw new Error('Order ID is required for capture');
            }
            let request = new paypal.orders.OrdersCaptureRequest(orderId);
            request.requestBody({});

            let response = await client.execute(request);
            console.log('Response:',JSON.stringify(response));
            
            return {
                statusCode: 200,
                body: JSON.stringify(response.result),
            };
        } else {
            throw new Error('Invalid action. Use "create" or "capture".');
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};