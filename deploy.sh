#!/bin/bash

# ============================================
# NUAM React Auditoría - Deploy wrapper
# ============================================
# IMPORTANTE: No hace deploy standalone.
# Delega al deploy.sh del monorepo raíz que incluye
# usuarios + maestros + auditoría en un solo MTA,
# evitando conflictos de ownership en nuam-html5-repo-host.
#
# Uso: ./deploy.sh [dev | qa | prd]

ENV="$1"

if [[ -z "$ENV" ]]; then
  echo "Error: El parametro environment es necesario. Uso: bash deploy.sh [dev | qa | prd]"
  exit 1
fi

if [[ "$ENV" != "dev" && "$ENV" != "qa" && "$ENV" != "prd" ]]; then
  echo "Error: Ambiente invalido. Debe ser dev, qa o prd."
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MONOREPO_ROOT="$(dirname "$SCRIPT_DIR")"

echo "=== NUAM React Auditoría - Deploy via monorepo raíz ==="
echo "Ambiente: $ENV"
echo "Root: $MONOREPO_ROOT"
echo ""
echo "NOTA: Para evitar conflictos de HTML5 repo ownership,"
echo "      se despliegan todas las apps (usuarios + maestros + auditoría) juntas."
echo ""

cd "$MONOREPO_ROOT"
bash deploy.sh "$ENV"
