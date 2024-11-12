# Pull the minimal Ubuntu image
FROM ubuntu:latest

# Install Nginx
RUN apt-get -y update && apt-get -y install nginx
RUN apt-get -y install nano
RUN apt-get -y install curl

# Expose the port for access
EXPOSE 80/tcp


# Run the Nginx server
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]