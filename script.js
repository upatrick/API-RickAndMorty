const searchInput = document.getElementById('search-input');

        async function searchCharacters() {
            const searchTerm = searchInput.value.trim();

            if (searchTerm !== '') {
                try {
                    const response = await axios.get(`https://rickandmortyapi.com/api/character?name=${searchTerm}`);
                    const characters = response.data.results;

                    const characterListDiv = document.getElementById("character-list");
                    characterListDiv.innerHTML = '';

                    characters.forEach(character => {
                        const characterDiv = document.createElement("div");
                        characterDiv.className = "character-card";

                        const characterImgHTML = document.createElement("img");
                        characterImgHTML.src = character.image;
                        characterImgHTML.className = "character-image";

                        const characterNameElement = document.createElement("div");
                        characterNameElement.className = "character-name";
                        characterNameElement.innerText = character.name;

                        const characterLocationElement = document.createElement("div");
                        characterLocationElement.className = "character-location";
                        characterLocationElement.innerText = character.location.name;

                        characterDiv.appendChild(characterImgHTML);
                        characterDiv.appendChild(characterNameElement);
                        characterDiv.appendChild(characterLocationElement);

                        characterListDiv.appendChild(characterDiv);
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        }

        async function getJsonApi(pageURL) {
            try {
                const response = await axios.get(pageURL);
                return response.data;
            } catch (error) {
                console.log(error);
                throw error;
            }
        }

        function setupPaginationButton(isNext, buttonPageURL = null) {
            const buttonId = isNext ? "next-page-button" : "prev-page-button";
            const buttonHTML = document.getElementById(buttonId);

            if (buttonPageURL) {
                buttonHTML.setAttribute("onclick", "processCharacterPage('" + buttonPageURL + "')");
                buttonHTML.style.display = "inline-block";
            } else {
                buttonHTML.style.display = "none";
            }
        }

        async function processCharacterPage(pageURL) {
            try {
                const characterApiData = await getJsonApi(pageURL);

                const characterResults = characterApiData.results;

                const characterListDiv = document.createElement("div");
                characterListDiv.id = "character-list";
                characterListDiv.className = "character-container";

                characterResults.forEach(character => {
                    const characterDiv = document.createElement("div");
                    characterDiv.className = "character-card";

                    const characterImgHTML = document.createElement("img");
                    characterImgHTML.src = character.image;
                    characterImgHTML.className = "character-image";

                    const characterNameElement = document.createElement("div");
                    characterNameElement.className = "character-name";
                    characterNameElement.innerText = character.name;

                    const characterLocationElement = document.createElement("div");
                    characterLocationElement.className = "character-location";
                    characterLocationElement.innerText = character.location.name;

                    characterDiv.appendChild(characterImgHTML);
                    characterDiv.appendChild(characterNameElement);
                    characterDiv.appendChild(characterLocationElement);

                    characterListDiv.appendChild(characterDiv);
                });

                const oldCharacterListDiv = document.getElementById("character-list");
                if (oldCharacterListDiv) {
                    oldCharacterListDiv.replaceWith(characterListDiv);
                } else {
                    document.getElementById("character-list").appendChild(characterListDiv);
                }

                setupPaginationButton(true, characterApiData.info.next);
                setupPaginationButton(false, characterApiData.info.prev);
            } catch (error) {
                console.log(error);
            }
        }

        processCharacterPage("https://rickandmortyapi.com/api/character");

        axios.all([
            axios.get('https://rickandmortyapi.com/api/character'),
            axios.get('https://rickandmortyapi.com/api/location'),
            axios.get('https://rickandmortyapi.com/api/episode')
        ])
            .then(axios.spread(function (characterResponse, locationResponse, episodeResponse) {
                const characterCount = characterResponse.data.info.count;
                const locationCount = locationResponse.data.info.count;
                const episodeCount = episodeResponse.data.info.count;

                document.getElementById('characterCount').textContent = `PERSONAGENS: ${characterCount}`;
                document.getElementById('locationCount').textContent = `LOCALIZAÇÕES: ${locationCount}`;
                document.getElementById('episodeCount').textContent = `EPISÓDIOS: ${episodeCount}`;
            }))
            .catch(function (error) {
                console.log(error);
            });