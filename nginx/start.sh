#!/bin/sh

if [ -z "$HTTP_API_URL" ]; then
  echo "Error: HTTP_API_URL environment variable is not set."
  exit 1
fi

if [ -z "$COGNITO_USER_POOL_ID" ]; then
  echo "Error: COGNITO_USER_POOL_ID environment variable is not set."
  exit 1
fi

if [ -z "$COGNITO_CLIENT_ID" ]; then
  echo "Error: COGNITO_CLIENT_ID environment variable is not set."
  exit 1
fi

if [ -z "$COGNITO_API_URL" ]; then
  echo "Error: COGNITO_API_URL environment variable is not set."
  exit 1
fi

# Create a JSON configuration file with the HTTP_API_URL value
cat > /usr/share/nginx/html/assets/config.json <<EOF
{
  "documentApi":  "$HTTP_API_URL",
  "userPoolId": "$COGNITO_USER_POOL_ID",
  "clientId": "$COGNITO_CLIENT_ID",
  "consoleVersion": "$VERSION",
  "brand": "formkiq",
  "userAuthentication": "cognito",
  "authApi": "$COGNITO_API_URL",
  "cognitoHostedUi": "",
  "cognitoEndpointOverride":"",
  "useAuthApiForSignIn":true
}
EOF

# Start Nginx in the foreground
nginx -g "daemon off;"
