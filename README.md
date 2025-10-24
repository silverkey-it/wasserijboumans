## Create NGINX setup

### Create folders
```js
mkdir -p /home/root/nginx/conf.d
mkdir -p /home/root/nginx/certs
mkdir -p /home/root/nginx/www
```

### Add default.conf to conf.d (simpele versie voordat certbot draait)
```js
server {
    listen 80;
    server_name wasserijboumans.silver-key.nl;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;  # voor de HTTP-01 challenge
}

# Eventueel alles redirecten kan later. Voor nu kun je gewoon:
        location / {
# desnoods "hello world" of een doorverwijzing
# of proxy_pass naar je React-app,
# als je dat wilt testen via HTTP
    return 200 "Temporary HTTP server for Let's Encrypt";
}
}
```
### Start nginx container (let op alleen poort 80)
```js
docker run -d \
  --name reverse_proxy \
  --network wasserijboumans_net \
  -p 80:80 \
  -v /home/root/nginx/conf.d:/etc/nginx/conf.d \
  -v /home/root/nginx/certs:/etc/letsencrypt \
  -v /home/root/nginx/www:/var/www/certbot \
  nginx:stable-alpine
```

### Start certbot
```js
docker run --rm \
  -v /home/root/nginx/certs:/etc/letsencrypt \
  -v /home/root/nginx/www:/var/www/certbot \
  certbot/certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  -d wasserijboumans.silver-key.nl \
  --email bram@silver-key.nl \
  --agree-tos \
  --non-interactive
```

### Aanpassen: default.conf
```js
# Luister op poort 80 voor de Let’s Encrypt challenges en redirect alles naar https
server {
    listen 80;
    server_name wasserijboumans.silver-key.nl;

# Laat Certbot toe om /.well-known/acme-challenge/ te bedienen
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
}

# Al het overige verkeer op poort 80 redirecten naar https
    location / {
        return 301 https://$host$request_uri;
    }
}

# Het echte SSL-gedeelte
server {
    listen 443 ssl;
    server_name wasserijboumans.silver-key.nl;

# SSL Cert en key verwijzen naar Let’s Encrypt bestanden
    ssl_certificate     /etc/letsencrypt/live/wasserijboumans.silver-key.nl/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/wasserijboumans.silver-key.nl/privkey.pem;

# Proxy-instellingen: verkeer naar je React container (die op poort 80 draait)
    location / {
        proxy_pass http://react_app:80;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}

# Proxy-instellingen voor je Spring backend (die op poort 8080 draait)
    location /api/ {
        proxy_pass http://spring_app:8080/api/;  # Verkeer naar de Spring backend
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
}
```

### Start nginx container (let op nu met poort 443)
```js
docker run -d \
  --name reverse_proxy \
  --restart=always \
  --network wasserijboumans_net \
  -p 80:80 \
  -p 443:443 \
  -v /home/root/nginx/conf.d:/etc/nginx/conf.d \
  -v /home/root/nginx/certs:/etc/letsencrypt \
  -v /home/root/nginx/www:/var/www/certbot \
  nginx:stable-alpine
```

### Auto renewal certs
#### open cron tab
```js
crontab -e
```
#### add cron job
```js
# add cron job
0 3 * * * docker run --rm -v /home/root/nginx/certs:/etc/letsencrypt -v /home/root/nginx/www:/var/www/certbot certbot/certbot renew && docker exec reverse_proxy nginx -s reload
```
#### validate cron is running
```js
sudo systemctl status cron
```

#### validate
Zet een herinnering in je agenda om over 2 weken voor het verloop van het cert te checken of de auto renewal heeft gewerkt.