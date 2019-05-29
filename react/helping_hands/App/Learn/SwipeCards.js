// SwipeCards.js
'use strict';

import React, { Component } from 'react';
import {StyleSheet, Text, View, Image, Alert} from 'react-native';

import SwipeCards from 'react-native-swipe-cards';


import images from "../../img"

class Card extends React.Component {
  constructor(props) {
    super(props);

    this.state ={ hitOnce: true, magic: global.magic}

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
        <Image source={images[this.props.name]} />
        <Text style={styles.text}>{this.props.name}</Text>
      </View>
    )
  }
}

class NoMoreCards extends Component {
  constructor(props) {
    super(props);
  }
  // Alert.alert('no more cards!!!!');
  render() {
    return (
      <View>
        <Text style={styles.noMoreCardsText}>No more cards</Text>
        <Text style={styles.noMoreCardsText}>Learned: {global.learned.toString()}</Text>
        <Text style={styles.noMoreCardsText}>Not learned: {global.not_learned.toString()}</Text>
        <Text style={styles.noMoreCardsText}>What's left: {global.cards_left.toString()}</Text>
      </View>
    )
  }
}


export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: []    
    };
    var index = 0;
    for (index = 0; index < global.cards_left.length; index++){
      this.state.cards.push({name: global.cards_left[index]});
    }
    this.state.cards = this.shuffle(this.state.cards);
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
    global.cards_left = global.cards_left.filter(item => item !== card.name);
    global.learned.push(card.name);
    global.curr_cards = global.curr_cards+1;
  }
  handleNope (card) {
    console.log(global.cards_left);
    global.cards_left = global.cards_left.filter(item => item !== card.name);
    global.not_learned.push(card.name);
    global.curr_cards = global.curr_cards+1;
    //this.props.parentHandleNope(card);
  }

  // parentHandleNope (card) {
  //   this.state.cards.push(card.name);
  // }

  handleMaybe (card) {
    global.cards_left = global.cards_left.filter(item => item !== card.name);
    global.maybe_learned.push(card.name);
  }
  render() {
    // If you want a stack of cards instead of one-per-one view, activate stack mode
    // stack={true}
    return (
      <SwipeCards
        cards={this.state.cards}
        // renderCard={(cardData) => <Card method={this.parentHandleNope} {...cardData} />}
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