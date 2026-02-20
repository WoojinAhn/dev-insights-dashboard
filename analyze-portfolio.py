import os
import json
import google.generativeai as genai
import sys

# Configure Gemini API
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("❌ GEMINI_API_KEY not found in environment")
    sys.exit(1)

genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-3-flash-preview')

def analyze_portfolio():
    try:
        # Load latest repos
        repos_path = "public/data/repos.json"
        with open(repos_path, "r") as f:
            repos = json.load(f)
        
        # Prepare data for AI (compact format)
        repo_summary = []
        for r in repos:
            if not r.get("isPrivate"):
                repo_summary.append({
                    "name": r["name"],
                    "description": r.get("description", ""),
                    "stars": r.get("stargazerCount", 0),
                    "forks": r.get("forkCount", 0),
                    "lang": r.get("primaryLanguage", {}).get("name", "N/A") if r.get("primaryLanguage") else "N/A",
                    "updated": r.get("updatedAt", "")
                })

        prompt = f"""
        Analyze the following GitHub repositories and provide professional insights.
        Data: {json.dumps(repo_summary)}

        Tasks:
        1. Provide a professional 1-2 sentence summary in English and Korean.
        2. Identify 4 key professional strengths in English and Korean.
        3. Determine the top 5 technologies used across all projects.
        4. Evaluate each repository and select the top 9 most "impressive" or "proud" projects (excluding purely forked or low-effort ones). Rank them by their technical value and impact.

        Return ONLY a JSON object with this exact structure:
        {{
          "en": {{
            "summary": "English summary",
            "strengths": ["Strength 1", "Strength 2", "Strength 3", "Strength 4"]
          }},
          "ko": {{
            "summary": "Korean summary",
            "strengths": ["강점 1", "강점 2", "강점 3", "강점 4"]
          }},
          "top_technologies": ["Tech 1", "Tech 2", "Tech 3", "Tech 4", "Tech 5"],
          "recommended_featured": ["RepoName1", "RepoName2", "RepoName3", ..., "RepoName9"]
        }}
        """

        response = model.generate_content(prompt)
        content = response.text.replace("```json", "").replace("```", "").strip()
        analysis_data = json.loads(content)

        # Save to analysis.json
        analysis_path = "public/data/analysis.json"
        with open(analysis_path, "w", encoding="utf-8") as f:
            json.dump(analysis_data, f, ensure_ascii=False, indent=2)
        
        print("✅ AI Portfolio Analysis and Recommendations updated!")

    except Exception as e:
        print(f"❌ Error during AI analysis: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    analyze_portfolio()
