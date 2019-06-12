import React, { Component } from "react";
import { AppRegistry, TouchableHighlight, View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import { Button } from 'react-native-elements';
import firebase from '../../config/firebase';
import RNFetchBlob from 'rn-fetch-blob';
import {RNCamera} from 'react-native-camera';

import uuid from 'uuid';

/*
 * class CameraScreen
 * ------------------------------------------------------
 * This is the screen that handles taking pictures of the student's attempts to reproduce 
 * a word or letter that they were prompted to sign by the app's TestScreen class. This class interacts
 * with the serverless Helping Hands backend to return a prediction of whether or not a student's attempt
 * at a symbol was correct or not.
 */

export default class CameraScreen extends React.Component {
constructor(props) {
    super(props);

    this.state = 
    {
      prediction: "default",
    };
  }

  /*
   * function: takePicture()
   * ---------------------------------
   * Calls the Google Cloud Function running at 
   * https://us-central1-helping-hands-cs194.cloudfunctions.net/test10 where a cloud function is 
   * that has access to the Helping Hands ASL letters model and runs inference against it
   * using the input photo taken by the user in their attempt to reproduce the symbol that they
   * were prompted to on the test screen.
   */

  takePicture = async function() {
    var nav = this.props.navigation;

    //we need to be able to find the camera for our image-mediated verification
    //that the student has learned the sign to work
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log("data URI: " + data.uri);

      //This blob posts an image to firebase, receiving the URL that the image file
      //is stored at back in the response
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

      //gets the image URL of the photo that we just took on the phone and uploaded to firebase
      //then post that URL to our Computer Vision model running in the cloud for inference 
      //too see if the user signed correctly 
      snapshot.ref.getDownloadURL().then(function(downloadURL) {
        var image_url = (downloadURL.split("/")[7]).split("?")[0];
        var token = downloadURL.split("=")[2];

        var prediction = "DEFAULT";

        //post the downloaded image to the ASL model running as a google cloud function
      //   fetch('https://us-central1-helping-hands-cs194.cloudfunctions.net/test10', {
      //     method: 'POST',
      //     headers: {
      //       Accept: 'application/json',
      //       'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify({
      //       image_url: image_url,
      //       token: token

      //     }),
      //   })
      //   .then((response) => response.json())
      //   .then((responseJson) => {
      //     //navigate to the results page to report whether the student got the sign right or wrong
      //     nav.navigate('Results', {
      //       prediction: responseJson.sign,
      //     });
      //   })
      //   .catch((error) =>{
      //     console.error(error);
      //   });
      // });
      //post the downloaded image to the ASL model running as a google cloud function
        var gcloud_url = 'https://us-central1-helping-hands-cs194.cloudfunctions.net/test10';
        if (global.section_name != "Alphabet") {
          gcloud_url = 'https://us-central1-helping-hands-cs194.cloudfunctions.net/test10-numbers'
        }
        fetch(gcloud_url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            image_url: image_url,
            token: token
          }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
          //navigate to the results page to report whether the student got the sign right or wrong
          nav.navigate('Results', {
            prediction: responseJson.sign,
          });
        })
        .catch((error) =>{
          console.error(error);
        })
      });
  }
}
  /*
   * WORKAROUND ALERT!
   * To get the RNCamera library to properly use the front camera on iOS,
   * we needed to comment out the "onGoogleVisionBarcodesDetected" property on the 
   * RNCamera tag. This solution was described here: https://github.com/react-native-community/react-native-camera/issues/2252
   * and should be removed if/when the library is patched to fix this error.
   */

  render() {
    return (
      <View style={styles.container}>
            <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.front}
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
          /*{/*onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.log(barcodes);
          }}}*/
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    top: 0,
    left: 0,
    textAlign: 'center',
    // backgroundColor: '#e9ebee',
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