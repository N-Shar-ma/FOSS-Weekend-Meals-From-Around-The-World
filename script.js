let filteredRecipes;
const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";
const input = document.querySelector("[data-input]");
const body = document.querySelector("body");

input.addEventListener("keyup", e => {
  if(e.key === "Enter")
  {
    input.blur();
    fetchRecipesByArea(input.value);
  }
})

document.querySelector(".modal-close-button").addEventListener("click", ()=>{
  document.querySelector("body").classList.remove("show-modal");
});

document.querySelector(".overlay").addEventListener("click", ()=>{
  document.querySelector("body").classList.remove("show-modal");
});

async function fetchRecipesByArea(area) {
  try {
    body.classList.add("loading");
    const response = await fetch(`${BASE_URL}filter.php?a=${area}`);
    if(!response.ok) throw Error(response.status);
    ({meals : filteredRecipes} = await response.json());
    if(filteredRecipes == null) throw Error(`No ${area} meals found!`);
    console.log(filteredRecipes);
    body.classList.remove("loading");
    showImages();
  }
  catch (err) {
    console.log(err)
    if (err.message == `No ${area} meals found!`){
    showModal("\n"+err+"\n\n", `Sorry, '${area}' is not a valid entry. Try something else!`, color = "red");
    // location.reload();
    body.classList.remove("loading")
    }
    else{
    showModal("\n Unable to Fetch info\n\n", "\nYour internet connection doesn't seem well. Try again later!\n\n", color = "red");
    // location.reload();
    body.classList.remove("loading")
    }
  }
}

function showImages() {
  const imagesArea = document.querySelector(".images-area");
  filteredRecipes.forEach(meal => {
    const image = document.createElement("img");
    image.src = meal.strMealThumb;
    image.title = `${meal.strMeal}
Click to see recipe`;
    image.classList.add("meal-image");
    image.id = meal.idMeal;
    image.addEventListener("click", showIngredients);			
    imagesArea.append(image);
  });
}

async function showIngredients(e) {
  try {
    body.classList.add("loading");
    const response = await fetch(`${BASE_URL}lookup.php?i=${e.target.id}`);
    if(!response.ok) throw Error(response.status);
    const {meals : [meal]} = await response.json();
    console.log(meal);
    const ingredients = [];
    for(let i = 1; i <= 20; i++)
    {
      ingredients.push(meal[`strMeasure${i}`] + " " + meal[`strIngredient${i}`]);
    }
    const content = `Ingredients:

${ingredients.join(`
`)}

Instructions:

${meal.strInstructions}`;
    body.classList.remove("loading");
    showModal(meal.strMeal, content);
  }
  catch (err) {
    console.log(err)
    showModal("\n"+err+"\n\n", `Your internet connection doesn't seem well. Try again later!`, color = "red");
    // location.reload();
    body.classList.remove("loading")
  }
}

function showModal(title, content, color = "green") {
  document.querySelector(".modal-title").innerText = title;
  document.querySelector(".modal-content").innerText = content;
	document.querySelector(".modal-content").scrollTop = 0;
  document.querySelector(".modal-header").style.backgroundColor = color;
  if( color == "red" ) {document.querySelector(".modal-content").style.backgroundColor = "white";}
  body.classList.add("show-modal");
}