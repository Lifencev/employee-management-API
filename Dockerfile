# Use Node.js as the base image
FROM node:16

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install
RUN npm install -g newman

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define environment variable
ENV NODE_ENV=production

# Start the app
CMD ["npm", "start"]