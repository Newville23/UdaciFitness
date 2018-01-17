import React, {Component} from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { FontAwesome, Entypo } from '@expo/vector-icons'
import { white, purple } from '../utils/colors'

export default function UdaciSteper({value, unit, max, onIncrement, onDecrement}) {
    return (
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={onDecrement}>
                    <FontAwesome name='minus' size={30} color={'black'}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={onIncrement}>
                    <FontAwesome name='plus' size={30} color={'black'}/>
                </TouchableOpacity>
            </View>
            <View>
                <Text>{value}</Text>
                <Text>{unit}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    iosBtn: {
        borderColor:  purple,
        borderWidth: 1,
        borderRadius: 1,
    },
    androidBtn: {

    }
})
