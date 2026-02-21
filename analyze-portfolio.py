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
model = genai.GenerativeModel('gemini-1.5-flash-latest')

def analyze_portfolio():
    try:
        # Load latest repos
        repos_path = "public/data/repos.json"
        if not os.path.exists(repos_path):
             print(f"❌ {repos_path} not found. Skipping analysis.")
             sys.exit(1)

        with open(repos_path, "r") as f:
            repos = json.load(f)

        # Load forks (Interests)
        forks_path = "public/data/forks.json"
        forks_summary = []
        if os.path.exists(forks_path):
            with open(forks_path, "r") as f:
                forks = json.load(f)
            for r in forks:
                 if not r.get("isPrivate"):
                    forks_summary.append({
                        "name": r["name"],
                        "description": r.get("description", ""),
                        "lang": r.get("primaryLanguage", {}).get("name", "N/A") if r.get("primaryLanguage") else "N/A",
                        "topics": r.get("topics", [])
                    })
        
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
        Analyze the following GitHub repositories (Source & Forked) and provide a deep technical analysis of the developer's AI capabilities and interests.
        
        [Source Repositories (Main Portfolio)]:
        {json.dumps(repo_summary)}

        [Forked Repositories (Interests & Research)]:
        {json.dumps(forks_summary)}

        Tasks:
        1. Professional summary (EN/KO).
        2. 4 Key strengths (EN/KO).
           - **CRITICAL:** For each strength, provide a detailed explanation (2-3 sentences) citing specific repositories, code patterns, or technologies observed. Do not just say "Strong Python skills"; explain *how* it is demonstrated (e.g., "Demonstrates advanced Python proficiency through complex data processing pipelines in 'repo-a' and asynchronous scraping logic in 'repo-b'.").
        3. Top technological used.
        4. Select top 9 impressive projects.
        5. AI Core Capabilities Evaluation (4 dimensions):
           - "Integration", "Automation", "Context", "Agentic".
           - Score (0-100).
           - **Detailed reason (EN/KO):** Must be specific and evidence-based. Mention exactly *which* project or feature supports this score. (e.g., "High automation score due to the CI/CD workflows in 'project-x' and auto-labeling bot in 'project-y'.").
           - **NEW: AI Capabilities Overall Summary (EN/KO)**. A 1-sentence summary specifically for the AI section.
        6. **Interest Analysis (Based on Forks)**:
           - Analyze the forked repositories to identify what the developer is currently researching or interested in.
           - **Creative Title**: Generate a short, cool, tech-savvy section title (e.g., "Research Radar", "Incoming Signals", "Lab", "R&D Watchlist").
           - **Keywords**: 3-5 specific technology keywords (e.g., "LLM_Orchestration", "RAG", "Agentic_Workflows").
           - **Description (EN/KO)**: A brief explanation (1-2 sentences) of these interests.
           - **MANDATORY**: You MUST include this 'interests' field even if forked data is limited.

        [Tone & Manner Guidelines]
        - STRICTLY maintain an objective, factual, and neutral tone.
        - DO NOT use exaggerated, overly enthusiastic, or boastful adjectives.
        - Focus ONLY on technical facts.
        - Write as a third-party technical observer.

        Return ONLY a JSON object with this exact structure. DO NOT omit any keys:
        {{
          "en": {{ "summary": "...", "strengths": [...], "ai_summary": "..." }},
          "ko": {{ "summary": "...", "strengths": [...], "ai_summary": "..." }},
          "top_technologies": [...],
          "recommended_featured": [...],
          "ai_capabilities": [
            {{ "key": "Integration", "score": 85, "desc_en": "...", "desc_ko": "..." }},
            ...
          ],
          "interests": {{
            "title": "...",
            "keywords": ["...", "..."],
            "desc_en": "...",
            "desc_ko": "..."
          }}
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

        # Ensure 'interests' field exists to avoid frontend errors
        if "interests" not in analysis_data:
            print("⚠️ 'interests' field missing in AI response. Adding default.")
            analysis_data["interests"] = {
                "title": "Research Radar",
                "keywords": ["Tech Research", "Open Source"],
                "desc_en": "Analyzing latest trends and exploring innovative technologies through forked projects.",
                "desc_ko": "Fork된 프로젝트들을 통해 최신 기술 트렌드를 분석하고 혁신적인 기술들을 탐구하고 있습니다."
            }

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
