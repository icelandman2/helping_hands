import React, { Component } from "react";
import { AppRegistry, TouchableHighlight, View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import { Button } from 'react-native-elements';
import DeviceInfo from 'react-native-device-info';

//general styles
import styles from '../styles';

/*
 * class LearnMenuScreen
 * ------------------------------------------------------
 * This is the select screen where a student picks which module they would like to 
 * practice signing for. They will receive a stack of swipe cards corresponding to the module that
 * the student selects which they will practice signing at their own pace outside of the app.
 */

export default class LearnMenuScreen extends React.Component {

  constructor(props) {
    super(props);
  }  

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  /*
   * function: pressAlphabet
   * ------------------------------------------------------
   * initializes TestScreen class with props.sectionName "alphabet" and 
   * initializes global state variables to be the relevant letters to practice signing
   * according to the learning manager
   */  
  pressAlphabet = async function() {
    let alphabetUri = await this.update_cards('alphabet'); 
    this._isMounted && this.setState({
        uri: { alphabetUri },
        ready: true
    });   
    global.cards_left = global.new_cards_lm;
    global.curr_cards = 0;
    global.total_cards = global.cards_left.length;

    global.learned = [];
    global.not_learned = [];
    global.maybe_learned = []; 
    this.props.navigation.push('Learn', {
      sectionName: 'Alphabet',
      type: 'Learn'
    });     
  };

  /*
   * function: pressEtiquette
   * ------------------------------------------------------
   * initializes TestScreen class with props.sectionName "etiquette" and 
   * initializes global state variables to be the relevant words to practice signing
   * according to the learning manager
   */
  pressEtiquette = async function() {
    let etiquetteUri = await this.update_cards('etiquette'); 
    this._isMounted && this.setState({
        uri: { etiquetteUri },
        ready: true
    });   
    global.cards_left = global.new_cards_lm;            
    global.curr_cards = 0;
    global.total_cards = global.cards_left.length;
    global.learned = [];
    global.not_learned = [];
    global.maybe_learned = [];
    this.props.navigation.push('Learn', {
      sectionName: 'Etiquette',
      type: 'Learn'
    });    
  };

  /*
   * function: pressNumbers
   * ------------------------------------------------------
   * initializes TestScreen class with props.sectionName "numbers" and 
   * initializes global state variables to be the relevant words to practice signing
   * according to the learning manager
   */
  pressNumbers = async function() {
    let numbersUri = await this.update_cards('numbers'); 
    this._isMounted && this.setState({
        uri: { numbersUri },
        ready: true
    });        
    global.cards_left = global.new_cards_lm;        
    global.curr_cards = 0;
    global.total_cards = global.new_cards_lm.length;
    global.learned = [];
    global.not_learned = [];
    global.maybe_learned = [];   
    this.props.navigation.push('Learn', {
      sectionName: 'Numbers',
      type: 'Learn'
    });    
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
  update_cards(cardsType) {
    return fetch('https://us-central1-helping-hands-cs194.cloudfunctions.net/learning_manage', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        init_gcloud: false,        
        get_cards: true,
        update_knowledge: false,
        username: DeviceInfo.getUniqueID(),
        type: cardsType,
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

  render() {
    const {navigation} = this.props;
    const type = navigation.getParam('type', 'Learn');
    return (
      <View style={styles.container}>
        <View style={styles.topContainerStyle}>
          <Text style={styles.headerText}>Learn</Text>
        </View>
        <View style={styles.moduleContainerStyle}>
          {/*Here is where the first module button starts*/}
          <View style={styles.moduleButtonContainer}>
            <View style={styles.CircleShapeView}>
              <View style={styles.InnerCircleShapeView}>  
                <TouchableOpacity onPress={this.pressAlphabet.bind(this)}>
                  <Image
                    style={localStyles.alphabetStyle}
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
          {/*Here is where the next module button starts -- currently disabled*/}
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
          {/*Here is where the next module button starts*/}
          <View style={styles.moduleButtonContainer}>
            <View style={styles.CircleShapeView}>
              <View style={styles.InnerCircleShapeView}>                        
                <TouchableOpacity onPress={this.pressNumbers.bind(this)}>
                  <Image
                    style={styles.moduleButton}
                    source={require('../../img/alphabet_signs/z.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity 
              containerStyle={styles.moduleButtonText}
              title="Numbers"
              onPress={this.pressNumbers.bind(this)}
            ><Text style={styles.moduleButtonText}>Numbers</Text></TouchableOpacity>
          </View>  
        </View>
        <View style={styles.bottomContainerStyle}>
          <Button
            containerStyle={styles.checkButton}
            title="Main Menu"
            onPress={() => this.props.navigation.pop()}
          />
        </View>
      </View>
    );
  }
}

const localStyles = StyleSheet.create({
  alphabetStyle: {
    width: 58,
    height: 58,
    borderRadius: 15,
    alignSelf: 'center',
    backgroundColor: '#fff',
    marginRight: -5,
    marginTop: 3,
  },
});
