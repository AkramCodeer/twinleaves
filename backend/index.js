const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS to allow requests from the frontend
app.use(cors());

// GET endpoint to fetch products data from the API and serve it to the frontend
app.get('/api/products', async (req, res) => {
  try {
    const response = await axios.get('https://catalog-management-system-dev-ak3ogf6zea-uc.a.run.app/cms/products');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching products data:', error);
    res.status(500).json({ error: 'Failed to fetch products data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
