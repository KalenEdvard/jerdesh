@echo off
echo Deploying to VPS...
ssh -i "C:\Users\batyr\.ssh\id_rsa" root@72.56.249.143 "cd /var/www/mekendesh && git pull origin main && npm install && npm run build && pm2 restart mekendesh"
echo Done!
