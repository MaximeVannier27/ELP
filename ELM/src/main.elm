module Main exposing (..)
import Json.Decode exposing (Decoder, map2, field, string)

type State
    = gotPackage (Result Http.Error String)
    | gotDef 

getPackage : () -> (State)
getPackage =
  Http.get
    { url = "https://api.dictionaryapi.dev/api/v2/entries/en/" ++ word
    , expect = Http.expectString gotPackage packageDecoder
    }

type alias Package = 
    { word : string
    , meanings : Meanings
    }

type alias Meanings =
    { partOfSpeech : string
    , definitions : Definitions
    }

type alias Definitions =
    { definition : string
    }


packageDecoder : Decoder Package
packageDecoder =
    map2 Package
        (field "word" string)
        (field "meanings" meaningsDecoder)

meaningsDecoder : Decoder Meanings
meaningsDecoder =
    map2 Meanings
        (field "partOfSpeech" string)
        (field "definitions" definitionsDecoder)

definitionsDecoder : Decoder Definitions
definitionsDecoder =
    field "definition" string



