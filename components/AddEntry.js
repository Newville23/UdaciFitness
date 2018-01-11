import React, { Component } from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import { getMetricMetaInfo, timeToString, getDailyReminderValue } from '../utils/helpers'
import { submitEntry, removeEntry } from '../utils/api'
import { connect } from  'react-redux'
import UdaciSlide from './UdaciSlide';
import UdaciSteper from './UdaciSteper';
import DateHeader from './DateHeader';
import TextButton from './TextButton'
import {Ionicons} from '@expo/vector-icons'
import { addEntry } from '../actions' 


function SubmitBtn({action}) {
    return(
        <TouchableOpacity
            onPress={action}
        >
            <Text> Submit</Text>
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
            return (
              <View>
                <Ionicons
                  name={'ios-happy-outline'}
                  size={100}
                />
                <Text>You already logged your information for today.</Text>
                <TextButton onPress={this.reset}>
                  Reset
                </TextButton>
              </View>
            )
          }                        
        return(
            <View>
                <DateHeader date={(new Date()).toLocaleDateString()}/>
               {Object.keys(metaInfo).map((key) => {
                   const { getIcon, type, ...rest} = metaInfo[key]
                   const value = this.state[key]
                    return(
                       <View key={key}>
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

function mapStateToProps (state) {
    const key = timeToString()
    return {
      alreadyLogged: state[key] && typeof state[key].today === 'undefined'
    }
  }
  

export default connect(mapStateToProps)(AddEntry)