function exportTTS() {
    renderedItems.forEach(item => {
        if (exportedItems.includes(item)) {
            return;
        }
        let templateCopy = JSON.parse(JSON.stringify(templates[item.type]));
        templateCopy.ObjectStates[0].Nickname = `${item.set} ${item.type}`;

        if (item.category === 'booster') {
            exportBooster(item, templateCopy);
        } else if (item.category === 'bigBox')
        {
            exportBigBox(item, templateCopy);
        } else {
            return;
        }

        exportedItems.push(item);

        exportButton(item, templateCopy);
    });
}

function exportBooster(item, templateCopy) {
    templateCopy.ObjectStates[0].CustomMesh.DiffuseURL = artIDsSteamCloud[item.artID];

    item.cardContents.forEach(cardData => {
        let copy = JSON.parse(JSON.stringify(cardTemplate));
        
        processCard(cardData, copy);

        templateCopy.ObjectStates[0].ContainedObjects.push(copy);
    });
}

function exportBigBox(item, templateCopy) {
    templateCopy.ObjectStates[0].CustomMesh.DiffuseURL = artIDsSteamCloud[item.artID];

    //Rulebook
    let rulebook = JSON.parse(JSON.stringify(rulebookTemplate));
    rulebook.Nickname = `${item.set} Rulebook`;
    rulebook.Transform.scaleX = 1.5;
    rulebook.Transform.scaleZ = 1.5;
    templateCopy.ObjectStates[0].ContainedObjects.unshift(rulebook);

    //Oversize
    let oversize = JSON.parse(JSON.stringify(deckTemplate));
    oversize.Nickname = `${item.set} Oversize`;
    oversize.Transform.scaleX = 1.75;
    oversize.Transform.scaleZ = 1.75;
    oversize.CustomDeck = {};
    item.otherContents[0].forEach(cardData => {
        let copy = JSON.parse(JSON.stringify(oversizeTemplate));

        processCard(cardData, copy);

        oversize.DeckIDs.push(cardData.ttsCardID);
        if (!oversize.CustomDeck[cardData.ttsCustomDeck]) {
            oversize.CustomDeck[cardData.ttsCustomDeck] = customDecks[`${cardData.set}`][cardData.ttsCustomDeck];
        }

        oversize.ContainedObjects.push(copy);
    });
    templateCopy.ObjectStates[0].ContainedObjects.unshift(oversize);

    //StarterDeck
    let starter = JSON.parse(JSON.stringify(deckTemplate));
    starter.Nickname = `${item.cardContents[0].name} Starter Deck`;
    starter.CustomDeck = {};
    starter.Transform.rotZ = 180;

    item.cardContents.forEach(cardData => {
        let copy = JSON.parse(JSON.stringify(cardTemplate));

        processCard(cardData, copy);

        starter.DeckIDs.push(cardData.ttsCardID);
        if (!starter.CustomDeck[cardData.ttsCustomDeck]) {
            starter.CustomDeck[cardData.ttsCustomDeck] = customDecks[`${cardData.set}`][cardData.ttsCustomDeck];
        }

        starter.ContainedObjects.push(copy);
    });
    templateCopy.ObjectStates[0].ContainedObjects.unshift(starter);

    //Booster Packs
    item.otherContents.forEach(boosterData => {
        if (boosterData.category === 'booster') {
            let booster = JSON.parse(JSON.stringify(boosterTemplate));
            booster.CustomMesh.DiffuseURL = artIDsSteamCloud[boosterData.artID];

            boosterData.cardContents.forEach(cardData => {
                let copy = JSON.parse(JSON.stringify(cardTemplate));
        
                processCard(cardData, copy);

                booster.ContainedObjects.push(copy);
            });

            templateCopy.ObjectStates[0].ContainedObjects.unshift(booster);
        }
    })
}

function exportButton(item, templateCopy) {
        let exportedBooster = JSON.stringify(templateCopy);

        const cloneExportedItem = document.querySelector(`.exportedItem`).cloneNode(true);
        const name = cloneExportedItem.querySelector('.exportedItemName');
        const icon = cloneExportedItem.querySelector('.icon')

        name.innerText = `${item.set} ${item.type} ${exportedItems.length}`;
        icon.href = URL.createObjectURL(
            new Blob([exportedBooster], {type:"application/json"})
        )
        icon.download = `${templateCopy.ObjectStates[0].Nickname} ${exportedItems.length}.json`

        document.querySelector('.full-out').append(cloneExportedItem);
}

function processCard(cardData, copy) {
        copy.Nickname = cardData.name;
        copy.GMNotes = String(cardData.setNumber).padStart(3, '0') + cardData.rarity.charAt(0);

        const tags = [];
        if (cardData.type) {
            if (Array.isArray(cardData.type)) {
                cardData.type.forEach(type => tags.push(type));
            } else if (cardData.type !== "") {
                tags.push(cardData.type);
            }
        }
        if (tags.includes("Hero")) {
            copy.HideWhenFaceDown = false;
        } else {
            copy.HideWhenFaceDown = true;
        }
        if (cardData.class) {
            if (Array.isArray(cardData.class)) {
                cardData.class.forEach(cls => tags.push(cls));
            } else if (cardData.class !== "") {
                tags.push(cardData.class);
            }
        }
        if (cardData.faction && cardData.faction !== "") {
            tags.push(cardData.faction);
        }
        copy.Tags = tags;

        copy.CardID = cardData.ttsCardID;
        let tempCustomDeck = {};
        tempCustomDeck[cardData.ttsCustomDeck] = customDecks[`${cardData.set}`][cardData.ttsCustomDeck];
        copy.CustomDeck = tempCustomDeck;
}