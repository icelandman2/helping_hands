'use strict';

var React = require('react-native');

var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({
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
    marginTop: 115,
    marginBottom: 10,
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
  buttonContainer: {
    padding:10,
    backgroundColor: '#2089Dc',
    margin: 10,
    marginBottom: 15,
  },  
  buttonContainerText: {
    color: '#fff',  
    fontSize: 18,  
  },  
  CircleShapeView: {
    width: 120,
    height: 120,
    borderRadius: 120/2,
    backgroundColor: '#2089Dc',
    padding: 20,
},
  InnerCircleShapeView: {
    width: 80,
    height: 80,
    borderRadius: 80/2,
    backgroundColor: '#FFF',
    paddingLeft: 5, 
    paddingTop: 10,  
  },
  moduleButton: {
    width: 60,
    height: 60,
    borderRadius: 15,
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
  moduleButtonText: {
    fontSize:14,
    marginTop: 5,
    fontWeight: 'bold',
    fontFamily: 'System',

  },
  pbStyle: {
    // height: 40,    
    margin: 8,
  },
  checkButton: {
    padding: 10, 
    width: 300,
    borderRadius: 10,
  },
});