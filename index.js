'use strict'

async function main() {
    const res = await axios.get('https://restcountries.com/v3.1/all');
    const countries = res.data;
    let isDarkMode = false;
    //
    const searchInput = document.getElementsByClassName("search")[0];
    const resultHolder = document.getElementById("search-results");
    const ContainerCountryList = document.querySelector('.countries-list-container');
    const h1 = document.querySelector("h1");
    const dropdownContent = document.querySelector('.dropdown');
    const filterBtn = document.querySelector('.filterbtn');
    const countryDetailContainer = document.querySelector('.country-details');

    const africa = document.querySelector('#africa');
    const america = document.querySelector('#america');
    const asia = document.querySelector('#asia');
    const europe = document.querySelector('#europe');
    const oceania = document.querySelector('#oceania');
    const regions = [africa, america, asia, europe, oceania];
    //
    const displayCountries = function(countries) {
        countries.forEach(function(country) {
            const html = `
            <div class="country-container box-shadow">
                <a class="link" href="#${country.name.official}"/>
                <img src='${country.flags.png}' class="country-flag"/>
                <div class="country-name">${country.name.official}</div>
                <div class="country-info-container">
                    <div class="country-population">Population: ${country.population}</div>
                    <div class="country-region">Region: ${country.region}</div>
                    <div class="country-capital">Capital: ${country.capital}</div>
                </div>
            </div>`;
            ContainerCountryList.insertAdjacentHTML('afterbegin', html);
        });
        if (isDarkMode) {
            darkMode();
        }
    }

    const searchByName = async function(e) {
        try {
            const searchRes = await axios.get(`https://restcountries.com/v2/name/${e.target.value}`);

            removeAllChildNodes(resultHolder);
            for (let country of searchRes.data) {
                const item = document.createElement("li");
                let html = `<div class="search-result">
                <a href="#${country.name}"/>
                <div class="search-result-container">
                    <img class="search-flag" src="${country.flag}"/>
                    <div>${country.name}</div></div>
                </div>`;
                item.insertAdjacentHTML('afterbegin', html);
                resultHolder.appendChild(item);
            }
            resultHolder.style.display = "block";

        } catch (err) {
            throw err;
        }

    }

    const removeAllChildNodes = function(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }
    }

    async function showCountryDetails() {
        try {
            const name = window.location.hash.slice(1).replaceAll("%20", " ");
            const res = await axios.get(`https://restcountries.com/v2/name/${name}`);
            const html = `
            <div>
                <div class="backbtn box-shadow">Back</div>
                <div class="country-details-container">
                <img class="country-detail-flag box-shadow" src="${res.data[0].flag}"/>
                <div class="country-infos">
                    <div class="name">${res.data[0].name}</div>
                    <div class="info-container">
                        <div>
                            <div>Native Name: <span class="normal-font-weight">${res.data[0].nativeName}</span></div>
                            <div>Population: <span class="normal-font-weight">${res.data[0].population}</span></div>
                            <div>Region: <span class="normal-font-weight">${res.data[0].region}</span></div>
                            <div>Sub Region: <span class="normal-font-weight">${res.data[0].subregion}</span></div>
                            <div>Capital: <span class="normal-font-weight">${res.data[0].capital}</span></div>
                        </div>
                        <div>
                            <div>Top Level Domain: <span class="normal-font-weight">${res.data[0].topLevelDomain}</span></div>
                            <div>Currencies: <span class="normal-font-weight">${res.data[0].currencies.map(cur => {
                              return  `<span class="normal-font-weight">${cur.name} </span`
                            }).join()}</span></div>
                            <div>Languages: <span class="normal-font-weight">${res.data[0].languages.map(lang => {
                                return  `<span class="normal-font-weight">${lang.name} </span`
                              }).join()}</span></div>
                        </div>
                    </div>  
                    <div>Border Countries: <span class="normal-font-weight">${res.data[0].borders}</span></div>          
                </div>
            </div>
            </div>
            `;
            ContainerCountryList.style.display = "none";
            countryDetailContainer.style.display = "block";
            document.querySelector('.search-filter-container').style.display = "none";
            countryDetailContainer.insertAdjacentHTML('afterbegin', html);
            const backBtn = document.querySelector(".backbtn");
            backBtn.addEventListener('click', backToHome);

            if(isDarkMode){
                darkMode();
            }
        } catch (err) {
            throw err;
        }

    }

    const backToHome = function(){
        window.location.href="index.html";
    }

    const darkMode = function() {
        document.querySelector('body').style.backgroundColor = "hsl(207, 26%, 17%)";
        document.querySelector('body').style.color = "hsl(0, 0%, 100%)";
        document.querySelectorAll('.country-container').forEach(country => country.style.backgroundColor = "hsl(209, 23%, 22%)");
        searchInput.style.backgroundColor = "hsl(209, 23%, 22%)";
        filterBtn.style.backgroundColor = "hsl(209, 23%, 22%)";
        dropdownContent.style.backgroundColor = "hsl(209, 23%, 22%)";
        document.querySelectorAll('.box-shadow').forEach(el => el.classList.remove("box-shadow"));
        resultHolder.style.backgroundColor = "hsl(209, 23%, 22%)";

    }

    const lightMode = function() {
        document.querySelector('body').style.backgroundColor = "hsl(0, 0%, 98%)";
        document.querySelector('body').style.color = "hsl(200, 15%, 8%)";
        document.querySelectorAll('.country-container').forEach(country => country.style.backgroundColor = "white");
        searchInput.style.backgroundColor = "white";
        filterBtn.style.backgroundColor = "white";
        dropdownContent.style.backgroundColor = "white";
        document.querySelectorAll('.box-shadow').forEach(el => el.classList.add("box-shadow"));
        searchInput.classList.add("box-shadow");
        dropdownContent.classList.add("box-shadow");
        filterBtn.classList.add("box-shadow");
        document.querySelectorAll('.country-container').forEach(el => el.classList.add("box-shadow"));
    }

    async function filterByRegion(region){
        try{
            const res = await axios.get(`https://restcountries.com/v3.1/region/${region}`);
            ContainerCountryList.innerHTML = "";
            displayCountries(res.data);
        }catch(err){
            throw err;
        }
    }
    //
    document.addEventListener('click', function(e) {
        const isClickInsideElement = searchInput.contains(e.target);
        const isClickInsideElement1 = resultHolder.contains(e.target);
        const filterClick = filterBtn.contains(e.target);
        const dropdownClick = dropdownContent.contains(e.target);
        if (!isClickInsideElement && !isClickInsideElement1) {
            resultHolder.style.display = "none";
        }
        if(!filterClick && !dropdownClick){
            dropdownContent.style.display = "none";
        }
    })

    displayCountries(countries);
    searchInput.addEventListener('input', searchByName);

    h1.addEventListener('click', backToHome);

    window.addEventListener('hashchange', showCountryDetails);

    filterBtn.addEventListener('click', function(){
        dropdownContent.style.display = "block";
    });

    regions.forEach(region => region.addEventListener('click', function(){
        filterByRegion(region.id)
    }));

    document.querySelector(".dark-mode").addEventListener('click', function(){
        isDarkMode = !isDarkMode;
        isDarkMode?darkMode():lightMode();
    });
}

main();