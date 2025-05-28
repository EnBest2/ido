const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Statikus fájlok kiszolgálása a gyökérből
app.use(express.static(__dirname));

// Minden útvonal esetén küldjük vissza az index.html-t (hasznos SPA esetén)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server fut a ${PORT} porton`);
});
