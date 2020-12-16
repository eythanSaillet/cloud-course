# Start / inherit from Docker image Node v15
FROM node:15

# change the working directory INSIDE  the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json from local directory to the working directory inside the container
COPY package*.json ./

# execute a commande line
RUN npm i

# Copy from / to
COPY ./ ./

# expose the part of the docker network
EXPOSE 3000

# start the application
CMD ["node", "index.js"]