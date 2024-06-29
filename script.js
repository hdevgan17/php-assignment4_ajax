/******w**************
    
    Assignment 4 Javascript
    Name: Harshdeep Devgan
    Date: 28 June, 2024
    Description: 

*********************/

'use strict';

function formAvailability(enabled) {
  const buttonElement = document.querySelector('button');
  const searchInput = document.querySelector('#candidate');

  if (enabled) {
    buttonElement.classList.remove('is-loading');
    searchInput.focus();
    searchInput.select();
  } else {
    buttonElement.classList.add('is-loading');
    searchInput.blur();
  }
}

function displaySearchExplanation(searchText, resultCount) {
  const explanationElement = document.querySelector('h2.explanation');

  if (resultCount === 0) {
    explanationElement.innerHTML = `Could not find any Winnipeg  Election candidate in data that includes '${searchText}'.`;
  } else {
    explanationElement.innerHTML = `The ${resultCount} top Winnipeg Election candidates in election that includes '${searchText}'.`;
  }
}

function tableVisibility(show) {
  const candidateTable = document.querySelector('table.candidates');

  if (show) {
    candidateTable.classList.remove('is-invisible');
  } else {
    candidateTable.classList.add('is-invisible');
  }
}

// DOM work required to add data from a single candidate as td elements within a tr.
function addCandidateAsTableRow(table, candidate) {
  const row = document.createElement('tr');
  const typeTD = document.createElement('td');
  const candidateTd = document.createElement('td');
  const possitionTd = document.createElement('td');
  const votesTd = document.createElement('td');
  const wonTd = document.createElement('td');

  typeTD.innerHTML = candidate.type;
  candidateTd.innerHTML = candidate.candidate;
  possitionTd.innerHTML = candidate.position;
  votesTd.innerHTML = candidate.votes;
  wonTd.innerHTML = candidate.won;

  row.appendChild(typeTD);
  row.appendChild(candidateTd);
  row.appendChild(possitionTd);
  row.appendChild(votesTd);
  row.appendChild(wonTd);
  table.appendChild(row);
}

// Loop through the candidates in the array of candidates retrieved from the API adding
// each candidate as a row to the candidate table body element.
function addCandidatesToTable(candidates) {
  const candidateTable = document.querySelector('.candidates tbody');
  candidateTable.innerHTML = '';

  for (let candidate of candidates) {
    addCandidateAsTableRow(candidateTable, candidate);
  }
}

function processSearchResults(candidates, searchTerm) {
  displaySearchExplanation(searchTerm, candidates.length);
  tableVisibility(candidates.length !== 0);
  addCandidatesToTable(candidates);
  formAvailability(true);
}

// Fetch paginated data from the City of Winnipeg candidate dataset and display it
// within an HTML table element.
function paginatedCandidateFetch(candidate, limit) {
  const apiUrl = `https://data.winnipeg.ca/resource/7753-3fjc.json?` + `$where=lower(candidate) LIKE lower('%${candidate}%') ` + `&$order=won DESC` + `&$limit=${limit}`;

  fetch(encodeURI(apiUrl))
    .then(response => response.json())
    .then(candidates => processSearchResults(candidates, candidate));
}

function demoQuery(event) {
  const searchInput = document.querySelector('#candidate');
  const searchTerm = event.target.innerHTML;

  event.preventDefault();
  searchInput.value = searchTerm;
  formAvailability(false);
  paginatedCandidateFetch(searchTerm, 100);
}

function searchForCandidates(event) {
  event.preventDefault();

  const searchInput = document.querySelector('#candidate');
  const searchTerms = searchInput.value.trim();
  if (searchTerms !== '') {
    formAvailability(false);
    paginatedCandidateFetch(searchTerms, 100);
  }
}

function loadApp() {
  const queryLinks = document.querySelectorAll('a.query');
  const formElement = document.querySelector('form');
  formElement.addEventListener('submit', searchForCandidates);

  for (let query of queryLinks) {
    query.addEventListener('click', demoQuery);
  }

  tableVisibility(false);
  formAvailability(true);
}

loadApp();
