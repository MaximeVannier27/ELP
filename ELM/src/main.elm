module Main exposing (..)






-- Press a button to send a GET request for random quotes.
--
-- Read how it works:
--   https://guide.elm-lang.org/effects/json.html
--

import Browser
import Html exposing (Html, div, h1, ul, li, text, input, label, h2, h3)
import Html.Attributes exposing (value, type_, placeholder)
import Html.Events exposing (..)
import Http
import Json.Decode exposing (Decoder, map2, field, string, at, list, map)



-- MAIN


main =
  Browser.element
    { init = init
    , update = update
    , subscriptions = subscriptions
    , view = view
    }



-- MODEL


type Model
  = Loading
  | Succes ModelType
  | Failure Http.Error

type alias ModelType 
  = { definition : Package
  , content : String
  , isChecked : Bool}


-- INIT


init : () -> (Model, Cmd Msg)
init _ =
  (Loading, getPackage)



-- UPDATE


type Msg
  = GotPackage (Result Http.Error Package)
  | Change String
  | ToggleCheck


update : Msg -> Model -> (Model, Cmd Msg) 
update msg model =
  case msg of
    GotPackage result ->
      case result of
        Ok package ->
          (Succes  (ModelType package "" False), Cmd.none)
        Err code -> (Failure code, Cmd.none)
    Change newContent ->
        case model of
            Succes modeltype ->
                (Succes {modeltype | content = newContent} , Cmd.none)
            Loading -> (Loading, Cmd.none)
            Failure code -> (Failure code, Cmd.none)
    ToggleCheck ->
        case model of
            Succes modeltype ->
                (Succes {modeltype | isChecked = not modeltype.isChecked}, Cmd.none)
            Loading -> (Loading, Cmd.none)
            Failure code -> (Failure code, Cmd.none)


-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none



-- VIEW


view : Model -> Html Msg
view model =
  case model of 
    Succes modeltype ->
      div []
        [ h1 [] [ text "Guess it !" ]
        , ul [] 
          [ li [] [ text "a l'aide"]
          , li [] [ text "je veux"]
          , li [] [ text "mourir"]
          , li [] [ text "tout de suite"]
          ]
            
        , h3 [] [ text "Type in to guess" ]
        , div [] [ input [ placeholder "Your guess", value modeltype.content, onInput Change ] [] ]
        , div[] [ label []
          [ input [ type_ "checkbox", onClick ToggleCheck ] []
          , text "Show it"
          ] 
          ]
        ]
    Loading -> text "Loading..."
    Failure code -> text (errorToString code)


vERIF_MOT = "test"
dECOUVERTE_MOT = "test"

-- HTTP



getPackage : Cmd Msg
getPackage =
  Http.get
    { url = "https://api.dictionaryapi.dev/api/v2/entries/en/" ++ "word"
    , expect = Http.expectJson GotPackage mainDecoder
    }

type alias Package = 
    { word : String
    , meanings : List Meanings
    }

type alias Meanings =
    { partOfSpeech : String
    , definitions : List Definitions
    }

type alias Definitions =
    { definition : String
    }

mainDecoder = at["0"](packageDecoder)

packageDecoder : Decoder Package
packageDecoder =
    map2 Package
        (field "word" string)
        (field "meanings" (list meaningsDecoder))

meaningsDecoder : Decoder Meanings
meaningsDecoder =
    map2 Meanings
        (field "partOfSpeech" string)
        (field "definitions" (list definitionsDecoder))

definitionsDecoder : Decoder Definitions
definitionsDecoder =
    map Definitions
        (field "definition" string)


-- Error

errorToString : Http.Error -> String
errorToString error =
    case error of
        Http.BadUrl url ->
            "The URL " ++ url ++ " was invalid"
        Http.Timeout ->
            "Unable to reach the server, try again"
        Http.NetworkError ->
            "Unable to reach the server, check your network connection"
        Http.BadStatus 500 ->
            "The server had a problem, try again later"
        Http.BadStatus 400 ->
            "Verify your information and try again"
        Http.BadStatus x ->
            "Unknown error with status " ++ (String.fromInt x)
        Http.BadBody errorMessage ->
            errorMessage







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

