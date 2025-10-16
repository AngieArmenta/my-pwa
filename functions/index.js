// functions/index.js
import functions from "firebase-functions";
import admin from "firebase-admin";

// Inicializa la app admin
admin.initializeApp();
const db = admin.firestore();

// --- 🔄 Función para sincronizar datos desde IndexedDB ---
export const syncEntries = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Método no permitido');

  try {
    const entry = req.body;
    await db.collection('entries').add(entry);
    console.log('✅ Entrada guardada en Firestore:', entry);
    res.status(200).send({ success: true });
  } catch (error) {
    console.error('❌ Error guardando datos:', error);
    res.status(500).send({ error: 'Error al guardar datos' });
  }
});

// --- 🔔 Función para enviar notificaciones push ---
export const sendNotification = functions.https.onRequest(async (req, res) => {
  const { token, title, body } = req.body;

  if (!token) {
    return res.status(400).send('Falta el token del dispositivo');
  }

  const message = {
    token,
    notification: {
      title: title || "📢 Notificación desde Firebase",
      body: body || "Mensaje de prueba exitoso"
    },
  };

  try {
    await admin.messaging().send(message);
    console.log('✅ Notificación enviada a:', token);
    res.status(200).send('Notificación enviada con éxito');
  } catch (error) {
    console.error('❌ Error enviando notificación:', error);
    res.status(500).send('Error enviando notificación');
  }
});
