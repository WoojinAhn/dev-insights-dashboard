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
        
        # Prepare data for AI
        repo_summary = []
        for r in repos:
            if not r.get("isPrivate"):
                repo_summary.append({
                    "name": r["name"],
                    "description": r.get("description", ""),
                    "lang": r.get("primaryLanguage", {}).get("name", "N/A") if r.get("primaryLanguage") else "N/A"
                })

        prompt = f"""
        Analyze the following GitHub repositories and provide a deep technical analysis of the developer's AI capabilities.
        Data: {json.dumps(repo_summary)}

        Tasks:
        1. Professional summary (EN/KO).
        2. 4 Key strengths (EN/KO).
        3. Top  tecnológica used.
        4. Select top 9 impressive projects.
        5. AI Core Capabilities Evaluation (4 dimensions):
           - "Integration", "Automation", "Context", "Agentic".
           - Score (0-100), Detailed reason (EN/KO).
           - **NEW: AI Capabilities Overall Summary (EN/KO)**. A 1-sentence summary specifically for the AI section.

        Return ONLY a JSON object with this exact structure:
        {{
          "en": {{ "summary": "...", "strengths": [...], "ai_summary": "..." }},
          "ko": {{ "summary": "...", "strengths": [...], "ai_summary": "..." }},
          "top_technologies": [...],
          "recommended_featured": [...],
          "ai_capabilities": [
            {{ "key": "Integration", "score": 85, "desc_en": "...", "desc_ko": "..." }},
            ...
          ]
        }}
        """

        response = model.generate_content(prompt)
        content = response.text.replace("```json", "").replace("```", "").strip()
        analysis_data = json.loads(content)

        # Save to analysis.json
        analysis_path = "public/data/analysis.json"
        with open(analysis_path, "w", encoding="utf-8") as f:
            json.dump(analysis_data, f, ensure_ascii=False, indent=2)
        
        print("✅ Dynamic AI Capabilities with Summaries updated!")

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    analyze_portfolio()
