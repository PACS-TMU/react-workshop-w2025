import "./App.css";
import "./index.css";
import React, { useState, useEffect } from "react";

// Recipe Card Component
function RecipeCard({ title, time, ingredients, instructions }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className={`recipe-card ${isExpanded ? "expanded" : ""}`}>
      <h2 className="recipe-title">{title}</h2>
      <div className="recipe-time">{time}</div>
      <div className="recipe-section">
        <h3>Ingredients</h3>
        <p>{ingredients}</p>
      </div>
      <div className="recipe-section">
        <h3>How to Make</h3>
        <p>
          {isExpanded
            ? instructions
            : instructions.length > 100
            ? instructions.substring(0, 100) + "..."
            : instructions}
        </p>
      </div>
      {instructions.length > 100 && (
        <div className="expand-button-container">
          <button
            className="expand-button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Show less" : "Show more"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [searchTrigger, setSearchTrigger] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchComplete, setFetchComplete] = useState(false);

  // Search effect - triggered when searchTrigger changes
  useEffect(() => {
    // Skip empty searches
    if (!searchTrigger) return;

    // Set loading to true when search starts
    setIsLoading(true);
    // Set fetchComplete to false at the beginning of new search
    setFetchComplete(false);

    // Clear previous recipes
    setRecipes([]);

    // Replace spaces with underscores for the API
    const ingredient = searchTrigger.trim().replace(/ /g, "_");

    const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then(async (data) => {
        console.log("Search API Response:", data);
        if (data.meals && data.meals.length > 0) {
          // Store the meal IDs for lookup
          const mealIds = data.meals.map((meal) => meal.idMeal);
          const tempRecipes = []; // Temporary array to collect recipes

          // Process each meal ID - looking up details directly here
          for (const mealId of mealIds) {
            const lookupUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
            try {
              const response = await fetch(lookupUrl);
              const data = await response.json();

              if (data.meals && data.meals.length > 0) {
                const meal = data.meals[0];

                // Format ingredients as a list
                let ingredientsList = "";
                for (let i = 1; i <= 20; i++) {
                  const ingredient = meal[`strIngredient${i}`];
                  const measure = meal[`strMeasure${i}`];
                  if (ingredient && ingredient.trim() !== "") {
                    ingredientsList += `${measure} ${ingredient}, `;
                  }
                }
                ingredientsList = ingredientsList.slice(0, -2); // Remove last comma and space

                // Create formatted recipe object
                const formattedRecipe = {
                  title: meal.strMeal,
                  time: meal.strCategory, // Using category as time since API doesn't have cooking time
                  ingredients: ingredientsList,
                  instructions: meal.strInstructions,
                };

                // Add to temporary array instead of setting state
                const exists = tempRecipes.some(
                  (r) => r.title === formattedRecipe.title
                );
                if (!exists) {
                  tempRecipes.push(formattedRecipe);
                }
              }
            } catch (error) {
              console.error("Error fetching meal details:", error);
            }
          }

          // Only update state once with all recipes
          setRecipes(tempRecipes);
        }
        // Mark fetching as complete
        setFetchComplete(true);
      })
      .catch((error) => {
        console.error("Error fetching search data:", error);
        setFetchComplete(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [searchTrigger]);

  // Function to handle the search button click
  const handleSearch = () => {
    setSearchTrigger(searchInput);
  };

  return (
    <div className="App">
      <div className="header">
        <p className="club-names">PACS x WiCS</p>
        <h1 className="website-name">REACTRAUNT</h1>
        <p className="slogan">cook watcha got.</p>
        <div className="images">
          <img src="/images/lightbulb.png" alt="Lightbulb icon" />
          <img src="/images/cart.png" alt="Shopping cart icon" />
        </div>
      </div>
      <div className="search-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Add Ingredients"
            className="search-input"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button className="search-button" onClick={handleSearch}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14m-7-7l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="loading-spinner">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="spinner"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <p>Finding recipes...</p>
        </div>
      )}

      <div className="recipes-container">
        {fetchComplete &&
          recipes.map((recipe, index) => (
            <RecipeCard
              key={index}
              title={recipe.title}
              time={recipe.time}
              ingredients={recipe.ingredients}
              instructions={recipe.instructions}
            />
          ))}
      </div>
    </div>
  );
}

export default App;
