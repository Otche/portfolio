# Pull the minimal Ubuntu image
FROM node

# Install Nginx

# Expose the port for access

# Run the Nginx server
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]