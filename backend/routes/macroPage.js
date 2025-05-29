const express = require('express');
const router = express.Router();
const Food = require('../models/foodModel');
const Macro = require('../models/macroModel');

// Route 1: Food feteching from mongoDB
router.get('/search', async (req,res) => {
  const {query} = req.query;

  if(!query || query.trim().length === 0){
    return res.status(400).json({error: 'Search query is required'});
  }

  try {
    const foods = await Food.find(
      { food_name: { $regex: query, $options: 'i' } }, // Case-insensitive search
      {
        food_name: 1,
        energy_kcal: 1,
        protein_g: 1,
        fat_g: 1,
        carb_g: 1,
        _id: 0
      }
    ).limit(20); // Optional: limit results

    res.json(foods);
  } catch (error) {
    console.error('Error Finding food summary',error);
    res.status(500).json({error:'Server Error'});
  }
});

// Route 2: Add macro entry
router.post('/add', async (req, res) => {
  const {
    userId,
    food_name,
    foodId,
    energy_kcal,
    protein_g,
    fat_g,
    carb_g,
    meal,
    date
  } = req.body;

  // Basic validation
  if (!userId || !food_name || !meal || !date) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  try {
    const newMacro = new Macro({
      userId,
      food_name,
      foodId, // optional
      energy_kcal,
      protein_g,
      fat_g,
      carb_g,
      meal,
      date
    });

    await newMacro.save();
    res.status(201).json({ message: 'Macro entry logged successfully', macro: newMacro });
  } catch (error) {
    console.error('Error saving macro entry:', error);
    res.status(500).json({ error: 'Server error while saving macro entry' });
  }
});


// Route 3: Get macro entries for a specific user and date OR year
router.get('/logs', async (req, res) => {
  const { userId, date, year } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const query = { userId };

  if (date) {
    // Specific day query
    query.date = date;
  } else if (year) {
    // Whole year query
    const startOfYear = `${year}-01-01`;
    const endOfYear = `${year}-12-31`;
    query.date = { $gte: startOfYear, $lte: endOfYear };
  }

  try {
    const logs = await Macro.find(query).sort({ date: 1, meal: 1, createdAt: 1 });
    res.json(logs);
  } catch (error) {
    console.error('Error fetching macro logs:', error);
    res.status(500).json({ error: 'Server error while fetching logs' });
  }
});


// Route 4: Delete all macro entries
router.delete('/deleteAll', async (req, res) => {
  try {
    const result = await Macro.deleteMany({});
    res.json({ message: 'All macro entries deleted', deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Error deleting all macro entries:', error);
    res.status(500).json({ error: 'Server error while deleting macro entries' });
  }
});


module.exports = router;