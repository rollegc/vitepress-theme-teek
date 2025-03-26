#!/usr/bin/env bash
set -e

command=$1

# npm publish 等于 npm publish --tag latest
if [ "$command" == "latest" ]; then
  publish_tag="latest"
elif [ "$command" == "beta" ]; then
  publish_tag="beta"
elif [ "$command" == "alpha" ]; then
  publish_tag="alpha"
elif [ "$command" == "canary" ]; then
  publish_tag="canary"
elif [ "$command" == "next" ]; then
  publish_tag="next"
else
  echo "Unknown command: $command"
  exit 1
fi

npm run clean
npm run build

cd dist/vitepress-theme-teek
echo "publish vitepress-theme-teek..."
npm publish --tag $publish_tag
echo "Successfully published vitepress-theme-teek"
cd -

echo "✅ Publish completed"
exit
