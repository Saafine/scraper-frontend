# Stage 0, "build-stage", based on Node.js, to build and compile Angular
FROM node as build-stage

WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/

# We change output path to out, because angular cli normally uses projects name for the directory
RUN npm run build -- --output-path=./dist/out
