const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type data = {
  choice: string;
  context: string;
  history: string[];
};

export async function analyzeDecision(data: data) {
  const response = await fetch(`${API_BASE}/api/decisions/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
