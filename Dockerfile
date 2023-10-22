# Use the official Nginx image as the base image
FROM nginx:stable-alpine3.17-slim

ARG CONSOLE_VERSION
ENV VERSION=$CONSOLE_VERSION

# Copy your custom Nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static files to the Nginx web root
COPY ./formkiq/dist/apps/formkiq-document-console-react /usr/share/nginx/html

# Copy and execute the custom config.sh script
COPY nginx/start.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/start.sh
CMD ["/usr/local/bin/start.sh"]

# Expose the port that Nginx will listen on (default is 80)
EXPOSE 80