let recipes = [];
let ingredientsList = [];
const recipesContainer = document.querySelector(".recipes-container");
const recipesSelect = document.querySelector(".recipes-select");
let ingredientFilter = "";
let applianceFilter = "";
let ustensilsFilter = "";
let searchFilter = "";
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");

const generateIngredientsSelect = () => {
  const select = document.createElement("select");
  for (let i = 0; i < ingredientsList.length; i++) {
    const option = document.createElement("option");
    option.value = ingredientsList[i];
    option.innerHTML = ingredientsList[i];
    select.appendChild(option);
  }

  select.addEventListener("change", (e) => {
    ingredientFilter = e.target.value;
    generateRecipes();
  });
  recipesSelect.appendChild(select);
};

const generateAppliancesSelect = () => {
  const select = document.createElement("select");
  const appliancesList = [
    ...new Set(recipes.map((recipe) => recipe.appliance)),
  ]; // Liste unique d'appareils
  console.log(appliancesList);
  appliancesList.forEach((appliance) => {
    const option = document.createElement("option");
    option.value = appliance;
    option.innerHTML = appliance;
    select.appendChild(option);
  });
  select.addEventListener("change", (e) => {
    applianceFilter = e.target.value;
    generateRecipes();
  });
  recipesSelect.appendChild(select);
};

const generateUtensilsSelect = () => {
  const select = document.createElement("select");
  const utensilsList = [
    ...new Set(recipes.flatMap((recipe) => recipe.ustensils)),
  ]; // Liste unique d'ustensiles
  utensilsList.forEach((utensil) => {
    const option = document.createElement("option");
    option.value = utensil;
    option.innerHTML = utensil;
    select.appendChild(option);
  });
  select.addEventListener("change", (e) => {
    ustensilsFilter = e.target.value;
    generateRecipes();
  });
  recipesSelect.appendChild(select);
};

/*const generateRecipesByAppliance = (appliance) => {
  console.log(appliance);

  const filteredRecipes = recipes.filter(
    (recipe) => recipe.appliance === appliance
  );
  console.log(filteredRecipes);
  generateRecipes(filteredRecipes);
};*/

const generateRecipesByUtensil = (utensil) => {
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.ustensils.includes(utensil)
  );
  generateRecipes(filteredRecipes);
};

const recipeCountElement = document.querySelector(".recipe-count");
// Fonction pour afficher le nombre de recettes
function updateRecipeCount(recipes) {
  const count = recipes.length;
  const message = `${count} recette${count > 1 ? "s" : ""}`;
  recipeCountElement.textContent = message;
}
updateRecipeCount(recipes);

const generateRecipes = () => {
  let filteredRecipes = [];
  recipesContainer.innerHTML = "";
  if (searchFilter) {
    for (let i = 0; i < recipes.length; i++) {
      const name = recipes[i].name.toLowerCase();
      const isName = name.includes(searchFilter.toLowerCase());
      const description = recipes[i].description.toLowerCase();
      const isDescription = description.includes(searchFilter.toLowerCase());
      const appliance = recipes[i].appliance.toLowerCase();
      const isAppliance = appliance.includes(searchFilter.toLowerCase());
      const ustensils = recipes[i].ustensils;
      const isUstensils = ustensils.find((item) =>
        item.toLowerCase().includes(searchFilter)
      );
      const ingredients = recipes[i].ingredients;
      const isIngredients = ingredients.find((item) =>
        item.ingredient.toLowerCase().includes(searchFilter)
      );
      if (
        isName ||
        isDescription ||
        isAppliance ||
        isUstensils ||
        isIngredients
      ) {
        filteredRecipes.push(recipes[i]);
      }
    }
  }

  if (ingredientFilter) {
    for (let i = 0; i < recipes.length; i++) {
      const ingredient = recipes[i].ingredients.find(
        (item) => item.ingredient === ingredientFilter
      );
      if (ingredient) {
        filteredRecipes.push(recipes[i]);
      }
    }
  }
  if (applianceFilter) {
    const recipe = recipes.find((item) => item.appliance === applianceFilter);
    if (recipe) {
      filteredRecipes.push(recipe);
    }
  }
  if (ustensilsFilter) {
    for (let i = 0; i < recipes.length; i++) {
      const ustensile = recipes[i].ustensils.find(
        (item) => item === ustensilsFilter
      );
      if (ustensile) {
        filteredRecipes.push(recipes[i]);
      }
    }
  }

  if (
    !ingredientFilter &&
    !applianceFilter &&
    !ustensilsFilter &&
    !searchFilter
  ) {
    filteredRecipes = recipes;
  }
  updateRecipeCount(filteredRecipes);
  console.log(filteredRecipes.length);

  // Si aucune recette ne correspond, afficher un message
  if (filteredRecipes.length === 0) {
    recipesContainer.innerHTML =
      "<p>Désolé, nous n'avons trouvé aucune recette correspondant à votre recherche. Essayez avec d'autres mots-clés ou vérifiez l'orthographe.</p>";
    return;
  }

  for (let i = 0; i < filteredRecipes.length; i++) {
    const recipeCardContenair = document.createElement("div");
    recipeCardContenair.className = "recipeCardContainer";
    const recipeCard = document.createElement("div");
    recipeCard.className = "recipeCard";
    const image = document.createElement("img");
    image.src = `./assets/images/recipes/${filteredRecipes[i].image}`;
    image.className = "recipeCardImage";

    // Ajout div du temps
    const timeElement = document.createElement("div");
    timeElement.className = "recipe-time";
    timeElement.innerHTML = filteredRecipes[i].time + " min";
    recipeCard.appendChild(timeElement);

    const descriptionDiv = document.createElement("div");
    descriptionDiv.className = "descriptionDiv";
    const titleRecipe = document.createElement("h3");
    titleRecipe.innerHTML = filteredRecipes[i].name;
    descriptionDiv.appendChild(titleRecipe);

    const recipeDescriptionTitle = document.createElement("h3");
    recipeDescriptionTitle.innerHTML = "RECETTE";
    recipeDescriptionTitle.className = "recipeDescriptionTitle";
    descriptionDiv.appendChild(recipeDescriptionTitle);

    const recipeDescription = document.createElement("p"); // Paragraphe pour la description
    recipeDescription.className = "recipeDescription";
    recipeDescription.innerHTML = filteredRecipes[i].description;

    descriptionDiv.appendChild(recipeDescription); // Ajoute la description sous le titre

    const ingredientsTitle = document.createElement("h3");
    ingredientsTitle.innerHTML = "INGREDIENTS";
    ingredientsTitle.className = "ingredientsTitle";
    descriptionDiv.appendChild(ingredientsTitle);

    // Créer une liste d'ingrédients
    const ingredients = document.createElement("ul");
    ingredients.className = "ingredients";

    // Parcourir la liste des ingrédients pour cette recette
    filteredRecipes[i].ingredients.forEach((item) => {
      const ingredientItem = document.createElement("li");
      ingredientItem.textContent = item.ingredient; // Ajouter chaque ingrédient
      ingredients.appendChild(ingredientItem);
    });

    const ustensilsTitle = document.createElement("h3");
    ustensilsTitle.innerHTML = "Ustensils";
    ustensilsTitle.className = "ingredientsTitle";

    // Créer une liste d'ingrédients
    const ustensils = document.createElement("ul");
    ustensils.className = "ingredients";

    // Parcourir la liste des ingrédients pour cette recette
    filteredRecipes[i].ustensils.forEach((item) => {
      const ingredientItem = document.createElement("li");
      ingredientItem.textContent = item; // Ajouter chaque ingrédient
      ustensils.appendChild(ingredientItem);
    });

    const appliancesTitle = document.createElement("h3");
    appliancesTitle.innerHTML = "APPAREILS";

    const applianceItem = document.createElement("div");
    applianceItem.innerHTML = filteredRecipes[i].appliance;

    descriptionDiv.appendChild(ingredients);

    descriptionDiv.appendChild(appliancesTitle);
    descriptionDiv.appendChild(applianceItem);
    descriptionDiv.appendChild(ustensilsTitle);
    descriptionDiv.appendChild(ustensils);
    recipeCard.appendChild(image);
    recipeCard.appendChild(descriptionDiv);
    recipeCardContenair.appendChild(recipeCard);
    recipesContainer.appendChild(recipeCardContenair);
  }
};

const getRecipes = () => {
  fetch("./assets/data/recipes.json")
    .then((res) => res.json())
    .then((data) => {
      recipes = data;
      let ingredientsListTemp = [];
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].ingredients.length; j++) {
          ingredientsListTemp.push(data[i].ingredients[j].ingredient);
        }
      }
      ingredientsListTemp = ingredientsListTemp.filter(function (item, pos) {
        return ingredientsListTemp.indexOf(item) == pos;
      });
      ingredientsList = ingredientsListTemp;
      generateIngredientsSelect();
      generateAppliancesSelect();
      generateUtensilsSelect();
      generateRecipes(null);
    });
};

getRecipes();

const checkInput = () => {
  if (
    inputTitle.target.value &&
    inputCategory.value &&
    inputPhoto.files.length >= 1
  ) {
    valideButton.disable = false;
    valideButton.className = "activeButton";
  } else {
    valideButton.disable = true;
    valideButton.className = "inactiveButton";
  }
};

searchButton.addEventListener("click", () => {
  searchFilter = searchInput.value;
  generateRecipes();
});
//inputCategory.addEventListener("change", checkInput);
//inputPhoto.addEventListener("change", checkInput);
