import React, { useState } from 'react';
import { Plus, Minus, Scale as Male, Scale as Female } from 'lucide-react';

type Ingredient = {
  id: string;
  name: string;
  amount: number;
  unit: 'g' | 'ml';
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
};

type Meal = {
  id: string;
  name: string;
  ingredients: Ingredient[];
};

type UserGoals = {
  sex: 'male' | 'female';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

function App() {
  const [meals, setMeals] = useState<Meal[]>([
    { id: '1', name: 'Breakfast', ingredients: [] },
    { id: '2', name: 'Lunch', ingredients: [] },
    { id: '3', name: 'Snack', ingredients: [] },
    { id: '4', name: 'Dinner', ingredients: [] },
  ]);

  const [goals, setGoals] = useState<UserGoals>({
    sex: 'male',
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
    fiber: 30,
  });

  const addIngredient = (mealId: string) => {
    const newIngredient: Ingredient = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      amount: 0,
      unit: 'g',
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      fiber: 0,
    };

    setMeals(meals.map(meal => 
      meal.id === mealId 
        ? { ...meal, ingredients: [...meal.ingredients, newIngredient] }
        : meal
    ));
  };

  const removeIngredient = (mealId: string, ingredientId: string) => {
    setMeals(meals.map(meal => 
      meal.id === mealId 
        ? { ...meal, ingredients: meal.ingredients.filter(ing => ing.id !== ingredientId) }
        : meal
    ));
  };

  const updateIngredient = (mealId: string, ingredientId: string, updates: Partial<Ingredient>) => {
    setMeals(meals.map(meal => 
      meal.id === mealId 
        ? {
            ...meal,
            ingredients: meal.ingredients.map(ing => 
              ing.id === ingredientId ? { ...ing, ...updates } : ing
            )
          }
        : meal
    ));
  };

  const calculateTotals = () => {
    return meals.reduce((acc, meal) => {
      const mealTotals = meal.ingredients.reduce((macc, ing) => ({
        calories: macc.calories + (ing.calories * ing.amount / 100),
        protein: macc.protein + (ing.protein * ing.amount / 100),
        carbs: macc.carbs + (ing.carbs * ing.amount / 100),
        fat: macc.fat + (ing.fat * ing.amount / 100),
        fiber: macc.fiber + (ing.fiber * ing.amount / 100),
      }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

      return {
        calories: acc.calories + mealTotals.calories,
        protein: acc.protein + mealTotals.protein,
        carbs: acc.carbs + mealTotals.carbs,
        fat: acc.fat + mealTotals.fat,
        fiber: acc.fiber + mealTotals.fiber,
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-[1fr,auto,1fr] gap-8">
        {/* Left Side - Meals */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Daily Meals</h2>
          {meals.map(meal => (
            <div key={meal.id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{meal.name}</h3>
              <div className="space-y-6">
                {meal.ingredients.map(ing => (
                  <div key={ing.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-[1fr,auto] gap-4 mb-3">
                      <input
                        type="text"
                        value={ing.name}
                        onChange={e => updateIngredient(meal.id, ing.id, { name: e.target.value })}
                        placeholder="Ingredient name"
                        className="border rounded px-3 py-2"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={ing.amount}
                          onChange={e => updateIngredient(meal.id, ing.id, { amount: parseFloat(e.target.value) })}
                          className="border rounded w-20 px-3 py-2"
                        />
                        <select
                          value={ing.unit}
                          onChange={e => updateIngredient(meal.id, ing.id, { unit: e.target.value as 'g' | 'ml' })}
                          className="border rounded px-3 py-2"
                        >
                          <option value="g">g</option>
                          <option value="ml">ml</option>
                        </select>
                        <button
                          onClick={() => removeIngredient(meal.id, ing.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                          title="Remove ingredient"
                        >
                          <Minus size={20} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Calories (per 100{ing.unit})
                        </label>
                        <input
                          type="number"
                          value={ing.calories}
                          onChange={e => updateIngredient(meal.id, ing.id, { calories: parseFloat(e.target.value) })}
                          className="border rounded px-3 py-2 w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Protein (per 100{ing.unit})
                        </label>
                        <input
                          type="number"
                          value={ing.protein}
                          onChange={e => updateIngredient(meal.id, ing.id, { protein: parseFloat(e.target.value) })}
                          className="border rounded px-3 py-2 w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fat (per 100{ing.unit})
                        </label>
                        <input
                          type="number"
                          value={ing.fat}
                          onChange={e => updateIngredient(meal.id, ing.id, { fat: parseFloat(e.target.value) })}
                          className="border rounded px-3 py-2 w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Carbs (per 100{ing.unit})
                        </label>
                        <input
                          type="number"
                          value={ing.carbs}
                          onChange={e => updateIngredient(meal.id, ing.id, { carbs: parseFloat(e.target.value) })}
                          className="border rounded px-3 py-2 w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fiber (per 100{ing.unit})
                        </label>
                        <input
                          type="number"
                          value={ing.fiber}
                          onChange={e => updateIngredient(meal.id, ing.id, { fiber: parseFloat(e.target.value) })}
                          className="border rounded px-3 py-2 w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => addIngredient(meal.id)}
                className="mt-4 flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
              >
                <Plus size={20} />
                Add Ingredient
              </button>
            </div>
          ))}
        </div>

        {/* Middle - Results */}
        <div className="bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Daily Progress</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Calories</h3>
              <div className="w-64 bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 rounded-full h-4"
                  style={{ width: `${Math.min(100, (totals.calories / goals.calories) * 100)}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600">
                {totals.calories.toFixed(0)} / {goals.calories} kcal
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Protein</h3>
              <div className="w-64 bg-gray-200 rounded-full h-4">
                <div
                  className="bg-red-600 rounded-full h-4"
                  style={{ width: `${Math.min(100, (totals.protein / goals.protein) * 100)}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600">
                {totals.protein.toFixed(1)} / {goals.protein}g
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Carbs</h3>
              <div className="w-64 bg-gray-200 rounded-full h-4">
                <div
                  className="bg-green-600 rounded-full h-4"
                  style={{ width: `${Math.min(100, (totals.carbs / goals.carbs) * 100)}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600">
                {totals.carbs.toFixed(1)} / {goals.carbs}g
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Fat</h3>
              <div className="w-64 bg-gray-200 rounded-full h-4">
                <div
                  className="bg-yellow-600 rounded-full h-4"
                  style={{ width: `${Math.min(100, (totals.fat / goals.fat) * 100)}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600">
                {totals.fat.toFixed(1)} / {goals.fat}g
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Fiber</h3>
              <div className="w-64 bg-gray-200 rounded-full h-4">
                <div
                  className="bg-purple-600 rounded-full h-4"
                  style={{ width: `${Math.min(100, (totals.fiber / goals.fiber) * 100)}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600">
                {totals.fiber.toFixed(1)} / {goals.fiber}g
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Goals */}
        <div className="bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Daily Goals</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sex</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setGoals(g => ({ ...g, sex: 'male' }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded ${
                    goals.sex === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                  }`}
                >
                  <Male size={20} />
                  Male
                </button>
                <button
                  onClick={() => setGoals(g => ({ ...g, sex: 'female' }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded ${
                    goals.sex === 'female' ? 'bg-pink-100 text-pink-800' : 'bg-gray-100'
                  }`}
                >
                  <Female size={20} />
                  Female
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Calories (kcal)
              </label>
              <input
                type="number"
                value={goals.calories}
                onChange={e => setGoals(g => ({ ...g, calories: parseFloat(e.target.value) }))}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Protein Goal (g)
              </label>
              <input
                type="number"
                value={goals.protein}
                onChange={e => setGoals(g => ({ ...g, protein: parseFloat(e.target.value) }))}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carbs Goal (g)
              </label>
              <input
                type="number"
                value={goals.carbs}
                onChange={e => setGoals(g => ({ ...g, carbs: parseFloat(e.target.value) }))}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fat Goal (g)
              </label>
              <input
                type="number"
                value={goals.fat}
                onChange={e => setGoals(g => ({ ...g, fat: parseFloat(e.target.value) }))}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fiber Goal (g)
              </label>
              <input
                type="number"
                value={goals.fiber}
                onChange={e => setGoals(g => ({ ...g, fiber: parseFloat(e.target.value) }))}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;