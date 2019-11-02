server {
    listen 80;
    server_name scrapulec.eu;
    location / {
        return 301 https://$host$request_uri;
    }
}
server {
    listen 443 ssl;
    server_name scrapulec.eu;

    location / {
        proxy_pass http://scrapulec.eu; #for demo purposes
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html =404;
    }
}
