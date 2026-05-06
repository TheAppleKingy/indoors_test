const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'dist/browser')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/browser', 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Frontend running on port ${port}`);
});