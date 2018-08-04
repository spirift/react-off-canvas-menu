# React Off Canvas Menu

[![Build Status](https://travis-ci.org/spirift/react-off-canvas-menu.png?branch=master)](https://travis-ci.org/spirift/react-off-canvas-menu)
[![codecov](https://codecov.io/gh/spirift/react-off-canvas-menu/branch/master/graph/badge.svg)](https://codecov.io/gh/spirift/react-off-canvas-menu)

React Off Canvas Menu is a React component that produces an off canvas area that can slide on and off the screen. It is draggable on touch from the left and can also be controlled with buttons. It also emits state change for easy interaction with state controllers like redux.

## Demo

https://spirift.github.io/react-off-canvas-menu/

## Installing
`$ npm i react-off-canvas-menu`

## Versions

Since React 16.3.0 `componentWillReceiveProps` has been deprecated and replaced with `UNSAFE_componentWillReceiveProps` instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops

If you are using a React version less than 16.3.0, use version 1.x.x of this lib. For people on 16.3.0 or later use at least version 2.x.x of this lib.

## Usage

This OffCanvas component should be used to wrap the body of the app so that the off canvas section is full height. Pass whatever you like as children to the component. The Content prop is what will be rendered inside the off canvas section, give it some jsx to eat and it will be happy. Content is all rendered inside as aside HTML tag.

``` javascript
import OffCanvas from 'react-off-canvas'

const MyComponent = () => (
  <OffCanvas Content={<div>This is the off canvas section</div>}>
    <main>This is your main app</main>
  </OffCanvas>
)
```
