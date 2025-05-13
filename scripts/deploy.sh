#!/bin/sh
# Usage: ./deploy.sh
# Example: ./deploy.sh

cd eko-maistas
git pull origin main
npm i -f
rm .env.local
npm run build
pm2 reload 0 --update-env
exit
