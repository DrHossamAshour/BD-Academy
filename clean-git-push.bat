@echo off
echo Creating .gitignore if not exists...
if not exist .gitignore (
    echo node_modules/ > .gitignore
) else (
    findstr /C:"node_modules/" .gitignore >nul || echo node_modules/ >> .gitignore
)

echo Removing node_modules from Git tracking...
git rm -r --cached node_modules

echo Adding all files...
git add .

echo Committing changes...
git commit -m "Removed node_modules and updated .gitignore"

echo Pushing to origin main...
git push -u origin main

echo ✅ Done!
pause
