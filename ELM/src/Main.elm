module Main exposing (..)






-- Press a button to send a GET request for random quotes.
--
-- Read how it works:
--   https://guide.elm-lang.org/effects/json.html
--

import Browser
import Html exposing (Html, div, h1, ol, ul, li, text, input, label, h2, h3)
import Html.Attributes exposing (value, type_, placeholder, style)
import Html.Events exposing (..)
import Http
import Json.Decode exposing (Decoder, map2, field, string, at, list, map)
import Random




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
  | Loadingword String
  | Succes ModelType
  | Failure Http.Error String

type alias ModelType 
  = { definition : Package
  , content : String
  , isChecked : Bool}


-- INIT


init : () -> (Model, Cmd Msg)
init _ =
  (Loading, getAllWord)



-- UPDATE


type Msg
  = GotRandom Int 
  | GotWords (Result Http.Error String)
  | GotPackage (Result Http.Error Package)
  | Change String
  | ToggleCheck


update : Msg -> Model -> (Model, Cmd Msg) 
update msg model =
  case msg of
    GotWords result ->
      case result of 
        Ok words ->
          (Loadingword words, Random.generate GotRandom (Random.int 1 1000))
        Err code -> (Failure code "1", Cmd.none)
    GotRandom number ->
        case model of 
          Loadingword words ->
            (Loading, getPackage(getElementAtIndex number (String.split " " words)))
          _ -> (Loading, Cmd.none)
    GotPackage result ->
      case result of
        Ok package ->
          (Succes  (ModelType package "" False), Cmd.none)
        Err code -> (Failure code "2", Cmd.none)
    Change newContent ->
        case model of
            Succes modeltype ->
                (Succes {modeltype | content = newContent} , Cmd.none)
            Loading -> (Loading, Cmd.none)
            Loadingword words -> (Loadingword words, Cmd.none)
            Failure code id -> (Failure code id, Cmd.none)
    ToggleCheck ->
        case model of
            Succes modeltype ->
                (Succes {modeltype | isChecked = not modeltype.isChecked}, Cmd.none)
            Loading -> (Loading, Cmd.none)
            Loadingword words -> (Loadingword words, Cmd.none)
            Failure code id -> (Failure code id, Cmd.none)


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
            [ h1 [] [ text (if modeltype.isChecked then modeltype.definition.word else "Guess it!") ]
            , printPackage modeltype.definition   
            , div [] [ text (if modeltype.content == modeltype.definition.word then "BIEN JOUE OUI OUI OUI" else "Type your guess here !") ]
            , div [] [ input [ placeholder "Your guess", value modeltype.content, onInput Change ] [] ]
            , div[] [ label []
                    [ input [ type_ "checkbox", onClick ToggleCheck ] []
                    , text "Show it"
                    ] ]
            ]
    Loading -> text "Loading..."
    Loadingword words -> text "Loading..."
    Failure code id -> text (errorToString code id)

printPackage : Package -> Html Msg
printPackage {word, meanings} = div [] [ ul [] (printMeanings meanings)]

printMeanings : List Meanings -> List (Html Msg) 
printMeanings liste =
  case liste of
    [] -> [text ""]
    (x::xs) ->  li [style "Font" "bold"] (text (x.partOfSpeech) :: [ol [] (printDef x.definitions)]) :: printMeanings xs

printDef : List Definitions -> List (Html Msg)
printDef liste =
  case liste of
    [] -> [text ""]
    (x::xs) -> li [style "Font" "italic"] [text (x.definition)] :: printDef xs



-- HTTP

getAllWord : Cmd Msg
getAllWord = 
  Http.get
    { url = "https://raw.githubusercontent.com/MaximeVannier27/ELP/main/ELM/static/mots.txt"
    , expect = Http.expectString GotWords}

getPackage : String -> Cmd Msg
getPackage word =
  Http.get
    { url = "https://api.dictionaryapi.dev/api/v2/entries/en/" ++ word
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

getElementAtIndex : Int -> List String -> String 
getElementAtIndex index liste =
  Maybe.withDefault "" (List.drop index liste |> List.head)





-- Error

errorToString : Http.Error -> String -> String
errorToString error id =
    case error of
        Http.BadUrl url ->
            "The URL " ++ url ++ " was invalid" ++ id
        Http.Timeout ->
            "Unable to reach the server, try again" ++ id
        Http.NetworkError ->
            "Unable to reach the server, check your network connection" ++ id
        Http.BadStatus 500 ->
            "The server had a problem, try again later" ++ id
        Http.BadStatus 400 ->
            "Verify your information and try again" ++ id
        Http.BadStatus x ->
            "Unknown error with status " ++ (String.fromInt x) ++ id
        Http.BadBody errorMessage ->
            errorMessage ++ id







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

