import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import axios from 'axios'

function App() {
  const [deckID, setDeckID] = useState("")
  const [playerHand, setPlayerHand] = useState([])
  const [dealerHand, setDealerHand] = useState([])
  const [dealerHandValue, setDealerHandValue] = useState(0)
  const [dealerFirstCard, setDealerFirstCard] = useState("")
  const [playerHandValue, setPlayerHandValue] = useState(0)
  const [playerStand, setPlayerStand] = useState(false)
  const [turn, setTurn] = useState(0)
  const [dealerHandHit, setDealerHandHit] = useState(false)
  const deckUrl = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
  const drawCardUrl = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`

//{dealerHand[0][0].value}

  // calls API for a deck of shuffled cards
  const getDeck = () => {
    axios.get(deckUrl)
      .then((response) => {
        setDeckID(response.data.deck_id);
      })
  }

  // changes player hand value
  /*
  const changePlayerValue = () => {
    for (let i = 0; i < playerHand.length; i++) {
      if(playerHand[i][0].value === "QUEEN" || playerHand[i][0].value === "JACK" || playerHand[i][0].value === "KING"){
        setPlayerHandValue(playerHandValue + 10)
        return playerHandValue
      } else if(playerHand[i][0].value === "ACE") {
        setPlayerHandValue(playerHandValue + 1)
      } else {
        setPlayerHandValue(playerHandValue + parseInt(playerHand[i][0].value))
        return playerHandValue
      }
    }
  }
  */
  // calls API to draw a card from the deck and adds the card to the playerHand Array

  const playerHandValueUpdate = (response) => {
    if(response.data.cards[0].value === "JACK" || response.data.cards[0].value === "QUEEN" || response.data.cards[0].value === "KING"){
      return 10;
    } else if(response.data.cards[0].value === "ACE"){
      return 11;
    }
    return parseInt(response.data.cards[0].value);
  }
  const getPlayerCard = () => {
    
    axios.get(drawCardUrl)
      .then((response) => {
        setPlayerHand(oldArray => [...oldArray, response.data.cards]);
        console.log(response.data)
        setPlayerHandValue(playerHandValue + playerHandValueUpdate(response))
      })
      setTurn(turn+1)
    }


  

  // drawing card for dealer hand
  const getDealerCard = () => {
    axios.get(drawCardUrl)
      .then((response) => {
        setDealerHand(oldArray => [...oldArray, response.data.cards]);
        setDealerFirstCard(response.data.cards[0].value)
      })
    setDealerHandHit(true)
  }
  const setFirstHand = (card) => {
    setDealerFirstCard(card)
  }
  const startGame = () => {
    setTurn(turn+1)
    getPlayerCard()
    getDealerCard()
    getDealerCard()
  }
  if(playerStand){
    return (
      <>
        <div>
          playerhand
        {
          playerHand.map((e, index) =>
            <div>{e[0].value} </div>
          )
        }
        playerhand value: {playerHandValue}
        
        </div>
        <div>
          dealer hand
        </div>
        {
          dealerHand.map((e, index) =>
            <div>{e[0].value} </div>
          )
        }
      </>
    )
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
        Your hand value: {playerHandValue}
        <br/>
        turn: {turn}
        </div>
        <div>
          dealer hand
        firstcard
        {dealerFirstCard}
        </div>

        <button onClick={() => getPlayerCard()}> Hit </button>
        <button onClick={() => setPlayerStand(true)}> Stand </button>
      </>
    )
  }
  // Initial Screen
  return (
    <>
      <div>
        <button onClick={() => getDeck()}> get deck </button>
        <button onClick={() => startGame()}> start game </button>
      </div>
    </>
  )
}

export default App
