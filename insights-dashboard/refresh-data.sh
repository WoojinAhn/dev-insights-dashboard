#!/bin/bash

DATA_DIR="./public/data"
mkdir -p "$DATA_DIR"
GH_USER="WoojinAhn"

echo "🔄 Refreshing GitHub Data for $GH_USER..."

# 1. User Profile
gh api user > "$DATA_DIR/user.json"

# 2. Pinned Repositories (GraphQL) - Fetching up to 9
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
          primaryLanguage {
            name
          }
          updatedAt
        }
      }
    }
  }
}' -F login="$GH_USER" | jq '.data.user.pinnedItems.nodes' > "$DATA_DIR/pinned.json"

# 3. All Public Repositories
echo "🌐 Fetching Public Repositories..."
gh repo list "$GH_USER" --visibility public --limit 100 --json name,description,stargazerCount,languages,url,updatedAt,isPrivate,primaryLanguage,forkCount > "$DATA_DIR/repos.json"

echo "✅ Data refreshed in $DATA_DIR"
