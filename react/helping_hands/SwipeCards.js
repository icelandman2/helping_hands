// SwipeCards.js
'use strict';

import React, { Component } from 'react';
import {StyleSheet, Text, View, Image, Alert} from 'react-native';

import SwipeCards from 'react-native-swipe-cards';


import images from "./img"

class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  // image_path(name) {
  //   switch(name) {
  //     case 'a':
  //       return require('/img/alphabet_signs/a.png');
  //     default:
  //       return require('/img/alphabet_signs/a.png');
  //   }
  // }
  setGlobal() {
    global.current_name = this.props.name;
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
        <Text style={styles.noMoreCardsText}>Total: {global.cards_left.toString()}</Text>
      </View>
    )
  }
}


export default class extends React.Component {
  constructor(props) {
    super(props);
    global.curr_alphabet_cards = 0;
    global.cards_left = ['a', 'b', 'c', 'd', 'e', 'f'];

    this.state = {
      cards: [
        {name: 'a'},
        {name: 'b'},
        {name: 'c'},
        // {name: 'd'},
        // {name: 'e'},
        // {name: 'f'},
        // {name: 'g'},
        // {name: 'h'},
        // {name: 'i'},
        // {name: 'j'},
        // {name: 'k'},
        // {name: 'l'},
        // {name: 'm'},
        // {name: 'n'},
        // {name: 'o'},
        // {name: 'p'},
        // {name: 'q'},
        // {name: 'r'},
        // {name: 's'},
        // {name: 't'},
        // {name: 'u'},
        // {name: 'v'},
        // {name: 'w'},
        // {name: 'x'},
        // {name: 'y'},
        // {name: 'z'},
      ]
    };
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
    global.curr_alphabet_cards = global.curr_alphabet_cards+1;
  }
  handleNope (card) {
    global.cards_left = global.cards_left.filter(item => item !== card.name);
    global.not_learned.push(card.name);
    global.curr_alphabet_cards = global.curr_alphabet_cards+1;
  }
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