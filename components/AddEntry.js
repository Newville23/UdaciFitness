import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native'
import { getMetricMetaInfo, timeToString, getDailyReminderValue } from '../utils/helpers'
import { submitEntry, removeEntry } from '../utils/api'
import { connect } from 'react-redux'
import UdaciSlide from './UdaciSlide';
import UdaciSteper from './UdaciSteper';
import DateHeader from './DateHeader';
import TextButton from './TextButton'
import {Ionicons} from '@expo/vector-icons'
import { addEntry } from '../actions' 
import { white, purple } from '../utils/colors'

function SubmitBtn({action}) {
    return(
        <TouchableOpacity
            style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn}
            onPress={action}
        >
            <Text style={styles.submitBtnText}> Submit</Text>
        </TouchableOpacity>
    )
}

class AddEntry extends Component{
    state = {
        run: 0,
        bike: 0,
        swim: 0,
        sleep: 0,
        eat: 0,
    }
    increment = (metric) => {
        const {max, step} = getMetricMetaInfo(metric)

        this.setState((state)=>{
            const count = state[metric] + step
            return {
                ...state,
                [metric]: count > max ? max : count, 
            }
        })
    }
    decrement = (metric) => {
        this.setState((state) => {
            const count = state[metric] - getMetricMetaInfo(metric).step
            return {
                ...state,
                [metric]: count < 0 ? 0 : count, 
            }
        })
    }
    slide = (metric, value) => {
        this.setState(() => ({
            [metric]: value,
        }))
    }
    submit = () => {
        const key = timeToString()
        const entry = this.state

        //update Redux
        this.props.dispatch(addEntry({
            [key]: entry 
        }))
        
        this.setState(() => ({
            run: 0,
            bike: 0,
            swim: 0,
            sleep: 0,
            eat: 0
        }))
        //Navigate to home
        //Save to 'DB'
        submitEntry({key, entry})
        //Clear local notification
    }
    reset = () => {
        const key = timeToString()

        this.props.dispatch(addEntry({
            [key]: getDailyReminderValue()
        }))
        //Navigate to home
        //Save to 'DB'
        removeEntry(key)
        //Clear local notification
    }
    render() {
        const metaInfo = getMetricMetaInfo()  
        if (this.props.alreadyLogged) {
            console.log(this.props.alreadyLogged)
            return (
              <View style={styles.center}>
                <Ionicons
                  name={Platform.OS === 'ios' ? 'ios-happy-outline' : 'md-happy'}
                  size={100}
                />
                <Text>You already logged your information for today.</Text>
                <TextButton style={{padding: 10}} onPress={this.reset}>
                  Reset
                </TextButton>
              </View>
            )
          }                     
        return(
            <View style={styles.container}>
                <DateHeader date={(new Date()).toLocaleDateString()}/>
               {Object.keys(metaInfo).map((key) => {
                   const { getIcon, type, ...rest} = metaInfo[key]
                   const value = this.state[key]
                    return(
                       <View key={key} style={styles.row}>
                        {getIcon()}
                        {type === 'slider'
                            ? <UdaciSlide
                                value={value}
                                onChange={(value) => this.slide(key, value)}
                                {...rest}
                                />  
                            : <UdaciSteper
                                value={value}
                                onIncrement={() => this.increment(key)}
                                onDecrement={() => this.decrement(key)}
                                {...rest}
                                />
                        }
                       </View> 
                    )
               })   
               }
               <SubmitBtn action={this.submit}/>
            </View>
        )
    }
} 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: white
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    center: {   
         flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 30,
        marginRight: 30,
    },
    iosSubmitBtn: {
        backgroundColor: purple,
        borderRadius: 7,
        height: 45,
        padding: 10,
        marginLeft: 40,
        marginRight: 40,
    },
    androidSubmitBtn: {
        backgroundColor: purple,
        borderRadius: 2,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        height: 45,
    },
    submitBtnText: {
        color: white,
        fontSize: 22,
        textAlign: 'center' 
    }
})


function mapStateToProps (state) {
    const key = timeToString()
    return {
      alreadyLogged: state[key] && typeof state[key].today === 'undefined'
    }
  }

export default connect(mapStateToProps)(AddEntry)