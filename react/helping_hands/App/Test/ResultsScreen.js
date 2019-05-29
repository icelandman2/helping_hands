import React, { Component } from "react";
import { AppRegistry, TouchableHighlight, View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import { Button } from 'react-native-elements';
import images from "../../img"

export default class ResultsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  goBackToSigns= async function() {

    global.cards_left = global.cards_left.filter(item => item !== global.current_sign);
    global.rand_ind = Math.floor(Math.random()*global.cards_left.length);

    global.curr_cards = global.curr_cards+1;
    console.log("Curr cards!!! ", curr_cards);

    if (global.cards_left == []) {
        this.props.navigation.navigate(FinalResults);
    } else {
      this.props.navigation.navigate(global.type, {
          sectionName: global.section_name,
          type: global.type
        });

    }

  };
        

  render() {
    const {navigation} = this.props;
    const prediction = navigation.getParam('prediction', 'default');

    var check = "";
    if (prediction==(global.current_sign).toUpperCase()) {
      check = "Correct :)";
      paragraphText = "Nice job!"
      global.results_lm.push(1);
      global.learned.push(global.current_sign);
    } else {
      check = "Incorrect :(";
      paragraphText = "Just a little more practice!";
      global.results_lm.push(0);
      global.not_learned.push(global.current_sign);    
    }
    return (
      <View style={styles.container}>
        <View style={styles.topContainerStyle}>      
        <Text style={styles.headerText}>Results</Text>        
      </View>
        <Text style={styles.subHeaderText}>{check}</Text>
        <Text style={styles.paragraphText}>{paragraphText}</Text>
        <Text style={styles.subHeaderText}>Correct sign: {global.current_sign.toUpperCase()}</Text>

        <Image source={images[global.current_sign]} 
           style={{flex:0.4, width:300, height:300, resizeMode: 'contain'}}/>

        <Text style={styles.subHeaderText}>You signed: {prediction.toUpperCase()}</Text>
        {
          /* TODO::
          Work on this "continue" button right here
          Intended: go to test screen and present a different test sign
          */
        }
        <Button
          containerStyle={styles.button}
          title="Continue"
          onPress={this.goBackToSigns.bind(this)}
        />

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