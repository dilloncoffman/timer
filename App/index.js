import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    StatusBar, // use to change color of time and cell network at very top
    TouchableOpacity, // use as a customizable button
    Dimensions, // use to get screen size to style start/stop button
    Picker, // use to allow user to choose time
    Platform, // use to make platform specific changes in styles
} from 'react-native';

const screen = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1, // container takes up entirety of available space
      backgroundColor: "#07121B",
      alignItems: "center", // vertically centers content
      justifyContent: "center"  // horizontally centers content
    },
    button: {
      borderWidth: 10,
      borderColor: "#89AAFF",
      width: screen.width / 2, // make start/stop button 50% of screen size
      height: screen.width / 2,
      borderRadius: screen.width / 2, // makes circle
      alignItems: "center", // aligns start/stop text center in circle
      justifyContent: "center", // display in react native is by default flex, as opposed to on web it wouldn't be
      marginTop: 30
    },
    buttonStop: {
      borderColor: "#FF851B"
    },
    buttonText: {
      fontSize: 45,
      color: "#89AAFF"
    },
    buttonTextStop: {
      color: "#FF851B"
    },
    timerText: {
      color: "#fff",
      fontSize: 90
    },
    picker: {
        width: 50,
        ...Platform.select({ // change styles for picker on Android
            android: {
                color: '#fff',
                backgroundColor: '#07121B',
                marginLeft: 10,
            }
        })
    },
    pickerItem: {
        color: '#fff',
        fontSize: 20
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    }
  });

const formatNumber = (number) => `0${number}`.slice(-2); // gets last two digits only for string to format properly

const getRemaining = (time) => { // gets remaining time in minutes and seconds from remainingSeconds state
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    return { minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
};

const createArray = length => { // populates minutes and seconds arrays
    const arr = [];
    let i = 0;
    while (i < length) {
      arr.push(i.toString());
      i += 1;
    }
  
    return arr;
};

const AVAILABLE_MINUTES = createArray(10); // max minutes is 10
const AVAILABLE_SECONDS = createArray(60); // max seconds 60

export default class App extends React.Component {
    state = {
        remainingSeconds: 5, // timer's remaining seconds
        isRunning: false, // to keep track of if timer is running
        selectedMinutes: '0', // use strings to work with picker
        selectedSeconds: '5',
    }

    interval = null; 

    componentDidUpdate(prevProp, prevState) { 
        // use prevState check to avoid infinite loop, when we call stop we update state again
        if (this.state.remainingSeconds === 0 && prevState.remainingSeconds !== 0) {
            this.stop();
        }
    }

    componentWillUnmount() { // to avoid memory leaks, clear interval
        if (this.interval) { // if an interval exists
            clearInterval(this.interval); // clear it
        }
    }

    start = () => {
        this.setState(state => ({
            remainingSeconds: 
                parseInt(state.selectedMinutes) * 60 + 
                parseInt(state.selectedSeconds), // calculate what remaining seconds are initially
            isRunning: true,
        }));

        this.interval = setInterval(() => { // store setInterval or setTimeout on variable on component
            this.setState(state => (({
                remainingSeconds: state.remainingSeconds - 1
            })));
        }, 1000); // update every one second
    };

    stop = () => {
        clearInterval(this.interval); // clear interval when stopping
        this.interval = null;
        this.setState({
            remainingSeconds: 5, // set remainingSeconds back to (what will be) chosen time
            isRunning: false,
        });
    }

    renderPickers = () => (
      <View style={styles.pickerContainer}>
        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={this.state.selectedMinutes} // user-selected minutes
          onValueChange={itemValue => {
            // update state when picking minutes
            this.setState({ selectedMinutes: itemValue });
        }}
          mode="dropdown" // fixes layout of picker on Android
        >
          {AVAILABLE_MINUTES.map(value => ( // map over values for minutes onto Picker item
            <Picker.Item key={value} label={value} value={value} />
        ))}
        </Picker>
        <Text style={styles.pickerItem}>minutes</Text>
        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={this.state.selectedSeconds} // user-selected seconds
          onValueChange={itemValue => {
          // update state when picking seconds
          this.setState({ selectedSeconds: itemValue });
        }}
          mode="dropdown" // fixes layout of picker on Android
        >
          {AVAILABLE_SECONDS.map(value => (
            <Picker.Item key={value} label={value} value={value} />
        ))}
        </Picker>
        <Text style={styles.pickerItem}>seconds</Text>
      </View>
        )

    render() {
        const { minutes, seconds } = getRemaining(this.state.remainingSeconds);

        return (
          <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            {this.state.isRunning ? ( // if timer is running render time, otherwise render pickers
              <Text style={styles.timerText}>{`${minutes}:${seconds}`}</Text>
            ): this.renderPickers() }
            {this.state.isRunning ? ( // if timer is running render stop button
              <TouchableOpacity onPress={this.stop} style={[styles.button, styles.buttonStop]}>
                <Text style={[styles.buttonText, styles.buttonTextStop]}>Stop</Text>
              </TouchableOpacity>
            ) : ( // otherwise render start button
              <TouchableOpacity onPress={this.start} style={styles.button}>
                <Text style={styles.buttonText}>Start</Text>
              </TouchableOpacity>
            )}
          </View>
        );
    }
}


