// server.js

const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

const port = process.env.PORT || 3000;

// Konfiguráljuk a Nodemailer-t az environment változók alapján.
// Ezeket a Render Dashboard-on kell beállítani:
// SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,         
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',  // Általában "false", ha TLS-t használsz 587-en
  auth: {
    user: process.env.SMTP_USER,        
    pass: process.env.SMTP_PASS
  }
});

// Ez a függvény felelős az e-mailküldésért.
// Itt lehet dinamikusan generálni a tartalmat, most egy statikus szöveg van.
function sendReminderEmail() {
  const emailText = `Kedves Felhasználó!

Ma ismételd át az alábbi anyagokat:
- JavaScript alapok
- Aszinkron programozás
- API-k használata

Sok sikert!`;

  const mailOptions = {
    from: `"Tananyag Emlékeztető" <${process.env.SMTP_USER}>`,
    // Ha több felhasználót nem kell elkülönítve kezelni, egyszerűen ugyanarra az e-mailre küldjük.
    // Ha van RECIPIENT_EMAIL environment változó, azt fogjuk használni, egyébként az SMTP_USER-t.
    to: process.env.RECIPIENT_EMAIL || process.env.SMTP_USER,
    subject: 'Ismétlési Emlékeztető',
    text: emailText
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Hiba az e-mail küldésekor:', err);
    } else {
      console.log(`E-mail sikeresen elküldve: ${info.response}`);
    }
  });
}

// HTTP végpont az e-mailküldés indításához.
// Ez az URL-t fogjátok konfigurálni az ingyenes cron szolgáltatásban (például cron-job.org).
app.get('/send-reminder', (req, res) => {
  sendReminderEmail();
  res.send('E-mail küldés indítva.');
});

// Egy egyszerű gyökérútvonal a szerver teszteléséhez.
app.get('/', (req, res) => {
  res.send('Az alkalmazás fut! Az e-mailküldés elérhető a /send-reminder végponton.');
});

// A szerver indítása a megadott porton.
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
