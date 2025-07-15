@echo off
REM Dieses Skript startet die Entwicklungsumgebung für die Mathe trainer app.

REM Schritt 1: Prüfen, ob ngrok installiert ist.
where ngrok >nul 2>nul
if %errorlevel% neq 0 (
    echo ngrok nicht gefunden. Versuche, es mit Chocolatey zu installieren...
    where choco >nul 2>nul
    if %errorlevel% neq 0 (
        echo Chocolatey ist nicht installiert. Bitte installiere ngrok manuell.
        echo Lade es hier herunter: https://ngrok.com/download
        pause
        exit /b
    ) else (
        choco install ngrok -y
    )
) else (
    echo ngrok ist bereits installiert.
)

REM Schritt 2: Starte den Python Webserver in einem neuen Fenster.
echo Starte Python Webserver auf Port 8000...
start "Python Server" cmd /k "python -m http.server 8000"

REM Kurze Pause, damit der Server starten kann
timeout /t 2 >nul

REM Schritt 3: Starte ngrok in einem neuen Fenster.
echo Starte ngrok Tunnel für Port 8000...
start "ngrok Tunnel" cmd /k "ngrok http 8000"

echo Entwicklungsumgebung gestartet!
