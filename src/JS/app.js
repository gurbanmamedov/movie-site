const API_KEY = "c38d3589-6731-45cb-9483-6c88d38dec88";
const API_URL_POPULAR =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_MOVIES&page=";
const API_URL_SEARCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";

let currentPage = 1;

getMovies(API_URL_POPULAR + currentPage);

async function getMovies(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const responseData = await response.json();
  showMovies(responseData);
}

function getClassByRate(vote) {
  return vote >= 7 ? "green" : vote > 5 ? "orange" : "red";
}

function showMovies(data) {
  const moviesElement = document.querySelector(".movies");
  moviesElement.innerHTML = "";

  if (data?.films || data?.items) {
    const movies = data.films || data.items;
    movies.forEach((movie) => {
      const movieElement = document.createElement("li");
      movieElement.classList.add("movie");
      const ratingClass = movie.ratingKinopoisk
        ? getClassByRate(movie.ratingKinopoisk)
        : getClassByRate();

      movieElement.innerHTML = `
        <div class="movie__cover-inner">
          <img
            src="${movie.posterUrl}"
            alt="${movie.nameRu}"
            class="movie__poster"
          />
          <div class="movie__cover-dark"></div>
        </div>
        <div class="movie__info">
          <h3 class="movie__title">${movie.nameRu}</h3>
          <p class="movie__genre">${movie.genres.map(
            (genre) => ` ${genre.genre}`
          )}</p>
          <p class="movie__rating ${ratingClass}">
            ${movie.ratingKinopoisk || ""}
          </p>
        </div>
      `;
      moviesElement.append(movieElement);
    });
  } else {
    moviesElement.innerHTML = "<p>No movies found.</p>";
  }
}

const search = document.querySelector(".header__search");
const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchValue = search.value;
  const apiSearchUrl = `${API_URL_SEARCH}${searchValue}`;
  if (searchValue) {
    getMovies(apiSearchUrl);
  }
});

const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");

prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    getMovies(API_URL_POPULAR + currentPage);
  }
});

nextPageBtn.addEventListener("click", () => {
  currentPage++;
  getMovies(API_URL_POPULAR + currentPage);
});
