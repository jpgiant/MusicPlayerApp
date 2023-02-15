import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const {height, width} = Dimensions.get('window');

const MusicListItem = ({item, index, data}) => {
    const navigation=useNavigation()
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {marginBottom: index === data.length - 1 ? 30 : 0},
      ]} onPress={()=>{navigation.navigate('Music',{data: item, index: index})}}>
        <Image
            source={item.artwork}
            style={styles.songImage}
        />
        <View style={styles.nameView}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.singer}>{item.artist}</Text>
        </View>
        <TouchableOpacity>
            <Image
                source={require('../images/play.png')}
                style={styles.play}
            />
        </TouchableOpacity>
      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 25,
    height: 100,
    elevation: 5,
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center'
    // justifyContent:'center'
  },
  songImage:{
    height: 90,
    width: 80,
    borderRadius: 10,
    marginLeft: 7,
    resizeMode: 'contain'  ,
    // marginTopL   
  },
  nameView:{
    paddingLeft: 15,
    // borderWidth: 1,
    width: 200
  },
  title:{
    fontSize: 16,
    fontWeight: '600',
    color: '#000'
  },
  singer:{
    fontSize: 14
  },
  play:{
    width: 30,
    height: 30,
    marginLeft: 36
    
  }
});

export default MusicListItem;
