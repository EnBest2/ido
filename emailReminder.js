/**
 * emailReminder.js - Napi e-mail értesítő script
 * Futtasd a következő paranccsal: node emailReminder.js
 */

const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// A kliens által exportált adatok fájlja
const DATA_FILE = path.join(__dirname, 'materials.json');

// Az adatok betöltése az exportált JSON fájlból
function getData() {
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    try {
      return JSON.parse(data);
    } catch(err) {
      console.error("Hiba a JSON parsolása közben:", err);
      return null;
    }
  } else {
    console.error("Nincs 'materials.json' fájl az exportált adatokkal.");
    return null;
  }
}

// Ellenőrizzük, mely tananyagok ismétlése esedékes a napra
function getTodaysRepetitions(data) {
  const today = new Date().toISOString().split("T")[0];
  const dueMaterials = [];
  data.materials.forEach(mat => {
    mat.repetitions.forEach(rep => {
      if (!rep.completed && rep.dueDate === today) {
        dueMaterials.push(mat.title + " (" + rep.dueDate + ")");
      }
    });
  });
  return dueMaterials;
}

// SMTP paraméterek – ezeket a Render "Environment Variables" segítségével állítsd be!
const smtpHost = process.env.SMTP_HOST || 'smtp.example.com';
const smtpPort = process.env.SMTP_PORT || 587;
const smtpSecure = process.env.SMTP_SECURE === 'true' || false;
const smtpUser = process.env.SMTP_USER || 'your_smtp_user';
const smtpPass = process.env.SMTP_PASS || 'your_smtp_password';

let transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: {
    user: smtpUser,
    pass: smtpPass
  }
});

// E-mail tartalom összeállítása
function generateEmailText(dueMaterials) {
  let text = "Ma ismételd át a következő anyagokat:\n\n";
  dueMaterials.forEach(item => {
    text += "- " + item + "\n";
  });
  text += "\nÜdvözlettel:\nIsmétlési Ütemező app";
  return text;
}

// E-mail küldése
async function sendReminder(email, dueMaterials) {
  let mailOptions = {
    from: `"Ismétlési Ütemező" <noreply@ismetlodes.hu>`,
    to: email,
    subject: "Ismétlés esedékes ma!",
    text: generateEmailText(dueMaterials)
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("E-mail elküldve: %s", info.messageId);
  } catch (err) {
    console.error("Hiba az e-mail küldésekor:", err);
  }
}

// Fő logika
function main() {
  const data = getData();
  if (!data) return;

  const dueMaterials = getTodaysRepetitions(data);
  if (dueMaterials.length === 0) {
    console.log("Ma nincs esedékes ismétlés.");
    return;
  }

  if (data.userEmail) {
    sendReminder(data.userEmail, dueMaterials);
  } else {
    console.error("Nincs felhasználói e-mail cím az exportált adatokban.");
  }
}

main();
