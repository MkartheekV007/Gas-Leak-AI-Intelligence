# Gas Leak Safety Assistant

An AI-powered agent designed to help users assess gas leak incidents and provide immediate safety recommendations.
It uses Google's Gemini generative AI model to analyze descriptions of possible gas leaks, determine the risk level, provide a reason, and give immediate safety actions in simple language suitable for households and rural communities.

## Prerequisites

- Python 3.9+
- A Google Gemini API Key

## Installation

1. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set your Gemini API key as an environment variable.
   
   On Windows (Command Prompt):
   ```cmd
   set GEMINI_API_KEY=your_api_key_here
   ```
   
   On Windows (PowerShell):
   ```powershell
   $env:GEMINI_API_KEY="your_api_key_here"
   ```

   On Linux/macOS:
   ```bash
   export GEMINI_API_KEY="your_api_key_here"
   ```

## Usage

Run the agent script:

```bash
python agent.py
```

Describe your situation when prompted:

```
Situation Description: I smell LPG gas near my kitchen and hear a hissing sound.

[Analyzing situation...]

--- Assessment & Recommendations ---
Risk Level: High

Reason:
Possible active LPG gas leak.

Immediate Actions:
- Turn off gas supply.
- Open windows and doors.
- Avoid electrical switches.
- Do not use flames.

Incident Summary:
Potential gas leak reported in kitchen area requiring immediate attention.
------------------------------------
```
