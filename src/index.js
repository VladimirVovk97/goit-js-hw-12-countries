import debounce from 'lodash.debounce';
import countryList from './country.hbs';
import countriesList from './countries.hbs';

import { error, defaults } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

defaults.delay = 2000;

const searchRef = document.querySelector('[data-action="search"]');
const countryRef = document.querySelector('.country');

searchRef.addEventListener('input', debounce(renderCountry, 500));

function onSearch() {
  if (searchRef.value.trim() === '') {
    return fetch(`https://restcountries.com/v2/name/${searchRef.value}`).catch(error =>
      console.log(error),
    );
  }
  return getInfo();
}

function renderCountry() {
  onSearch().then(data => {
    if (data.status === 404) {
      error({
        title: 'Please, enter the name of the real country!'
      });
      clearCardContent();
      return;
    } else if (data.length >= 2 && data.length <= 10) {
      clearCardContent();
      makeCardContent(data);
      return;
    } else if (data.length > 10) {
      clearCardContent();
      error({
        title: 'Too many matches found. Please, enter a more specific query!',
      });
      return;
    }

    clearCardContent();
    makeCardContent(data);
  });
}

function getInfo() {
  return fetch(`https://restcountries.com/v2/name/${searchRef.value}`)
    .then(response => response.json())
    .catch(error => console.log(error));
}

function clearCardContent() {
  countryRef.innerHTML = '';
}

function makeCardContent(data) {
  if (data.length >= 2 && data.length <= 10) {
    countryRef.insertAdjacentHTML('beforeend', countriesList(data));
  }
  else countryRef.insertAdjacentHTML('beforeend', countryList(data));
}