# Mathe Lern App

Dies ist eine einfache Web-App, um Grundrechenarten zu üben. Als Belohnung für richtige Antworten werden zufällige, lustige GIFs von Tenor angezeigt. Die App ist als Progressive Web App (PWA) konzipiert, was bedeutet, dass sie auf einem Gerät (z.B. einem Smartphone) installiert und auch offline genutzt werden kann.

## Features

- Üben von Addition, Subtraktion, Multiplikation und Division.
- Einstellbarer Zahlenbereich für die Aufgaben.
- Zufällige GIF-Belohnungen über die Tenor API.
- Offline-Fähigkeit durch einen Service Worker.
- Installierbar auf Desktop und Mobilgeräten (PWA).
- Galerie zum Ansehen der bisher erhaltenen GIFs.

## Setup & Lokales Testen

Um die App lokal zu entwickeln und zu testen, sind einige Schritte notwendig.

### Voraussetzungen

1. **Python**: Wird benötigt, um einen einfachen lokalen Webserver zu starten. [Python herunterladen](https://www.python.org/downloads/).
2. **Chocolatey (Optional, für Windows)**: Ein Paketmanager, der die Installation von `ngrok` vereinfacht. [Chocolatey installieren](https://chocolatey.org/install).
3. **ngrok**: Wird benötigt, um die PWA-Funktionen auf einem mobilen Gerät zu testen, da dies eine sichere HTTPS-Verbindung erfordert.
4. **Tenor API Key**: Um die GIF-Belohnungen zu nutzen, benötigst du einen eigenen API-Schlüssel von Tenor. Du kannst ihn hier bekommen: [Tenor GIF API](https://tenor.com/gifapi/documentation).

### Anleitung

1. **API Key eintragen**:
   - Starte die App.
   - Klicke auf das Zahnrad-Symbol (⚙️) für die Einstellungen.
   - Gib deinen persönlichen Tenor API Key ein und speichere ihn.

2. **Lokalen Server starten (Automatisiert)**:
   - Führe die Datei `start_dev.bat` durch einen Doppelklick aus.
   - Das Skript prüft, ob `ngrok` installiert ist (und installiert es bei Bedarf via Chocolatey).
   - Es öffnen sich zwei neue Kommandozeilen-Fenster:
     - Eines für den Python-Webserver auf Port 8000.
     - Eines für den `ngrok`-Tunnel.

3. **App testen**:
   - **Auf dem PC**: Öffne im Browser die Adresse [http://localhost:8000](http://localhost:8000).
   - **Auf dem Smartphone**: Suche im `ngrok`-Fenster nach der `https://`-Adresse (z.B. `https://dein-code.ngrok.io`). Gib diese Adresse im Browser deines Smartphones ein. Da dies eine sichere Verbindung ist, kannst du die App nun als PWA installieren und die Offline-Funktionen testen.

---
*Entwickelt mit Unterstützung von Cascade.*
