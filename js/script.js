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
const loader = document.querySelector(".loader-wrapper");
// const detail = document.querySelector(".container-right");

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
  const data = await fetchData(url + id, options);

  //Рендерим фильм
  renderFilmData(data);
}

//Рендерим фильм
function renderFilmData(item) {
  //0. проверка на наличие деталей
  if (document.querySelector(".container-right")) {
    document.querySelector(".container-right").remove();
  }

  // 1. Рендерим контейнер деталей
  const containerRight = document.createElement("div");
  containerRight.classList.add("container-right");
  document.body.insertAdjacentElement("afterbegin", containerRight);

  // 2. Кнопка закрытия
  const btnClose = document.createElement("button");
  btnClose.classList.add("btn-close");
  btnClose.innerHTML = `<img src="./img/cross.svg" alt="Close" width="24" />`;
  btnClose.addEventListener("click", () => {
    containerRight.remove();
  });
  containerRight.insertAdjacentElement("beforeend", btnClose);

  // 3. Рендерим фильм
  const film = document.createElement("div");
  film.classList.add("film");
  containerRight.insertAdjacentElement("beforeend", film);

  const html = `
      <div class="film__title">${item.nameRu}</div>
      <div class="film__img"><img src=${item.posterUrl} alt="Cover"></div>
      <div class="film__desc">
        <p class="film__details">Год: ${item.year}</p>
        <p class="film__details">Рейтинг: ${item.ratingKinopoisk}</p>
        <p class="film__details">Продолжительность: ${item.filmLength} мин.</p>
        <p class="film__details">Страна: ${item.countries[0].country}</p>
        <p class="film__details">Жанр: ${item.genres[0].genre}</p>
      </div>
  }`;

  film.insertAdjacentHTML("beforeend", html);
}
fetchAndRenderFilms().catch((error) => console.log(error));
