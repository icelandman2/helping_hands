import React, { Component } from "react";
import { AppRegistry, TouchableHighlight, View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import { Button } from 'react-native-elements';
import * as Progress from 'react-native-progress';

/*
 * TODO :: Add main menu button to the test screen
 AND remove çorrect checked sign from global vars for test module and increment the progress bar
 remove check sign for remove
 Put views into different files
 THEN - Tina is going to integrate the model's prediction with the app
 after each "check sign," go to evaluation screen
 give immediate feedback on each testing question
 after getting sequential questions to work, add random test questions and integrate learning manager

*/

export default class TestScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = 
    {
      progress: 0,
      indeterminate: true
    };
    console.log(global.cards_left);
  }

  componentDidMount() {
    this.animate();
  }

  animate() {
    let progress = 0;
    this.setState({ progress });
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
    const type = navigation.getParam('type', 'Test');
    const sectionName = navigation.getParam('sectionName', 'Alphabet');
    return (
      <View style={styles.container}>
        <View style={styles.topContainerStyle}>
          <Text style={styles.headerText}>{type}</Text>
          <Text style={styles.subHeaderText}>{sectionName}</Text>
          <Text>Cards Left: {global.cards_left.toString()}</Text>
          <Progress.Bar progress={parseFloat(global.curr_cards)/parseFloat(global.total_cards)} width={200} />          
        </View>          
        {/*<SwipeCards style={{flex: 1}} />*/}
        <Text style={styles.testQuestionStyle}>{global.cards_left[0].toString().toUpperCase()}</Text>  
        <Text style={styles.paragraphText}>When you're ready, check your knowledge by pressing the button and submitting a photo!</Text>      
        <Button
          containerStyle={styles.checkButton}
          title="Check sign"
          onPress={() =>
            this.props.navigation.push('Camera')}/>
{/*TODO:: get this button's position to function properly with*/}            
        <View style={styles.bottomContainerStyle}>
          <Button
            containerStyle={styles.checkButton}
            title="Back to Test Menu"
            onPress={() =>
              this.props.navigation.push('TestMenu')}/>
        </View>              

      </View>
    );
  }
}

const styles = StyleSheet.create({
  baseText: {

  },
  topContainerStyle: {
    // position: 'absolute',
    top: 0,
    alignItems: "center",
    justifyContent: "center",   
  },
  headerText: {
    fontSize: 36,
    fontWeight: 'bold',
    margin: 20,
  },
  subHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  paragraphText: {
    fontSize: 14,
    width: 250,
    margin: 5,
    textAlign: "center",
  },
  swipeCardsStyle: {
    flex: 1,
    height: 100,
    zIndex: -1,
  },
  testQuestionStyle: {
    fontSize: 64,
    fontWeight: 'bold',
    margin: 25,
  },
  bottomContainerStyle: {
    position: 'absolute',
    bottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    top: 0,
    left: 0,
    textAlign: 'center',
    // backgroundColor: '#e9ebee',
  },
  button: {
    padding:10,
  },
  moduleContainerStyle: {
    //alignItems: 'flex-end',
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'flex-end',
  },
  moduleButtonContainer: {
    margin: 30,
    marginTop: 0,
    alignItems: "center",
//    justifyContent: "center",
  },
  CircleShapeView: {
    width: 120,
    height: 120,
    borderRadius: 120/2,
    backgroundColor: '#00BCD4',
    padding: 20,
},
  InnerCircleShapeView: {
    width: 80,
    height: 80,
    borderRadius: 80/2,
    backgroundColor: '#FFF',
    // padding: 10, 
    paddingLeft: 5, 
    paddingTop: 10,  
  },
  moduleButton: {
    width: 60,
    height: 60,
    // flex: 1,
    borderRadius: 15,
    alignSelf: 'center',
    backgroundColor: '#fff',
    // justifyContent: 'center',
    //borderRadius: 75,
  },
  moduleButtonText: {
    fontSize:14,
    textDecorationLine: "underline",
    marginTop: 5,
    // backgroundColor: "transparent",

  },
  checkButton: {
    padding: 10, 
    width: 300,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    //alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40  
  },
})