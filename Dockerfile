# Stage 0, "build-stage", based on Node.js, to build and compile Angular
FROM node as build-stage

WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/

# We change output path to out, because angular cli normally uses projects name for the directory
RUN npm run build -- --output-path=./dist/out

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15
COPY --from=build-stage /app/dist/out/ /usr/share/nginx/html
COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf
