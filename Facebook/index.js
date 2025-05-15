const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

let userAccessToken = null;
let instagramUserId = null;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send(`<h1>Bienvenue sur Sirius Auth</h1>
    <a href="/login">🔐 Connecter mon compte Facebook / Instagram</a>`);
});

app.get('/login', (req, res) => {
  const fbOAuthUrl = `https://www.facebook.com/v22.0/dialog/oauth?client_id=${process.env.FB_APP_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=pages_show_list,instagram_basic,pages_read_engagement,instagram_content_publish`;
  res.redirect(fbOAuthUrl);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send('❌ Erreur : code manquant');

  try {
    const tokenResponse = await axios.get(`https://graph.facebook.com/v22.0/oauth/access_token`, {
      params: {
        client_id: process.env.FB_APP_ID,
        redirect_uri: process.env.REDIRECT_URI,
        client_secret: process.env.FB_APP_SECRET,
        code: code
      }
    });

    userAccessToken = tokenResponse.data.access_token;

    res.send(`
      ✅ Connexion réussie !<br><br>
      Voici ton token :<br>
      <code>${userAccessToken}</code><br><br>
      🔁 Tu peux maintenant appeler /pages, /instagram ou /post
    `);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.send('❌ Erreur lors de la récupération du token.');
  }
});

app.get('/pages', async (req, res) => {
  if (!userAccessToken) {
    return res.status(401).json({ error: "Non connecté. Va sur /login d'abord." });
  }

  try {
    const pagesRes = await axios.get('https://graph.facebook.com/v19.0/me/accounts', {
      params: { access_token: userAccessToken }
    });

    res.json(pagesRes.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Erreur lors de la récupération des pages Facebook." });
  }
});

app.get('/instagram', async (req, res) => {
  const pageId = req.query.page_id;
  if (!userAccessToken || !pageId) {
    return res.status(400).json({ error: "Token ou page_id manquant" });
  }

  try {
    const igRes = await axios.get(`https://graph.facebook.com/v19.0/${pageId}`, {
      params: {
        fields: 'connected_instagram_account',
        access_token: userAccessToken
      }
    });

    instagramUserId = igRes.data.connected_instagram_account?.id;

    if (!instagramUserId) {
      return res.status(404).json({ error: "Aucun compte Instagram lié à cette page." });
    }

    res.json({ instagram_user_id: instagramUserId });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Erreur lors de la récupération du compte Instagram." });
  }
});

app.post('/post', async (req, res) => {
  const { image_url, caption } = req.body;

  if (!userAccessToken || !instagramUserId) {
    return res.status(400).json({ error: "Token ou Instagram ID manquant. Appelle /instagram d’abord." });
  }

  try {
    // 1. Créer le media container
    const createRes = await axios.post(`https://graph.facebook.com/v19.0/${instagramUserId}/media`, null, {
      params: {
        image_url,
        caption,
        access_token: userAccessToken
      }
    });

    const creationId = createRes.data.id;

    // 2. Publier le post
    const publishRes = await axios.post(`https://graph.facebook.com/v19.0/${instagramUserId}/media_publish`, null, {
      params: {
        creation_id: creationId,
        access_token: userAccessToken
      }
    });

    res.json({ success: true, post_id: publishRes.data.id });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Erreur lors de la publication." });
  }
});

app.listen(PORT, () => {
  console.log(`🟢 Sirius Auth API lancé sur http://localhost:${PORT}`);
});
