import './App.css';

// Recipe Card Component
function RecipeCard({ title, time, ingredients, instructions }) {
  return (
    <div className="recipe-card">
      <h2 className="recipe-title">{title}</h2>
      <div className="recipe-time">{time}</div>
      <div className="recipe-section">
        <h3>Ingredients</h3>
        <p>{ingredients}</p>
      </div>
      <div className="recipe-section">
        <h3>How to Make</h3>
        <p>{instructions}</p>
      </div>
    </div>
  );
}

function App() {
  // Mock recipe data
  const recipes = [
    {
      title: "Roasted Chicken",
      time: "30 Minutes",
      ingredients: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      instructions: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      title: "Pasta Carbonara",
      time: "25 Minutes",
      ingredients: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      instructions: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      title: "Vegetable Stir-Fry",
      time: "20 Minutes",
      ingredients: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      instructions: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    }
  ];

  return (
    <div className="App">
      <div className="search-container">
        <div className="search-bar">
          <input type="text" placeholder="Add Ingredients" className="search-input" />
          <button className="search-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14m-7-7l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <div className="recipes-container">
        {recipes.map((recipe, index) => (
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