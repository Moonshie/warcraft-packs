const boosterTemplate = {
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
        "posX": 7.098098,
        "posY": 1.181499,
        "posZ": 12.5696115,
        "rotX": -4.54092685E-07,
        "rotY": 180.0,
        "rotZ": -3.96562871E-09,
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
      "LuaScript": "            function onLoad()\n                self.addContextMenuItem(\"Crack the Pack\", unloadAllCards)\n            end\n\n            function unloadAllCards(player_color, position, object)\n                local objects = self.getObjects()\n                local basePos = self.positionToWorld({0, 0.5, 0})\n                local yOffset = 0\n\n                for i, obj in ipairs(objects) do\n                    self.takeObject({\n                        guid = obj.guid,\n                        position = {basePos.x, basePos.y + yOffset, basePos.z},\n                        smooth = false,\n                        callback_function = function(takenObj)\n                            takenObj.setRotationSmooth({0, 180, 0})\n                        end\n                    })\n                    yOffset = yOffset + 0.2\n                end\n\n                Wait.time(checkEmptyAndDestroy, 0.5)\n            end\n\n            function onObjectLeaveContainer(container, leaving_object)\n                if container == self then\n                    Wait.time(checkEmptyAndDestroy, 0.2)\n                end\n            end\n\n            function checkEmptyAndDestroy()\n                if #self.getObjects() == 0 then\n                    self.destruct()\n                end\n            end\n        ",
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
            "posX": 7.019083,
            "posY": 1.404453,
            "posZ": 12.3405943,
            "rotX": 0.000113114773,
            "rotY": 180.0,
            "rotZ": 180.000076,
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
    }
};

console.log(boosterTemplate);
console.log(cardTemplate);
console.log(customDecks);

function exportTTS() {
    renderedItems.forEach(item => {
        let boosterCopy = Object.assign({}, boosterTemplate);
        boosterCopy.ObjectStates[0].Nickname = `${item.set} ${item.type}`;

        item.cardContents.forEach(cardData => {
            let cardCopy = {...cardTemplate};

            cardCopy.Nickname = cardData.name;
            cardCopy.GMNotes = String(cardData.setNumber).padStart(3, '0') + cardData.rarity.charAt(0);

            if (cardData.type === "Hero") {
                cardCopy.HideWhenFaceDown = false;
            } else {
                cardCopy.HideWhenFaceDown = true;
            }

            const tags = [];
            if (cardData.type) {
                tags.push(cardData.type);
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
            cardCopy.Tags = tags;

            cardCopy.CardID = cardData.ttsCardID;
            let tempCustomDeck = {};
            tempCustomDeck[cardData.ttsCustomDeck] = customDecks[`${cardData.set}`][cardData.ttsCustomDeck];
            cardCopy.CustomDeck = tempCustomDeck;

            boosterCopy.ObjectStates[0].ContainedObjects.push(cardCopy);
            console.log(boosterCopy);
        });
    let exportBooster = JSON.stringify(boosterCopy);

    var a = document.createElement("a")
    a.href = URL.createObjectURL(
        new Blob([exportBooster], {type:"application/json"})
    )
    a.download = `${boosterCopy.ObjectStates[0].Nickname}.json`
    a.click()

    boosterCopy.ObjectStates[0].ContainedObjects = [];
    });
}