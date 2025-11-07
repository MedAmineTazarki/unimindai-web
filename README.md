# 🧠 UnimindAI Web App

Application web de test pour UnimindAI - Interface complète pour tester le backend Firebase avec MCP.

## 🌟 Fonctionnalités

✅ **Interface de Chat** - Conversations avec l'IA  
✅ **Gestion des Notes** - Knowledge Base (MCP)  
✅ **Test MCP Tools** - Interface de test des outils  
✅ **Authentification Firebase** - Login sécurisé  
✅ **Design moderne** - Interface responsive  

## 🚀 Demo en ligne

👉 **App déployée :** [https://unimindai-web.vercel.app](https://unimindai-web.vercel.app)

## 📦 Installation locale

```bash
# Cloner le repo
git clone https://github.com/MedAmineTazarki/unimindai-web.git
cd unimindai-web

# Ouvrir avec un serveur local
python -m http.server 8000
# OU
npx serve
```

## ⚙️ Configuration

### 1. Firebase Config

Éditez `config.js` avec votre configuration Firebase :

```javascript
const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "fallalertapp-9b1fa.firebaseapp.com",
    projectId: "fallalertapp-9b1fa",
    // ...
};
```

### 2. Activer Authentication

Dans [Firebase Console](https://console.firebase.google.com/u/0/project/fallalertapp-9b1fa/authentication):
- Activer Email/Password
- Créer un utilisateur de test : `demo@unimindai.com` / `demo123`

### 3. Backend URL

L'app pointe vers :
```
https://us-central1-fallalertapp-9b1fa.cloudfunctions.net/api
```

Assurez-vous que le backend est déployé !

## 🎯 Utilisation

### 1. **Connexion**
- Email: `demo@unimindai.com`
- Password: `demo123`

### 2. **Chat** 💬
- Posez des questions à l'IA
- L'historique est sauvegardé dans Firestore
- Réponses via Replicate AI (Llama 3)

### 3. **Notes** 📝
- Créer des notes
- Chercher dans vos notes
- Tags pour l'organisation
- Stockage sécurisé (MCP Knowledge Base)

### 4. **MCP Tools** ⚙️
- Voir tous les tools disponibles
- Tester chaque tool manuellement
- Voir les réponses JSON

## 🛠️ Technologies

- **HTML5/CSS3/JavaScript** - Frontend pur (pas de framework)
- **Firebase Auth** - Authentification
- **Firebase Functions** - Backend API
- **MCP Protocol** - JSON-RPC 2.0
- **Replicate AI** - LLM (Llama 3)

## 📡 API Endpoints utilisés

```javascript
// Chat
POST /api/chat/send-message

// MCP Tools
POST /api/mcp/tools/list
POST /api/mcp/tools/call
```

## 🔐 Sécurité

- ✅ Authentication JWT Firebase
- ✅ Token validé côté backend
- ✅ Données isolées par utilisateur
- ✅ CORS configuré

## 📱 Responsive

L'interface s'adapte automatiquement :
- 📱 Mobile
- 💻 Desktop
- 📐 Tablette

## 🐛 Debug

Ouvrez la console navigateur (F12) pour voir :
- Logs de connexion
- Requêtes API
- Erreurs éventuelles

## 🔗 Liens utiles

- **Backend repo:** [unimindai-backend](https://github.com/MedAmineTazarki/unimindai-backend)
- **Firebase Console:** [Project](https://console.firebase.google.com/project/fallalertapp-9b1fa)
- **MCP Spec:** [modelcontextprotocol.io](https://modelcontextprotocol.io)

## 📄 Licence

MIT License

---

**Créé avec ❤️ pour tester UnimindAI Backend**
