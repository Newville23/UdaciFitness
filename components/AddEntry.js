import React, { Component } from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import { getMetricMetaInfo, timeToString } from '../utils/helpers'
import UdaciSlider from './UdaciSlide';
import UdaciSteper from './UdaciSteper';
import DateHeader from './DateHeader';

function SubmitBtn({action}) {
    return(
        <TouchableOpacity
            onPress={action}
        >
            <Text> Submit</Text>
        </TouchableOpacity>
    )
}

export default class AddEntry extends Component{
    state = {
        run: 0,
        bike: 0,
        swim: 5,
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
        this.setState(() => ({
            run: 0,
            bike: 0,
            swim: 0,
            sleep: 0,
            eat: 0
        }))
        //Navigate to home
        //Save to 'DB'
        //Clear local notification
    }
    render() {
        const metaInfo = getMetricMetaInfo()
        return(
            <View>
                <Text>{JSON.stringify(this.state)}</Text>
                <DateHeader date={(new Date()).toLocaleDateString()}/>
               {Object.keys(metaInfo).map((key) => {
                   const { getIcon, type, ...rest} = metaInfo[key]
                   const value = this.state[key]
                    return(
                       <View key={key}>
                        {getIcon()}
                        {type === 'slider'
                            ? <UdaciSlider
                                value={value}
                                onChange={() => this.slide(key, value)}
                                {...rest}
                                />  
                            : <UdaciSteper
                                value={value}
                                onIncrement={() => this.increment()}
                                onDecrement={() => this.decrement()}
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