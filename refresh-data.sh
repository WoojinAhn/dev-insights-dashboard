#!/bin/bash

DATA_DIR="./public/data"
mkdir -p "$DATA_DIR"
GH_USER="WoojinAhn"

echo "🔄 Refreshing GitHub Data for $GH_USER (Excluding Forks)..."

# Helper function for safe fetching
fetch_data() {
    local url="$1"
    local output="$2"
    local temp_output="${output}.tmp"
    local cmd="$3"

    if eval "$cmd > \"$temp_output\""; then
        if [ -s "$temp_output" ]; then
            mv "$temp_output" "$output"
            echo "✅ Updated $output"
        else
            echo "⚠️  Empty response for $output. Keeping old data."
            rm -f "$temp_output"
        fi
    else
        echo "❌ Failed to fetch $output. Keeping old data."
        rm -f "$temp_output"
    fi
}

# 1. User Profile
echo "👤 Fetching User Profile..."
fetch_data "users/$GH_USER" "$DATA_DIR/user.json" "gh api \"users/$GH_USER\""

# 2. Pinned Repositories (GraphQL)
echo "📍 Fetching Pinned Repositories..."
QUERY='query($login:String!) {
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
}'
# Escape the query for the eval string
SAFE_QUERY=$(echo "$QUERY" | tr -d '\n' | sed 's/"/\\"/g' | sed 's/\$/\\$/g')
CMD="gh api graphql -f query=\"$SAFE_QUERY\" -F login=\"$GH_USER\" | jq '.data.user.pinnedItems.nodes | map(select(.isFork == false))'"
fetch_data "pinned_repos" "$DATA_DIR/pinned.json" "$CMD"

# 3. All Public Source Repositories (Non-Forks)
echo "🌐 Fetching Public Source Repositories..."
CMD="gh repo list \"$GH_USER\" --visibility public --source --limit 100 --json name,description,stargazerCount,languages,url,updatedAt,isPrivate,isFork,primaryLanguage,forkCount"
fetch_data "repos" "$DATA_DIR/repos.json" "$CMD"

# 4. Forked Repositories (Interests) - Fetching Parent Stats via GraphQL
echo "🍴 Fetching Forked Repositories (with Parent Stats)..."
FORK_QUERY='query($login:String!) {
  user(login: $login) {
    repositories(first: 100, isFork: true, privacy: PUBLIC, orderBy: {field: UPDATED_AT, direction: DESC}) {
      nodes {
        name
        description
        url
        isPrivate
        isFork
        updatedAt
        stargazerCount
        forkCount
        primaryLanguage {
          name
        }
        parent {
          name
          owner {
            login
          }
          stargazerCount
          forkCount
        }
      }
    }
  }
}'
SAFE_FORK_QUERY=$(echo "$FORK_QUERY" | tr -d '\n' | sed 's/"/\\"/g' | sed 's/\$/\\$/g')
CMD="gh api graphql -f query=\"$SAFE_FORK_QUERY\" -F login=\"$GH_USER\" | jq '.data.user.repositories.nodes'"
fetch_data "forks" "$DATA_DIR/forks.json" "$CMD"

# 5. Run AI Analysis
echo "🧠 Running AI Analysis..."
if python3 analyze-portfolio.py; then
    echo "✅ AI Analysis complete."
else
    echo "❌ AI Analysis failed. Keeping old analysis data."
fi

echo "✅ Data refresh process finished in $DATA_DIR"
