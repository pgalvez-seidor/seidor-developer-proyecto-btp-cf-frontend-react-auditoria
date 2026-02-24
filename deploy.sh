ENV="$1"

if [[ -z "$ENV" ]]; then
  echo "Error: El parametro environment es necesario (dev, qa, prd)."
  exit 1
fi

echo "Iniciando despliegue STANDALONE de Maestros ($ENV)..."

# Cargar variables de entorno (Opcional, si existen en .env)
# IMPORTANTE PARA MAC CON NVM: Asegurar que el PATH tenga npm y mbt
if [ -f .env ]; then
  source .env
  if [[ -n "$EMAIL_BTP" && -n "$PASSWORD_BTP" ]]; then
    echo "Autenticando en SAP BTP Trial usando API US10..."
    cf api https://api.cf.us10-001.hana.ondemand.com
    cf login -u "$EMAIL_BTP" -p "$PASSWORD_BTP" -o "$ORG_DEV" -s "$SPACE_DEV"
  fi
fi

# Hardcodeando el PATH de nvm local que vimos fallar en tu shell
export PATH=$PATH:$HOME/.nvm/versions/node/v24.13.0/bin

# 1. Instalar y Compilar React
echo "Building React App..."
npm install
npm run build

# 2. El TRUCO del ZIP (según REACT-BTP-GUIDE.md)
# Creamos el zip de los assets en la ruta original para que mbt build lo encuentre
echo "Creating dist.zip workaround..."
cd dist
rm -f dist.zip
zip -r dist.zip .
cd ..

# 3. Build MTA
echo "Building MTA archive..."
rm -rf mta_archives/
mbt build -p cf -t ./mta_archives --mtar nuam-react-maestros-standalone.mtar

# 4. Deploy a BTP
echo "Deploying to BTP..."
cf deploy mta_archives/nuam-react-maestros-standalone.mtar -f
