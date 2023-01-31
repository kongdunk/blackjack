import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import { cardValues } from '../data/data'

function App() {
  // API stuff
  const [deckID, setDeckID] = useState("")
  const deckUrl = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
  const drawCardUrl = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`
  const drawCardsUrl = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=52`
  // card values
  const [playerValue, setPlayerValue] = useState(0)
  const [dealerValue, setDealerValue] = useState(0)
  // card hands
  const [cards, setCards] = useState()
  const [cardIndex, setCardIndex] = useState(0)
  const [dealerIndex, setDealerIndex] = useState(0)
  const [playerCards, setPlayerCards] = useState([])
  const [dealerCards, setDealerCards] = useState([])
  const [bust, setBust] = useState(false)
  const [firstCardDrawn, setFirstcardDrawn] = useState(false)

  // calls API for a deck of shuffled cards
  const getDeck = () => {
    axios.get(deckUrl)
      .then((response) => {
        setDeckID(response.data.deck_id);
      })
  };
  const getCards = () => {
    axios.get(drawCardsUrl)
      .then((response) => {
        setCards(response.data.cards)
        console.log(response.data)
      })
  }
  useEffect(() => {
    getDeck()
  },[])
  useEffect(() => {
    getCards()
  },[deckID])
  useEffect(() => {
    if(cardIndex > 0){
      setCardValue(setPlayerValue, playerCards, playerValue)
      console.log(playerCards[cardIndex-1].value)
    }
    if(cardIndex === 0){
      getDeck()
    }
    if(firstCardDrawn){
      getCard(setDealerCards)
      console.log("carddrawn")
      setFirstcardDrawn(false)
    }
  },[playerCards])  

  useEffect(() => {
    if(dealerIndex > 0){
      setCardValue(setDealerValue, dealerCards, playerValue)
    }
    
    console.log(dealerCards)
    console.log(playerCards)
  },[dealerCards])   
  //seting hand value
  const setCardValue = (setHandValue, hand, handValue) => {
    if(hand[cardIndex-1].value === "ACE" && ((handValue + 11) > 21)){
      setHandValue(oldHandValue => oldHandValue + 1)  
    } else if(hand[cardIndex-1].value === "ACE"){
      setHandValue(oldHandValue => oldHandValue + 11)  
    } else {
    setHandValue(oldHandValue => oldHandValue + cardValues[hand[cardIndex-1].value])
    }
    if(playerValue > 21){
      console.log("busted")
    }
  }

  const getCard = (setHand) => {
    setHand(oldArray => [...oldArray, (cards[cardIndex])])
    if(setHand === setPlayerCards){
      setCardIndex(cardIndex + 1)
      if(cardIndex === 0){
        setFirstcardDrawn(true)
      }
    } else {
      setDealerIndex(dealerIndex + 1)
    }
  }
  const playerStand = () => {
    if(dealerValue < 17){
      getCard(setDealerCards)
    } else{
      console.log('yo mama')
    }
  }
  return (
    <div>
      <button onClick={() => getCard(setPlayerCards) }> Hit </button>
      <button onClick={() => playerStand()}> stand </button>
      <div>
        {playerValue}
      </div>
      <div>
        {dealerValue}
      </div>
    </div>
  )
}

export default App
