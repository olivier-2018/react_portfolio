# Stage 1: Build the Vite app
FROM node:22-alpine 
WORKDIR /app
# RUN addgroup -S nonrootgroup && adduser -S nonrootuser -G nonrootgroup \
#     && chown -R nonrootuser:nonrootgroup /app
# USER nonrootuser
COPY package*.json ./
RUN npm install 
COPY . . 
EXPOSE 5173
CMD ["npm", "run", "dev"]
