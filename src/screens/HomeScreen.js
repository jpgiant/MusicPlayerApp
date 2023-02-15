import { View, Text, StyleSheet, FlatList } from 'react-native'
import React from 'react'
import { songs } from '../MusicData'
import MusicListItem from '../common/MusicListItem.js'

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Music Player App</Text>
      </View>
      <FlatList
        data={songs}
        renderItem={({item, index})=>{
            return(
                <MusicListItem item={item} index={index} data={songs}/>
            )
        }}
      />
    </View>
  )
}

const styles=StyleSheet.create({
    container:{
        flex: 1
    },
    header:{
        height: 60,
        backgroundColor: '#fff',
        width: '100%',
        elevation: 10,
        justifyContent: 'center'
    },
    logo:{
        fontSize: 20,
        fontWeight: '700',
        marginLeft: 20,
        textAlign: 'center'

    }
})

export default HomeScreen