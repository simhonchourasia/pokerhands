import React from 'react';

const nats = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const values = ['X', 'X', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const cardNames = ['2C', '2D', '2H', '2S', '3C', '3D', '3H', '3S', '4C', '4D', '4H', '4S', 
            '5C', '5D', '5H', '5S', '6C', '6D', '6H', '6S', '7C', '7D', '7H', '7S',
            '8C', '8D', '8H', '8S', '9C', '9D', '9H', '9S', '10C', '10D', '10H', '10S',
            'JC', 'JD', 'JH', 'JS', 'QC', 'QD', 'QH', 'QS', 'KC', 'KD', 'KH', 'KS',
            'AC', 'AD', 'AH', 'AS'];
const pokerHands = ['Royal Flush', 'Straight Flush', 'Four of a Kind', 'Full House', 'Flush', 'Straight', 'Three of a Kind', 'Two Pairs', 'One Pair', 'High Card'];
const initCards = [];
for (let i = 0; i < 13; i++) {
    initCards.push('');
}
initCards[0] = 'KS';
initCards[1] = 'KH';
initCards[2] = 'KD';
initCards[3] = '10H';
initCards[4] = '10S';
initCards[5] = '9D';

class Form extends React.Component {
    state = {
        cards: initCards,
        poker_hands: []
    }

    outputHands = () => {
        return this.state.poker_hands.map((hand)=>{
            return (
            <p className='results'>{hand[1] + ' ' + this.reconstructHand(hand).toString()}</p>
        )})
    }

    // Returns an array containing card value and suit, in that order
    // Example: '10C' becomes ['10', 'C']
    // Faced cards are converted to numeric values
    // Example: 'KH' becomes ['13', 'H'], and 'AS' becomes ['14', 'S']
    deconstructCard = (card) => {
        const val = card.slice(0, -1);
        const suit = card.slice(-1);
        const realVal = values.findIndex(x => x === val);
        return [realVal, suit];
    }

    // Opposite of deconstructCard
    reconstructCard = (dec) => {
        let suit = '';
        if (dec[1]==='H') suit = '♥';
        if (dec[1]==='S') suit = '♠';
        if (dec[1]==='D') suit = '♦';
        if (dec[1]==='C') suit = '♣'
        let val = dec[0];
        if (val === 11) val = 'J';
        if (val === 12) val = 'Q';
        if (val === 13) val = 'K';
        if (val === 14) val = 'A';
        return val.toString().concat(suit);
    }

    // Reconstructs card for every card in a hand
    reconstructHand = (hand) => {
        let ret = [];
        for (let i = 0; i < hand[0].length; i++) {
            ret.push(this.reconstructCard(hand[0][i]))
        }
        return ret;
    }

    // Returns an array containing the deconstruction of each card
    deconstructCombination = (combo) => {
        const ret = [];
        for (let i = 0; i < combo.length; i++) {
            ret.push(this.deconstructCard(combo[i]));
        }
        return ret;
    }

    is_4_1 = (combo) => {
        if (combo[0][0] === combo[1][0]  && combo[1][0] === combo[2][0] && combo[2][0] === combo[3][0]){
            return true;}
        if (combo[1][0] === combo[2][0] && combo[2][0] === combo[3][0] && combo[3][0] === combo[4][0]) {
            return true;}
        return false;
    }

    is_3_2 = (combo) => {
        // check if the higher or lower is a triple
        if (combo[0][0] === combo[2][0]) { // lower
            if (combo[0][0] === combo[1][0] && combo[3][0] === combo[4][0]) return true;
        }
        if (combo[4][0] === combo[2][0]) { // higher
            if (combo[0][0] === combo[1][0] && combo[3][0] === combo[4][0]) return true;
        }
        return false;
    }

    is_3_1_1 = (combo) => {
        if (combo[0][0] === combo[1][0] && combo[1][0] === combo[2][0]) return true;
        if (combo[1][0] === combo[2][0] && combo[2][0] === combo[3][0]) return true;
        if (combo[2][0] === combo[3][0] && combo[3][0] === combo[4][0]) return true;
        return false;
    }

    is_2_2_1 = (combo) => {
        if (combo[0][0] === combo[1][0]) { //XXYYZ or XXYZZ
            if (combo[2][0] === combo[3][0] || combo[3][0] === combo[4][0]) return true;
        } else { // XYYZZ
            if (combo[3][0] === combo[4][0]) return true;
        }
        return false;
    }

    is_2_1_1_1 = (combo) => {
        if (combo[0][0] === combo[1][0]) return true;
        if (combo[2][0] === combo[1][0]) return true;
        if (combo[2][0] === combo[3][0]) return true;
        if (combo[4][0] === combo[3][0]) return true;
        return false;
    }

    getCombinations = () => {
        const ret = [];
        for (let a = 0; a < 13; a++) {
            for (let b = a+1; b < 13; b++) {
                for (let c = b+1; c < 13; c++) {
                    for (let d = c+1; d < 13; d++) {
                        for (let e = d+1; e < 13; e++) {
                            ret.push([a, b, c, d, e]);
                        }
                    }
                }
            }
        }
        return ret;
    }

    getPokerHands = () => {
        const ret = [];
        const combinations = this.getCombinations();
        for (let i = 0; i < combinations.length; i++) {
            // First check if they are valid cards
            let cardCombo = [];
            let valid = true;

            for (let c = 0; c < 5; c++) {
                let currentCard = this.state.cards[combinations[i][c]];
                cardCombo.push(currentCard);
                if (!cardNames.includes(currentCard)) valid = false;
            }
            // Check each type
            if (valid) {
                // Ordered by hand value
                // royal flush, straight flush, 4-1, 3-2, flush, straight, 3-1-1, 2-2-1, 2-1-1-1, high card
                
                let isPokerHand = [true, true, true, true, true, true, true, true, true, true];
                const cards = this.deconstructCombination(cardCombo);
                cards.sort((c1, c2) => c1[0]-c2[0]) // sort by value

                // Royal Flush
                const suit = cards[0][1];
                for (let c = 0; c < 5; c ++) {
                    if (cards[c][1] === suit && cards[c][0] === 10+i) {//pass
                    } else {isPokerHand[0] = false;}
                }

                // Straight Flush
                const minVal = cards[0][0];
                for (let c = 0; c < 5; c++) {
                    if (cards[c][1] === suit && cards[c][0] === minVal+c) {//pass
                    } else {isPokerHand[1] = false;}
                }

                // Four of a Kind
                if (! this.is_4_1(cards)) isPokerHand[2] = false;

                // Full House
                if (! this.is_3_2(cards)) isPokerHand[3] = false;

                // Flush
                for (let c = 0; c < 5; c++) {
                    if (cards[c][1] === suit) {//pass
                    } else {isPokerHand[4] = false;}
                }

                // Straight
                for (let c = 0; c < 5; c++) {
                    if (cards[c][0] === minVal+c) {//pass 
                    } else {isPokerHand[5] = false;}
                }
                
                // Three of a Kind
                if (!this.is_3_1_1(cards)) isPokerHand[6] = false;

                // Two Pairs
                if (!this.is_2_2_1(cards)) isPokerHand[7] = false;

                // One Pair
                if (!this.is_2_1_1_1(cards)) isPokerHand[8] = false;

                // High Card
                // Always true

                // Add to ret with the corresponding label
                const ind = isPokerHand.indexOf(true);
                const hand = [cards, pokerHands[ind]];
                console.log(hand);
                ret.push(hand);

            }
        }
        return ret;
    }

    // Comparison function for poker hands
    // Only compares types of hands, doesn't compare individual cards
    // Hands are given in the form [(type), [[V, S], [V, S], [V, S], [V, S], [V, S]]]
    compareHands = (hand1, hand2) => {
        const type1 = pokerHands.indexOf(hand1[1]);
        const type2 = pokerHands.indexOf(hand2[1]);
        return type1 - type2;
    }

    render() {
        return (
            <>
            <form>
                {nats.map((i) => (
                    <div>
                        
                        <input placeholder='Card name' value={this.state.cards[i]}
                            onChange={e => {
                                
                                const newCards = this.state.cards;
                                newCards[i] = e.target.value.toUpperCase();
                                this.setState({cards: newCards});
                                const poker = this.getPokerHands();
                                poker.sort(this.compareHands);
                                this.setState({poker_hands: poker});
                            }}/>

                        <br/>
                    </div>
                        )
                )}
            </form>

            <div>
                {this.state.cards.map((card) => {
                    return(
                    cardNames.includes(card) ? <img src={'img/'+card+'.png'} alt=''/> : null
                )})}
            </div>

            <div>
                {this.outputHands()}
            </div>
            </>
        )
    }
}

export default Form;