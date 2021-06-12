# Stage build
FROM node:14 as builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# Stage runtime application
FROM nginx as production-stage
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
RUN touch /var/run/nginx.pid && \
  chown nginx:nginx /var/run/nginx.pid &&\
  chown -R nginx:nginx /var/cache/nginx
CMD ["nginx", "-g", "daemon off;"]