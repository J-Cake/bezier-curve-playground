import express from 'express';

export const app = express();
export const port = Number(process.argv[process.argv.findIndex(i => i === '-p' || i === '--port')] ?? '1920');

app.use('/', express.static('./static'));
app.use('/', express.static('./build/target', {maxAge: 0}));

app.listen(port, () => console.log(`Server is live on http://localhost:${port}`));