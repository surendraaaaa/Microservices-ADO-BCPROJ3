#!/bin/bash
set -euo pipefail

SERVICE_NAME=$1
REGISTRY=$2
NEW_TAG=$3

REPO_URL="https://$AZURE_DEVOPS_PAT@dev.azure.com/ashukumavat2410/Microservices-CICD/_git/Microservices-CICD"

TMP_DIR=$(mktemp -d)
git clone "$REPO_URL" "$TMP_DIR"
cd "$TMP_DIR"

# Configure Git identity locally
git config user.email "azure-pipelines@myorg.com"
git config user.name "Azure Pipelines"

MANIFEST_FILE="k8s/${SERVICE_NAME}-deployment.yaml"
echo "Updating image tag in $MANIFEST_FILE..."
sed -i "s|\(image:\s*$REGISTRY/$SERVICE_NAME\):[^[:space:]]*|\1:$NEW_TAG|g" "$MANIFEST_FILE"

# Only commit if changes exist
if git diff --quiet; then
  echo "No changes to commit"
else
  git add "$MANIFEST_FILE"
  git commit -m "Update $SERVICE_NAME image tag to $NEW_TAG"
  git push
fi

rm -rf "$TMP_DIR"
echo "✅ Updated $SERVICE_NAME manifest to $REGISTRY/$SERVICE_NAME:$NEW_TAG"

# pipeline urls git remote set-url origin https://ashukumavat2410:<token>@dev.azure.com/ashukumavat2410/Microservices-CICD/_git/Microservices-CICD
