const foodDiv = document.querySelector('.food');
const categoryDiv = document.querySelector('.category');

const url = 'http://localhost:1337/api';
let allFood = [];
let allCategory = [];

// récupere le form par id et ensuite les inputs via les id des inputs
const addFoodForm = document.forms.addFood;
const foodTitle = addFoodForm.foodTitle;
const expirationDate = addFoodForm.expirationDate;
const cat = addFoodForm.id_category;

addFoodForm.addEventListener('submit', addFood);

let lastAddedItem = null;

foodDiv.addEventListener('click', deleteFoodItem);

init();

function init() {
  getFood();
  getCategory();
}

function getFood() {
  fetch(`${url}/fooditems?sort=ExpirationDate:ASC`)
    .then((data) => data.json())
    .then((data) => {
      /* console.log(data.data); */
      renderFood(data.data);
      if (lastAddedItem !== null) {
        flashLastAddedeItem(lastAddedItem);
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

function renderFood(array) {
  let list = [];
  array.forEach((element) => {
    const dateFR = convertInFrenchString(element.attributes.ExpirationDate);
    const item = `<li id=${element.id} class="marg"><button id=del${element.id}>X</button> ${element.attributes.title} à consommer avant le ${dateFR} </li>`;
    list = [...list, item];
  });

  foodDiv.innerHTML = `<ul>${list.join('')}</ul>`;
}

function addFood(e) {
  e.preventDefault();
  const title =
    foodTitle.value.trim().charAt(0).toUpperCase() + foodTitle.value.slice(1);
  const date = expirationDate.value;
  const category = cat.value;
  console.log(cat.value);

  const payload = {
    title,
    ExpirationDate: date,
    id_category: category,
  };
  fetch(`${url}/fooditems`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: payload }),
  })
    .then((response) => response.json())
    .then((data) => {
      // empty form
      foodTitle.value = '';
      expirationDate.value = '';
      cat.value = '';
      lastAddedItem = data;
      // retrieve latest food
      getFood();
      setTimeout(() => {
        location.reload();
      }, 3000);
    });
}

function flashLastAddedeItem(item) {
  const lastAddedItemElement = document.getElementById(`${item.data.id}`);
  if (lastAddedItemElement) {
    lastAddedItemElement.classList.add('just-added');

    setTimeout(() => {
      lastAddedItemElement.classList.remove('just-added');
    }, 2000);
  }
}

function convertInFrenchString(dateString) {
  const dateFragments = dateString.split('-');
  return `${dateFragments[2]}/${dateFragments[1]}/${dateFragments[0]}`;
}

function deleteFoodItem(e) {
  // vérification de l'endroit du click si pas un bouton return rien
  if (e.target.nodeName.toLowerCase() !== 'button') {
    return;
  }
  // si c'est sur un bouton le target récupère la cible
  const fooditemId = e.target.parentNode.id;

  fetch(`${url}/fooditems/${fooditemId}`, {
    method: 'delete',
  }).then((res) => {
    getFood();
  });
  location.reload();
}

function getCategory() {
  fetch(`${url}/categories?populate=*`)
    .then((data) => data.json())
    .then((result) => {
      category = result;
      /* console.log(result); */
      renderCategory(category.data);
    })
    .catch((err) => {
      console.error(err);
    });
}

function renderCategory(array) {
  let list = [];
  array.forEach((element) => {
    let listSubitem = [];
    for (
      let index = 0;
      index < element.attributes.id_fooditems.data.length;
      index++
    ) {
      const element2 = element.attributes.id_fooditems.data[index];

      const subitem = ` <li>${element2.attributes.title}</li>`;
      listSubitem = [...listSubitem, subitem];
    }

    const item = `<li id=${element.id} class="marg font">
                     ${element.attributes.name} 
                     <li> ${listSubitem.join('')}</li>
                     </li> `;
    list = [...list, item];
  });

  categoryDiv.innerHTML = `<ul>${list.join('')}</ul>`;
}
