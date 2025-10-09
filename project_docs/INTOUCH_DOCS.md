Checkout page

SCRIPT
CheckOut page allows you to collect funds from your customers via mobile money, cash, bank transfer and bank card. Simply import our Javascript Library and link it to your checkOut button. You can choose between a redirection page or a pop-up iFrame.
Pop Up Link
Redirection Link
1
<script src=https://touchpay.gutouch.com/touchpay/script/prod_touchpay-0.0.1.js
2
  type="text/javascript"></script>
3
  <script type="text/javascript">
4
  Function calltouchpay(){
5
  SendPaymentInfos(order_number, agency_code, secure_code, domain_name, url_redirection_success, url_redirection_failed, amount, city, email, clientFirstName, clientLastName, clientPhone);
6
}
7
</script>
DESCRIPTION OF THE PARAMS
order_number
string
required
Order reference
agency_code
string
required
Account ID provided by InTouch
security_code
string
required
Parameter provided by InTouch
url_notif_success
string
required
Redirection page after a successful transaction
url_notif_failed
string
required
Redirection page after a failed transaction
domain_name
string
required
Your website domain name
amount
string
required
Transaction amount
city
string
Delivery city
email
string
Customer email
clientFirstname
string
the first name of the client
clientLastname
string
the last name of the client
clientPhone
string
Customer phone number

Callback TouchPay

GET
http://your_url_callback?payment_mode=INTOUCH_SERVICE_CODE&paid_sum=22200.0&paid_amount=22200.0&payment_token=1565251468191&payment_status=200&command_number=14526&payment_validation_date=1565251499748
Some payments are asynchronous and are completed outside the payment tunnel. An url to receive the notification of the end of payment is required. It must meet certain specifications.
AUTHENTICATION
This endpoint is secured with Basic authentication. Include your credentials in the Authorization header using the format :

Authorization: Basic <base64(username:password)>
Ensure the credentials are valid and properly encoded. Unauthorized requests will return a 401 error.

PATH PARAMS
payment_mode
STRING
required
the mode of the payment used
paid_sum
STRING
required
The total amount of payments for the order
paid_amount
STRING
required
The amount of payment notified
payment_token
STRING
required
The id of the transaction on Intouch side
payment_status
STRING
required
the order status
command_number
STRING
required
the order number
payment_validation_date
STRING
required
the payment validation date
BODY OF REQUEST
1
{
2
    "payment_mode": "INTOUCH_SERVICE_CODE",
3
    "paid_sum": "22200.0",
4
    "paid_amount": "22200.0",
5
    "payment_token": "1565251468191",
6
    "payment_status": "200",
7
    "command_number": "14526",
8
    "payment_validation_date": "1565251499748"
9
}
BODY PARAMS
payment_mode
string
required
the mode of the payment used
paid_sum
string
required
The total amount of payments for the order
paid_amount
string
required
The amount of payment notified
payment_token
string
required
The id of the transaction on Intouch side
payment_status
string
required
the order status
command_number
string
required
the order number
payment_validation_date
string
required
the payment validation date
RESPONSES
 200
the transaction is initiated and validated in our system
1
 420
the transaction failed on the system