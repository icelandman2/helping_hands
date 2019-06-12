import React, { Component } from "react";
import { AppRegistry, TouchableHighlight, View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import { Button } from 'react-native-elements';

//general styles
import styles from "../styles";

export default class InstructionsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = 
    {
      progress: 0,
      indeterminate: true
    };
  }

  componentDidMount() {
    this.animate();
  }

  animate() {
    let progress = 0;
    this.setState({ progress });
    setTimeout(() => {
      this.setState({ indeterminate: false });
    }, 1500);
  }


  render() {
    const {navigation} = this.props;
    const type = navigation.getParam('type', 'Instructions');
    const sectionName = navigation.getParam('sectionName', 'Alphabet');
    return (
      <View style={styles.container}>
        <View style={styles.topContainerStyle}>
          <Text style={styles.headerText}>{type}</Text>
          <Text style={localStyles.subHeaderText}>Visit the Learn menu to swipe through letters and/or numbers you do not know, as many times as you need to become comfortable.</Text>
          <Text style={localStyles.subHeaderText}>When you are ready, evaluate your signing ability on the Test menu! Check back frequently to keep your knowledge from becoming stale.</Text>          
        </View>                
      </View>
    );
  }
}

const localStyles = StyleSheet.create({
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
    alignItems: "center",
    justifyContent: "center",       
  },
  subHeaderText: {
    fontSize: 18,
    //fontWeight: 'bold',
    margin: 15,
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
  checkButton: {
    padding: 10, 
    width: 300,
  },
})