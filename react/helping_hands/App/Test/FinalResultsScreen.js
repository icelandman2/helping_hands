import React, { Component } from "react";
import { AppRegistry, TouchableHighlight, View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import { Button } from 'react-native-elements';
import firebase from '../../config/firebase';
import RNFetchBlob from 'rn-fetch-blob';
import images from "../../img"
import DeviceInfo from 'react-native-device-info';

//general styles
import styles from "../styles";

/*
 * Module FinalResultsScreen
 * ---------------------------------
 * This screen presents the student's performance on the selected testing module.
 * It also sends the performance results to the cloud-based learning manager so the user 
 * can receive cards tuned to the user's current progress. Allows the student to navigate back to 
 * the testing module select menu
 */
export default class FinalResultsScreen extends React.Component {
  constructor(props) {
    super(props);

    //this.state.deviceID = DeviceInfo.getUniqueID();
    //console.log(this.state.deviceID);

  }

  /*
   * function: update_knowledge()
   * ---------------------------------
   * Calls the Google Cloud Function running at 
   * https://us-central1-helping-hands-cs194.cloudfunctions.net/learning_manage
   * and receives the cards that the user should practice. Updates global state variables
   * to handle the presentation of the proper learning cards for the student.
   * Should eventually be separated into its own class, a service module, to be included
   * when necessary on visual interfaces
   * ----There is currently no error checking done on the backend, in particular:
   * ----passing get_cards: false is going to CRASH the app.
   */

  update_knowledge() {
    console.log("fast console log!");
    console.log("we are fetching from /learning_manage with get_cards: false and results: " + global.results_lm + '\n');
    fetch('https://us-central1-helping-hands-cs194.cloudfunctions.net/learning_manage', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        init_gcloud: false,
        get_cards: false,
        update_knowledge: true,
        username: DeviceInfo.getUniqueID(),
        type: 'cat',
        results: global.results_lm
      }),
    })
  }

  render() {
    const {navigation} = this.props;  
    global.learned = global.learned.filter(function(item, pos) {
      return global.learned.indexOf(item) == pos;
    })
    global.not_learned = global.not_learned.filter(function(item, pos) {
      return global.not_learned.indexOf(item) == pos;
    })    
    this.update_knowledge();

    //calculating the right messages to display to the user -- how did they perform in their
    //recall for this module?
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
        <Text style={styles.moduleButtonText}>Symbols learned: {learnedMessage}</Text>
        <Text style={styles.moduleButtonText}>Symbols not learned: {global.not_learned.join()}</Text>

        <Button
          containerStyle={styles.button}
          title="Back To Test Menu"
          onPress={() => this.props.navigation.navigate('TestMenu')}
        />

      </View>
    );
  }
}
