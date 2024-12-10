import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Paper, IconButton, Container } from '@mui/material';
import Grid from '@mui/material/Grid2';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import RecipeSearch from './RecipeSearch';  
import { IRecipe } from '../models/Recipe.model'; 
import { RecipeSlot } from '../models/RecipeSlot.model';

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const WeeklyCalendar: React.FC = () => {

    const [open, setOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<RecipeSlot | null>(null);
    const initialCalendar = daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [] }), {});
    const [calendar, setCalendar] = useState<Record<string, RecipeSlot[]>>(initialCalendar);

 
    useEffect(() => {
        const fetchCalendarData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/WeeklyCalendar', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const fetchedData = await response.json();

   
                    const loadedCalendar: Record<string, RecipeSlot[]> = daysOfWeek.reduce((acc, day) => ({
                        ...acc,
                        [day]: fetchedData
                            .filter((slot: any) => slot.dayOfWeek === daysOfWeek.indexOf(day))
                            .map((slot: any) => ({
                                id: slot.slotId,
                                recipe: slot.recipe
                                ? {
                                      id: slot.recipe.id,
                                      recipeName: slot.recipe.name,
                                      ingredients: slot.recipe.ingredients || [],
                                      imageUrl: slot.recipe.imageUrl || "",
                                      instructions: slot.recipe.instructions || "",
                                  }
                                : null,
                            })),
                    }), {});
                    
                    setCalendar(loadedCalendar);
                } else {
                    console.error('Failed to fetch calendar data');
                }
            } catch (error) {
                console.error('Error fetching calendar data:', error);
            }
        };

        fetchCalendarData();
    }, []);

    const handleOpenDialog = (day: string, slot: RecipeSlot) => {
        setSelectedDay(day);
        setSelectedSlot(slot);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setSelectedDay(null);
        setSelectedSlot(null);
    };

    const handleSaveRecipe = async (recipe: IRecipe) => {
        if (selectedDay && selectedSlot) {         

          
            const payload = {
                id: 0,  
                dayOfWeek: daysOfWeek.indexOf(selectedDay),
                slotId: selectedSlot.id,
                recipeId: recipe.id,
                recipe: {
                    id: recipe.id, 
                    recipeName: recipe.recipeName, 
                    instructions: recipe.instructions,
                    ingredients: recipe.ingredients
                }
            };

       
            try {
                const response = await fetch('http://localhost:5000/api/WeeklyCalendar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

          

                if (!response.ok) {
                    console.error('Failed to save the calendar slot', await response.text());
                } 
                else {
                    console.log('Slot saved successfully');
                                     
                    const updatedSlots = (calendar[selectedDay] || [])
                        .map((slot) =>
                            slot.id === selectedSlot.id
                                ? { ...slot, recipe } 
                                : slot 
                        );

                 
                    if (!updatedSlots.some(slot => slot.id === selectedSlot.id)) {
                        updatedSlots.push({ id: selectedSlot.id, recipe });
                    }


                   
                    const updatedCalendar = {
                        ...calendar,
                        [selectedDay]: updatedSlots,
                    };
                    setCalendar(updatedCalendar);                
                }
            } catch (error) {
                console.error('Error saving calendar slot:', error);
            }

            handleCloseDialog();
        }
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Weekly Meal Planner
            </Typography>
            <Grid container spacing={2}>
                {daysOfWeek.map((day) => (
                    <Grid item xs={12} sm={6} md={4} key={day}>
                        <Paper elevation={3} sx={{ padding: 2 }}>
                            <Typography variant="h6" gutterBottom>{day}</Typography>
                            {/* Show all 3 slots, whether filled or not */}
                            {[1, 2, 3].map((slotId) => {
                                const slot = calendar[day].find((slot) => slot.id === slotId) || { id: slotId, recipe: null };
                                return (
                                    <div key={slot.id} style={{ marginBottom: 8, height: '80px', width: '100%' }}>
                                    {slot.recipe ? (
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            height: '100%',
                                            flexDirection: 'row', 
                                        }}>
                                           <Typography
    variant="body1"
    style={{
        wordWrap: 'break-word',   
        whiteSpace: 'normal',     
        flex: 1,                  
        marginRight: '8px',       
        overflow: 'hidden',       
        height: '100%',           
        maxWidth:'150px',
        lineHeight: 'normal',    
        textOverflow: 'ellipsis',
    }}
>
    {slot.recipe.recipeName || "Unnamed Recipe"}
</Typography>

                                            <IconButton
                                                color="primary"
                                                onClick={() => handleOpenDialog(day, slot)}
                                                style={{
                                                    height: '40px', 
                                                    width: '40px', 
                                                    padding: '8px',
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </div>
                                    ) : (
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            height: '100%', 
                                        }}>
                                            <Typography variant="body1" color="textSecondary" style={{ flex: 1 }}></Typography>
                                            <Button
    variant="outlined"
    startIcon={<AddIcon />}
    onClick={() => handleOpenDialog(day, slot)}
    style={{
        height: '40px', 
        width: '200px', 
        maxWidth: '100%',
    }}
>
    Add Recipe
</Button>

                                        </div>
                                    )}
                                </div>
                                


                                );
                            })}
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="md">
                <DialogTitle>{selectedSlot?.recipe ? "Edit Recipe" : "Add Recipe"}</DialogTitle>
                <DialogContent>
                    <RecipeSearch onSelectRecipe={handleSaveRecipe} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default WeeklyCalendar;
