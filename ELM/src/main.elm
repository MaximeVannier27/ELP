module Main exposing (..)

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
  = { definition : String
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
  --  , AFFICHER_DEF model
    , h3 [] [ text "Type in to guess" ]
    , div [] [ input [ placeholder "Your guess", value model.content, onInput Change ] [] ]
    , div[] [ label []
            [ input [ type_ "checkbox", onClick ToggleCheck ] []
            , text "Show it"
            ] ]
    ]

vERIF_MOT = "test"
dECOUVERTE_MOT = "test"







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