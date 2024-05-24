import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  CircularProgress,
  Snackbar,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(0);
  const [sortModel, setSortModel] = useState([
    { field: 'price', sort: 'asc' },
  ]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products');
        const productsData = Array.isArray(response.data.products) ? response.data.products : [];
        const productsWithId = productsData.map((product, index) => ({
          ...product,
          id: product.id || index,
          activation_date: new Date(product.activation_date),
          deactivation_date: new Date(product.deactivation_date),
          price: product.price || 0,
        }));
        setProducts(productsWithId);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) &&
    (category ? product.main_category === category : true)
  );

  const handleSortModelChange = (model) => {
    setSortModel(model);
  };

  return (
    <Container style={{ textAlign: 'center' }}>
      <Typography variant="h3" style={{ fontFamily: 'Arial, sans-serif', margin: '20px 0' }}>
        Product Catalog
      </Typography>
      <TextField
        label="Search by Name"
        variant="outlined"
        value={search}
        onChange={handleSearch}
        style={{ marginBottom: '20px', marginRight: '20px' }}
      />
      <FormControl variant="outlined" style={{ minWidth: 120, marginBottom: '20px' }}>
        <InputLabel>Category</InputLabel>
        <Select value={category} onChange={handleCategoryChange} label="Category">
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {Array.from(new Set(products.map((product) => product.main_category))).map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
        </div>
      ) : (
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredProducts}
            columns={[
              { field: 'id', headerName: 'ID', width: 70 },
              {
                field: 'image',
                headerName: 'Image',
                width: 150,
                renderCell: (params) => (
                  <img src="https://www.bing.com/th?id=OIP.7SJp_lSQvrI9ZnUYjNlb-QHaHa&w=150&h=150&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2" alt={params.row.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                ),
              },
              { field: 'brand', headerName: 'Brand', width: 130 },
              { field: 'name', headerName: 'Name', width: 250 },
              { field: 'description', headerName: 'Description', width: 300 },
              { field: 'sku_code', headerName: 'SKU Code', width: 130 },
              { field: 'main_category', headerName: 'Main Category', width: 180 },
              { field: 'marketPlaceSellable', headerName: 'Market Place Sellable', width: 180 },
              {
                field: 'activation_date',
                headerName: 'Activation Date',
                width: 180,
                type: 'date',
                valueGetter: (params) => new Date(params.value),
              },
              {
                field: 'deactivation_date',
                headerName: 'Deactivation Date',
                width: 180,
                type: 'date',
                valueGetter: (params) => new Date(params.value),
              },
              { field: 'price', headerName: 'Price', width: 100, type: 'number' },
            ]}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10, 20]}
            pagination
            page={page}
            onPageChange={(params) => setPage(params.page)}
            sortModel={sortModel}
            onSortModelChange={handleSortModelChange}
            loading={loading}
          />
        </div>
      )}
      {error && <Snackbar open autoHideDuration={6000} message={error} />}
    </Container>
  );
};

export default ProductCatalog;
