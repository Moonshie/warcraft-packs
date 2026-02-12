const boosterSaveTemplate = {
  "SaveName": "",
  "Date": "",
  "VersionNumber": "",
  "GameMode": "",
  "GameType": "",
  "GameComplexity": "",
  "Tags": [],
  "Gravity": 0.5,
  "PlayArea": 0.5,
  "Table": "",
  "Sky": "",
  "Note": "",
  "TabStates": {},
  "LuaScript": "",
  "LuaScriptState": "",
  "XmlUI": "",
  "ObjectStates": [
    {
      "GUID": "",
      "Name": "Custom_Model_Bag",
      "Transform": {
        "posX": 0,
        "posY": 2,
        "posZ": 0,
        "rotX": 0,
        "rotY": 180.0,
        "rotZ": 0,
        "scaleX": 1.0,
        "scaleY": 1.0,
        "scaleZ": 1.0
      },
      "Nickname": "Booster",
      "Description": "",
      "GMNotes": "",
      "AltLookAngle": {
        "x": 0.0,
        "y": 0.0,
        "z": 0.0
      },
      "ColorDiffuse": {
        "r": 1.0,
        "g": 1.0,
        "b": 1.0
      },
      "LayoutGroupSortIndex": 0,
      "Value": 0,
      "Locked": false,
      "Grid": true,
      "Snap": true,
      "IgnoreFoW": false,
      "MeasureMovement": false,
      "DragSelectable": true,
      "Autoraise": true,
      "Sticky": true,
      "Tooltip": true,
      "GridProjection": false,
      "HideWhenFaceDown": false,
      "Hands": false,
      "MaterialIndex": -1,
      "MeshIndex": -1,
      "CustomMesh": {
        "MeshURL": "https://steamusercontent-a.akamaihd.net/ugc/10161235644986836063/E9A65CD25256BFDB28AE4140FCB1D27BC71A5A8D/",
        "DiffuseURL": "https://steamusercontent-a.akamaihd.net/ugc/14112822235229092952/DC43688C9BA514D9439E41C007A5EB46674A1A64/",
        "NormalURL": "https://steamusercontent-a.akamaihd.net/ugc/15643083660343037921/D75480247FA058266F0D423501D867407458666D/",
        "ColliderURL": "",
        "Convex": true,
        "MaterialIndex": 0,
        "TypeIndex": 6,
        "CastShadows": true
      },
      "Bag": {
        "Order": 0
      },
      "LuaScript": "            function onLoad()\n                self.addContextMenuItem(\"Crack the Pack\", unloadAllCards)\n            end\n\n            function unloadAllCards(player_color, position, object)\n                local objects = self.getObjects()\n                local basePos = self.positionToWorld({0, 0.5, 0})\n                local yOffset = 0\n\n                for i, obj in ipairs(objects) do\n                    self.takeObject({\n                        guid = obj.guid,\n                        position = {basePos.x, basePos.y + yOffset, basePos.z},\n                        smooth = false,\n                        callback_function = function(takenObj)\n                            takenObj.setRotationSmooth({0, 180, 0})\n                        end\n                    })\n                    yOffset = yOffset + 0.2\n                end\n\n                Wait.time(checkEmptyAndDestroy, 0.1)\n            end\n\n            function onObjectLeaveContainer(container, leaving_object)\n                if container == self then\n                    Wait.time(checkEmptyAndDestroy, 0.2)\n                end\n            end\n\n            function checkEmptyAndDestroy()\n                if #self.getObjects() == 0 then\n                    self.destruct()\n                end\n            end\n        ",
      "LuaScriptState": "",
      "XmlUI": "",
      "ContainedObjects": []
    }
  ]
}

const boosterTemplate = {
    "GUID": "",
    "Name": "Custom_Model_Bag",
    "Transform": {
    "posX": 0,
    "posY": 2,
    "posZ": 0,
    "rotX": 0,
    "rotY": 180.0,
    "rotZ": 0,
    "scaleX": 1.0,
    "scaleY": 1.0,
    "scaleZ": 1.0
    },
    "Nickname": "Booster",
    "Description": "",
    "GMNotes": "",
    "AltLookAngle": {
    "x": 0.0,
    "y": 0.0,
    "z": 0.0
    },
    "ColorDiffuse": {
    "r": 1.0,
    "g": 1.0,
    "b": 1.0
    },
    "LayoutGroupSortIndex": 0,
    "Value": 0,
    "Locked": false,
    "Grid": true,
    "Snap": true,
    "IgnoreFoW": false,
    "MeasureMovement": false,
    "DragSelectable": true,
    "Autoraise": true,
    "Sticky": true,
    "Tooltip": true,
    "GridProjection": false,
    "HideWhenFaceDown": false,
    "Hands": false,
    "MaterialIndex": -1,
    "MeshIndex": -1,
    "CustomMesh": {
    "MeshURL": "https://steamusercontent-a.akamaihd.net/ugc/10161235644986836063/E9A65CD25256BFDB28AE4140FCB1D27BC71A5A8D/",
    "DiffuseURL": "https://steamusercontent-a.akamaihd.net/ugc/14112822235229092952/DC43688C9BA514D9439E41C007A5EB46674A1A64/",
    "NormalURL": "https://steamusercontent-a.akamaihd.net/ugc/15643083660343037921/D75480247FA058266F0D423501D867407458666D/",
    "ColliderURL": "",
    "Convex": true,
    "MaterialIndex": 0,
    "TypeIndex": 6,
    "CastShadows": true
    },
    "Bag": {
    "Order": 0
    },
    "LuaScript": "            function onLoad()\n                self.addContextMenuItem(\"Crack the Pack\", unloadAllCards)\n            end\n\n            function unloadAllCards(player_color, position, object)\n                local objects = self.getObjects()\n                local basePos = self.positionToWorld({0, 0.5, 0})\n                local yOffset = 0\n\n                for i, obj in ipairs(objects) do\n                    self.takeObject({\n                        guid = obj.guid,\n                        position = {basePos.x, basePos.y + yOffset, basePos.z},\n                        smooth = false,\n                        callback_function = function(takenObj)\n                            takenObj.setRotationSmooth({0, 180, 0})\n                        end\n                    })\n                    yOffset = yOffset + 0.2\n                end\n\n                Wait.time(checkEmptyAndDestroy, 0.1)\n            end\n\n            function onObjectLeaveContainer(container, leaving_object)\n                if container == self then\n                    Wait.time(checkEmptyAndDestroy, 0.2)\n                end\n            end\n\n            function checkEmptyAndDestroy()\n                if #self.getObjects() == 0 then\n                    self.destruct()\n                end\n            end\n        ",
    "LuaScriptState": "",
    "XmlUI": "",
    "ContainedObjects": []
}

const bigBoxSaveTemplate = {
  "SaveName": "",
  "Date": "",
  "VersionNumber": "",
  "GameMode": "",
  "GameType": "",
  "GameComplexity": "",
  "Tags": [],
  "Gravity": 0.5,
  "PlayArea": 0.5,
  "Table": "",
  "Sky": "",
  "Note": "",
  "TabStates": {},
  "LuaScript": "",
  "LuaScriptState": "",
  "XmlUI": "",
  "ObjectStates": [
    {
      "GUID": "",
      "Name": "Custom_Model_Bag",
      "Transform": {
        "posX": 0,
        "posY": 4,
        "posZ": 0,
        "rotX": 0,
        "rotY": 180.0,
        "rotZ": 0,
        "scaleX": 0.45,
        "scaleY": 0.45,
        "scaleZ": 0.45
      },
      "Nickname": "",
      "Description": "",
      "GMNotes": "",
      "AltLookAngle": {
        "x": 0.0,
        "y": 0.0,
        "z": 0.0
      },
      "ColorDiffuse": {
        "r": 1.0,
        "g": 1.0,
        "b": 1.0
      },
      "LayoutGroupSortIndex": 0,
      "Value": 0,
      "Locked": false,
      "Grid": true,
      "Snap": true,
      "IgnoreFoW": false,
      "MeasureMovement": false,
      "DragSelectable": true,
      "Autoraise": true,
      "Sticky": true,
      "Tooltip": true,
      "GridProjection": false,
      "HideWhenFaceDown": false,
      "Hands": false,
      "MaterialIndex": -1,
      "MeshIndex": -1,
      "CustomMesh": {
        "MeshURL": "https://steamusercontent-a.akamaihd.net/ugc/18342680365901557106/37339D4CCAF59C8665D9FDFE413F362362C3B3D3/",
        "DiffuseURL": "https://steamusercontent-a.akamaihd.net/ugc/11959105098238899912/208C3C0A2456A06B5001EF7CA0135DDB2ED4D621/",
        "NormalURL": "",
        "ColliderURL": "",
        "Convex": true,
        "MaterialIndex": 3,
        "TypeIndex": 6,
        "CustomShader": {
          "SpecularColor": {
            "r": 1.0,
            "g": 1.0,
            "b": 1.0
          },
          "SpecularIntensity": 0.0,
          "SpecularSharpness": 2.0,
          "FresnelStrength": 0.0
        },
        "CastShadows": true
      },
      "Bag": {
        "Order": 0
      },
      "LuaScript": "",
      "LuaScriptState": "",
      "XmlUI": "",
      "ContainedObjects": []
    }
  ]
}

const cardTemplate = {
    "GUID": "",
    "Name": "Card",
    "Transform": {
    "posX": 0,
    "posY": 3.0,
    "posZ": 0,
    "rotX": 0,
    "rotY": 180.0,
    "rotZ": 180.0,
    "scaleX": 1.0,
    "scaleY": 1.0,
    "scaleZ": 1.0
    },
    "Nickname": '',
    "Description": "",
    "GMNotes": '',
    "AltLookAngle": {
    "x": 0.0,
    "y": 0.0,
    "z": 0.0
    },
    "ColorDiffuse": {
    "r": 0.713235259,
    "g": 0.713235259,
    "b": 0.713235259
    },
    "Tags": [],
    "LayoutGroupSortIndex": 0,
    "Value": 0,
    "Locked": false,
    "Grid": true,
    "Snap": true,
    "IgnoreFoW": false,
    "MeasureMovement": false,
    "DragSelectable": true,
    "Autoraise": true,
    "Sticky": true,
    "Tooltip": true,
    "GridProjection": false,
    "HideWhenFaceDown": true,
    "Hands": true,
    "CardID": '',
    "SidewaysCard": false,
    "CustomDeck": {},
    "LuaScript": "",
    "LuaScriptState": "",
    "XmlUI": ""
}

const oversizeTemplate = {
    "GUID": "",
    "Name": "Card",
    "Transform": {
    "posX": 0,
    "posY": 3.0,
    "posZ": 0,
    "rotX": 0,
    "rotY": 180.0,
    "rotZ": 180.0,
    "scaleX": 1.75,
    "scaleY": 1.0,
    "scaleZ": 1.75
    },
    "Nickname": '',
    "Description": "",
    "GMNotes": '',
    "AltLookAngle": {
    "x": 0.0,
    "y": 0.0,
    "z": 0.0
    },
    "ColorDiffuse": {
    "r": 0.713235259,
    "g": 0.713235259,
    "b": 0.713235259
    },
    "Tags": [],
    "LayoutGroupSortIndex": 0,
    "Value": 0,
    "Locked": false,
    "Grid": true,
    "Snap": true,
    "IgnoreFoW": false,
    "MeasureMovement": false,
    "DragSelectable": true,
    "Autoraise": true,
    "Sticky": true,
    "Tooltip": true,
    "GridProjection": false,
    "HideWhenFaceDown": true,
    "Hands": true,
    "CardID": '',
    "SidewaysCard": false,
    "CustomDeck": {},
    "LuaScript": "",
    "LuaScriptState": "",
    "XmlUI": ""
}

const deckTemplate = {
    "GUID": "",
    "Name": "DeckCustom",
    "Transform": {
    "posX": 0,
    "posY": 2,
    "posZ": 0,
    "rotX": 0,
    "rotY": 180,
    "rotZ": 0,
    "scaleX": 1.0,
    "scaleY": 1.0,
    "scaleZ": 1.0
    },
    "Nickname": "",
    "Description": "",
    "GMNotes": "",
    "AltLookAngle": {
    "x": 0.0,
    "y": 0.0,
    "z": 0.0
    },
    "ColorDiffuse": {
    "r": 0.713235259,
    "g": 0.713235259,
    "b": 0.713235259
    },
    "Tags": [],
    "LayoutGroupSortIndex": 0,
    "Value": 0,
    "Locked": false,
    "Grid": true,
    "Snap": true,
    "IgnoreFoW": false,
    "MeasureMovement": false,
    "DragSelectable": true,
    "Autoraise": true,
    "Sticky": true,
    "Tooltip": true,
    "GridProjection": false,
    "HideWhenFaceDown": false,
    "Hands": false,
    "SidewaysCard": false,
    "DeckIDs": [],
    "LuaScript": "",
    "LuaScriptState": "",
    "XmlUI": "",
    "ContainedObjects": [],
}

const rulebookTemplate = {
    "GUID": "",
    "Name": "Custom_PDF",
    "Transform": {
    "posX": 0,
    "posY": 2,
    "posZ": 0,
    "rotX": 0,
    "rotY": 180,
    "rotZ": 0,
    "scaleX": 1.0,
    "scaleY": 1.0,
    "scaleZ": 1.0
    },
    "Nickname": "",
    "Description": "",
    "GMNotes": "",
    "AltLookAngle": {
    "x": 0.0,
    "y": 0.0,
    "z": 0.0
    },
    "ColorDiffuse": {
    "r": 1.0,
    "g": 1.0,
    "b": 1.0
    },
    "LayoutGroupSortIndex": 0,
    "Value": 0,
    "Locked": false,
    "Grid": true,
    "Snap": true,
    "IgnoreFoW": false,
    "MeasureMovement": false,
    "DragSelectable": true,
    "Autoraise": true,
    "Sticky": true,
    "Tooltip": true,
    "GridProjection": false,
    "HideWhenFaceDown": false,
    "Hands": false,
    "CustomPDF": {
    "PDFUrl": "https://steamusercontent-a.akamaihd.net/ugc/10817274396679929285/321C8CCC8080BCDBEA66CC75AD3AB5275B21B520/",
    "PDFPassword": "",
    "PDFPage": 0,
    "PDFPageOffset": 0
    },
    "LuaScript": "",
    "LuaScriptState": "",
    "XmlUI": ""
}

const customDecks = {
    'Azeroth': {
        229: {
            "FaceURL": "https://steamusercontent-a.akamaihd.net/ugc/13417990999640844537/2B2F15C1A26068AE074582FBF6021C5A41A5D089/",
            "BackURL": "https://steamusercontent-a.akamaihd.net/ugc/17632449275576979154/77FD399963BDEA67EAC0D22CEDCC626D2B85CBFA/",
            "NumWidth": 5,
            "NumHeight": 4,
            "BackIsHidden": false,
            "UniqueBack": true,
            "Type": 0
        },
        230: {
            "FaceURL": "https://steamusercontent-a.akamaihd.net/ugc/16030895108459434663/911557F5375084A6CE3F900F97CEEF7721C259AC/",
            "BackURL": "https://steamusercontent-a.akamaihd.net/ugc/17146053646204639674/6410FA3E438DBF040B3436F17A7DA7B2F97A86EF/",
            "NumWidth": 10,
            "NumHeight": 7,
            "BackIsHidden": false,
            "UniqueBack": false,
            "Type": 0
        },
        231: {
            "FaceURL": "https://steamusercontent-a.akamaihd.net/ugc/17284153877165841619/852498632816F9877887A26A2EA82386026E5FF4/",
            "BackURL": "https://steamusercontent-a.akamaihd.net/ugc/17146053646204639674/6410FA3E438DBF040B3436F17A7DA7B2F97A86EF/",
            "NumWidth": 10,
            "NumHeight": 7,
            "BackIsHidden": false,
            "UniqueBack": false,
            "Type": 0
        },
        232: {
            "FaceURL": "https://steamusercontent-a.akamaihd.net/ugc/15576550831512241522/24D2944FDAAEBF72E099FC368CD0F25E4B4862A8/",
            "BackURL": "https://steamusercontent-a.akamaihd.net/ugc/17146053646204639674/6410FA3E438DBF040B3436F17A7DA7B2F97A86EF/",
            "NumWidth": 10,
            "NumHeight": 7,
            "BackIsHidden": false,
            "UniqueBack": false,
            "Type": 0
        },
        233: {
            "FaceURL": "https://steamusercontent-a.akamaihd.net/ugc/10141918766255584244/F1038524BD80306C57EB2FCE0FCD6F1B340D1A5E/",
            "BackURL": "https://steamusercontent-a.akamaihd.net/ugc/17146053646204639674/6410FA3E438DBF040B3436F17A7DA7B2F97A86EF/",
            "NumWidth": 10,
            "NumHeight": 7,
            "BackIsHidden": false,
            "UniqueBack": false,
            "Type": 0
        },
        234: {
            "FaceURL": "https://steamusercontent-a.akamaihd.net/ugc/12956762013996720270/312C0B518F16125344D8576CCBCCDF9F35229E04/",
            "BackURL": "https://steamusercontent-a.akamaihd.net/ugc/17146053646204639674/6410FA3E438DBF040B3436F17A7DA7B2F97A86EF/",
            "NumWidth": 10,
            "NumHeight": 7,
            "BackIsHidden": false,
            "UniqueBack": false,
            "Type": 0
        }
    },
    'Azeroth Oversize': {
        235: {
            "FaceURL": "https://steamusercontent-a.akamaihd.net/ugc/14876611159502112538/FB10BF67D1D75F0BB2EA4314473030EDD797A642/",
            "BackURL": "https://steamusercontent-a.akamaihd.net/ugc/10170071975024849537/877F497E40B1F948E5B9BFBE4FA44BAFFD77E0FC/",
            "NumWidth": 5,
            "NumHeight": 4,
            "BackIsHidden": false,
            "UniqueBack": true,
            "Type": 0
        }
    }
};

const templates = {
    'Classic Booster': boosterSaveTemplate,
    'Starter Deck': bigBoxSaveTemplate,
}

const artIDsSteamCloud = {
    'AzerothBigBox': 'https://steamusercontent-a.akamaihd.net/ugc/11959105098238899912/208C3C0A2456A06B5001EF7CA0135DDB2ED4D621/',
    'AzerothBooster1': 'https://steamusercontent-a.akamaihd.net/ugc/14112822235229092952/DC43688C9BA514D9439E41C007A5EB46674A1A64/',
    'AzerothBooster2': 'https://steamusercontent-a.akamaihd.net/ugc/14195948671432938179/B233997DE63552F9B309B2CBCEB5C097A50F41CF/',
    'DarkPortalBigBox': 'https://steamusercontent-a.akamaihd.net/ugc/13830077253897791760/891829101809830E79273D79655934CEC6B451DA/',
    'DarkPortalBooster1': 'https://steamusercontent-a.akamaihd.net/ugc/14755963915318952112/3CED74014200F6BD66E478D0485AE6DB7187BD80/',
    'DarkPortalBooster2': 'https://steamusercontent-a.akamaihd.net/ugc/17774724210400209970/BAF78A3651B026D21E6E3410FEEB5CB73443F357/',      
}

const rulebooksSteamCloud = {
    'AzerothBigBox': 'https://steamusercontent-a.akamaihd.net/ugc/10817274396679929285/321C8CCC8080BCDBEA66CC75AD3AB5275B21B520/'
}

const exportedItems = [];

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

        console.log(templateCopy);

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
        console.log(`${cardData.set}`)
        tempCustomDeck[cardData.ttsCustomDeck] = customDecks[`${cardData.set}`][cardData.ttsCustomDeck];
        copy.CustomDeck = tempCustomDeck;
}