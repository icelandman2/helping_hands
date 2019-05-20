import React, { Component } from "react";
import { AppRegistry, View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import { Button } from 'react-native-elements';
import { createStackNavigator, createAppContainer } from "react-navigation";
import { Header } from "native-base";
import * as Progress from 'react-native-progress';

// import firebase from 'firebase'
import RNFetchBlob from 'rn-fetch-blob';


import {RNCamera} from 'react-native-camera';

import SwipeCards from './SwipeCards.js'

import uuid from 'uuid';
// import Environment from './config/environment';
import firebase from './config/firebase';
import images from './img';

/*
 * TODO :: Add main menu button to the test screen
 AND remove çorrect checked sign from global vars for test module and increment the progress bar
 remove check sign for remove
 Put views into different files
 THEN - Tina is going to integrate the model's prediction with the app
 after each "check sign," go to evaluation screen
 give immediate feedback on each testing question
 after getting sequential questions to work, add random test questions and integrate learning manager

*/
class HomeScreen extends React.Component {
  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }

  test_google_cloud() {
    fetch('https://us-central1-helping-hands-cs194.cloudfunctions.net/hello_get')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
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

          onPress={() => this.props.navigation.push('LearnMenu', {
            type: 'Learn',
          })}
        />

        <Button
          containerStyle={styles.button}
          title="Test"
          onPress={() => this.props.navigation.push('TestMenu', {
            type: 'Test',
          })}
        />
        <Button
          containerStyle={styles.button}
          title="Instructions"
          onPress={() => this.props.navigation.push('Instructions', {
            type: 'Instructions',
          })}
        />
      </View>
    );
  }
}

class LearnMenuScreen extends React.Component {
  pressAlphabet= async function() {
    this.props.navigation.push('Learn', {
              sectionName: 'Alphabet',
              type: 'Learn'
            });
    global.cards_left = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'];
    global.curr_cards = 0;
    global.total_cards = 26;

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
        <Text style={styles.headerText}>{type}</Text>
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

class TestMenuScreen extends React.Component {

  pressAlphabet= async function() {
    this.props.navigation.push('Test', {
              sectionName: 'alphabet',
              type: 'Test'
            });
    global.cards_left = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'];
    global.curr_cards = 0;
    global.total_cards = 26;

    global.learned = [];
    global.not_learned = [];
    global.maybe_learned = [];

  };

  pressEtiquette= async function() {
    this.props.navigation.push('Test', {
              sectionName: 'etiquette',
              type: 'Test'
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
        <Text style={styles.headerText}>{type}</Text>
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
      setInterval(() => {
        progress = parseFloat(global.curr_cards)/parseFloat(global.total_cards);
        this.setState({ progress });
      }, 500);
    }, 1500);
  }


  render() {
    const {navigation} = this.props;
    const type = navigation.getParam('type', 'Learn');
    const sectionName = navigation.getParam('sectionName', 'Alphabet');


    return (
      <View style={styles.container}>
        <View style={styles.topContainerStyle}>
          <Text style={styles.headerText}>{type}</Text>
          <Text style={styles.subHeaderText}>{sectionName}</Text>
          <Text>Cards Left: {global.cards_left.toString()}</Text>
          <Progress.Bar progress={parseFloat(global.curr_cards)/parseFloat(global.total_cards)} width={200} />          
        </View>
        <Text>Practice Signing:</Text>
        <SwipeCards style={styles.swipeCardsStyle}/>

        <View style={styles.bottomContainerStyle}>
          <Text style={{width:300, textAlign: "center"}}>When you're ready, check your progress by pressing the button and submitting an image!</Text>
          <Button
            containerStyle={styles.button}
            title="Check sign"
            onPress={() =>
              this.props.navigation.push('Camera')}/>         
          <Button
            containerStyle={styles.button}
            title="Back to Learn Menu"
            onPress={() =>
              this.props.navigation.push('LearnMenu')}
          />
        </View>
      </View>
    );
  }
}

class TestScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = 
    {
      progress: 0,
      indeterminate: true
    };
    console.log(global.cards_left);
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
    const type = navigation.getParam('type', 'Test');
    const sectionName = navigation.getParam('sectionName', 'Alphabet');
    return (
      <View style={styles.container}>
        <View style={styles.topContainerStyle}>
          <Text style={styles.headerText}>{type}</Text>
          <Text style={styles.subHeaderText}>{sectionName}</Text>
          <Text>Cards Left: {global.cards_left.toString()}</Text>
          <Progress.Bar progress={parseFloat(global.curr_cards)/parseFloat(global.total_cards)} width={200} />          
        </View>          
        {/*<SwipeCards style={{flex: 1}} />*/}
        <Text style={styles.testQuestionStyle}>{global.cards_left[0].toString().toUpperCase()}</Text>  
        <Text>When you're ready, check your knowledge by pressing the button and submitting a photo!</Text>      
        <Button
          containerStyle={styles.checkButton}
          title="Check sign"
          onPress={() =>
            this.props.navigation.push('Camera')}/>    
{/*TODO:: get this button's position to function properly with*/}            
        <View style={styles.bottomContainerStyle}>
          <Button
            containerStyle={styles.checkButton}
            title="Back to Test Menu"
            onPress={() =>
              this.props.navigation.push('TestMenu')}/>
        </View>              

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
      console.log("data URI: " + data.uri);

      const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', data.uri, true);
      xhr.send(null);
    });

    const ref = firebase
      .storage()
      .ref()
      .child(uuid.v4());
    const snapshot = await ref.put(blob);

    blob.close();

    snapshot.ref.getDownloadURL().then(function(downloadURL) {
      console.log('File available at', downloadURL);
    });
    console.log("download URI: " + snapshot.ref.getDownloadURL());
    console.log("hello!!!!!");

    // return await snapshot.ref.getDownloadURL();


      // const image = data.uri;

      // const Blob = RNFetchBlob.polyfill.Blob
      // const fs = RNFetchBlob.fs
      // window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
      // window.Blob = Blob
   
     
      // let uploadBlob = null
      // const imageRef = firebase.storage().ref('posts').child("test.jpg")
      // let mime = 'image/jpg'
      // fs.readFile(image, 'base64')
      //   .then((data) => {
      //     return Blob.build(data, { type: `${mime};BASE64` })
      // })
      // .then((blob) => {
      //     uploadBlob = blob
      //     return imageRef.put(blob, { contentType: mime })
      //   })
      //   .then(() => {
      //     uploadBlob.close()
      //     console.log(imageRef.getDownloadURL);
      //     return imageRef.getDownloadURL();
      //   })
      //   .then((url) => {
      //     // URL of the image uploaded on Firebase storage
      //     console.log(url);
          
      //   })
      //   .catch((error) => {
      //     console.log(error);
   
      //   })  
      

      this.props.navigation.pop();
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

class InstructionsScreen extends React.Component {
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
      setInterval(() => {
        progress = parseFloat(global.curr_cards)/parseFloat(global.total_cards);
        this.setState({ progress });
      }, 500);
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
          <Text style={styles.subHeaderText}>This view will provide the answers to frequently asked questions as well as general how-tos for the Helping Hands application.            
          </Text>
        </View>                
      </View>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Instructions: InstructionsScreen,
    LearnMenu: LearnMenuScreen,
    Learn: LearnScreen,
    Camera: CameraScreen,
    TestMenu: TestMenuScreen,
    Test: TestScreen,
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
    position: 'absolute',
    top: 0,
    alignItems: "center",
    justifyContent: "center",    
  },
  headerText: {
    fontSize: 36,
    fontWeight: 'bold',
    margin: 25,
  },
  subHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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