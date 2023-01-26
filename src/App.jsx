import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import axios from 'axios'

function App() {
  const [deckID, setDeckID] = useState("")
  const [playerHand, setPlayerHand] = useState([])
  const [dealerHand, setDealerHand] = useState([])
  const [playerHandValue, setPlayerHandValue] = useState(0)

  const deckUrl = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
  const drawCardUrl = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`
  // calls API for a deck of shuffled cards
  const getDeck = () => {
    axios.get(deckUrl)
      .then((response) => {
        setDeckID(response.data.deck_id);
      })
  }
  
  const changePlayerValue = () => {
    let total = 0;
    for (let i = 0; i < playerHand.length; i++) {
      console.log(playerHand[i][0].value)
      if(playerHand[i][0].value === "QUEEN" || playerHand[i][0].value === "JACK" || playerHand[i][0].value === "KING"){
        setPlayerHandValue(playerHandValue + 10)
      } else {
        setPlayerHandValue(playerHandValue + parseInt(playerHand[i][0].value))
        
      }
    }
  }
  // calls API to draw a card from the deck and adds the card to the playerHand Array
  const getPlayerCard = () => {
    axios.get(drawCardUrl)
      .then((response) => {
        setPlayerHand(oldArray => [...oldArray, response.data.cards]);
        console.log(playerHand)
      })
      changePlayerValue()
  }
  // drawing card for dealer hand
  const getDealerCard = () => {
    axios.get(drawCardUrl)
      .then((response) => {
        setDealerHand(oldArray => [...oldArray, response.data.cards]);
        console.log(playerHand)
      })
  }
  const startGame = () => {
    getPlayerCard()
    getDealerCard()
  }
  // After Player Hits Once
  if(playerHand.length > 0){
    return (
      <>
        <div>
          playerhand
        {
          playerHand.map((e) =>
            <div>{e[0].value} </div>
          )
        }
        playerhand value: {playerHandValue}
        { console.log("hello")}
        { console.log(playerHandValue)}
        </div>
        <div>
          dealer hand
        {
          dealerHand.map((e) =>
            <div>{e[0].value} </div>
          )
        }
        </div>

        <button onClick={() => getPlayerCard()}> Hit </button>
        <button onClick={() => getPlayerCard()}> Stand </button>
      </>
    )
  }
  // Initial Screen
  return (
    <>
      <div>
        <button onClick={() => getDeck()}> get deck </button>
        <button onClick={() => startGame()}> start game </button>
        <button onClick={() => getPlayerCard()}> Stand </button>    
      </div>
    </>
  )
}

export default App
