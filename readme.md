# React Off Canvas Menu

[![Build Status](https://travis-ci.org/spirift/react-off-canvas-menu.png?branch=master)](https://travis-ci.org/spirift/react-off-canvas-menu)
[![codecov](https://codecov.io/gh/spirift/react-off-canvas-menu/branch/master/graph/badge.svg)](https://codecov.io/gh/spirift/react-off-canvas-menu)

React Off Canvas Menu is a React component that produces an off canvas area that can slide on and off the screen. It is draggable on touch from the left and can also be controlled with buttons. It also emits state change for easy interaction with state controllers like redux.

## Installing
`$npm i react-off-canvas-menu`

## Usage

This OffCanvas component should be used to wrap the body of the app so that the off canvas section is full height. Pass whatever you like as children to the component. The Content prop is what will be rendered inside the off canvas section, give it some jsx to eat and it will be happy.

``` javascript
import OffCanvas from 'react-off-canvas'

const MyComponent = () => (
  <OffCanvas Content={<aside>This is the off canvas section</aside>}>
    <main>This is your main app</main>
  </OffCanvas>
)
```
