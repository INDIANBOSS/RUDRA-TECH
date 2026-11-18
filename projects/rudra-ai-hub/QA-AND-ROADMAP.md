# RUDRA AI HUB — QA and Development Plan

## Deployment
- Production URL: https://rudra-ai-hub.vercel.app
- Hosting: Vercel
- Model provider: Google Gemini (Gemini Flash)
- API key: stored as the server-side `GEMINI_API_KEY` environment variable; never place it in browser code.

## Confirmed from manual user tests
- [x] Universal chat returned Hindi and English text.
- [x] A Research Agent-style DNS explanation was returned after an earlier “Failed to fetch” message.
- [x] A calculator/code-generation response was returned.
- [x] An IT Support website/code-generation response was returned.
- [x] Vercel reported the production deployment as READY.
- [x] The deployment file inventory includes `src/index.html` and `src/api/chat.js`.

## Not yet verified
- [ ] Selected specialist agent is actually passed to the server and changes the system prompt.
- [ ] Content Agent routing.
- [ ] Creative Agent routing.
- [ ] Media Agent routing.
- [ ] Builder Agent routing (card selection is visible; server-side routing still needs confirmation).
- [ ] Review Agent routing.
- [ ] Request timeout, retry, and user-friendly error handling.
- [ ] Chat history and mobile accessibility.
- [ ] Production smoke test for every agent.

## Safe implementation rules
1. Preserve the existing working production deployment until a replacement has been inspected and tested.
2. Never expose or print the Gemini API key. Keep it server-side only.
3. Do not claim an agent passed solely because the universal assistant returned a response; verify the selected agent and response behavior.
4. Use free-tier models and services unless the owner explicitly approves a change.
5. Ask for approval before any paid upgrade, account change, or destructive action.

## Next engineering tasks
1. Inspect the full current frontend and API source before editing.
2. Trace the selected-agent value from the UI to the API request.
3. Add explicit agent validation and a safe default if selection is missing.
4. Return structured errors for missing key, upstream API failure, rate limits, and timeouts.
5. Test all specialist routes on a preview deployment before promoting to production.
