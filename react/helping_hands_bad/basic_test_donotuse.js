/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Alert, Platform, StyleSheet, Text, View, Image, Button} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';

type Props = {};
export default class App extends Component<Props> {
  _hellooo() {
    Alert.alert('Hellloooooo')
  }
  render() {
    let pic = {
      uri: 'https://www.johnnyseeds.com/dw/image/v2/BBBW_PRD/on/demandware.static/-/Sites-jss-master/default/dw2f79264c/images/products/flowers/01814_01_sunrichorangesum.jpg?sw=387&cx=302&cy=0&cw=1196&ch=1196'
    };
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>
        <Text style={styles.bigBlue}>Hello world!</Text>
        <Image source = {pic} style={{width: 193, height: 100}}/>
        <Greeting flower='sunflower' />
        <Greeting flower='daisy' />
        
        <View style={styles.buttonContainer}>
          <Button
            onPress={this._hellooo}
            title="Press me!!"
          />
        </View>
        <Blink text='Blinkkkkkk' />
        
      </View>
      // <View style={styles.container}>
      //   <Text style={styles.welcome}>Welcome to React Native!</Text>
      //   <Text style={styles.instructions}>To get started, edit App.js</Text>
      //   <Text style={styles.instructions}>{instructions}</Text>
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  bigBlue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
  }
});
