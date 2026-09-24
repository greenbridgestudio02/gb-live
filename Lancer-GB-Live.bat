@echo off
title GB Live - Serveur
cd /d "C:\Users\user\Documents\gb-live"

(
echo {
echo   "mode": "home",
echo   "song": null,
echo   "elapsedTime": 0,
echo   "isPlaying": false,
echo   "message": "",
echo   "messageUpdatedAt": 0,
echo   "updatedAt": 0
echo }
) > data\live-state.json

start "GB Live MIDI" /min cmd /c "node scripts\midi-trigger.cjs"

start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000 & start http://localhost:3000/screen"

npm start