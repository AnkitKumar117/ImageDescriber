import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 7005;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
