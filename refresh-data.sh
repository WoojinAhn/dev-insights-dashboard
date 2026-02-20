#!/bin/bash

DATA_DIR="./public/data"
mkdir -p "$DATA_DIR"
GH_USER="WoojinAhn"

echo "🔄 Refreshing GitHub Data for $GH_USER (Excluding Forks)..."

# 1. User Profile
gh api user > "$DATA_DIR/user.json"

# 2. Pinned Repositories (GraphQL)
echo "📍 Fetching Pinned Repositories..."
gh api graphql -f query='
query($login:String!) {
  user(login: $login) {
    pinnedItems(first: 9, types: [REPOSITORY]) {
      nodes {
        ... on Repository {
          name
          description
          stargazerCount
          forkCount
          url
          isPrivate
          isFork
          primaryLanguage {
            name
          }
          updatedAt
        }
      }
    }
  }
}' -F login="$GH_USER" | jq '.data.user.pinnedItems.nodes | map(select(.isFork == false))' > "$DATA_DIR/pinned.json"

# 3. All Public Source Repositories (Non-Forks)
echo "🌐 Fetching Public Source Repositories..."
gh repo list "$GH_USER" --visibility public --source --limit 100 --json name,description,stargazerCount,languages,url,updatedAt,isPrivate,isFork,primaryLanguage,forkCount > "$DATA_DIR/repos.json"

echo "✅ Data refreshed in $DATA_DIR"
