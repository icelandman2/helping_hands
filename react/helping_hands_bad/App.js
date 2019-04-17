/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Alert, Platform, StyleSheet, Text, View, Image, Button} from 'react-native';
import {StackNavigator} from 'react-navigation';

const HomeScreen = () => (
  <Text> Hello from the home screen!</Text>
)

const App = StackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      headerTitle: 'Home'
    }
  }
})

export default App
// const MainNavigator = createStackNavigator({
//   Home: {screen: Homescreen},
//   Learn: {screen: LearnScreen},
// });

// const App = createAppContainer(MainNavigator);

// export default App;

// class HomeScreen extends React.Component {
//   static navigationOptions = {title: 'Welcome'};
//   render() {
//     const {navigate} = this.props.navigation;
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>
//         <Text style={styles.bigBlue}>Hello world!</Text>
//         <Image source = {pic} style={{width: 193, height: 100}}/>
//         <Greeting flower='sunflower' />
//         <Greeting flower='daisy' />
        
//         <View style={styles.buttonContainer}>
//           <Button
//             onPress={this._hellooo}
//             title="Press me!!"
//           />
//         </View>
//         <Blink text='Blinkkkkkk' />
        
//       </View>
//       // <Button title="Learn!"
//       //         onPress={()=> navigate('Learn', {name: 'Jane'})}/>
//     );
//   }
// }

// class LearnScreen extends React.Component {
//   render() {
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>
//         <Text style={styles.bigBlue}>Hello world!</Text>
//         <Image source = {pic} style={{width: 193, height: 100}}/>
//         <Greeting flower='sunflower' />
//         <Greeting flower='daisy' />
        
//         <View style={styles.buttonContainer}>
//           <Button
//             onPress={this._hellooo}
//             title="Press me!!"
//           />
//         </View>
//         <Blink text='Blinkkkkkk' />
        
//       </View>
//   }
// }

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//   android:
//     'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });

// class Greeting extends Component {
//   render() {
//     return (
//       <View style={{alignItems: 'center'}}>
//         <Text>Hello {this.props.flower}!</Text>
//       </View>
//     );
//   }
// }

// class Blink extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {isShowingText: true};

//     setInterval(() => (
//       this.setState(previousState => (
//         {isShowingText: !previousState.isShowingText}
//       ))
//     ), 1000);
//   }
//   render() {
//     if (!this.state.isShowingText) {
//       return null;
//     }
//     return (
//       <Text>{this.props.text}</Text>
//     );
//   }
// }

// type Props = {};
// export default class App extends Component<Props> {
//   _hellooo() {
//     Alert.alert('Hellloooooo')
//   }
//   render() {
//     let pic = {
//       uri: 'https://www.johnnyseeds.com/dw/image/v2/BBBW_PRD/on/demandware.static/-/Sites-jss-master/default/dw2f79264c/images/products/flowers/01814_01_sunrichorangesum.jpg?sw=387&cx=302&cy=0&cw=1196&ch=1196'
//     };
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>
//         <Text style={styles.bigBlue}>Hello world!</Text>
//         <Image source = {pic} style={{width: 193, height: 100}}/>
//         <Greeting flower='sunflower' />
//         <Greeting flower='daisy' />
        
//         <View style={styles.buttonContainer}>
//           <Button
//             onPress={this._hellooo}
//             title="Press me!!"
//           />
//         </View>
//         <Blink text='Blinkkkkkk' />
        
//       </View>
//       // <View style={styles.container}>
//       //   <Text style={styles.welcome}>Welcome to React Native!</Text>
//       //   <Text style={styles.instructions}>To get started, edit App.js</Text>
//       //   <Text style={styles.instructions}>{instructions}</Text>
//       // </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
//   bigBlue: {
//     color: 'blue',
//     fontWeight: 'bold',
//     fontSize: 30,
//   }
// });
