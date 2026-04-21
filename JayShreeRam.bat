@echo off
echo.
echo  Jay Shree Ram - Deploying ZenVista Homes...
echo  ============================================

:: Step 1 - Stage and Push to GitHub
git add .
git commit -m "Update: Jay Shree Ram"
git push origin main

:: Step 2 - Trigger Cloudflare Deploy via GitHub Actions
echo.
echo  Triggering Cloudflare deployment...

curl -s -X POST ^
  -H "Authorization: token YOUR_GITHUB_TOKEN" ^
  -H "Accept: application/vnd.github.v3+json" ^
  https://api.github.com/repos/raigaurav0511/zenvistahomes/actions/workflows/deploy.yml/dispatches ^
  -d "{\"ref\":\"main\"}"

echo.
echo  Done! Site is deploying to www.zenvistahomes.com
echo  Check: github.com/raigaurav0511/zenvistahomes/actions
echo.
pause
