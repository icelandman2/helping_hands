import React, { Component } from "react";
import { AppRegistry, View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import { Button } from 'react-native-elements';
import { createStackNavigator, createAppContainer } from "react-navigation";

import {RNCamera} from 'react-native-camera';

import SwipeCards from './SwipeCards.js'


import * as Progress from 'react-native-progress';

class HomeScreen extends React.Component {
  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }

  componentDidMount(){
    return fetch('https://us-central1-helping-hands-cs194.cloudfunctions.net/hello_get')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson.sign,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }

  hellloooo() {
    fetch('https://us-central1-helping-hands-cs194.cloudfunctions.net/hello_get')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson.sign,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.dataSource}</Text>
        <Image source={require('./img/HelpingHandsLogo.png')} 
               style={{flex:0.4, width:300, height:300, resizeMode: 'contain'}}/>
        <Button
          containerStyle={styles.button}
          title="Learn"
          onPress={() => this.props.navigation.push('Menu', {
            type: 'learn',
          })}
        />

          <Button
          containerStyle={styles.button}
          title="!!"
          onPress={this.hellloooo}
        />



        <Button
          containerStyle={styles.button}
          title="Test"
          onPress={() => this.props.navigation.push('Menu', {
            type: 'test',
          })}
        />

        
      </View>
    );
  }
}

class MenuScreen extends React.Component {

  pressAlphabet= async function() {
    this.props.navigation.push('Learn', {
              sectionName: 'alphabet',
              type: 'learn'
            });
    global.cards_left = ['a', 'b', 'c'];
    global.curr_cards = 0;
    global.total_cards = 26;

    global.learned = [];
    global.not_learned = [];
    global.maybe_learned = [];

  };

  pressEtiquette= async function() {
    this.props.navigation.push('Learn', {
              sectionName: 'etiquette',
              type: 'learn'
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
    const type = navigation.getParam('type', 'learn');
    return (
      <View style={styles.container}>
        <Text>{type}</Text>
        <Button
          containerStyle={styles.button}
          title="Alphabet"
          onPress={this.pressAlphabet.bind(this)}
        />

        <Button
          containerStyle={styles.button}
          title="Basic Etiquette"
          onPress={this.pressEtiquette.bind(this)}
        />
      </View>
    );
  }
}

class LearnScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {progress: 0,
      indeterminate: true};
  }

  componentDidMount() {
    this.animate();
  }

  animate() {
    let progress = 0;
    this.setState({ progress });
    setTimeout(() => {
      this.setState({ indeterminate: false });
      setInterval(() => {
        progress = parseFloat(global.curr_cards)/parseFloat(global.total_cards);
        this.setState({ progress });
      }, 500);
    }, 1500);
  }


  render() {
    const {navigation} = this.props;
    const type = navigation.getParam('type', 'learn');
    const sectionName = navigation.getParam('sectionName', 'alphabet');


    return (
      <View style={styles.container}>

        <Text>{type}</Text>
        <Text>{sectionName}</Text>
        <Text>____{global.cards_left.toString()}___</Text>
        <Progress.Bar progress={parseFloat(global.curr_cards)/parseFloat(global.total_cards)} width={200} />
        <SwipeCards style={{flex: 1}} />
        
        <Button
          containerStyle={styles.button}
          title="Check sign"
          onPress={() =>
            this.props.navigation.push('Camera')}
        />

        <Button
          containerStyle={styles.button}
          title="Back to Learn Menu"
          onPress={() =>
            this.props.navigation.push('Menu')}
        />

      </View>
    );
  }
}

class CameraScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  takePicture = async function() {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
      this.props.navigation.push('Learn');
    }
  };

  render() {
    return (
      <View style={styles.container}>
            <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.log(barcodes);
          }}
        />

        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> SNAP </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Menu: MenuScreen,
    Learn: LearnScreen,
    Camera: CameraScreen
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
   container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
   },
   button: {
      padding:10
   },
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
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
    } 
})