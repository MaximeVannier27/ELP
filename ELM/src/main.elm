module Main exposing (..)
import Json.Decode exposing (Decoder, map2, field, string)

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

packageDecoder =
    map2 Package
        (field "word" string)
        (field "meanings" meaningsDecoder)

meaningsDecoder =
    map2 Meanings
        (field "partOfSpeech" string)
        (field "definitions" definitionsDecoder)

definitionsDecoder =
    field "definition" string

