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


# Ensure that _redirects and 404.html are in the build folder
COPY public/404.html build/



# Install a lightweight web server to serve the app
RUN npm install -g serve

# Expose the port the app will run on
EXPOSE 3000

# Start the app
CMD ["serve", "-s", "build", "-l", "3000", "--single"]
#CMD ["http-server", "build", "-p", "3000", "-c-1", "--redirects"]




# Install a lightweight web server to serve the app
#RUN npm install -g serve

# Copy the serve.json file into the build directory
#COPY serve.json ./build/serve.json

# Expose the port the app will run on
#EXPOSE 3000

# Start the app with the serve.json configuration
#CMD ["serve", "-s", "build", "-l", "3000", "-c", "serve.json"]
