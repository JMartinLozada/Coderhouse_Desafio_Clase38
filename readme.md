# Comandos

## Consigna 1
<!-- MODO CLUSTER -->
pm2 start index.js --name=8081 --watch -i 1 -- 8081

<!-- MODO FORK -->
pm2 start index.js --name=8080 --watch -- 8080


## Consigna 2
<!-- MODO CLUSTER -->
pm2 start index.js --name=8082 --watch -i 1 -- 8082
pm2 start index.js --name=8083 --watch -i 1 -- 8083
pm2 start index.js --name=8084 --watch -i 1 -- 8084
pm2 start index.js --name=8085 --watch -i 1 -- 8085


