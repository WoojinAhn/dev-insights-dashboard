import os
import json
import google.generativeai as genai
import sys
import time
import requests
from datetime import datetime

# API Keys
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
GH_TOKEN = os.environ.get("GH_TOKEN") # Used for GitHub Models Fallback

if not any([GEMINI_API_KEY, GROQ_API_KEY, GH_TOKEN]):
    print("❌ No API keys found (GEMINI_API_KEY, GROQ_API_KEY, or GH_TOKEN)")
    sys.exit(1)

def call_gemini(prompt):
    if not GEMINI_API_KEY:
        raise Exception("Gemini API key not provided")
    
    genai.configure(api_key=GEMINI_API_KEY)
    
    model_name = 'gemini-2.0-flash'
    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"⚠️ Gemini failed: {e}")
        raise

def call_github_gpt(prompt):
    if not GH_TOKEN:
        raise Exception("GH_TOKEN not provided for GitHub Models")
    
    print("🚀 Attempting Fallback to GitHub Models (GPT-4o-mini)...")
    url = "https://models.inference.ai.azure.com/chat/completions"
    headers = {
        "Authorization": f"Bearer {GH_TOKEN}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "You are a professional technical portfolio analyzer. Return ONLY pure JSON."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.1,
        "response_format": {"type": "json_object"}
    }
    
    response = requests.post(url, headers=headers, json=data, timeout=30)
    response.raise_for_status()
    result = response.json()
    return result['choices'][0]['message']['content']

def call_groq(prompt):
    if not GROQ_API_KEY:
        raise Exception("Groq API key not provided")
    
    print("🚀 Attempting Fallback to Groq (Llama 3.3 70B)...")
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": "You are a professional technical portfolio analyzer. Return ONLY pure JSON."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.1,
        "response_format": {"type": "json_object"}
    }
    
    response = requests.post(url, headers=headers, json=data, timeout=30)
    response.raise_for_status()
    result = response.json()
    return result['choices'][0]['message']['content']

def analyze_portfolio():
    try:
        # Load data
        repos_path = "public/data/repos.json"
        forks_path = "public/data/forks.json"
        
        if not os.path.exists(repos_path):
             print(f"❌ {repos_path} not found.")
             sys.exit(1)

        with open(repos_path, "r") as f:
            repos = json.load(f)
        
        forks_summary = []
        if os.path.exists(forks_path):
            with open(forks_path, "r") as f:
                forks = json.load(f)
            for r in forks:
                 if not r.get("isPrivate"):
                    forks_summary.append({
                        "name": r["name"],
                        "description": r.get("description", ""),
                        "lang": r.get("primaryLanguage", {}).get("name", "N/A") if r.get("primaryLanguage") else "N/A"
                    })
        
        repo_summary = [{
            "name": r["name"],
            "description": r.get("description", ""),
            "lang": r.get("primaryLanguage", {}).get("name", "N/A") if r.get("primaryLanguage") else "N/A"
        } for r in repos if not r.get("isPrivate")]

        prompt = f"""
        [Role]: You are a Senior Technical Architect and Talent Scout.
        [Task]: Perform a rigorous technical audit of the following GitHub portfolio to identify the developer's unique engineering signature, AI proficiency, and research trajectory.

        [Data Inputs]:
        - SOURCE REPOSITORIES (Own Work): {json.dumps(repo_summary)}
        - FORKED REPOSITORIES (Research Interest): {json.dumps(forks_summary)}

        [Requirements for Analysis]:
        1. **Summary**: Define a 'Technical Persona' (e.g., 'Automation Architect', 'AI Integration Specialist').
        2. **Key Strengths**: Identify 4 high-level engineering strengths based ONLY on [Source Repositories]. 
           - For each, provide 'strength' (title) and 'evidence' (a concise technical explanation mentioning specific repos and technologies).
        3. **Top Technologies**: Identify the core tech stack from [Source Repositories].
        4. **AI Capabilities**: Evaluate 4 dimensions (Integration, Automation, Context, Agentic).
           - Score (0-100) and 'Detailed Reason'. Reason must be evidence-based (e.g., "Score 90 in Automation due to the implementation of complex GitHub Action workflows in [Repo Name]").
        5. **Interests (Research Radar)**: Analyze [Forked Repositories] only.
           - Identify what the developer is currently studying or watching. Provide a creative section title, keywords, and a visionary description.

        [Tone & Language Quality]:
        - Professional, objective, and dry. Avoid "passionate", "talented", or "amazing".
        - Korean Output: MUST be natural, sophisticated, and grammatically perfect (Senior level). Use professional endings like "~을 구축함", "~에 특화됨".
        - English Output: Standard industry-level technical prose.

        Return ONLY a JSON object with this exact structure:
        {{
          "en": {{ 
            "summary": "...", 
            "strengths": [{{ "strength": "...", "evidence": "..." }}, ...], 
            "ai_summary": "..." 
          }},
          "ko": {{ 
            "summary": "...", 
            "strengths": [{{ "strength": "...", "evidence": "..." }}, ...], 
            "ai_summary": "..." 
          }},
          "top_technologies": ["...", "..."],
          "recommended_featured": ["...", "..."],
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

        # --- Multi-LLM Execution ---
        raw_response = None
        used_provider = "Gemini"
        
        try:
            raw_response = call_gemini(prompt)
            print("✅ Analysis completed via Gemini")
        except Exception:
            try:
                raw_response = call_github_gpt(prompt)
                used_provider = "GPT-4o-mini (GitHub)"
                print("✅ Analysis completed via GPT-4o-mini")
            except Exception as e:
                print(f"⚠️ GitHub Models failed: {e}")
                try:
                    raw_response = call_groq(prompt)
                    used_provider = "Groq"
                    print("✅ Analysis completed via Groq (Fallback)")
                except Exception as e2:
                    print(f"❌ All providers failed: {e2}")
                    sys.exit(1)

        # --- Logging (History) ---
        history_dir = "public/data/history"
        os.makedirs(history_dir, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        history_file = os.path.join(history_dir, f"analysis_{timestamp}.json")
        
        with open(history_file, "w", encoding="utf-8") as f:
            json.dump({"provider": used_provider, "timestamp": timestamp, "response": raw_response}, f, ensure_ascii=False, indent=2)

        # --- Processing & Validation ---
        content = raw_response.replace("```json", "").replace("```", "").strip()
        try:
            analysis_data = json.loads(content)
        except Exception as e:
            print(f"⚠️ JSON parsing failed, using minimal fallback: {e}")
            analysis_data = {}

        # --- Strict Key Validation & Defaulting ---
        # 1. Base structure (en/ko)
        for lang_key in ["en", "ko"]:
            if lang_key not in analysis_data:
                analysis_data[lang_key] = {
                    "summary": "Technical profile analysis in progress.",
                    "strengths": [],
                    "ai_summary": "AI capability assessment pending."
                }
            # Ensure strengths are objects {strength, evidence}
            new_strengths = []
            for s in analysis_data[lang_key].get("strengths", []):
                if isinstance(s, str):
                    new_strengths.append({"strength": s, "evidence": "Demonstrated across various projects."})
                else:
                    new_strengths.append(s)
            analysis_data[lang_key]["strengths"] = new_strengths

        # 2. List fields
        if "top_technologies" not in analysis_data:
            analysis_data["top_technologies"] = ["TypeScript", "Python", "Java"]
        if "recommended_featured" not in analysis_data:
            analysis_data["recommended_featured"] = []

        # 3. AI Capabilities
        if "ai_capabilities" not in analysis_data:
            analysis_data["ai_capabilities"] = [
                {"key": "Integration", "score": 0, "desc_en": "Pending...", "desc_ko": "분석 중..."},
                {"key": "Automation", "score": 0, "desc_en": "Pending...", "desc_ko": "분석 중..."},
                {"key": "Context", "score": 0, "desc_en": "Pending...", "desc_ko": "분석 중..."},
                {"key": "Agentic", "score": 0, "desc_en": "Pending...", "desc_ko": "분석 중..."}
            ]

        # 4. Interests (Research Radar)
        if "interests" not in analysis_data:
            analysis_data["interests"] = {
                "title": "Research Radar",
                "keywords": ["AI", "Open Source"],
                "desc_en": "Exploring innovative tech through forked projects.",
                "desc_ko": "Fork된 프로젝트들을 통해 기술 트렌드를 분석 중입니다."
            }

        # Save validated data
        with open("public/data/analysis.json", "w", encoding="utf-8") as f:
            json.dump(analysis_data, f, ensure_ascii=False, indent=2)
        
        print(f"✨ Robust AI Analysis updated using {used_provider}!")

    except Exception as e:
        print(f"❌ Error during portfolio analysis: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    analyze_portfolio()
