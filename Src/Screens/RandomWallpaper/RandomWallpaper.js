import React from 'react';
import {
  View,
  Text,
  Animated,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  PermissionsAndroid,
  Alert,
  Platform,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-toast-message';
const {height, width} = Dimensions.get('screen');
const data = [
  'https://cdn.dribbble.com/users/3281732/screenshots/11192830/media/7690704fa8f0566d572a085637dd1eee.jpg?compress=1&resize=1200x1200',
  'https://cdn.dribbble.com/users/3281732/screenshots/13130602/media/592ccac0a949b39f058a297fd1faa38e.jpg?compress=1&resize=1200x1200',
  'https://cdn.dribbble.com/users/3281732/screenshots/9165292/media/ccbfbce040e1941972dbc6a378c35e98.jpg?compress=1&resize=1200x1200',
  'https://cdn.dribbble.com/users/3281732/screenshots/11205211/media/44c854b0a6e381340fbefe276e03e8e4.jpg?compress=1&resize=1200x1200',
  'https://cdn.dribbble.com/users/3281732/screenshots/7003560/media/48d5ac3503d204751a2890ba82cc42ad.jpg?compress=1&resize=1200x1200',
  'https://cdn.dribbble.com/users/3281732/screenshots/6727912/samji_illustrator.jpeg?compress=1&resize=1200x1200',
  'https://cdn.dribbble.com/users/3281732/screenshots/13661330/media/1d9d3cd01504fa3f5ae5016e5ec3a313.jpg?compress=1&resize=1200x1200',
];

const imageW = width * 0.8;
const imageH = imageW * 1;

const RandomWallpaper = () => {
  const scrollX = React.useRef(new Animated.Value(0)).current;

  const getPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Image Download Permission',
          message: 'Your permission is required to save images to your device',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
      Alert.alert(
        'Save remote Image',
        'Grant Me Permission to save Image',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    } catch (err) {
      Alert.alert(
        'Save remote Image',
        'Failed to save Image: ' + err.message,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    }
  };

  const handleDownload = async (item) => {
    // if device is android you have to ensure you have permission
    if (Platform.OS === 'android') {
      const granted = await getPermissionAndroid();
      if (!granted) {
        return;
      }
    }
    // this.setState({saving: true});
    RNFetchBlob.config({
      fileCache: true,
      appendExt: 'png',
    })
      .fetch('GET', item)
      .then((res) => {
        CameraRoll.save(res.data, 'photo')
          .then(() => {
            Toast.show({
              type: 'success',
              position: 'top',
              text1: 'Hurreeyyyy!',
              text2: 'Wallpaper download successfully 👋',
              visibilityTime: 4000,
              autoHide: true,
              //  topOffset: 30,
              //bottomOffset: 40,
              onShow: () => {},
              onHide: () => {},
              onPress: () => {},
            });
          })
          .catch((err) => {
            Toast.show({
              type: 'error',
              position: 'top',
              text1: 'Try Agian!',
              text2: 'Wallpaper download failed',
              visibilityTime: 4000,
              autoHide: true,
              topOffset: 30,
              bottomOffset: 40,
              onShow: () => {},
              onHide: () => {},
              onPress: () => {},
            });
          })
          .finally(() => {});
      })
      .catch((error) => {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Try Agian!',
          text2: 'Wallpaper download failed',
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 40,
          onShow: () => {},
          onHide: () => {},
          onPress: () => {},
        });
      });
  };

  const renderImage = (item) => {
    //console.log(item.item);
    return (
      <TouchableOpacity
        style={styles.coursalImageMainView}
        onPress={() => handleDownload(item.item)}>
        <Image source={{uri: item.item}} style={styles.coursalImage} />
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.Container}>
      <StatusBar hidden />
      <View style={StyleSheet.absoluteFillObject}>
        {data.map((image, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
          });
          return (
            <Animated.Image
              key={`Image-${index}`}
              source={{uri: image}}
              style={[StyleSheet.absoluteFillObject, {opacity}]}
              blurRadius={15}
            />
          );
        })}
      </View>
      <Animated.FlatList
        data={data}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: true},
        )}
        horizontal
        pagingEnabled
        keyExtractor={(item, index) => {
          item + index;
        }}
        renderItem={renderImage}
      />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#000',
  },
  coursalImage: {
    width: imageW,
    height: imageH,
    resizeMode: 'cover',
    borderRadius: 16,
  },
  coursalImageMainView: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RandomWallpaper;
