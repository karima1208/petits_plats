let recipes = [];
let ingredientsList = [];
const recipesContainer = document.querySelector(".recipes-container");
const recipesSelect = document.querySelector(".recipes-select");
let ingredientFilter = "";
let applianceFilter = "";

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
  select.addEventListener("change", (e) =>
    generateRecipesByAppliance(e.target.value)
  );
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
  select.addEventListener("change", (e) =>
    generateRecipesByUtensil(e.target.value)
  );
  recipesSelect.appendChild(select);
};

const generateRecipesByAppliance = (appliance) => {
  console.log(appliance);

  const filteredRecipes = recipes.filter(
    (recipe) => recipe.appliance === appliance
  );
  console.log(filteredRecipes);
  generateRecipes(filteredRecipes);
};

const generateRecipesByUtensil = (utensil) => {
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.ustensils.includes(utensil)
  );
  generateRecipes(filteredRecipes);
};

const generateRecipes = () => {
  let filteredRecipes = recipes;
  recipesContainer.innerHTML = "";

  if (ingredientFilter) {
    for (let i = 0; i < recipes.length; i++) {
      for (let j = 0; j < recipes[i].ingredients.length; j++) {
        if (ingredientFilter === recipes[i].ingredients[j].ingredient) {
          filteredRecipes.push(recipes[i]);
        }
      }
    }
  } else {
    filteredRecipes = recipes;
  }

  for (let i = 0; i < filteredRecipes.length; i++) {
    const recipeCardContenair = document.createElement("div");
    recipeCardContenair.className = "recipeCardContainer";
    const recipeCard = document.createElement("div");
    recipeCard.className = "recipeCard";
    const image = document.createElement("img");
    image.src = `./assets/images/recipes/${filteredRecipes[i].image}`;
    image.className = "recipeCardImage";
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

    descriptionDiv.appendChild(ingredients);

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

inputTitle.addEventListener("change", checkInput);
inputCategory.addEventListener("change", checkInput);
inputPhoto.addEventListener("change", checkInput);
