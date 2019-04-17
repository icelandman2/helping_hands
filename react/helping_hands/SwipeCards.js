// SwipeCards.js
'use strict';

import React, { Component } from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';

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

  render() {
    return (
      <View style={styles.card}>
        <Image source={images[this.props.name]} />
        <Text style={styles.text}>This is card {this.props.name}</Text>
      </View>
    )
  }
}

class NoMoreCards extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text style={styles.noMoreCardsText}>No more cards</Text>
      </View>
    )
  }
}


export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [
        {name: 'a'},
        {name: 'b'},
        {name: 'c'},
        {name: 'd'},
        {name: 'e'},
        {name: 'f'},
        {name: 'g'},
        {name: 'h'},
        {name: 'i'},
        {name: 'j'},
        {name: 'k'},
        {name: 'l'},
        {name: 'm'},
        {name: 'n'},
        {name: 'o'},
        {name: 'p'},
        {name: 'q'},
        {name: 'r'},
        {name: 's'},
        {name: 't'},
        {name: 'u'},
        {name: 'v'},
        {name: 'w'},
        {name: 'x'},
        {name: 'y'},
        {name: 'z'},
      ]
    };
  }

  handleYup (card) {
    console.log(`Yup for ${card.text}`)
  }
  handleNope (card) {
    console.log(`Practice again for ${card.text}`)
  }
  handleMaybe (card) {
    console.log(`Maybe for ${card.text}`)
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