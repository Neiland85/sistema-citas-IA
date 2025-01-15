import express from 'express';

const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send('Hola desde el backend!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
