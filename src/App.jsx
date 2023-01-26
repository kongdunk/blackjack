import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import axios from 'axios'

function App() {
  const [deckID, setDeckID] = useState("")
  const [playerHand, setPlayerHand] = useState([])
  const [houseHand, setHouseHand] = useState([])

  const deckUrl = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
  const drawCardUrl = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`

  // calls API for a deck of shuffled cards
  const getDeck = () => {
    axios.get(deckUrl)
      .then((response) => {
        setDeckID(response.data.deck_id);
      })
  }
  
  // calls API to draw a card from the deck and adds the card to the playerHand Array
  const getPlayerCard = () => {
    axios.get(drawCardUrl)
      .then((response) => {
        setPlayerHand(oldArray => [...oldArray, response.data.cards]);
        console.log(playerHand)
        console.log(playerHand[0][0].value)
      })
  }
  // After Player Hits Once
  if(playerHand.length > 0){
    return (
      <>
        {
          playerHand.map((e) =>
            <div>{e[0].value} </div>
          )
        }
        
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
        <button onClick={() => getPlayerCard()}> Hit </button>
        <button onClick={() => getPlayerCard()}> Stand </button>    
      </div>
    </>
  )
}

export default App
