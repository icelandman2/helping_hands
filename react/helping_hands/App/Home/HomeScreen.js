import React, { Component } from "react";
import { AppRegistry, TouchableHighlight, View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import { Button } from 'react-native-elements';

//general styles
import styles from "../styles";

import DeviceInfo from 'react-native-device-info';

/*
 * class HomeScreen
 * ------------------------------------------------------
 * This is the opening screen of the Helping Hands app. It has four buttons that navigate to
 * the two main interfaces of the app and two minor interfaces. The learn button takes a user to 
 * the menu to select which module to start learning, the test button takes a user to select which 
 * module to start being tested on, the instructions button takes a user to a small view that 
 * explains how the app works, and a button that gets a new set of cards for the user to be tested on.
 * Currently, Helping Hands is only supporting learning and testing the English alphabet in ASL
 */
export default class HomeScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = { isLoading: true}
    this.state.deviceID = DeviceInfo.getUniqueID();
  }

  /*
   * function: update_cards()
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
        init_gcloud: false,        
        get_cards: true,
        update_knowledge: false,
        type: "alphabet",
        username: this.state.deviceID,
        results: [0,0,0],
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

  componentDidMount() {
    this.update_cards();
  }

  componentWillUnmount() {
    // if (this.state.waitedUpdate) this.state.waitedUpdate.cancel();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.dataSource}</Text>
        <Image source={require('../../img/HelpingHandsLogo.png')} 
               style={{flex:0.4, width:300, height:300, resizeMode: 'contain'}}/>
        <View style={styles.moduleContainerStyle}>          
          <View style={styles.moduleButtonContainer}>
            <View style={styles.CircleShapeView}>
              <View style={styles.InnerCircleShapeView}>  
                <TouchableOpacity onPress={() => this.props.navigation.push('LearnMenu', {
                type: 'LearnMenu',
              })}>
                  <Image
                    style={styles.moduleButton, localStyles.learnStyle}
                    source={require('../../img/learn.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>                    
            <TouchableOpacity 
            containerStyle={styles.moduleButtonText}
            onPress={() => this.props.navigation.push('LearnMenu', {
            type: 'LearnMenu',
          })}
          ><Text style={styles.moduleButtonText}>Learn</Text></TouchableOpacity>      
          </View>
          <View style={styles.moduleButtonContainer}>
            <View style={styles.CircleShapeView}>
              <View style={styles.InnerCircleShapeView}>  
                <TouchableOpacity onPress={() => this.props.navigation.push('TestMenu', {
                  type: 'TestMenu',
                })}>
                  <Image
                    style={styles.moduleButton, localStyles.testStyle}
                    source={require('../../img/test.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>  
            <TouchableOpacity 
              containerStyle={styles.moduleButtonText}
              onPress={() => this.props.navigation.push('TestMenu', {
              type: 'TestMenu',
            })}
            ><Text style={styles.moduleButtonText}>Test</Text></TouchableOpacity>        
          </View>          
        </View>

        {/*<Button backgroundColor={"#00bcd4"}*/}
        <TouchableOpacity
          style={styles.buttonContainer}
          title="Instructions"
          onPress={() => this.props.navigation.push('Instructions', {
            type: 'Instructions',
          })}><Text style={styles.buttonContainerText}>Instructions</Text></TouchableOpacity
        >
       {/* <Button */}
       <TouchableOpacity
          color="#00bcd4"
          style={styles.buttonContainer}
          title="Update Daily Cards"
          onPress={() => this.update_cards()}
        ><Text style={styles.buttonContainerText}>Update Daily Cards</Text></TouchableOpacity>

      </View>
    );
  }
}

const localStyles = StyleSheet.create({
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
