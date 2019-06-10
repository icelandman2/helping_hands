import React, { Component } from "react";
import { AppRegistry, TouchableHighlight, View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import { Button } from 'react-native-elements';
import styles from '../styles';

/*
 * class LearnMenuScreen
 * ------------------------------------------------------
 * This is the select screen where a student picks which module they would like to 
 * practice signing for. They will receive a stack of swipe cards corresponding to the module that
 * the student selects which they will practice signing at their own pace outside of the app.
 */

export default class LearnMenuScreen extends React.Component {
  pressAlphabet= async function() {
    this.props.navigation.push('Learn', {
              sectionName: 'Alphabet',
              type: 'Learn'
            });
    global.cards_left = global.new_cards_lm;
    // global.cards_left = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    global.curr_cards = 0;
    global.total_cards = global.cards_left.length;

    global.learned = [];
    global.not_learned = [];
    global.maybe_learned = [];
  };

  pressEtiquette= async function() {
    this.props.navigation.push('Learn', {
              sectionName: 'Etiquette',
              type: 'Learn'
            });
    global.cards_left = ['hello', 'thanks', 'bye'];
    global.curr_cards = 0;
    global.total_cards = 3;

    global.learned = [];
    global.not_learned = [];
    global.maybe_learned = [];
  };

  render() {
    const {navigation} = this.props;
    const type = navigation.getParam('type', 'Learn');
    return (
      <View style={styles.container}>
        <View style={styles.topContainerStyle}>
          <Text style={styles.headerText}>Learn</Text>
        </View>
        <View style={styles.moduleContainerStyle}>
          <View style={styles.moduleButtonContainer}>
            <View style={styles.CircleShapeView}>
              <View style={styles.InnerCircleShapeView}>  
                <TouchableOpacity onPress={this.pressAlphabet.bind(this)}>
                  <Image
                    style={styles.moduleButton}
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
        </View>
        <Button
          containerStyle={styles.button}
          title="Main Menu"
          onPress={() => this.props.navigation.pop()}
        />
      </View>
    );
  }
}
