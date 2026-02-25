import os
import json
import google.generativeai as genai
import sys
import time
import requests
from datetime import datetime

# API Keys
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
GH_TOKEN = os.environ.get("GH_TOKEN")

if not any([GEMINI_API_KEY, GH_TOKEN]):
    print("❌ No API keys found (GEMINI_API_KEY or GH_TOKEN)")
    sys.exit(1)

def call_gemini(prompt):
    if not GEMINI_API_KEY:
        raise Exception("Gemini API key not provided")
    
    genai.configure(api_key=GEMINI_API_KEY)
    # Reverting to 2.0-flash as requested, keeping JSON mode for stability
    model_name = 'gemini-2.0-flash'
    
    generation_config = {
        "temperature": 0.2,
        "response_mime_type": "application/json",
    }
    
    for attempt in range(3):
        try:
            model = genai.GenerativeModel(model_name, generation_config=generation_config)
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            if "429" in str(e) and attempt < 2:
                print(f"⚠️ Gemini quota reached. Waiting 30s before retry {attempt+1}/3...")
                time.sleep(30)
                continue
            print(f"⚠️ Gemini failed: {e}")
            raise

def call_github_gpt(prompt):
    token = os.environ.get("GH_TOKEN")
    if not token:
        raise Exception("GH_TOKEN not provided")
    
    print("🚀 Attempting Fallback to GitHub Models (GPT-4o-mini)...")
    url = "https://models.inference.ai.azure.com/chat/completions"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "You are a professional technical portfolio analyzer. Return ONLY pure JSON."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.1
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
        [Task]: Perform a rigorous technical audit of the provided GitHub portfolio.

        [Data Inputs]:
        1. **SOURCE REPOSITORIES** (The developer's actual work): 
        {json.dumps(repo_summary)}
        
        2. **FORKED REPOSITORIES** (Reference/Study material only - DO NOT use for skills assessment): 
        {json.dumps(forks_summary)}

        [Analysis Constraints - CRITICAL]:
        - **Summary, Strengths, Top Technologies, AI Capabilities**: MUST be based **ONLY** on [SOURCE REPOSITORIES]. Do NOT mention forked repos (like scavenger, fixture-monkey, etc.) in these sections.
        - **Interests (Research Radar)**: This is the ONLY section where you should use [FORKED REPOSITORIES].

        [Requirements for Analysis]:
        1. **Summary**: Define a 'Technical Persona' based ONLY on their own code.
        2. **Key Strengths**: Identify 3-5 high-level engineering strengths based ONLY on [SOURCE REPOSITORIES].
           - Evidence must point to specific source repos.
           - Each strength must include `tag_en` (1-3 word English hashtag) and `tag_ko` (1-3 word Korean hashtag).
        3. **Top Technologies**: Identify the core tech stack from [SOURCE REPOSITORIES].
        4. **AI Capabilities**: Freely identify 3-5 AI capability dimensions based ONLY on [SOURCE REPOSITORIES].
           - Do NOT use fixed keys. Choose descriptive snake_case keys (e.g. "llm_integration", "workflow_automation").
           - Each must include `title_en` and `title_ko` (short display title), `score` (0-100), and `desc_en`/`desc_ko` as complete descriptive sentences.
        5. **Interests (Research Radar)**: Analyze [FORKED REPOSITORIES] to see what they are studying.
           - Provide a bilingual section title (`title_en`, `title_ko`).
           - `keywords` must be an array of objects, each with `name`, `desc_en`, `desc_ko` as complete descriptive sentences.

        [Tone & Language Quality]:
        - Professional, objective, and dry.
        - Korean `desc` fields (`evidence`, `desc_ko`): MUST be complete sentences ending with "~합니다", "~있습니다", "~보여줍니다" etc. Short forms ("~을 구축함", "~에 특화됨") are only allowed for titles and tags.
        - English `desc` fields (`evidence`, `desc_en`): MUST be complete sentences with Subject + Verb structure. Do NOT use noun phrases or gerund phrases.
        - English Output: Standard industry-level technical prose.

        Return ONLY a JSON object with this exact structure:
        {{
          "en": {{
            "summary": "...",
            "strengths": [{{ "strength": "...", "evidence": "...", "tag_en": "Web Apps", "tag_ko": "웹 앱" }}, ...],
            "ai_summary": "..."
          }},
          "ko": {{
            "summary": "...",
            "strengths": [{{ "strength": "...", "evidence": "...", "tag_en": "Web Apps", "tag_ko": "웹 앱" }}, ...],
            "ai_summary": "..."
          }},
          "top_technologies": ["...", "..."],
          "recommended_featured": ["...", "..."],
          "ai_capabilities": [
            {{ "key": "llm_integration", "title_en": "LLM Integration", "title_ko": "LLM 통합", "score": 85, "desc_en": "...", "desc_ko": "..." }},
            ...
          ],
          "interests": {{
            "title_en": "...",
            "title_ko": "...",
            "keywords": [{{ "name": "AI Integration", "desc_en": "...", "desc_ko": "..." }}, ...],
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
                print(f"❌ All providers failed (Gemini, GitHub Models): {e}")
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
            # Ensure strengths are objects {strength, evidence, tag_en, tag_ko}
            new_strengths = []
            for s in analysis_data[lang_key].get("strengths", []):
                if isinstance(s, str):
                    s = {"strength": s, "evidence": "Demonstrated across various projects."}
                if "tag_en" not in s:
                    s["tag_en"] = " ".join(s.get("strength", "").split()[:2])
                if "tag_ko" not in s:
                    s["tag_ko"] = " ".join(s.get("strength", "").split()[:2])
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
                {"key": "llm_integration", "title_en": "LLM Integration", "title_ko": "LLM 통합", "score": 0, "desc_en": "Pending...", "desc_ko": "분석 중..."},
                {"key": "workflow_automation", "title_en": "Workflow Automation", "title_ko": "워크플로우 자동화", "score": 0, "desc_en": "Pending...", "desc_ko": "분석 중..."},
            ]
        else:
            for cap in analysis_data["ai_capabilities"]:
                if "title_en" not in cap:
                    cap["title_en"] = cap.get("key", "").replace("_", " ").title()
                if "title_ko" not in cap:
                    cap["title_ko"] = cap.get("key", "").replace("_", " ").title()

        # 4. Interests (Research Radar)
        if "interests" not in analysis_data:
            analysis_data["interests"] = {
                "title_en": "Research Radar",
                "title_ko": "리서치 레이더",
                "keywords": [{"name": "AI", "desc_en": "Exploring AI trends.", "desc_ko": "AI 트렌드 탐구 중."}],
                "desc_en": "Exploring innovative tech through forked projects.",
                "desc_ko": "Fork된 프로젝트들을 통해 기술 트렌드를 분석 중입니다."
            }
        else:
            interests = analysis_data["interests"]
            if "title_en" not in interests:
                interests["title_en"] = interests.get("title", "Research Radar")
            if "title_ko" not in interests:
                interests["title_ko"] = interests.get("title", "리서치 레이더")
            interests.pop("title", None)
            # Convert string keywords to objects
            new_keywords = []
            for kw in interests.get("keywords", []):
                if isinstance(kw, str):
                    new_keywords.append({"name": kw, "desc_en": interests.get("desc_en", ""), "desc_ko": interests.get("desc_ko", "")})
                else:
                    new_keywords.append(kw)
            interests["keywords"] = new_keywords

        # Save validated data
        analysis_data["model_provider"] = used_provider
        with open("public/data/analysis.json", "w", encoding="utf-8") as f:
            json.dump(analysis_data, f, ensure_ascii=False, indent=2)
        
        print(f"✨ Robust AI Analysis updated using {used_provider}!")

    except Exception as e:
        print(f"❌ Error during portfolio analysis: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    analyze_portfolio()
