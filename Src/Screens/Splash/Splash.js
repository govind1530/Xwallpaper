import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Splash = () => {
  return (
    <View style={styles.Container}>
      <Text>Splash</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Splash;
