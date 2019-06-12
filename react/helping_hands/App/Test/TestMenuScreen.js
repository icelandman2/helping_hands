import React, { Component } from "react";
import { AppRegistry, TouchableHighlight, View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import { Button } from 'react-native-elements';

//global styles
import styles from '../styles';
import DeviceInfo from 'react-native-device-info';

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

  constructor(props) {
    super(props);
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    // this._isMounted && this.getImage(this.props.item.image);    
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
    global.curr_cards = 0;    
    this._isMounted && this.setState({
        uri: { alphabetUri },
        ready: true
    });          
    this.props.navigation.push('Test', {
      sectionName: 'Alphabet',
      type: 'Test'
    });
    global.cards_left = global.new_cards_lm;
    global.curr_cards = 0;
    global.total_cards = global.cards_left.length;
    global.current_sign = global.cards_left[0];
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
  pressEtiquette = async function() {
    let etiquetteUri = await this.update_cards('etiquette');
    global.curr_cards = 0;        
    this._isMounted && this.setState({
        uri: { etiquetteUri },
        ready: true
    });    
    this.props.navigation.push('Test', {
      sectionName: 'Etiquette',
      type: 'Test'
    });
    global.total_cards = global.cards_left.length;
    global.current_sign = global.cards_left[0];
    global.learned = [];
    global.not_learned = [];
    global.maybe_learned = [];
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
    global.curr_cards = 0;     
    this._isMounted && this.setState({
        uri: { numbersUri },
        ready: true
    });        
    this.props.navigation.push('Test', {
      sectionName: 'Numbers',
      type: 'Test'
    });        
    global.cards_left = global.new_cards_lm;                
    global.curr_cards = 0;
    global.total_cards = global.cards_left.length;
    global.current_sign = global.cards_left[0];
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
      global.cards_left = global.new_cards_lm;
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
  topContainerStyle: {
    position: 'absolute',
    top: 0,
    alignItems: "center",
    justifyContent: "center",   
  },  
  moduleButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  }, 
moduleButtonContainer: {
    margin: 30,
    marginBottom: 5,
    // marginTop: 0,
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
