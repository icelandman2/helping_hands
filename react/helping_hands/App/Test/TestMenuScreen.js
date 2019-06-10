import React, { Component } from "react";
import { AppRegistry, TouchableHighlight, View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import { Button } from 'react-native-elements';

import styles from '../styles';

/*
 * class TestMenuScreen
 * ------------------------------------------------------
 * This is the select screen where a student selects which module they would like to be
 * tested on. The symbols that a student will be tested on are selected ahead of time by the 
 * learning manager backend, which is invoked through a google cloud function. For each symbol,
 * the student will be prompted to submit an image that is the student's attempt to reproduce
 * the symbol that they learned in the Learn module, which the learning manager has determined 
 * that the student needs to practice.
 */

export default class TestMenuScreen extends React.Component {

  
  /*
   * function: pressAlphabet
   * ------------------------------------------------------
   * initializes TestScreen class with props.sectionName "alphabet" and 
   * initializes global state variables to be the relevant letters to practice signing
   * according to the learning manager
   */
  pressAlphabet= async function() {
    console.log("we are going to update cards now");
    this.update_cards();    
    this.props.navigation.push('Test', {
              sectionName: 'Alphabet',
              type: 'Test'
            });
    global.cards_left = global.new_cards_lm;
    global.curr_cards = 0;
    global.total_cards = global.cards_left.length;

    global.learned = [];
    global.not_learned = [];
    global.maybe_learned = [];

  };

  /*
   * function: pressEtiquette
   * ------------------------------------------------------
   * initializes TestScreen class with props.sectionName "etiquette" and 
   * initializes global state variables to be the relevant words to practice signing
   * according to the learning manager
   */
  pressEtiquette= async function() {
    this.props.navigation.push('Test', {
              sectionName: 'Etiquette',
              type: 'Test'
            });
    global.cards_left = ['hello', 'thanks', 'bye'];
    global.curr_cards = 0;
    global.total_cards = global.cards_left.length;

    global.learned = [];
    global.not_learned = [];
    global.maybe_learned = [];
  };

  /*
   * function: update_knowledge()
   * ---------------------------------
   * Calls the Google Cloud Function running at 
   * https://us-central1-helping-hands-cs194.cloudfunctions.net/learning_manage
   * and receives the cards that the user should practice. Updates global state variables
   * to handle the presentation of the proper learning cards for the student.
   * Should eventually be separated into its own class, a service module, to be included
   * when necessary on visual interfaces
   */
  update_cards() {
    fetch('https://us-central1-helping-hands-cs194.cloudfunctions.net/learning_manage', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        get_cards: true,
        update_knowledge: true,
        username: 1,
        results: [0,0,0]
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        global.new_cards_lm = responseJson.cards;
        console.log(global.new_cards_lm);
        
      })
      .catch((error) =>{
        console.error(error);
      });
  }

  render() {
    const {navigation} = this.props;
    const type = navigation.getParam('type', 'Learn');
    return (
      <View style={styles.container}>
        <View style={styles.topContainerStyle}>
          <Text style={styles.headerText}>Test</Text>
        </View>
        <View style={styles.moduleContainerStyle}>
          <View style={styles.moduleButtonContainer}>
            <View style={styles.CircleShapeView}>
              <View style={styles.InnerCircleShapeView}>            
                <TouchableOpacity onPress={                  
                  this.pressAlphabet.bind(this)
                }>
                  <Image
                    style={styles.moduleButton}
                    source={require('../../img/alphabet_signs/a.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity 
              containerStyle={styles.moduleButtonText}
              onPress={this.pressAlphabet.bind(this)}
            ><Text style={styles.moduleButtonText}>Alphabet</Text></TouchableOpacity>
          </View>
          {/*<View style={styles.moduleButtonContainer}>
            <View style={styles.CircleShapeView}>
              <View style={styles.InnerCircleShapeView}>                        
                <TouchableOpacity onPress={this.pressEtiquette.bind(this)}>
                  <Image
                    style={styles.moduleButton}
                    source={require('../../img/thankyou.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity 
              containerStyle={styles.moduleButtonText}
              title="Basic Etiquette"
              onPress={this.pressEtiquette.bind(this)}
            ><Text style={styles.moduleButtonText}>Basic Etiquette</Text></TouchableOpacity>
          </View>*/}
        </View>
        <Button
          containerStyle={styles.button}
          title="Main Menu"
          onPress={() => this.props.navigation.pop()}
        />        
      </View>
    );
  }
}
