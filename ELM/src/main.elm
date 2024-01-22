module Main exposing (..)
import Json.Decode exposing (Decoder, map2, field, string)

type State
    = gotPackage (Result Http.Error Package)
    | gotDef 

getPackage : () -> (State)
getPackage =
  Http.get
    { url = "https://api.dictionaryapi.dev/api/v2/entries/en/" ++ word
    , expect = Http.expectString gotPackage packageDecoder
    }

type alias Package = 
    { word : string
    , meanings : List Meanings
    }

type alias Meanings =
    { partOfSpeech : string
    , definitions : List Definitions
    }

type alias Definitions =
    { definition : string
    }

mainDecoder = at["0"](packageDecoder)

packageDecoder : Decoder Package
packageDecoder =
    map2 Package
        (field "word" string)
        (field "meanings" (List meaningsDecoder))

meaningsDecoder : Decoder Meanings
meaningsDecoder =
    map2 Meanings
        (field "partOfSpeech" string)
        (field "definitions" (List definitionsDecoder))

definitionsDecoder : Decoder Definitions
definitionsDecoder =
    field "definition" string



