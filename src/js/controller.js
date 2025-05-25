import * as model from './model.js'
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultsView from './view/resultsView.js';
import paginationView from './view/paginationView.js';
import bookmarksView from './view/bookmarksView.js';
import addRecipeView from './view/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime'
import { MODAL_CLOSE_SEC } from './config.js';

// if(module.hot){
//   module.hot.accept();
// }


const controlRecipes = async function () {
  try {
    const id=window.location.hash.slice(1);
    if(!id) return ; 

    // rendering spinner
    recipeView.renderSpinner();

    // 0) update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) updating bookmarks 
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults= async function(){
  try{   
    // 1) get search query
    const query=searchView.getQuery();
    if(!query) return ;

    resultsView.renderSpinner();

    // 2)  Load search results
    await model.loadSearchResults(query);

    // 3) render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage(1));

    // 4) render initial pagination button
    paginationView.render(model.state.search);

  }catch(err){
    console.error(err);
  }
}

const controlPagination=function(gotoPage){
   // 1) render New results
    resultsView.render(model.getSearchResultsPage(gotoPage));

    // 2) render New pagination button
    paginationView.render(model.state.search);
}

const controlServings=function(newServings){
  //update the recipe servings (in state)
  model.updateServings(newServings);

  // update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const  controlAddBookmark=function(){
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  console.log(model.state.recipe);
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks=function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe= async function(newRecipe){
  try{
  // show loading rendering spinner
  addRecipeView.renderSpinner();

  // upload the new recipe data
  await model.uploadRecipe(newRecipe);
  console.log(model.state.recipe);

  //Render Recipe
  recipeView.render(model.state.recipe);

  // success message
  addRecipeView.renderMessage();

  // Render bookmark view
  bookmarksView.render(model.state.bookmarks);

  // change ID in URL
  window.history.pushState(null,'',`#${model.state.recipe.id}`);

  // close form window
  // setTimeout(function(){
  //   addRecipeView.toggleWindow()
  // },MODAL_CLOSE_SEC*1000)
  }catch(err){
    console.error('💥',err);
    addRecipeView.renderError(err.message);
  }
}

const init=function(){
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
 console.log("yo");
};

init();

