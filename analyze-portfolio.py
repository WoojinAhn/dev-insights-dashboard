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
model = genai.GenerativeModel('gemini-1.5-flash')

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
                    "lang": r.get("primaryLanguage", {}).get("name", "N/A") if r.get("primaryLanguage") else "N/A"
                })

        prompt = f"""
        Analyze the following GitHub portfolio data and provide a professional summary of the developer's strengths and core technologies.
        Data: {json.dumps(repo_summary[:20])}

        Return ONLY a JSON object with this exact structure:
        {{
          "en": {{
            "summary": "1-2 sentences professional summary in English",
            "strengths": ["Strength 1", "Strength 2", "Strength 3", "Strength 4"]
          }},
          "ko": {{
            "summary": "1-2 sentences professional summary in Korean",
            "strengths": ["강점 1", "강점 2", "강점 3", "강점 4"]
          }},
          "top_technologies": ["Tech 1", "Tech 2", "Tech 3", "Tech 4", "Tech 5"]
        }}
        """

        response = model.generate_content(prompt)
        content = response.text.replace("```json", "").replace("```", "").strip()
        analysis_data = json.loads(content)

        # Save to analysis.json
        analysis_path = "public/data/analysis.json"
        with open(analysis_path, "w", encoding="utf-8") as f:
            json.dump(analysis_data, f, ensure_ascii=False, indent=2)
        
        print("✅ AI Portfolio Analysis updated successfully!")

    except Exception as e:
        print(f"❌ Error during AI analysis: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    analyze_portfolio()
