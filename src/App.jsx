import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import axios from 'axios'

function App() {
  const [deckID, setDeckID] = useState("")
  const deckUrl = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
  const initialDrawCardUrl = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=4`
  const drawCardUrl = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`
  const [initialCards, setInitialCards] = useState([])
  const [playerValue, setPlayerValue] = useState(0)
  const [dealerValue, setDealerValue] = useState(0)
  const [dealerCardOne, setDealerCardOne] = useState("");
  const [dealerCardTwo, setDealerCardTwo] = useState(""); 
  const [playerCardOne, setPlayerCardOne] = useState("");
  const [playerCardTwo, setPlayerCardTwo] = useState(""); 
  const [showDealer, setShowDealer] = useState(false)
  const [playerHitCount, setplayerHitCount] = useState(0)

  const [dealerHitHand, setDealerHitHand] = useState([])


  const cardValues = {
    'ACE': 1,
    'JACK': 10,
    'QUEEN': 10,
    'KING': 10,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10
  }

  // calls API for a deck of shuffled cards
  const getDeck = () => {
    axios.get(deckUrl)
      .then((response) => {
        setDeckID(response.data.deck_id);
      })
  };

  const startGame = () => {
    axios.get(initialDrawCardUrl)
      .then((response) => {
        console.log(response.data.cards)
        setInitialCards(response.data.cards)
        setDealerCardOne(response.data.cards[0].value)
        setDealerCardTwo(response.data.cards[1].value)
        setPlayerCardOne(response.data.cards[2].value)
        setPlayerCardTwo(response.data.cards[3].value)
        //setPlayerHand(cardValues[playerCardTwo] + cardValues[playerCardOne])
      })
  };
  const playerHit = () => {
    axios.get(drawCardUrl)
      .then((response) => {
        console.log(response.data.cards)
        setInitialCards(oldArray => [...oldArray, response.data.cards[0]])
        ///cards[initialCards.length]
      })
  }
  const dealerHit = () => {
    axios.get(drawCardUrl)
      .then((response) => {
        console.log(response.data.cards)
        setDealerHitHand(oldArray => [...oldArray, response.data.cards[0]])
        setDealerValue(cardValues[dealerCardOne] + cardValues[dealerCardTwo] + parseInt(response.data.cards[0].value))
        ///cards[initialCards.length]
      })
  }
  const dealerAfterStand = () => {
    if((dealerCardOne==='ACE' || dealerCardTwo==='ACE')){
      if((cardValues[dealerCardOne] + cardValues[dealerCardTwo]) < 12){
        setDealerValue(cardValues[dealerCardOne] + cardValues[dealerCardTwo] + 10)
        if(dealerValue < 17){
          dealerHit()
        }
      }
    } else {
      // check if dealer hand is greater than 16
      if((cardValues[dealerCardOne] + cardValues[dealerCardTwo]) > 16){
        setDealerValue(cardValues[dealerCardOne] + cardValues[dealerCardTwo])
      } else{
        dealerHit()
      }
      /*
      let total = 0
      console.log(initialCards.length - 2)
      for (let index = 0; index < initialCards.length; index++) {
        total = total + cardValues[initialCards[index].value];
      }
      setPlayerValue(total)
       */
    }
  }

  const playerStand = () => {
    if((playerCardOne==='ACE' || playerCardTwo==='ACE')){
      if((cardValues[playerCardOne] + cardValues[playerCardTwo]) < 12){
        setPlayerValue(cardValues[playerCardOne] + cardValues[playerCardTwo] + 10)
      }
    } else {
      let total = 0
      for (let index = 2; index < initialCards.length; index++) {
        total = total + cardValues[initialCards[index].value];
      }
      setPlayerValue(total)
    }
    setShowDealer(true)
    dealerAfterStand()
    
  }
  getDeck()
  return (
    <div>
      <div>
        <button onClick={() => startGame()}> start game </button>
        Dealerhand {dealerValue}
        <div className='cardHand'>
        {
          showDealer&&<div> 
            
          </div>
        }
        {
          dealerHitHand.map((e,index) => 
            <div key={e.code}> 
              <img src={e.image} alt="" srcSet="" />
            </div>
          )
        }
        {
          initialCards.map((e,index) => 
            (index < 2) &&<div key={e.code}> 
              <img src={e.image} alt="" srcSet="" />
            </div>
          )
        }
        </div>
        Playerhand
        <div className='cardHand'>
        {
          initialCards.map((e,index) => 
            (index > 1)&&<div key={e.code}> 
              <img src={e.image} alt="" srcSet="" />
            </div>
          )
        }
        </div>
      </div>
      <button onClick={() => playerHit()}> hit </button>
      <button onClick={() => playerStand()}> stand </button>
      
    </div>
  )
}

export default App
