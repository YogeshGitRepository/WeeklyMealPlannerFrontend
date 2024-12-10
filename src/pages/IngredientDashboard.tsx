import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import Grid from '@mui/material/Grid2';


ChartJS.register(ArcElement, Tooltip, Legend);


const createChartData = (ingredient: any) => {
  const total = ingredient.totalQuantity || 1;
  const availablePercentage = (ingredient.totalQuantity / total) * 100;
  const usedPercentage = (ingredient.usedQuantity / total) * 100;
  const remainingPercentage = (ingredient.remainingQuantity / total) * 100;

  return {
    labels: ['Available Quantity', 'Meal Planner Taken Quantity', 'Remain Quantity'],
    datasets: [
      {
        label: ingredient.ingredientName,
        data: [availablePercentage, usedPercentage, remainingPercentage],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
      },
    ],
  };
};

const IngredientDashboard: React.FC = () => {
  const [remainingIngredients, setRemainingIngredients] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRemainingIngredients = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get('http://localhost:5000/api/recipe/remaining-ingredients');
        setRemainingIngredients(response.data);
      } catch (err) {
        setError('Failed to fetch remaining ingredient data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRemainingIngredients();
  }, []);

 
  const shortageList = remainingIngredients.filter(
    (ingredient) => ingredient.remainingQuantity < 0
  );

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto', padding: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Ingredient Dashboard
      </Typography>

      {loading && <CircularProgress sx={{ display: 'block', margin: '0 auto', my: 2 }} />}
      {error && <Alert severity="error">{error}</Alert>}

      {remainingIngredients.length > 0 ? (
        <>
          {/* Main Ingredient Dashboard */}
          <Grid container spacing={3}>
            {remainingIngredients.map((ingredient, index) => (

              <Grid item xs={12} md={6} key={index}>
                <Box sx={{ textAlign: 'center', padding: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
                  <Typography variant="h6">{ingredient.ingredientName}</Typography>
                  <Doughnut data={createChartData(ingredient)} />
                </Box>
              </Grid>

            ))}
          </Grid>

          {/* Shortage List */}
          {shortageList.length > 0 && (
            <Box sx={{ marginTop: 4 }}>
              <Typography variant="h5" gutterBottom>
                Shortage List
              </Typography>
              {shortageList.map((ingredient, index) => (
                <Box
                  key={index}
                  sx={{
                    border: '1px solid #f44336',
                    borderRadius: '8px',
                    padding: 2,
                    marginBottom: 2,
                  }}
                >
                  <Typography variant="body1">
                    <strong>{ingredient.ingredientName}:</strong> : {ingredient.remainingQuantity}{' '}
                    {ingredient.measurement}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </>
      ) : (
        <Typography variant="body1" align="center">
          No ingredients available or calculated data.
        </Typography>
      )}
    </Box>
  );
};

export default IngredientDashboard;
