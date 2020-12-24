set -x

#  deleting releases
for release in $(hub release --include-drafts --format "%T%n"); do
    echo "deleting ${release}"
    hub release delete ${release};
done;

# deleting tags
git push --delete origin $(hub release --include-drafts --format "%T ")  




# list artifacts
# consider filter by date
# for url in $(hub api /repos/bnh6/cryptobox/actions/artifacts | jq '.artifacts[].id '); do
#     # echo "\n/repos/bnh6/actions/artifacts/$id"
#     hub api -X DELETE "/repos/bnh6/actions/artifacts/$id"
# done


for url in $(hub api /repos/bnh6/cryptobox/actions/artifacts | jq -r '.artifacts[].url' | sed -e "s/https:\/\/api.github.com//g"); do
    echo "\n$url";
    hub api --obey-ratelimit -X DELETE  ${url}
done
# for id in $(hub api /repos/bnh6/cryptobox/actions/artifacts | jq '.artifacts[].id '); do
# echo "\n/repos/bnh6/actions/artifacts/$id"

set +x