import os
import json
import google.generativeai as genai
import sys
import time
from datetime import datetime

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
        if not os.path.exists(repos_path):
             print(f"❌ {repos_path} not found. Skipping analysis.")
             sys.exit(1)

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

        [Tone & Manner Guidelines]
        - STRICTLY maintain an objective, factual, and neutral tone.
        - DO NOT use exaggerated, overly enthusiastic, or boastful adjectives (e.g., "역량이 뛰어난", "다재다능한", "혁신적인", "뛰어난", "훌륭한").
        - Focus ONLY on technical facts, actual tech stacks used, and demonstrable achievements based on the provided repository data.
        - Write as a third-party technical observer, not a marketer.
        - When writing in Korean, use a dry and professional tone (e.g., "~을 활용함", "~구현 사례가 확인됨", "~에 특화된 개발자임").

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
        
        # --- Logging (History) ---
        history_dir = "public/data/history"
        os.makedirs(history_dir, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        history_file = os.path.join(history_dir, f"gemini_response_{timestamp}.json")
        
        # Save raw response for debugging/history
        log_data = {
            "timestamp": timestamp,
            "prompt_preview": prompt[:200] + "...",
            "raw_text": response.text
        }
        
        with open(history_file, "w", encoding="utf-8") as f:
            json.dump(log_data, f, ensure_ascii=False, indent=2)
        print(f"📝 Saved raw API response to {history_file}")

        # --- Processing & Validation ---
        content = response.text.replace("```json", "").replace("```", "").strip()
        analysis_data = json.loads(content)

        # Save to analysis.json only if parsing succeeded
        analysis_path = "public/data/analysis.json"
        with open(analysis_path, "w", encoding="utf-8") as f:
            json.dump(analysis_data, f, ensure_ascii=False, indent=2)
        
        print("✅ Dynamic AI Capabilities with Summaries updated!")

    except Exception as e:
        print(f"❌ Error during AI analysis: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    analyze_portfolio()
