import React, { Component } from "react";
import { AppRegistry, TouchableHighlight, View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import { Button } from 'react-native-elements';
import firebase from '../../config/firebase';
import RNFetchBlob from 'rn-fetch-blob';
import images from "../../img"

export default class FinalResultsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  update_knowledge() {
//    fetch('https://us-central1-helping-hands-cs194.cloudfunctions.net/learning_manage', {
    console.log("fast console log!");
    console.log("we are fetching from /learning_manage with get_cards: false and results: " + global.results_lm + '\n');
    fetch('https://us-central1-helping-hands-cs194.cloudfunctions.net/learning_manage', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        get_cards: false,
        update_knowledge: true,
        username: 1,
        results: global.results_lm
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("Updated and we are successful in getting the response from server");
      })
      .catch((error) =>{
        console.log("we had an error");
        //toDO: we are getting an error right here!!
        console.error(error);
      });
  }
        

  render() {
    const {navigation} = this.props;
    console.log("we are beginning render before update_knowledge");    
    console.log("add another console log!")    
    // this.update_knowledge();
    console.log("we are at the end of update_knowledge"); 
    console.log("currently our global learned variable is " + global.learned);
    // var learnedMessage = global.learned === [] ? "No symbols :(" : global.learned;
    var learnedMessage; 
    if (global.learned.length == 0) {
      console.log("we see that we lerned no symbols");
      learnedMessage = "No symbols :(";
    } else {
      console.log("we see that we lerned SOME! symbols");      
      learnedMessage = global.learned.join();
    }
    return (
      <View style={styles.container}>
        <Text>Total learned: {learnedMessage}</Text>
        <Text>Total not learned: {global.not_learned.join()}</Text>

        <Button
          containerStyle={styles.button}
          title="Back To Test Menu"
          onPress={() => this.props.navigation.navigate('TestMenu')}
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