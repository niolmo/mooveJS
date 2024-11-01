//Constants & Variables

const apiKey = "e27e03b8-bf5d-4068-8584-31326495f508";
const url = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";
const options = {
  method: "GET",
  headers: {
    "X-API-KEY": apiKey,
    "Content-Type": "application/json"
  }
};

let page = 1;

//Elements

const filmsWrapper = document.querySelector(".films");
const btnMore = document.querySelector(".show-more");
const btnClose = document.querySelector(".btn-close");
const loader = document.querySelector(".loader-wrapper");

//Events

btnMore.addEventListener("click", () => {
  fetchAndRenderFilms().catch((error) => console.log(error));
});

//Functions

//Получаеи данные и в JSON
async function fetchData(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();
  return data;
}

//Рендерим фильмы
function renderFilms(items) {
  for (item of items) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.id = item.kinopoiskId;
    card.onclick = openFilmDetails;
    const html = `
    <img class="card__img" src=${item.posterUrlPreview} alt="Poster">
    <p< class="card__title">${item.nameRu}</p>
    <p class="card__genre">${item.genres[0].genre}</p>
    <p class="card__year">${item.year}</p>
    <p class="card__rate">${item.ratingKinopoisk}</p
  `;
    card.insertAdjacentHTML("beforeend", html);
    filmsWrapper.insertAdjacentElement("beforeend", card);
  }
}

//Сводим все в одну функцию
async function fetchAndRenderFilms() {
  //Показываем лоадер
  loader.classList.remove("none");

  //Получаем данные
  const data = await fetchData(
    url + `collections?type=TOP_250_MOVIES&page=${page}`,
    options
  );
  if (data.totalPages > 1) page++;

  //Скрываем лоадер
  loader.classList.add("none");

  //Рендерим фильмы
  renderFilms(data.items);
}

//Открываем детали
async function openFilmDetails(e) {
  const id = e.currentTarget.id;

  //Получаем данные
  const film = await fetchData(url + id, options);
}
fetchAndRenderFilms().catch((error) => console.log(error));
