import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import OffCanvas from '../src'
import './styles.css'

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
      <OffCanvas
        Content={
          <div className="menu">
            <p>This is the off canvas section</p>
            <p>
              <button
                type="button"
                onClick={this.handleClick}
                className="button"
              >
                Close the menu
              </button>
            </p>
          </div>
        }
        forceOpenState={this.state.open}
      >
        <main>
          <p>This is your main app</p>
          <p>
            <button type="button" onClick={this.handleClick} className="button">
              Open the menu
            </button>
          </p>
        </main>
      </OffCanvas>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
