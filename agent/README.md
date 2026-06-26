# Gas Leak Safety Assistant

A production-ready AI Agent designed to assess user descriptions of gas leak incidents and immediately output actionable, life-saving advice in a structured format. This project is structured around Google Agent Development Kit (ADK) principles, utilizing a modular, code-first approach.

## Features
- **Structured Schema Output:** Guarantees responses contain Risk Level, Reason, Immediate Actions, and an Incident Summary.
- **Safety-First Prompting:** Strict rules ensure critical risk situations always prioritize immediate evacuation and emergency contact.
- **Dual Interfaces:** Provides both an interactive CLI and a FastAPI REST interface for programmatic integration.
- **Docker Ready:** Includes a `Dockerfile` for easy containerization and deployment.

## Prerequisites
- Python 3.10+
- A Google Gemini API Key. Get one at [Google AI Studio](https://aistudio.google.com/).

## Setup Instructions

### 1. Backend (AI Layer) Setup
1. **Navigate to the agent directory:**
   ```bash
   cd agent
   ```
2. **Create a virtual environment:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```
3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Configure Environment Variables:**
   Copy the example environment file and add your API key:
   ```bash
   cp .env.example .env
   # Edit .env and set GEMINI_API_KEY=your_api_key_here
   ```
5. **Start the API Server:**
   ```bash
   python main.py
   ```
   *The backend will run on `http://localhost:8000`*

### 2. Frontend (Web UI) Setup
1. **Open a new terminal window.**
2. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`. Open this URL in your browser to interact with the Dashboard.*

## Usage

Once both servers are running, simply type your incident description into the modern React dashboard and click "Get Immediate Actions". The frontend directly communicates with the Python backend to provide real-time, life-saving assessments.

## Deployment Instructions

This project is ready to be deployed to containerized platforms like Google Cloud Run, AWS App Runner, or any Docker-compatible hosting environment.

1. **Build the Docker image:**
   ```bash
   docker build -t gas-leak-agent .
   ```

2. **Run the Docker container locally:**
   ```bash
   docker run -p 8000:8000 --env-file .env gas-leak-agent
   ```

3. **Deploy to Google Cloud Run:**
   Assuming you have the `gcloud` CLI installed and authenticated:
   ```bash
   gcloud run deploy gas-leak-agent \
       --source . \
       --port 8000 \
       --set-env-vars="GEMINI_API_KEY=your_api_key_here" \
       --allow-unauthenticated
   ```
