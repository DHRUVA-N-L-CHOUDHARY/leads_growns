# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy the rest of the application code
COPY . .

# Expose the port Cloud Run will listen on
EXPOSE 8080

# Set the PORT environment variable for Cloud Run
ENV PORT 8080

# Start the application
CMD ["npm", "start"]
