#!/bin/bash

# Lineamiento NUAM: ./deploy.sh [dev | qa | prd]
ENV="$1"

if [[ -z "$ENV" ]]; then
  echo "Error: El parametro environment es necesario. Uso: bash deploy.sh [dev | qa | prd]"
  exit 1
fi

if [[ "$ENV" != "dev" && "$ENV" != "qa" && "$ENV" != "prd" ]]; then
  echo "Error: Ambiente invalido. Debe ser dev, qa o prd."
  exit 1
fi

ENV_UPPER=$(echo "$ENV" | tr '[:lower:]' '[:upper:]')
echo "=== DEPLOYING NUAM AUDITORIA FRONTEND TO $ENV ==="

# Cargar variables de entorno
set -a
source .env
set +a

# Login en BTP con ORG/SPACE dinámico según ambiente
ORG_NAME=ORG_$ENV_UPPER
SPACE_NAME=SPACE_$ENV_UPPER
cf login -u $EMAIL_BTP -p $PASSWORD_BTP -a $API_ENDPOINT_BTP -o ${!ORG_NAME} -s ${!SPACE_NAME}

# IMPORTANTE PARA MAC CON NVM: asegurar que npm/mbt estén en el PATH
export PATH=$PATH:$HOME/.nvm/versions/node/v24.13.0/bin

# 1. Instalar y compilar React
echo "Building React App..."
npm install
npm run build

# 2. Workaround zip para mbt build (según REACT-BTP-GUIDE.md)
echo "Creating dist.zip..."
cd dist
rm -f dist.zip
zip -r dist.zip .
cd ..

# 3. Copiar mta del ambiente correspondiente
rm -f mta.yaml ./mta_archives/*.mtar
cp ./config/mta.base-$ENV.yaml ./mta.yaml

# 4. Build MTA
echo "Building MTA archive..."
rm -rf mta_archives/
mbt build -p cf -t ./mta_archives --mtar nuam-react-auditoria-standalone.mtar

# 5. Deploy a BTP
echo "Deploying to BTP ($ENV)..."
cf deploy mta_archives/nuam-react-auditoria-standalone.mtar -f
