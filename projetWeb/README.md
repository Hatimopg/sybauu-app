## README (extraits importants)


- **But** : permettre à un utilisateur de se connecter via GitHub OAuth, afficher la page d'accueil avec son compte et les organisations, puis en cliquant sur une organisation montrer les repositories.
- **Important** : vous devez créer une OAuth App GitHub (https://github.com/settings/developers) et récupérer `GITHUB_CLIENT_ID` et `GITHUB_CLIENT_SECRET`. Mettre `Authorization callback URL` sur `http://localhost:4000/auth/github/callback` (ou ajuster si port différent).