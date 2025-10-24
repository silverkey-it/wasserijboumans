## Wasserij Boumans Portal

Basisondersteuning voor het Wasserij Boumans portaal met een simpele loginflow en landingpagina. De daadwerkelijke businesslogica volgt later; deze setup zorgt dat authenticatie, routing en deployment pipelines klaarstaan.

### Functionaliteit
- React + TypeScript frontend met `react-router-dom`.
- Auth-context die een mock-token bewaart in `localStorage`.
- Loginformulier dat tegen `/api/auth/login` van de backend praat.
- Landingpagina met placeholdercontent voor toekomstige features.

### Development
1. Installeer dependencies  
   ```bash
   npm install
   ```
2. Start de dev-server  
   ```bash
   npm run dev
   ```
3. Lint & build  
   ```bash
   npm run lint
   npm run build
   ```

De dev-server gebruikt standaard `VITE_API_BASE=http://localhost:8080/api`. Pas dit aan in `.env.development` indien gewenst.

### Login
Standaard credentials komen uit de backend-configuratie (zie `application.properties`). Default:
- gebruikersnaam: `admin`
- wachtwoord: `wasserij`

Na succesvol inloggen ga je naar `/dashboard`.

### Docker
Build en run lokaal:
```bash
docker build -t wasserijboumans:latest .
docker run --rm -p 8085:80 wasserijboumans:latest
```

De Nginx-configuratie voor deploy staat in `nginx.conf`. Een GitHub Actions workflow (`.github/workflows/deploy.yml`) bouwt en verstuurt dezelfde image.

### Verdere documentatie
- Reverse proxy & certificaatsetup: `docs/nginx-setup.md`
