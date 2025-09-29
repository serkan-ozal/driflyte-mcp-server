VERSION="$(jq -r '.version' package.json)"
if [[ -z "$VERSION" || "$VERSION" == "null" ]]; then
  echo "❌ Error: Could not read 'version' from package.json"
  exit 1
fi

TAG="${GITHUB_REF_NAME}"
ASSET=".mcpb/driflyte.mcpb"

if [[ ! -f "$ASSET" ]]; then
  echo "❌ Error: Asset not found at $ASSET"
  exit 1
fi

# Ensure release exists for the tag
if ! gh release view "$TAG" >/dev/null 2>&1; then
  echo "❌ Error: Release for tag '$TAG' does not exist."
  exit 1
fi

echo "ℹ️ Uploading MCPB asset to release $TAG…"
gh release upload "$TAG" "$ASSET" --clobber

echo "✅ Done: driflyte.mcpb attached to release $TAG"
