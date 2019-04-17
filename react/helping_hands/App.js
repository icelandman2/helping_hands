import React from "react";
import { View, Text , Image, StyleSheet} from "react-native";
import { Button } from 'react-native-elements';
import { createStackNavigator, createAppContainer } from "react-navigation";

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
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
  render() {
    const {navigation} = this.props;
    const type = navigation.getParam('type', 'learn');

    return (
      <View style={styles.container}>
        <Text>{type}</Text>
        <Button
          containerStyle={styles.button}
          title="Alphabet"
          onPress={() =>
            this.props.navigation.push('Learn', {
              sectionName: 'alphabet',
              type: type
            })}
        />

        <Button
          containerStyle={styles.button}
          title="Basic Etiquette"
          onPress={() =>
            this.props.navigation.push('Learn', {
              sectionName: 'etiquette',
              type: type,
            })}
        />
      </View>
    );
  }
}

class LearnScreen extends React.Component {
  render() {
    const {navigation} = this.props;
    const type = navigation.getParam('type', 'learn');
    const sectionName = navigation.getParam('sectionName', 'alphabet');

    return (
      <View style={styles.container}>
        <Text>{type}</Text>
        <Text>{sectionName}</Text>
      </View>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Menu: MenuScreen,
    Learn: LearnScreen
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
   }
})