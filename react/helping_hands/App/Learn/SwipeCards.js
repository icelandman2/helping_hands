// SwipeCards.js
'use strict';

import React, { Component } from 'react';
import {StyleSheet, Text, View, Image, Alert} from 'react-native';

import SwipeCards from 'react-native-swipe-cards';

import images from "../../img"

/*
 * Module: SwipeCards
 * --------------------------------------------
 * This is the module containing the Learning Module's problem cards that can be swiped left or right 
 * on for a user to establish whether they need more practice on a problem or whether they have
 * learned it to their satisfaction.
*/

/*
 * class: Card
 * --------------------------------------------
 * This is the base class that contains the prooblem image and its english name.
 * It is strictly visual other than definining its own state and magic number.
 * 
 */

class Card extends React.Component {
  constructor(props) {
    super(props);

    this.state = { hitOnce: true, magic: global.magic};

    global.magic = global.magic + 1;


  }

  setGlobal() {
    console.log(">>>>", this.props.name);
    console.log("magic", this.state.magic);
    if (this.state.hitOnce) {
      global.current_sign = this.props.name;
      console.log("why????", global.current_sign);
      this.state.hitOnce = false;
    }

  }

  render() {
    this.setGlobal();
    return (
      <View style={styles.card}>
        <Image source={images[this.props.name.toLowerCase()]} />
        <Text style={styles.text}>{this.props.name}</Text>
      </View>
    )
  }
}

/*
 * class: NoMoreCards
 * --------------------------------------------
 * This is the class, strictly visual, that is displayed once all cards are 
 * swiped on by the user.
 * 
 */
class NoMoreCards extends Component {
  constructor(props) {
    super(props);
  }
  // Alert.alert('no more cards!!!!');
  render() {
    return (
      <View>
        <Text style={styles.noMoreCardsText}>No more cards in this module!</Text>
        <Text style={styles.noMoreCardsText}>Learned: {global.learned.toString()}</Text>
        <Text style={styles.noMoreCardsText}>Not learned: {global.not_learned.toString()}</Text>
      </View>
    )
  }
}

/*
 * class: SwipeCards
 * --------------------------------------------
 * This class controls the shuffling of the problems so that they are in
 * a different order than the one the user may be used to practicing.
 * In the long run this should help the user memorize the different symbols.
 */
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: []    
    };
    var index = 0;
    for (index = 0; index < global.cards_left.length; index++){
      this.state.cards.push({name: global.cards_left[index].toUpperCase()});
    }
    //this.state.cards = this.shuffle(this.state.cards);
    //global.cards_left = this.state.cards;
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  handleYup (card) {
    console.log("we need to remove", card.name);
    console.log("current cards_left ", global.cards_left.length);
    console.log("current front of list is ", global.cards_left[0]);
    global.cards_left = global.cards_left.filter(item => item !== card.name.toLowerCase());
    console.log("current cards_left ", global.cards_left.length);    
    global.learned.push(card.name);
    global.curr_cards = global.curr_cards+1;
    if (global.cards_left.length > 0) {
      global.current_sign = global.cards_left[global.curr_cards];
    }
  }
  handleNope (card) {
    console.log(global.cards_left);
    global.cards_left = global.cards_left.filter(item => item !== card.name.toLowerCase());
    global.not_learned.push(card.name);
    global.curr_cards = global.curr_cards+1;
    if (global.cards_left.length > 0) {
      global.current_sign = global.cards_left[global.curr_cards];
    }
  }

  handleMaybe (card) {
    global.cards_left = global.cards_left.filter(item => item !== card.name.toLowerCase());
    global.maybe_learned.push(card.name);
    if (global.cards_left.length > 0) {
      global.current_sign = global.cards_left[global.curr_cards];
    }
  }
  render() {
    // If you want a stack of cards instead of one-per-one view, activate stack mode
    // stack={true}
    return (
      <SwipeCards
        cards={this.state.cards}
        renderCard={(cardData) => <Card {...cardData} />}        
        renderNoMoreCards={() => <NoMoreCards />}
        handleYup={this.handleYup}
        handleNope={this.handleNope}
        handleMaybe={this.handleMaybe}
        hasMaybeAction
      />
    )
  }
}

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 300,
    position: 'relative',
    top: -80,
  },
  thumbnail: {
    width: 300,
    height: 300,
  },
  text: {
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10
  },
  noMoreCardsText: {
    fontSize: 22,
  }
})