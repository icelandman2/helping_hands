import React, { Component } from "react";
import { AppRegistry, TouchableHighlight, View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import { Button } from 'react-native-elements';
import { createStackNavigator, createAppContainer } from "react-navigation";
import { Header } from "native-base";
import * as Progress from 'react-native-progress';

// import firebase from 'firebase'
import RNFetchBlob from 'rn-fetch-blob';


import {RNCamera} from 'react-native-camera';


import uuid from 'uuid';
// import Environment from './config/environment';
import images from '../img';

import HomeScreen from './Home/HomeScreen';
import LearnMenuScreen from './Learn/LearnMenuScreen';
import LearnScreen from './Learn/LearnScreen';
import TestMenuScreen from './Test/TestMenuScreen';
import TestScreen from './Test/TestScreen';
import CameraScreen from './Test/CameraScreen';
import ResultsScreen from './Test/ResultsScreen';
import InstructionsScreen from './Instructions/InstructionsScreen';

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Instructions: InstructionsScreen,
    LearnMenu: LearnMenuScreen,
    Learn: LearnScreen,
    Camera: CameraScreen,
    TestMenu: TestMenuScreen,
    Test: TestScreen,
    Results: ResultsScreen,
  },
  {
    initialRouteName: "Home"
  }
);


const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
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