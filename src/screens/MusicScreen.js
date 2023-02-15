import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {useRoute} from '@react-navigation/native';
import {Slider} from '@miblanchard/react-native-slider';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import {songs} from '../MusicData';
import TrackPlayer, {
  Capability,
  usePlaybackState,
  useProgress,
  State,
} from 'react-native-track-player';

const {height, width} = Dimensions.get('window');

const MusicScreen = () => {
  const routes = useRoute();
  const [currentSong, setCurrentSong] = useState(routes.params.index);
  const ref = useRef();
  const playbackState = usePlaybackState();
  const progress=useProgress()

  const setupPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        // Media controls capabilities
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],

        // Capabilities that will show up when the notification is in the compact form on Android
        compactCapabilities: [Capability.Play, Capability.Pause],
      });
      await TrackPlayer.add(songs);
      await TrackPlayer.skip(currentSong);
      togglePlayback(playbackState);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      ref.current.scrollToIndex({
        animated: true,
        index: currentSong,
      });
    }, 500);
  }, []);

  useEffect(() => {
    setupPlayer();
  }, []);

  const togglePlayback = async playbackState => {
    // console.log(playbackState);
    if (
      playbackState === State.Paused ||
      playbackState === State.Ready ||
      playbackState === State.Buffering ||
      playbackState === State.Connecting
    ) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  };

  return (
    <View style={styles.container}>
      {/* <Image source={routes.params.data.image} style={styles.banner} /> */}
      {/* {console.log(currentSong)} */}
      <View>
        <FlatList
          data={songs}
          ref={ref}
          renderItem={({item, index}) => {
            return (
              <View style={styles.bannerView}>
                <Image source={item.artwork} style={styles.banner} />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.singer}>{item.artist}</Text>
              </View>
            );
          }}
          onScroll={async e => {
            const x = e.nativeEvent.contentOffset.x / width;
            await TrackPlayer.skip(parseInt(x.toFixed(0)));
            togglePlayback(playbackState);
          }}
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.slider}>
        <Slider 
          value={progress.position}
          maximumValue={progress.duration}
          minimumValue={0}
          thumbStyle={{width: 20, height: 20}}
          thumbTintColor={'black'}
          // onValueChange={async(position)=>{
          //   // await TrackPlayer.seekTo(position)
          //   console.log(typeof position)
          // }}
          onSlidingComplete={async(x)=>{
            await TrackPlayer.seekTo(parseInt(x))
          }}
        />
      </View>
      <View style={styles.btnArea}>
        <TouchableOpacity
          onPress={async () => {
            if (currentSong > 0) {
              setCurrentSong(currentSong - 1);
              ref.current.scrollToIndex({
                animated: true,
                index: parseInt(currentSong) - 1,
              });
              await TrackPlayer.skip(parseInt(currentSong) - 1);
              togglePlayback(playbackState);
            }
            // console.log(currentSong)
          }}>
          <Text>
            <AntDesign name="stepbackward" size={35} color="#000" />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            // await TrackPlayer.skip(0);
            togglePlayback(playbackState);
          }}>
          {playbackState === State.Paused || playbackState === State.Ready ? (
            <Text style={styles.playButtonContainer}>
              <AntDesign name="caretright" size={30} color="#fff" />
            </Text>
          ) : (
            <Text style={styles.pauseButtonContainer}>
              <AntDesign name="pausecircle" size={50} color="#000" />
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            if (songs.length - 1 > currentSong) {
              setCurrentSong(currentSong + 1);
              ref.current.scrollToIndex({
                animated: true,
                index: parseInt(currentSong) + 1,
              });
              await TrackPlayer.skip(parseInt(currentSong) + 1);
              togglePlayback(playbackState);
            }
          }}>
          <Text>
            <AntDesign name="stepforward" size={35} color="#000" />
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.btnArea2}>
        <TouchableOpacity>
          <Entypo name="shuffle" size={35} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="repeat" size={35} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerView: {
    width: width,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    // borderWidth: 2
  },
  banner: {
    height: 280,
    width: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
    // marginTop: 50,
    borderRadius: 10,
  },
  title: {
    marginTop: 10,
    fontSize: 30,
    marginLeft: 20,
    fontWeight: '700',
    color: '#000',
  },
  singer: {
    marginLeft: 20,
    marginTop: 10,
    fontSize: 16,
    color: '#000',
  },
  slider: {
    marginTop: 20,
    alignSelf: 'center',
    width: '90%',
  },
  btnArea: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 20,
    // borderWidth: 1,
    height: 60,
  },
  playButtonContainer: {
    borderRadius: 50,
    padding: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButtonContainer: {
    borderRadius: 50,
    // backgroundColor: '#000',
  },
  btnArea2: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 20,
  },
});

export default MusicScreen;
