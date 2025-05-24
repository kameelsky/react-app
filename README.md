# Introduction

This repository serves as a template for building modern web applications. The folder structure and codebase have been designed with clarity, scalability, and maintainability in mind, making it easy to extend and adapt for future development.

## Client side
The client side of the application is built using modern JavaScript libraries and frameworks for building user interfaces, including **React.js** and **Next.js**. To ensure type safety and improve code readability, the project uses TypeScript instead of plain JavaScript. The configuration also includes support for Mantine, a growing UI component library, allowing for fast and elegant interface development.

## Server side
The server side is developed in **Python**, leveraging **FastAPI**, a high-performance web framework known for its simplicity, speed, and strong typing support. FastAPI is increasingly popular for building APIs and integrates seamlessly with tools for data analysis, machine learning, and database interaction, making this template a robust foundation for a wide range of backend applications.

# Installation & Deployment

This application is intended to run on **Linux-based servers** and is configured to work with **NGINX** as a reverse proxy. The deployment assumes a dual-port setup for frontend and backend services.

## Prerequisites
Before you begin, ensure the following dependencies are installed on your server:

- Node.js and npm
- pm2 (Process Manager 2 installed globally from npm)
- NGINX (installed and running)
- Miniconda

Python and all required backend dependencies will be installed via the provided Miniconda setup script in a separate virtual environment.

## Environment setup

Set custom environment variables in the `.env` file:

```
SECRET_KEY='YourApp_secret#key!'
PRODUCTION='True'
PRODUCTION_SERVER='192.168.0.105'
CONDA_ENV='app'
```

- ***PRODUCTION_SERVER*** should be set to the IP address of the machine within your local network. You can check the IP address of the current machine using the following command:

```shell 
hostname -I
```
- ***CONDA_ENV*** variable indicated conda virutal environment name used for building backend. If you have already installed conda this will indicate the environment.

## Build

```shell
# Frontend
cd client
npm install
npm run client-build

# Backend
cd ../server
npm run server-build
```

## DNS & NGINX server Configuration

Create a reverse proxy configuration file `/etc/nginx/conf.d/app.confv` for NGINX. Replace **yourservername.com** and **192.168.0.100** with your actual domain and internal IP:

### NGINX Reverse Proxy

```shell
conf="
server {
    listen 80;
    server_name yourservername.com;

    proxy_set_header Host \$host;

    location / {
        proxy_pass http://192.168.0.105:9002;
    }

    location /api/ {
        proxy_pass http://192.168.0.105:9003;
    }
}
"
echo "\$conf" | sudo tee /etc/nginx/conf.d/app.conf > /dev/null
sudo systemctl reload nginx
```
`9002` is the default port for the frontend, and `9003` is for the backend API. You can change them in the app settings if needed. However it will also require to change respectives files:

- [dev.sh](server/scripts/dev.sh)
- [start.sh](server/scripts/start.sh)
- [package.json](client/package.json)

## Deploy

```shell
pm2 start ecosystem.config.js
```