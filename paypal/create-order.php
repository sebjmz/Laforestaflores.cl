$ch=curl_init();

curl_setopt($ch,CURLOPT_URL,PAYPAL_BASE."/v1/oauth2/token");

curl_setopt($ch,CURLOPT_USERPWD,PAYPAL_CLIENT_ID.":".PAYPAL_SECRET);

curl_setopt($ch,CURLOPT_POST,true);

curl_setopt($ch,CURLOPT_POSTFIELDS,"grant_type=client_credentials");

curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);

curl_setopt($ch,CURLOPT_HTTPHEADER,[

"Accept: application/json",

"Accept-Language: en_US"

]);

$token=json_decode(curl_exec($ch),true);

$accessToken=$token["access_token"];
