import * as React from 'react';
import { Text, View, TouchableOpacity, Button } from 'react-native';
import { Camera, FileSystem, Constants } from 'expo';
import axios from 'axios';
import { createStackNavigator, createAppContainer, withNavigation } from 'react-navigation';
const { API_HOST } = Constants.manifest.extra;

class PanicButton extends React.Component {
  constructor(props:object){
    super(props);
    this.state = {
      type: Camera.Constants.Type.front,
      recording: false,
    }
    this.camera = null;
    this.record = this.record.bind(this);
  }
  async componentDidMount() {
    setTimeout(this.record, 1000);
  }

  async record() {
    const { camera } = this;
  if (camera) {
    console.log('Camera does exist');
    try {
      const { uri } = await camera.recordAsync({
        maxDuration: 10,
      });
      const file = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingTypes.Base64
      })
      console.log('GOT THE FILE', file.slice(0, 10), file.length);
      try {
        console.log('We should send the request');
        const { data } = await axios.post('https://api.cloudinary.com/v1_1/banditation/video/upload', 
          {
            "upload_preset": "lk917uwv",
            "file": "data:image/jpeg;base64," + file
          }
          )
          console.log(data.url);
          try {
            const { userId } = this.props.navigation.state.params;
            const body = {
              url_video: data.url,
              id_user: userId
            };
            const uploadToServer = await axios.post(API_HOST + '/upload', body);
            console.log(uploadToServer.status);
            //const serverUs = [15044442082, 15043390763, 15042107601];
            
            // for await(const number of serverUs) {
              // let body2 = {
              //   recipient: 15044442082,
              //   link: data.url
              // };
              //  axios.post(API_HOST + '/api/messages', body2);
            // }
      

          } catch(e){
            console.log(e);
          }
          } catch(e){
            console.log(e);
          }
    } catch (e) {
      console.log(e);
    }
  }
}
  render() {
    const { hasCameraPermission, hasAudioPermission } = this.props.navigation.state.params;
    if (hasCameraPermission === null && hasAudioPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false && hasAudioPermission === false) {
      return <Text>No access to camera or audio</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.type} ref={ref => { this.camera = ref; }} >
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });
                }}>
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                  {' '}Flip{' '}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={this.record}
              >
              <Text
                  style={{ fontSize: 10, marginBottom: 10, color: 'white' }}>
                  Record
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}

export default withNavigation(PanicButton);