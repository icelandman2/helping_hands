import React, { Component } from "react";
import { AppRegistry, TouchableHighlight, View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import { Button } from 'react-native-elements';
import images from "../../img"

//general styles
import styles from '../styles';

/*
 * class ResultsScreen
 * ------------------------------------------------------
 * This is the select screen where a student picks which module they would like to 
 * practice signing for. They will receive a stack of swipe cards that they will practice signing
 * outside of the app.
 * Will present a summary of which cards the user marked as "learned" and those that they marked
 * as "not learned" during the learning dialogue 
 */
export default class ResultsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

/*
 * function goBackToSigns()
 * ------------------------------------------------------
 * This function simply sends the user back to the main testing screen to receive the new problem
 * to attempt to sign. The only special case is that we are displaying the results after the last 
 * card of the module being tested. In that case, we navigate to FinalResults rather than removing the 
 * card from the global.cards_left variable. Since the Test Screen will still be rendered after the
 * call to navigate("FinalResults") (before rendering FinalResults), the app will crash if we do not 
 * handle this edge case.
 */  
  goBackToSigns = async function() {
    global.curr_cards = global.curr_cards+1;    
    if (global.cards_left.length !=1 ) {
      global.cards_left = global.cards_left.filter(item => item !== global.current_sign);
      global.rand_ind = Math.floor(Math.random()*global.cards_left.length);
      this.props.navigation.navigate(global.type, {
        sectionName: global.section_name,
        type: global.type
      });            
    } else {
      //if length IS ONE
      this.props.navigation.navigate('FinalResults', {
        prediction: '1',
      });   
      //global.cards_left = global.cards_left.filter(item => item !== global.current_sign);        
    }
  };
     
  overRide = async function() {
    curr_results_length = global.results_lm.length;
    global.results_lm[curr_results_length - 1] = 1;
    this.goBackToSigns();
  };   

  renderOverrideButtonIfWrong() {
    const prediction = this.props.navigation.getParam('prediction', 'default');    
    if (prediction==(global.current_sign).toUpperCase()) {
      return <Text></Text>;
    } else {
      return <Button
          containerStyle={styles.button}
          title="Override: I was right"
          onPress={this.overRide.bind(this)}
        />
    }
  }
  render() {
    const {navigation} = this.props;
    const prediction = navigation.getParam('prediction', 'default');

    //computing the proper message to show the user -- did they answer correctly?
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
        <Button
          containerStyle={styles.button}
          title="Continue"
          onPress={this.goBackToSigns.bind(this)}
        />
        {this.renderOverrideButtonIfWrong()}
      </View>
    );
  }
}
