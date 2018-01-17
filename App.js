import React from 'react'
import { ScrollView, View } from 'react-native'
import AddEntry from './components/AddEntry'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'

export default class App extends React.Component {
  render() {
    return (
      <Provider store={createStore(reducer)}>
        <ScrollView style={{flex: 1}}>
          <AddEntry />
        </ScrollView>
      </Provider>
    )
  }
}

