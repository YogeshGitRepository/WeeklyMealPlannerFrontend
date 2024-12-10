import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Alert, CircularProgress, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, Legend } from 'recharts';
import { RadialBarChart, RadialBar, PolarAngleAxis, Tooltip as RadialTooltip } from 'recharts';
import axios from 'axios';

interface IaggregatedIngredientCount {
  ingredient: string;
  searchCount: number;
}

interface IrecipeData {
  recipe: string;
  count: number;
}

const API_URL = 'http://localhost:5000/api/Recipe';

const Analytics: React.FC = () => {
  const [aggregatedIngredientCount, setaggregatedIngredientCount] = useState<IaggregatedIngredientCount[]>([]);
  const [recipeData, setrecipeData] = useState<IrecipeData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchAggregatedData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/aggregateddata`);
        const { aggregatedIngredientCount, recipeData } = response.data;

        if (!aggregatedIngredientCount || !recipeData) {
          throw new Error("API response does not contain expected data");
        }

        setaggregatedIngredientCount(aggregatedIngredientCount);
        setrecipeData(recipeData);
      } catch (error) {
        console.error('Error loading aggregated data:', error);
        setError('Failed to load aggregated data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAggregatedData();
  }, []);

  const maxRepetition = Math.max(...recipeData.map((data) => data.count), 1);

  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = recipeData.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(recipeData.length / itemsPerPage);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center' }}>
          Search Analytics
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Grid container justifyContent="center" alignItems="center" style={{ height: '300px' }}>
            <CircularProgress size={60} />
          </Grid>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" component="h2" sx={{ mb: 2, textAlign: 'center' }}>
                Search Count vs Ingredients (Bar Chart)
              </Typography>
              {aggregatedIngredientCount.length === 0 ? (
                <Typography variant="body1" align="center">No ingredient data available.</Typography>
              ) : (
                <BarChart
                  width={500}
                  height={300}
                  data={aggregatedIngredientCount}
                  margin={{ top: 20, right: 40, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ingredient" />
                  <YAxis />
                  <BarTooltip />
                  <Legend />
                  <Bar dataKey="searchCount" fill="#8884d8" />
                </BarChart>
              )}
            </Grid>

            {/* Recipe Repeatedness with Pagination */}
            <Grid item xs={12}>
              <Typography variant="h6" component="h2" sx={{ mb: 2, textAlign: 'center' }}>
                Recipe Repeatedness (Gauge Chart)
              </Typography>
              {recipeData.length === 0 ? (
                <Typography variant="body1" align="center">No recipe data available.</Typography>
              ) : (
                <>
                  <Grid container spacing={2} justifyContent="center">
                    {paginatedData.map((recipe, index) => (
                      <Grid item key={index} xs={2.4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
                          <strong>{recipe.recipe}:</strong> {recipe.count} Times
                        </Typography>
                        <RadialBarChart
                          width={200}
                          height={200}
                          cx="50%"
                          cy="50%"
                          innerRadius="30%"
                          outerRadius="80%"
                          barSize={12}
                          data={[{ recipe: recipe.recipe, count: recipe.count }]}
                          startAngle={180}
                          endAngle={0}
                        >
                          <PolarAngleAxis type="number" domain={[0, maxRepetition]} />
                          <RadialBar
                            label={{ position: 'insideStart', fill: '#fff', fontSize: '16px' }}
                            dataKey="count"
                            fill="#ff9800"
                          />
                          <RadialTooltip contentStyle={{ backgroundColor: '#2196f3', color: '#fff' }} />
                        </RadialBarChart>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Pagination Controls */}
                  <Grid container justifyContent="center" sx={{ mt: 4 }}>
                    <Button
                      variant="outlined"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      sx={{ mx: 1 }}
                    >
                      Previous
                    </Button>
                    <Typography variant="body2" sx={{ mx: 2, alignSelf: 'center' }}>
                      Page {currentPage} of {totalPages}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      sx={{ mx: 1 }}
                    >
                      Next
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default Analytics;
