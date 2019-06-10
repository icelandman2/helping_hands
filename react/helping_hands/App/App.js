/*
 * file: App.js
 * Helping Hands Team © 2019
 * This is the main App interface for the Helping Hands Application
 * It contains the definition of the app's global navigation object and the classes defining each of the main
 * views of the Helping HAnds application. It also defines/imports global styling that 
*/
import React, { Component } from "react";
import { AppRegistry, TouchableHighlight, View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import { Button } from 'react-native-elements';
import { createStackNavigator, createAppContainer } from "react-navigation";

//All Top Level Views i.e. the various screens of the app
//Interfaces for all view-controlling functions are located in these classes
import HomeScreen from './Home/HomeScreen';
import LearnMenuScreen from './Learn/LearnMenuScreen';
import LearnScreen from './Learn/LearnScreen';
import TestMenuScreen from './Test/TestMenuScreen';
import TestScreen from './Test/TestScreen';
import CameraScreen from './Test/CameraScreen';
import ResultsScreen from './Test/ResultsScreen';
import FinalResultsScreen from './Test/FinalResultsScreen';
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
    FinalResults: FinalResultsScreen,
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

//global app styles 
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