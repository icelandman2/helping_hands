import React, { Component } from "react";
import { AppRegistry, TouchableHighlight, View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import { Button } from 'react-native-elements';
import SwipeCards from './SwipeCards.js'
import * as Progress from 'react-native-progress';

//general styles
import styles from '../styles';

/*
 * class LearnScreen
 * ------------------------------------------------------
 * The student receives a stack of swipe cards that they will practice signing
 * outside of the app. If a student feels that they have gained competence with a sign, theyy
 * will mark it as "learned" by swiping right, but if they don't feel they've gained competence,
 * then they will mark it as "not_learned" by swiping left.
 * At the end, the app will present a summary of which cards the user marked as "learned" and those that they marked
 * as "not learned" during the learning dialogue 
 */

export default class LearnScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = 
    {
      progress: 0,
      indeterminate: true
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.animate();

  }

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
    const {navigation} = this.props;
    const type = navigation.getParam('type', 'Learn');
    const sectionName = navigation.getParam('sectionName', 'Alphabet');

    global.type = type;
    global.section_name = sectionName;

    if (!global.cards_left[0]) testQuestionText = "None!";
    else {
      if (global.cards_left.length == 1) {
        testQuestionText = global.cards_left[0].toUpperCase();
      } else if (global.cards_left.length == 2) {
        testQuestionText = global.cards_left[0].toUpperCase()+ " & " + global.cards_left[1].toUpperCase();
      } else if (global.cards_left.length == 3) {
        testQuestionText = global.cards_left[0].toUpperCase() + ", " + global.cards_left[1].toUpperCase() + ", & " + global.cards_left[2].toUpperCase();      
      } else {
        testQuestionText = global.cards_left[0].toUpperCase() + ", " + global.cards_left[1].toUpperCase() + ", " + global.cards_left[2].toUpperCase() + " & " + (global.cards_left.length - 3) + " more";            
      }
    }

    return (
      <View style={styles.container}>
        <View style={localStyles.topContainerStyle}>
          <View style={localStyles.moduleButtonContainer}>
            <View style={styles.CircleShapeView}>
              <View style={styles.InnerCircleShapeView}>  
                  <Image
                    style={styles.moduleButton, localStyles.testStyle}
                    source={require('../../img/learn.png')}
                  />
              </View>
            </View>  
           <Text style={localStyles.moduleButtonText}>{type}</Text>
          </View>         
          {/*<Text style={styles.headerText}>{type}</Text>*/}
          <Text style={localStyles.subHeaderText}>{sectionName}</Text>
          <Text>Cards Left: {testQuestionText}</Text>          
          <Progress.Bar style={styles.pbStyle} height={25} color = "#2089Dc" progress={parseFloat(global.curr_cards)/parseFloat(global.total_cards)} width={200} />          
          <Text>Swipe right if learned, or swipe left to study more !</Text>          
          <SwipeCards style={styles.swipeCardsStyle}/>   
          {/*<Text>Current card: {global.current_sign}</Text>*/}
        </View>

        <View style={styles.bottomContainerStyle}>
          {/*<Text style={styles.paragraphText}>When you're ready, check your progress by pressing the button and submitting an image!</Text>                 
          <Button
            containerStyle={styles.checkButton}
            title="Check sign"
            onPress={() =>
              this.props.navigation.push('Camera')}/>*/}          
          <Button
            containerStyle={styles.checkButton}
            title="Back to Learn Menu"
            onPress={() =>
              this.props.navigation.pop()}
          />
        </View>
      </View>
    );
  }
}

const localStyles = StyleSheet.create({
  subHeaderText: {
    fontSize: 36,
    fontWeight: 'bold',
    // marginBottom: 10,
    position: "relative",
    top: -2,
  },  
  topContainerStyle: {
    position: 'absolute',
    top: 0,
    alignItems: "center",
    justifyContent: "center",   
  },  
  moduleButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  }, 
moduleButtonContainer: {
    margin: 30,
    marginBottom: 0,
    marginTop: 20,
    alignItems: "center",
//    justifyContent: "center",
  },  
  learnStyle: {
    width: 60,
    height: 60,
    borderRadius: 15,
    alignSelf: 'center',
    backgroundColor: '#fff',
    marginLeft: -4,
  },
  testStyle: {
    width: 60,
    height: 60,
    borderRadius: 15,
    alignSelf: 'center',
    backgroundColor: '#fff',
    marginLeft: -1,
  },  
});