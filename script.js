let favList = [];
let firstAdd =false;
let closed="x";
let count=0;
let listContainer = document.createElement("ul");
const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');
const favContainer = document.getElementById('fav-page');
favContainer.style.display = "none";
var results = document.getElementById("movie-page"); 



// loading movies from API
async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=7fc30800`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    //  console.log(data);
     if(data.Response == "True") showMovieList(data.Search);
}
//load movies as user is typing
function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}
//listing movies
function showMovieList(movies){
    searchList.innerHTML = "";
    for(let i = 0; i < movies.length; i++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[i].imdbID; // setting movie id 
        movieListItem.classList.add('search-list-item');
        let fav="+ FAV"; 
        if(movies[i].Poster != "N/A")
            moviePoster = movies[i].Poster;
        else 
            moviePoster = "no-image.png";

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[i].Title}<span class="add-fav"> ${fav}</span></h3>   
        </div>
        
        `; //to display poster and favorite button to each movie
        searchList.appendChild(movieListItem);
    }
    showMovieDetails();
}

function showMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async (event) => {
                searchList.classList.add('hide-search-list');
                movieSearchBox.value = "";
                const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`);
                const movieDetails = await result.json();
                // console.log(movieDetails);
            if(event.target.className != "add-fav"){  
                displayMoviePage(movieDetails); 
            }
            else{
                firstAdd = true;
                let newMovie = movieDetails.Title;    
                var old_list = localStorage.getItem('favList');   
                if (old_list === null) {
                    localStorage.setItem('favList', movieDetails.Title); //first item     
                    addToFavList(newMovie);
                } 
                else {
                    if(old_list.includes(movieDetails.Title)){
                        alert("Already in favorite list");
                       }else{
                        localStorage.setItem('favList', old_list + ","+movieDetails.Title);
                        addToFavList(newMovie);
                       }
                  }            
            }
        });
    });
}
let i=0;
//adding a movie to favorite list
function addToFavList(newMovie){ 
    let listItem = document.createElement("li");
    let value=document.createTextNode(newMovie);
        listItem.appendChild(value);
        let span = document.createElement("span");
        span.className = "deleteButton";
        span.id= i++;
        var newtext = document.createTextNode("Remove");
        span.appendChild(newtext);
        listItem.appendChild(span);
        listContainer.appendChild(listItem);

    document.getElementById("myFavList").appendChild(listContainer);
}
//displaying movie page
function displayMoviePage(details){ 
    results.style.display ="block";
    resultGrid.innerHTML = `
    <span class="close" id="close">${closed}</span>
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <p class = "genre">${details.Genre}</p>
        <p class = "released">${details.Released}</p>
        <p class = "ratings">Ratings: ${details.imdbRating}</p>
        <div class="plot-details">
        <p class = "plot"><b></b> ${details.Plot}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        </div>      
        <p class = "language">${details.Language}</p>     
    </div>
    `;
}

function closeFav(){
    favContainer.style.display = "none";
}
//displaying favorite movies
function favMovies(){
    count++;
    favContainer.style.display = "block";
    results.style.display ="none";
    var list=localStorage.getItem("favList");
    if(list == null){
        alert("No items in favorite page");
        favContainer.style.display = "none";
    }
    else{
        if(!firstAdd && count == 1){
        let myArray = list.split(",");
        for(let i=0;i<myArray.length;i++){
           addToFavList(myArray[i]);
        }
        
        }
    }
}
//to control when should we page get displayed
window.addEventListener('click', (event) => {
    
    if(event.target.className == "form-control"){
        results.classList.add('hide-movie-page');
    }
    else if(event.target.id == "close"){  
        results.style.display="none";
    }
    else if(event.target.className == "deleteButton"){
        event.target.parentElement.style.display = "none";
    }
    else{
        results.classList.remove('hide-movie-page');
    }
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }   
    
});
