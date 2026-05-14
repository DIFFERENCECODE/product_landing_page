#!/bin/bash
set -e
cd /home/ubuntu/apps/product-landing-page
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 20
pm2 stop meo-landing || true
git stash || true
git pull
rm -rf .next node_modules package-lock.json
npm install
npm run build
[ -f data/stock.json ] || (mkdir -p data && echo '{"count":100}' > data/stock.json)
pm2 start meo-landing --update-env
pm2 status
