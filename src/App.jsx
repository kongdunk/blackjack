import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import { cardValues } from '../data/data'
import { motion } from "framer-motion"


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
  const [playerDrawCount, setPlayerDrawCount] = useState(0)
  const [bust, setBust] = useState(false)
  const [firstCardDrawn, setFirstcardDrawn] = useState(false)
  const [allDrawn, setAllDrawn] = useState([])
  const [stand, setStand] = useState(false)
  const [dealerStand, setDealerStand] = useState(false)
  const [gameEndMsg, setGameEndMsg] = useState("bruh")
  const [playerAce, setPlayerAce] = useState(false)
  const [dealerAce, setDealerAce] = useState(false)

  // calls API for a deck of shuffled cards
  const getDeckId = async() => {
    await axios.get(deckUrl)
      .then((response) => {
        setDeckID(response.data.deck_id);
      })
  };
  const getCards = async() => {
    await axios.get(drawCardsUrl)
      .then((response) => {
        setCards(response.data.cards)
        console.log(response.data)
      })
  }
  // setting game end message 
  useEffect(() => {
    if(playerValue > 21){
      setBust(true)
      setGameEndMsg("Player Bust")
    }
    if(dealerValue > 16){
      setDealerStand(true)
    }
    if((playerValue < 21) && (dealerValue < 21)){
      if(playerValue < dealerValue){
        setGameEndMsg("Dealer Wins")
      }
      if(dealerValue < playerValue){
        setGameEndMsg("Player Wins")
      }
      if(dealerValue === playerValue){
        setGameEndMsg("Tie")
      }
    }
  })
// draws 52 cards from the deck when deck id changes
  useEffect(() => {
    getCards()
  },[deckID])
  
// gets deck id
  useEffect(() => {
    getDeckId()
  },[])  
  useEffect(() => {
    const handlePlayerDraw = async () => {
      if(cardIndex > 0){
        setCardValue(setPlayerValue, playerCards, playerValue, setPlayerAce)
        setPlayerDrawCount(playerDrawCount + 1)
        console.log(playerDrawCount)
      }
      if(firstCardDrawn){
        setCardIndex(cardIndex+1)
        console.log('hi')
        getCard(setDealerCards)
        setFirstcardDrawn(false)

      }
  }
  handlePlayerDraw()
  },[playerCards])  

  useEffect(() => {
    if(dealerIndex > 0){
      setCardValue(setDealerValue, dealerCards, dealerValue, setDealerAce)
    }
    if(dealerValue > 16){
      setDealerStand(true)
    }
  },[dealerCards])   
  // function that sets hand value
  const setCardValue = (setHandValue, hand, handValue, setAce) => {
    if((hand === dealerCards) && (dealerIndex > 1)){
      console.log(cardIndex)
      console.log(playerDrawCount)
      if(hand[cardIndex-playerDrawCount-1].value === "ACE" && ((handValue + 11) > 21)){
        setHandValue(oldHandValue => oldHandValue + 1)
        setAce(true)
      } else if(hand[cardIndex-playerDrawCount-1].value === "ACE"){
        setHandValue(oldHandValue => oldHandValue + 11)  
      } else {
      setHandValue(oldHandValue => oldHandValue + cardValues[hand[cardIndex-playerDrawCount-1].value])
      }
    } else {
    if(hand === dealerCards){
      setHandValue(oldHandValue => oldHandValue + cardValues[hand[0].value])  
      console.log('hi')
    } else {
      console.log(cardIndex)
      console.log(hand)
    if(cardIndex < 2){
          if(hand[cardIndex-1].value === "ACE" && ((handValue + 11) > 21)){
      setHandValue(oldHandValue => oldHandValue + 1)  
    } else if(hand[cardIndex-1].value === "ACE"){
      setHandValue(oldHandValue => oldHandValue + 11)  
    } else {
    setHandValue(oldHandValue => oldHandValue + cardValues[hand[cardIndex-1].value])
    }
    } else {
          if(hand[cardIndex-2].value === "ACE" && ((handValue + 11) > 21)){
      setHandValue(oldHandValue => oldHandValue + 1)  
    } else if(hand[cardIndex-2].value === "ACE"){
      setHandValue(oldHandValue => oldHandValue + 11)  
    } else {
    setHandValue(oldHandValue => oldHandValue + cardValues[hand[cardIndex-2].value])
    }
    }

    }
    if(playerValue > 21){
      console.log("busted")
    }
    }
    console.log(dealerCards)
    console.log(playerCards)
    console.log(allDrawn)
  }

  const getCard = (setHand) => {
    console.log("index")
    console.log(cardIndex)
    if(dealerValue > 16){
      console.log('dealerbusted')
    } 
    setHand(oldArray => [...oldArray, (cards[cardIndex])])
    setAllDrawn(oldArray => [...oldArray, (cards[cardIndex])])
    if(setHand === setPlayerCards){
      setCardIndex(cardIndex + 1)
      if(cardIndex === 0){
        setFirstcardDrawn(true)
        console.log("first card drawn!")
      } 
    } else {
      setDealerIndex(dealerIndex + 1)
      if(dealerIndex > 0){
        setCardIndex(cardIndex + 1)
      }
    }
  }
  const playerStand = () => {
    if(dealerValue < 17){
      getCard(setDealerCards)
    } else{
      console.log('buss')
    }
    setStand(true)
  }
  const restartGame = () => {
    getDeckId()
  }
  return (
    <div>
      { bust &&
        <div> {gameEndMsg} </div>
      }
      { (!stand && !bust) &&
        <div>
          <button onClick={() => getCard(setPlayerCards) }> Hit </button>
          <button onClick={() => playerStand()}> Stand </button>
        </div>
      }
      { (stand && !dealerStand) && 
        <button onClick={() => playerStand()}> Dealer Hit </button>
      }
      {
        dealerStand && <div>
          dealer stand
        </div>
      }
      <div>
        { (playerValue > 0) && <div> {playerValue} </div>}
        <div className='cardsContainer'>
        {
          playerCards.map((e) => 
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.35 }}
            >
              <img className='card' src={e.image} alt="" srcset="" />
            </motion.div>
          )
        }
        </div>
        <div className='cardsContainer'>
        {
          dealerCards.map((e) => 
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.35 }}
            >
              <img className='card' src={e.image} alt="" srcset="" />
            </motion.div>
          )
        }
        </div>
      </div>
      <div>
        { (dealerValue > 0) && <div> {dealerValue} </div>}
      </div>
      <div>
        { (stand && (dealerValue > 16)) &&
          gameEndMsg
        }
      </div>
      <button id='playAgaianButton' onClick={() => 
        location.href = '/'
      }> play again </button>
    </div>
  )
}

export default App
