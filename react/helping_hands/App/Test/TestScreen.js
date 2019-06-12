import React, { Component } from "react";
import { AppRegistry, TouchableHighlight, View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import { Button } from 'react-native-elements';
import * as Progress from 'react-native-progress';

import styles from '../styles';

/*
 * class TestScreen
 * ------------------------------------------------------
 * The symbols that a student will be tested on symbols that were selected ahead of time by the 
 * learning manager backend. For each symbol, the student will submit an image (taken from within 
 * Helping Hands)that is the student's attempt to reproduce the symbol that they learned in the 
 * Learn module, which the learning manager has determined that the student needs to practice.
 */
export default class TestScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = 
    {
      progress: 0,
      indeterminate: true
    };
    global.rand_ind = Math.floor(Math.random()*global.cards_left.length);
  }

  componentDidMount() {
    this.animate();
  }

  componentWillUnMount() {
    if (this.state.waitedUpdate) this.state.waitedUpdate.cancel();
  }
  /*
   * function animate()
   * ------------------------------------------------------------
   * Initialization method that displays the starting configuration of the progress bar.
  */
  animate() {
    let progress = 0;
    this.setState({ progress });
    if (!this._isMounted) return;
    setTimeout(() => {
      this.setState({ indeterminate: false });
      setInterval(() => {
        progress = parseFloat(global.curr_cards)/parseFloat(global.total_cards);
        this.setState({ progress });
      }, 500);
    }, 1500);
  }


  render() {
    console.log(global.cards_left);
    const {navigation} = this.props;
    const type = navigation.getParam('type', 'Test');
    const sectionName = navigation.getParam('sectionName', 'Alphabet');

    global.type = type;

    // global.current_sign = global.cards_left[global.rand_ind];
    testQuestionText = "";
    if (global.cards_left == []) {
      this.props.navigation.pop();      
    } else {
      global.current_sign = global.cards_left[0];      
    }
    if (global.cards_left.length == 1) {
      testQuestionText = global.current_sign.toUpperCase();
    } else if (global.cards_left.length == 2) {
      testQuestionText = global.current_sign .toUpperCase()+ " & " + global.cards_left[1].toUpperCase();
    } else if (global.cards_left.length == 3) {
      testQuestionText = global.current_sign.toUpperCase() + ", " + global.cards_left[1].toUpperCase() + ", & " + global.cards_left[2].toUpperCase();      
    } else {
      testQuestionText = global.current_sign.toUpperCase() + ", " + global.cards_left[1].toUpperCase() + ", " + global.cards_left[2].toUpperCase() + " & " + (global.cards_left.length - 3) + " more";            
    }

    return (
      <View style={styles.container}>
        <View style={styles.topContainerStyle}>
          <Text style={styles.headerText}>{type}</Text>
          <Text style={styles.subHeaderText}>{sectionName}</Text>
          <Text>Cards Left: {testQuestionText}</Text>
          <Progress.Bar progress={parseFloat(global.curr_cards)/parseFloat(global.total_cards)} width={200} />          
        </View>          
        {/*<SwipeCards style={{flex: 1}} />*/}
        {<Text style={styles.testQuestionStyle}>{global.current_sign.toUpperCase()}</Text>} 
        {/*<Text style={styles.testQuestionStyle}>{testQuestionText}</Text>*/} 
        <Text style={styles.paragraphText}>When you're ready, check your knowledge by pressing the button and submitting a photo!</Text>      
        <Button
          containerStyle={styles.checkButton}
          title="Check sign"
          onPress={() =>
            this.props.navigation.push('Camera')}/>
        <View style={styles.bottomContainerStyle}>
          <Button
            containerStyle={styles.checkButton}
            title="Back to Test Menu"
            onPress={() =>
              this.props.navigation.pop()}/>
        </View>              

      </View>
    );
  }
}
