import "./Body.css";
import React from "react";

function Body() {
  const [dealerSum, setDealerSum] = React.useState(0);
  const [yourSum, setYourSum] = React.useState(0);
  var dealerAceCount = React.useRef(0);
  var yourAceCount = React.useRef(0);
  const [dealerCards, setDealerCards] = React.useState([]);
  const [yourCards, setYourCards] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [winCount, setWinCount] = React.useState(0);
  const [loseCount, setLoseCount] = React.useState(0);
  const [winrate, setWinrate] = React.useState("0%");
  var deck = React.useRef(shuffleDeck(buildDeck()));
  var canHit = React.useRef(true);
  var canStay = React.useRef(true);
  const [stayFlag, setStayFlag] = React.useState(false);
  const [gameDone, setGameDone] = React.useState(false);


  React.useEffect(() => {
    startGame(deck);
  }, []);

  React.useEffect(() => {
    if (winCount + loseCount > 0) {
      setWinrate(
        String(
          Math.round((10000 * winCount) / (winCount + loseCount)) / 100
        ).concat("%")
      );
    }
  }, [winCount, loseCount]);

  React.useEffect(() => {
    if (dealerSum < 17 && stayFlag === true) { 
      setTimeout(() => {
        let tempDealerSum = dealerSum;
        let card = deck.current.pop();
        tempDealerSum = tempDealerSum + getValue(card);
        dealerAceCount.current += checkAce(card);
        const path = "./cards/" + card + ".png";
        let tempDealerCards = [{ src: path }];
        tempDealerSum = reduceDealerAce(
         tempDealerSum); 
        setDealerCards([...dealerCards, ...tempDealerCards]);
        setDealerSum(tempDealerSum);
      }, 1000);
    } else if (stayFlag === true) {
      setStayFlag(false);
      endgame(yourSum, dealerSum);
    }
  }, [dealerSum, stayFlag]);

  React.useEffect(() => {
    if (yourSum > 21) {
      endgame(yourSum, dealerSum);
    }
    
  }, [yourSum]);

  React.useEffect(() => {
    if (dealerSum === 21) {
      endgame(yourSum, dealerSum);
    }
  }, [dealerSum]);


  function restart() {
    dealerAceCount.current = 0;
    yourAceCount.current = 0;
    setDealerSum(0);
    setYourSum(0);
    setMessage("");
    canHit.current = true;
    canStay.current = true;
    setGameDone(false);
    deck.current = shuffleDeck(buildDeck());
    startGame(deck);
  }

  function buildDeck() {
    let values = [
      "A",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
    ];
    let types = ["C", "D", "H", "S"];
    var tempDeck = [];

    for (let i = 0; i < types.length; i++) {
      for (let j = 0; j < values.length; j++) {
        tempDeck.push(values[j] + "-" + types[i]);
      }
    }
    return tempDeck;
  }

  function shuffleDeck(tempDeck) {
    for (let i = 0; i < tempDeck.length; i++) {
      let j = Math.floor(Math.random() * tempDeck.length);
      let temp = tempDeck[i];
      tempDeck[i] = tempDeck[j];
      tempDeck[j] = temp;
    }
    return tempDeck;
  }

  function startGame(deck) {

    let tempDealerCards = [];
    let tempDealerSum = 0;
    for (let i = 0; i < 2; i++) {
      let card = deck.current.pop();
      const path = "./cards/" + card + ".png";
      tempDealerCards.push({ src: path });
      tempDealerSum = tempDealerSum + getValue(card);
      dealerAceCount.current += checkAce(card);
    }

    let tempYourCards = [];
    let tempYourSum = 0;
    for (let i = 0; i < 2; i++) {
      let card = deck.current.pop();
      const path = "./cards/" + card + ".png";
      tempYourCards.push({ src: path });
      tempYourSum = tempYourSum + getValue(card);
      yourAceCount.current += checkAce(card);
    }

    tempDealerSum = reduceDealerAce(
      tempDealerSum
    );

    tempYourSum = reduceYourAce(
      tempYourSum
    );

    setYourSum(tempYourSum);
    setDealerSum(tempDealerSum);
    setDealerCards([...tempDealerCards]);
    setYourCards([...tempYourCards]);
  }

  function hit() {
    if (!canHit.current) {
      return;
    }
    let card = deck.current.pop();
    let tempYourSum = yourSum; 
    tempYourSum = tempYourSum + getValue(card);
    yourAceCount.current += checkAce(card);
    const path = "./cards/" + card + ".png";
    setYourCards([...yourCards, { src: path }]);
    tempYourSum = reduceYourAce(tempYourSum);
    setYourSum(tempYourSum);
  }

  function win() {
    setWinCount((prevValue)=>prevValue + 1);
  }

  function lose() {
    setLoseCount((prevValue)=>prevValue + 1);
  }

  function stay() {
    if (!canStay.current) {
      return;
    }

    canHit.current = false;
    canStay.current = false;
    setStayFlag(true);
    /*
    let tempDealerSum = dealerSum;
    tempDealerSum = reduceDealerAce(
      tempDealerSum
    );

    let tempDealerCards = [];
    while (tempDealerSum < 17) {
      let card = deck.current.pop();
      tempDealerSum = tempDealerSum + getValue(card);
      dealerAceCount.current += checkAce(card);
      const path = "./cards/" + card + ".png";
      tempDealerCards.push({ src: path });
      tempDealerSum = reduceDealerAce(
        tempDealerSum
      );
    }
    */
  }

  function endgame(yourSum, dealerSum) {

    canHit.current = false;
    canStay.current = false;
    setGameDone(true);

    if (yourSum > 21) {
      setMessage("You Lose!");
      lose();
    } else if (dealerSum > 21) {
      setMessage("You win!");
      win();
    } else if (yourSum > dealerSum) {
      setMessage("You Win!");
      win();
    } else {
      setMessage("You Lose!");
      lose();
    }
  }

  function getValue(card) {
    let data = card.split("-");
    let value = data[0];

    if (isNaN(value)) {
      //A J Q K
      if (value === "A") {
        return 11;
      }
      return 10;
    }
    return parseInt(value);
  }

  function checkAce(card) {
    if (card[0] === "A") {
      return 1;
    }
    return 0;
  }

  function reduceYourAce(yourSum) {
    while (yourSum > 21 && yourAceCount.current > 0) {
      yourSum -= 10;
      yourAceCount.current -= 1;
    }
    return yourSum;
  }

  function reduceDealerAce(dealerSum) {
    while (dealerSum > 21 && dealerAceCount.current > 0) {
      dealerSum -= 10;
      dealerAceCount.current -= 1;
    }
    return dealerSum;
  }

  return (
    <div>
      <div className="heading">
        <h3>
          Wins: <span id="wins">{winCount}</span>
        </h3>
        <h3>
          Losses: <span id="losses">{loseCount}</span>
        </h3>
        <h3>
          Winrate: <span id="winrate">{winrate}</span>
        </h3>
      </div>
      <h2>
        Dealer: <span id="dealer-sum"></span>
        {dealerSum}
      </h2>
      <div id="dealer-cards">
        {dealerCards.length && dealerCards.map(({ src }) => <img src={src} />)}
      </div>
      <h2>
        You: <span id="your-sum">{yourSum}</span>
      </h2>
      <div id="your-cards">
        {yourCards.length && yourCards.map(({ src }) => <img src={src} />)}
      </div>
      <br />
      <button id="hit" onClick={hit}>
        Hit
      </button>
      <button id="stay" onClick={stay}>
        Stay
      </button>
      <p id="results">{message}</p>
      <span id="buttonAppear">
        {gameDone && <button onClick={restart}>Next Game!</button>}
      </span>
    </div>
  );
}

export default Body;
