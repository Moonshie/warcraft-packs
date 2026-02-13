//Empty variables


//Templates for Save Files, importable into TTS as saved objects
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

//Templates for objects to be filled with content, can be stored within other objects
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

//Templates access based on type of the item
const templates = {
    'Classic Booster': boosterSaveTemplate,
    'Class Booster': boosterSaveTemplate,
    'Faction Booster': boosterSaveTemplate,
    'Equipment Booster': boosterSaveTemplate,
    'Neutral Booster': boosterSaveTemplate,
    'Starter Deck': bigBoxSaveTemplate,
}

//Dict of all custom decks for cards
const customDecks = {
    'Azeroth': {
        1: {
            "FaceURL": "https://steamusercontent-a.akamaihd.net/ugc/13417990999640844537/2B2F15C1A26068AE074582FBF6021C5A41A5D089/",
            "BackURL": "https://steamusercontent-a.akamaihd.net/ugc/17632449275576979154/77FD399963BDEA67EAC0D22CEDCC626D2B85CBFA/",
            "NumWidth": 5,
            "NumHeight": 4,
            "BackIsHidden": false,
            "UniqueBack": true,
            "Type": 0
        },
        2: {
            "FaceURL": "https://steamusercontent-a.akamaihd.net/ugc/16030895108459434663/911557F5375084A6CE3F900F97CEEF7721C259AC/",
            "BackURL": "https://steamusercontent-a.akamaihd.net/ugc/17146053646204639674/6410FA3E438DBF040B3436F17A7DA7B2F97A86EF/",
            "NumWidth": 10,
            "NumHeight": 7,
            "BackIsHidden": false,
            "UniqueBack": false,
            "Type": 0
        },
        3: {
            "FaceURL": "https://steamusercontent-a.akamaihd.net/ugc/17284153877165841619/852498632816F9877887A26A2EA82386026E5FF4/",
            "BackURL": "https://steamusercontent-a.akamaihd.net/ugc/17146053646204639674/6410FA3E438DBF040B3436F17A7DA7B2F97A86EF/",
            "NumWidth": 10,
            "NumHeight": 7,
            "BackIsHidden": false,
            "UniqueBack": false,
            "Type": 0
        },
        4: {
            "FaceURL": "https://steamusercontent-a.akamaihd.net/ugc/15576550831512241522/24D2944FDAAEBF72E099FC368CD0F25E4B4862A8/",
            "BackURL": "https://steamusercontent-a.akamaihd.net/ugc/17146053646204639674/6410FA3E438DBF040B3436F17A7DA7B2F97A86EF/",
            "NumWidth": 10,
            "NumHeight": 7,
            "BackIsHidden": false,
            "UniqueBack": false,
            "Type": 0
        },
        5: {
            "FaceURL": "https://steamusercontent-a.akamaihd.net/ugc/10141918766255584244/F1038524BD80306C57EB2FCE0FCD6F1B340D1A5E/",
            "BackURL": "https://steamusercontent-a.akamaihd.net/ugc/17146053646204639674/6410FA3E438DBF040B3436F17A7DA7B2F97A86EF/",
            "NumWidth": 10,
            "NumHeight": 7,
            "BackIsHidden": false,
            "UniqueBack": false,
            "Type": 0
        },
        6: {
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
        7: {
            "FaceURL": "https://steamusercontent-a.akamaihd.net/ugc/14876611159502112538/FB10BF67D1D75F0BB2EA4314473030EDD797A642/",
            "BackURL": "https://steamusercontent-a.akamaihd.net/ugc/10170071975024849537/877F497E40B1F948E5B9BFBE4FA44BAFFD77E0FC/",
            "NumWidth": 5,
            "NumHeight": 4,
            "BackIsHidden": false,
            "UniqueBack": true,
            "Type": 0
        }
    },
    'DarkPortal': {
        8: {
            "FaceURL": "https://steamusercontent-a.akamaihd.net/ugc/14242462149872807802/F0F32348A5D5F70F1CD428FB26E4546BFA21418B/",
            "BackURL": "https://steamusercontent-a.akamaihd.net/ugc/9231936298222979685/ADCBFB991E96264609E0CD24DD4AC6BE155B911F/",
            "NumWidth": 5,
            "NumHeight": 4,
            "BackIsHidden": false,
            "UniqueBack": true,
            "Type": 0
        },
        9: {
            "FaceURL": "https://steamusercontent-a.akamaihd.net/ugc/17284044589253058834/D9C72B20B14C3B89AA723A2BF242C6A4CE057416/",
            "BackURL": "https://steamusercontent-a.akamaihd.net/ugc/17146053646204639674/6410FA3E438DBF040B3436F17A7DA7B2F97A86EF/",
            "NumWidth": 10,
            "NumHeight": 7,
            "BackIsHidden": false,
            "UniqueBack": false,
            "Type": 0
        },
        10: {
            "FaceURL": "https://steamusercontent-a.akamaihd.net/ugc/16390025322761471985/547B744FDD4C51F6148304EC4E9443747F134DEE/",
            "BackURL": "https://steamusercontent-a.akamaihd.net/ugc/17146053646204639674/6410FA3E438DBF040B3436F17A7DA7B2F97A86EF/",
            "NumWidth": 10,
            "NumHeight": 7,
            "BackIsHidden": false,
            "UniqueBack": false,
            "Type": 0
        },
        11: {
            "FaceURL": "https://steamusercontent-a.akamaihd.net/ugc/13339404461975753550/31E7D2F86D8FB59E55FF20B7F5497327D535C6AC/",
            "BackURL": "https://steamusercontent-a.akamaihd.net/ugc/17146053646204639674/6410FA3E438DBF040B3436F17A7DA7B2F97A86EF/",
            "NumWidth": 10,
            "NumHeight": 7,
            "BackIsHidden": false,
            "UniqueBack": false,
            "Type": 0
        },
        12: {
            "FaceURL": "https://steamusercontent-a.akamaihd.net/ugc/13891976965441406771/BF521CDBC36E0E24D148CD3087B0E31F84B52D0D/",
            "BackURL": "https://steamusercontent-a.akamaihd.net/ugc/17146053646204639674/6410FA3E438DBF040B3436F17A7DA7B2F97A86EF/",
            "NumWidth": 10,
            "NumHeight": 7,
            "BackIsHidden": false,
            "UniqueBack": false,
            "Type": 0
        },
        13: {
            "FaceURL": "https://steamusercontent-a.akamaihd.net/ugc/11971870181017252475/616CA38765B83BE8FD20D4F7108B9B76BEB67EB4/",
            "BackURL": "https://steamusercontent-a.akamaihd.net/ugc/17146053646204639674/6410FA3E438DBF040B3436F17A7DA7B2F97A86EF/",
            "NumWidth": 10,
            "NumHeight": 7,
            "BackIsHidden": false,
            "UniqueBack": false,
            "Type": 0
        }
    },
    'DarkPortal Oversize': {
        14: {
            "FaceURL": "https://steamusercontent-a.akamaihd.net/ugc/15808913951021144665/3968BA838980BB8090901A60ACD57F6B26CCB169/",
            "BackURL": "https://steamusercontent-a.akamaihd.net/ugc/12572555518116899653/10DC64805DE0C71CCDEABC608DFEADC5DD1A3C2A/",
            "NumWidth": 5,
            "NumHeight": 4,
            "BackIsHidden": false,
            "UniqueBack": true,
            "Type": 0
        }
    }
};

//Steam cloud addresses of used artworks and pdfs
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