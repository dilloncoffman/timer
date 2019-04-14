import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    StatusBar, // use to change color of time and cell network at very top
    TouchableOpacity, // use as a customizable button
    Dimensions, // use to get screen size to style start/stop button
} from 'react-native';

const screen = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1, // container takes up entirety of available space
      backgroundColor: '#07121B',
      alignItems: 'center', // vertically centers content
      justifyContent: 'center' // horizontally centers content
    },
    button: {
        borderWidth: 10,
        borderColor: '#89AAFF',
        width: screen.width / 2, // make start/stop button 50% of screen size
        height: screen.height / 2,
        borderRadius: screen.width / 2, // makes circle
        alignItems: 'center', // aligns start/stop text center in circle
        justifyContent: 'center', // display in react native is by default flex, as opposed to on web it wouldn't be
        marginTop: 30,
    },
    buttonText: {
        fontSize: 45,
        color: '#89AAFF'
    },
    timerText: {
        color: '#fff',
        fontSize: 90
    }
  });

const formatNumber = (number) => `0${number}`.slice(-2); // gets last two digits only for string to format properly

const getRemaining = (time) => { // gets remaining time in minutes and seconds from remainingSeconds state
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    return { minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
};

export default class App extends React.Component {
    state = {
        remainingSeconds: 90,
    }

    render() {
        const { minutes, seconds } = getRemaining(this.state.remainingSeconds);

        return (
          <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Text style={styles.timerText}>{`${minutes}:${seconds}`}</Text>
            <TouchableOpacity onPress={() => alert('Testing...')} style={styles.button}>
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
          </View>
        );
    }
}


