import React, { Component } from "react";
import { AppRegistry, TouchableHighlight, View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
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
    fetch('https://us-central1-helping-hands-cs194.cloudfunctions.net/test10', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_url: "30604346-b28f-4c64-bb1f-64548f16f96f",
        token: "x83ff2d78-5bab-4e39-8908-174536f613de",
      }),
      })
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
        {/*<Button
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
        />*/}
        <View style={styles.moduleContainerStyle}>
          <View style={styles.moduleButtonContainer}>
            <View style={styles.CircleShapeView}>
              <View style={styles.InnerCircleShapeView}>  
                <TouchableOpacity onPress={() => this.props.navigation.push('TestMenu', {
                  type: 'TestMenu',
                })}>
                  <Image
                    style={styles.moduleButton}
                    source={require('./img/test.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>  
            <TouchableOpacity 
              containerStyle={styles.moduleButtonText}
              onPress={() => this.props.navigation.push('TestMenu', {
              type: 'TestMenu',
            })}
            ><Text style={styles.moduleButtonText}>Test</Text></TouchableOpacity>        
          </View>
          <View style={styles.moduleButtonContainer}>
            <View style={styles.CircleShapeView}>
              <View style={styles.InnerCircleShapeView}>  
                <TouchableOpacity onPress={() => this.props.navigation.push('LearnMenu', {
                type: 'LearnMenu',
              })}>
                  <Image
                    style={styles.moduleButton}
                    source={require('./img/learn.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>                    
            <TouchableOpacity 
            containerStyle={styles.moduleButtonText}
            onPress={() => this.props.navigation.push('LearnMenu', {
            type: 'LearnMenu',
          })}
          ><Text style={styles.moduleButtonText}>Learn</Text></TouchableOpacity>      
          </View>
        </View>
        <Button
          containerStyle={styles.button}
          title="Instructions"
          onPress={() => this.props.navigation.push('Instructions', {
            type: 'Instructions',
          })}
        />
        <Button
          containerStyle={styles.button}
          title="Test Gcloud"
          onPress={() => this.test_google_cloud()}
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
    global.cards_left = ['a', 'b', 'c', 'd', 'p'];
    // global.cards_left = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
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
        <View style={styles.topContainerStyle}>
          <Text style={styles.headerText}>{type}</Text>
        </View>
        <View style={styles.moduleContainerStyle}>
          <View style={styles.moduleButtonContainer}>
            <View style={styles.CircleShapeView}>
              <View style={styles.InnerCircleShapeView}>  
                <TouchableOpacity onPress={this.pressAlphabet.bind(this)}>
                  <Image
                    style={styles.moduleButton}
                    source={require('./img/alphabet_signs/a.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity 
              containerStyle={styles.moduleButtonText}
              onPress={this.pressEtiquette.bind(this)}
            ><Text style={styles.moduleButtonText}>Alphabet</Text></TouchableOpacity>
          </View>
          <View style={styles.moduleButtonContainer}>
            <View style={styles.CircleShapeView}>
              <View style={styles.InnerCircleShapeView}>  
                <TouchableOpacity onPress={this.pressEtiquette.bind(this)}>
                  <Image
                    style={styles.moduleButton}
                    source={require('./img/thankyou.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity 
              containerStyle={styles.moduleButtonText}
              title="Basic Etiquette"
              onPress={this.pressEtiquette.bind(this)}
            ><Text style={styles.moduleButtonText}>Basic Etiquette</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

class TestMenuScreen extends React.Component {

  pressAlphabet= async function() {
    this.props.navigation.push('Test', {
              sectionName: 'Alphabet',
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
              sectionName: 'Etiquette',
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
        <View style={styles.topContainerStyle}>
          <Text style={styles.headerText}>{type}</Text>
        </View>
        <View style={styles.moduleContainerStyle}>
          <View style={styles.moduleButtonContainer}>
            <View style={styles.CircleShapeView}>
              <View style={styles.InnerCircleShapeView}>            
                <TouchableOpacity onPress={this.pressAlphabet.bind(this)}>
                  <Image
                    style={styles.moduleButton}
                    source={require('./img/alphabet_signs/a.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity 
              containerStyle={styles.moduleButtonText}
              onPress={this.pressEtiquette.bind(this)}
            ><Text style={styles.moduleButtonText}>Alphabet</Text></TouchableOpacity>
          </View>
          <View style={styles.moduleButtonContainer}>
            <View style={styles.CircleShapeView}>
              <View style={styles.InnerCircleShapeView}>                        
                <TouchableOpacity onPress={this.pressEtiquette.bind(this)}>
                  <Image
                    style={styles.moduleButton}
                    source={require('./img/thankyou.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity 
              containerStyle={styles.moduleButtonText}
              title="Basic Etiquette"
              onPress={this.pressEtiquette.bind(this)}
            ><Text style={styles.moduleButtonText}>Basic Etiquette</Text></TouchableOpacity>
          </View>
        </View>
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

    global.type = type;
    global.section_name = sectionName;


    return (
      <View style={styles.container}>
        <View style={styles.topContainerStyle}>
          <Text style={styles.headerText}>{type}</Text>
          <Text style={styles.subHeaderText}>{sectionName}</Text>
          <Text>Cards Left: {global.cards_left.toString()}</Text>
          <Progress.Bar progress={parseFloat(global.curr_cards)/parseFloat(global.total_cards)} width={200} />          
        </View>
        <Text>Current card: {global.current_sign}</Text>
        <SwipeCards style={styles.swipeCardsStyle}/>

        <View style={styles.bottomContainerStyle}>
          <Text style={styles.paragraphText}>Swipe right when you're done learning a sign. Swipe left to do more learning later.</Text>                 
          <Button
            containerStyle={styles.checkButton}
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
        <Text style={styles.paragraphText}>When you're ready, check your knowledge by pressing the button and submitting a photo!</Text>      
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

    this.state = 
    {
      prediction: "default",
    };
  }

  takePicture = async function() {
    var nav = this.props.navigation;

    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log("data URI: " + data.uri);

      /*const blob = await new Promise((resolve, reject) => {
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

      var image_url = (downloadURL.split("/")[7]).split("?")[0];
      var token = downloadURL.split("=")[2];

      var prediction = "DEFAULT";

      console.log('Image URL:', image_url);
      console.log('Token:', token);
//MARK PLACE
      fetch('https://us-central1-helping-hands-cs194.cloudfunctions.net/test10', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_url: "30604346-b28f-4c64-bb1f-64548f16f96f",
        token: "x83ff2d78-5bab-4e39-8908-174536f613de",
      }),
      })
      .then((response) => response.json())
      .then((responseJson) => {
        nav.push('Results', {
            prediction: responseJson.sign,
          });


      })
      .catch((error) =>{
        console.error(error);
      });*/
    nav.push('Results', {
            prediction: 'a',
          });

      // fetch('https://us-central1-helping-hands-cs194.cloudfunctions.net/test10', {
      //   method: 'POST',
      //   headers: {
      //     Accept: 'application/json',
      //       'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     image_url: image_url,
      //     token: token,
      //   }),
      //   })
      // .then((response) => response.json())
      // .then((responseJson) => {
      //   this.setState({
      //     prediction: responseJson.sign,
      //   }, function(){

      //   });

      // })
      //   .catch((error) =>{
      //     console.error(error);
      //   });

        
    //});
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
      
    // this.props.navigation.push('Results', {
    //         prediction: 'a',
    //       })
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

class ResultsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  goBackToSigns= async function() {
    this.props.navigation.push(global.type, {
              sectionName: global.section_name,
              type: global.type
            });
    global.cards_left = global.cards_left.filter(item => item !== global.current_sign);

    global.curr_cards = global.curr_cards+1;

  };
        

  render() {
    const {navigation} = this.props;
    const prediction = navigation.getParam('prediction', 'default');

    var check = "";
    if (prediction==(global.current_sign).toUpperCase()) {
      check = "Correct :)";
      paragraphText = "Nice job!"
      global.learned.push(global.current_sign);

    } else {
      check = "Incorrect :(";
      paragraphText = "Just a little more practice!";
      global.not_learned.push(global.current_sign);
    }
    return (
      <View style={styles.container}>
        <View style={styles.topContainerStyle}>      
        <Text style={styles.headerText}>Results</Text>        
      </View>
        <Text style={styles.subHeaderText}>{check}</Text>
        <Text style={styles.paragraphText}>{paragraphText}</Text>
        <Text style={styles.subHeaderText}>Correct sign: {global.current_sign.toUpperCase()}</Text>

        <Image source={images[global.current_sign]} 
           style={{flex:0.4, width:300, height:300, resizeMode: 'contain'}}/>

        <Text style={styles.subHeaderText}>You signed: {prediction.toUpperCase()}</Text>
        {
          /* TODO::
          Work on this "continue" button right here
          Intended: go to test screen and present a different test sign
          */
        }
        <Button
          containerStyle={styles.button}
          title="Continue"
          onPress={this.goBackToSigns.bind(this)}
        />

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