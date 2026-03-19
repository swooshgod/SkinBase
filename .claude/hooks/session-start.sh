#!/bin/bash
set -e
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Session Start — SkinBase"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📌 Branch: $(git branch --show-current 2>/dev/null || echo 'unknown')"
echo ""
echo "📝 Last 5 commits:"
git log --oneline -5 2>/dev/null || echo "  (no commits yet)"
echo ""
echo "📂 Git status:"
git status --short 2>/dev/null || echo "  (clean)"
echo ""
if [ -f "package.json" ]; then
  echo "📦 Installing dependencies..."
  npm install --prefer-offline --silent 2>/dev/null && echo "  ✅ Done" || echo "  ⚠️  npm install failed"
  echo ""
fi
echo "🔑 Env var check:"
ENV_VARS=("SUPABASE_URL" "SUPABASE_ANON_KEY" "EXPO_PUBLIC_SUPABASE_URL" "EXPO_PUBLIC_SUPABASE_ANON_KEY" "OPENAI_API_KEY")
if [ -f ".env" ]; then export $(grep -v '^#' .env | xargs) 2>/dev/null && echo "  ✅ .env loaded"; fi
MISSING=0
for VAR in "${ENV_VARS[@]}"; do
  if [ -z "${!VAR}" ]; then echo "  ❌ $VAR — missing"; MISSING=$((MISSING + 1)); else echo "  ✅ $VAR"; fi
done
[ $MISSING -gt 0 ] && echo "" && echo "  ⚠️  $MISSING env var(s) missing."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Session ready. Happy building."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
