import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import OffCanvas from '../src'
import './styles.css';

class App extends Component {
  constructor() {
    super()
    this.state = {
      open: false,
    }

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.setState({
      open: !this.state.open,
    })
  }

  render() {

    return (
      <OffCanvas Content={<div className="menu">
        This is the off canvas section
        <div>
          <button onClick={this.handleClick}>Close the menu</button>
        </div>
      </div>} forceOpenState={this.state.open}>
      <main>This is your main app
        <div>
          <button onClick={this.handleClick}>Open the menu</button>
        </div>
      </main>
      </OffCanvas>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
