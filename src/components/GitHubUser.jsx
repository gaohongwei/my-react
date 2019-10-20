import React, { useState, Fragment } from 'react';
import getUser from '../utils/api_github'
export default class GitHubUser extends React.Component{
  constructor(){
    super()
    this.state ={
      userinfor: {}
    }
  }

  componentDidMount(){
    getUser('gaohongwei').
    then( response => {
      console.log(response)
      this.setState({ userinfor: response.data})
    })

    //this.setState({userinfor: user})
  }


  render(){
    let userinfor = this.state.userinfor;
    console.log(userinfor)

    let keys = Object.keys(userinfor)
    return (
      <ul>
        User Infor: {keys.map( key =>
          <li>{`${key}: ${userinfor[key]}`}</li>
        )}

      </ul>
    )
  }
}

