import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Paper, List, ListItem, ListItemText, Alert, Box } from '@mui/material';
import { FamilySizeGet, ingredientsGet, ingredientsSet } from '../services/config.service';
import { IIngredient } from '../models/FamilySizeAndIngredients.model';
import { useNavigate } from 'react-router-dom';
import UserMenu from '../components/UserMenu'; 

const FamilySizeAndIngredients: React.FC = () => {
    const [familySize, setFamilySize] = useState<number>(1);
    const [ingredients, setIngredients] = useState<IIngredient[]>([]);
    const [newIngredient, setNewIngredient] = useState<IIngredient>({
        id: Date.now(),
        name: '',
        quantity: 0,
        measurement: '',
    });
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const size = await FamilySizeGet();
                setFamilySize(size || 1);

                const ingredientsList = await ingredientsGet();
                setIngredients(ingredientsList);
            } catch (error: any) {
                console.error('Error loading data:', error);
                if (error.message === 'Token expired or missing') {
                    setError('Your session has expired. Please log in again.');
                    navigate('/login'); 
                } else {
                    setError('Failed to load data.');
                }
            }
        };
        fetchData();
    }, [navigate]);

    const handleAddIngredient = async () => {
        if (newIngredient.name && newIngredient.quantity > 0 && newIngredient.measurement) {
            try {
                const addedIngredient = await ingredientsSet({ ...newIngredient, id: 0 });
                setIngredients([...ingredients, addedIngredient]);
                setNewIngredient({ id: Date.now(), name: '', quantity: 0, measurement: '' });
                setError(null);
            } catch (error: any) {
                console.error('Error adding ingredient:', error);
                if (error.message === 'Token expired or missing') {
                    setError('Your session has expired. Please log in again.');
                    navigate('/login'); 
                } else {
                    setError('Failed to add ingredient.');
                }
            }           
        } else {
            setError('Please fill in all fields before adding an ingredient.');
        }
    };

   

    const handleFamilySizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const parsedValue = parseInt(value, 10);

        if (!isNaN(parsedValue) && parsedValue >= 1) {
            setFamilySize(parsedValue);
        } else if (value === '') {
            setFamilySize(0);
        }
    };

    return (
        <Box maxWidth="xl" sx={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
            
            {/* Main Content */}
            <Container maxWidth="sm" sx={{ mt: 4, flexGrow: 1 }}>
                <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
                    <Typography variant="h4" component="h2" gutterBottom>
                        Family Size
                    </Typography>
                    <TextField
                        type="number"
                        value={familySize || ''}
                        onChange={handleFamilySizeChange}
                        placeholder="Enter family size"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        inputProps={{ min: 1 }}
                    />

                    <Typography variant="h5" component="h3" gutterBottom>
                        Add New Ingredient
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <TextField
                        type="text"
                        placeholder="Ingredient Name"
                        value={newIngredient.name}
                        onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                    <TextField
                        type="number"
                        placeholder="Quantity"
                        value={newIngredient.quantity || ''}
                        onChange={(e) => setNewIngredient({ ...newIngredient, quantity: Number(e.target.value) || 0 })}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        inputProps={{ min: 1 }}
                    />
                    <TextField
                        type="text"
                        placeholder="Measurement (e.g., grams, liters)"
                        value={newIngredient.measurement || ''}
                        onChange={(e) => setNewIngredient({ ...newIngredient, measurement: e.target.value })}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                    <Button onClick={handleAddIngredient} variant="contained" color="primary" fullWidth>
                        Add Ingredient
                    </Button>

                    <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
                        Available Ingredients
                    </Typography>
                    <List>
                        {ingredients.length === 0 ? (
                            <Typography variant="body1" align="center">No ingredients added yet.</Typography>
                        ) : (
                            ingredients.map((ingredient) => (
                                <ListItem key={ingredient.id}>
                                    <ListItemText primary={`${ingredient.name}: ${ingredient.quantity} ${ingredient.measurement}`} />
                                </ListItem>
                            ))
                        )}
                    </List>
                   
                </Paper>
            </Container>
        </Box>
    );
};

export default FamilySizeAndIngredients;
