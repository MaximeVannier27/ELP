module Main exposing (..)
import Json.Decode exposing (Decoder, map2, field, string)





-- Press a button to send a GET request for random quotes.
--
-- Read how it works:
--   https://guide.elm-lang.org/effects/json.html
--

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode exposing (Decoder, map4, field, int, string)



-- MAIN


main =
  Browser.element
    { init = init
    , update = update
    , subscriptions = subscriptions
    , view = view
    }



-- MODEL


type alias Model
  = { definition : Package
  , content : String
  , isChecked : Bool}



-- INIT


init : () -> (Model, Cmd Msg)
init _ =
  (Model "DEFINITION" "" False, Cmd.none)



-- UPDATE


type Msg
  = Change String
  | ToggleCheck


update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Change newContent ->
        ({model | content = newContent} , Cmd.none)
    ToggleCheck ->
        ({model | isChecked = not model.isChecked}, Cmd.none)


-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none



-- VIEW


view : Model -> Html Msg
view model =
  div []
    [ h1 [] [ text "Guess it !" ]
    , ul [] 
        [ li [] [ text "a l'aide"]]
        [ li [] [ text "je veux"]]
        [ li [] [ text "mourir"]]
        [ li [] [ text "tout de suite"]]
        
    , h3 [] [ text "Type in to guess" ]
    , div [] [ input [ placeholder "Your guess", value model.content, onInput Change ] [] ]
    , div[] [ label []
            [ input [ type_ "checkbox", onClick ToggleCheck ] []
            , text "Show it"
            ] ]
    ]

vERIF_MOT = "test"
dECOUVERTE_MOT = "test"

-- HTTP

type State
    = gotPackage (Result Http.Error Package)
    | gotDef 

getPackage : () -> (State)
getPackage =
  Http.get
    { url = "https://api.dictionaryapi.dev/api/v2/entries/en/" ++ word
    , expect = Http.expectString gotPackage mainDecoder
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








-- viewQuote : Model -> Html Msg
-- viewQuote model =
--   case model of
--     Failure ->
--       div []
--         [ text "I could not load a random quote for some reason. "
--         , button [ onClick MorePlease ] [ text "Try Again!" ]
--         ]

--     Loading ->
--       text "Loading..."

--     Success quote ->
--       div []
--         [ button [ onClick MorePlease, style "display" "block" ] [ text "More Please!" ]
--         , blockquote [] [ text quote.quote ]
--         , p [ style "text-align" "right" ]
--             [ text "— "
--             , cite [] [ text quote.source ]
--             , text (" by " ++ quote.author ++ " (" ++ String.fromInt quote.year ++ ")")
--             ]
--         ]



-- HTTP


-- getRandomQuote : Cmd Msg
-- getRandomQuote =
--   Http.get
--     { url = "https://elm-lang.org/api/random-quotes"
--     , expect = Http.expectJson GotQuote quoteDecoder
--     }


-- quoteDecoder : Decoder Quote
-- quoteDecoder =
--   map4 Quote
--     (field "quote" string)
--     (field "source" string)
--     (field "author" string)
--     (field "year" int)

