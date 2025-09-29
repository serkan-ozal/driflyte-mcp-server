VERSION="$(jq -r '.version' package.json)"
if [[ -z "$VERSION" || "$VERSION" == "null" ]]; then
  echo "❌ Error: Could not read 'version' from package.json"
  exit 1
fi

ASSET=".mcpb/driflyte.mcpb"
if [[ ! -f "$ASSET" ]]; then
  echo "❌ Error: Asset not found at $ASSET"
  exit 1
fi

# If this job runs on a tag ref, use it; otherwise fallback to v${VERSION}
if [[ "${GITHUB_REF:-}" == refs/tags/* ]]; then
  TAG="${GITHUB_REF_NAME}"
else
  TAG="v${VERSION}"
fi
echo "ℹ️ Using tag: ${TAG}"

# Ensure release exists for the tag
if ! gh release view "$TAG" >/dev/null 2>&1; then
  echo "❌ Error: Release for tag '$TAG' does not exist."
  exit 1
fi

echo "ℹ️ Uploading MCPB asset to release $TAG…"
gh release upload "$TAG" "$ASSET" --clobber

echo "✅ Done: driflyte.mcpb attached to release $TAG"
