# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN npm run build

# Install a lightweight web server to serve the app
RUN npm install -g serve

# Expose the port the app will run on
EXPOSE 3000

# Start the app
CMD ["serve", "-s", "dist", "-l", "3000", "--single"]
