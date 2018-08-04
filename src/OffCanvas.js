import React, { Component } from 'react'
import PropTypes from 'prop-types'

class OffCanvas extends Component {
  constructor(props) {
    super(props)

    this.state = {
      startMove: null,
      lastMove: null,
      xOffset: 0,
      isMenuOpen: false,
    }
    this.sideGrabWidth = props.sideGrabWidth || 40
    this.tollerance = props.tollerance || 70
    this.defaultMenuWidth = 170
    this.touchStartHandler = this.touchStartHandler.bind(this)
    this.touchEndHandler = this.touchEndHandler.bind(this)
    this.touchMoveHandler = this.touchMoveHandler.bind(this)
    this.openMenu = this.openMenu.bind(this)
    this.closeMenu = this.closeMenu.bind(this)
    this.trackMenuPosition = this.trackMenuPosition.bind(this)
    this.funcNullCheck = this.funcNullCheck.bind(this)
  }

  componentDidMount() {
    if (this.props.forceOpenState) {
      this.openMenu()
    }
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (
      newProps.forceOpenState === true &&
      newProps.forceOpenState !== this.props.forceOpenState &&
      this.state.isMenuOpen === false
    ) {
      this.openMenu()
    } else if (
      newProps.forceOpenState === false &&
      newProps.forceOpenState !== this.props.forceOpenState &&
      this.state.isMenuOpen === true
    ) {
      this.closeMenu()
    }

    if (
      this.props.menuWidth !== newProps.menuWidth &&
      newProps.forceOpenState === true
    ) {
      this.setState({
        xOffset: newProps.menuWidth,
      })
    }
  }

  touchStartHandler(e) {
    const { isMenuOpen } = this.state
    const xCoord = e.touches[0].clientX

    if (isMenuOpen || (!isMenuOpen && xCoord <= this.sideGrabWidth)) {
      this.setState({ startMove: xCoord })
    }
  }

  touchEndHandler() {
    const { startMove, lastMove, isMenuOpen } = this.state
    const dragDistance = lastMove - startMove
    const invertedDragDistance = dragDistance * -1

    if (!isMenuOpen && startMove && lastMove && dragDistance >= this.tollerance) {
      this.openMenu()
    } else if (!isMenuOpen && startMove && lastMove && dragDistance < this.tollerance) {
      this.closeMenu()
    }
    if (isMenuOpen && startMove && lastMove && invertedDragDistance >= this.tollerance) {
      this.closeMenu()
    } else if (isMenuOpen && startMove && lastMove && invertedDragDistance < this.tollerance) {
      this.openMenu()
    }
  }

  touchMoveHandler(e) {
    const { startMove, isMenuOpen } = this.state
    const touchX = e.touches[0].clientX

    if (isMenuOpen || (!isMenuOpen && startMove && startMove <= this.sideGrabWidth)) {
      this.trackMenuPosition(touchX)
    }
  }

  funcNullCheck(fn) {
    if (fn) {
      fn()
    }
  }

  openMenu() {
    this.setState({
      startMove: null,
      lastMove: null,
      xOffset: this.props.menuWidth || this.defaultMenuWidth,
      isMenuOpen: true,
    }, () => this.funcNullCheck(this.props.emitOpened))
  }

  closeMenu() {
    this.setState({
      startMove: null,
      lastMove: null,
      xOffset: 0,
      isMenuOpen: false,
    }, () => this.funcNullCheck(this.props.emitClosed))
  }

  trackMenuPosition(touchX) {
    const { startMove, isMenuOpen } = this.state
    const menuWidth = this.props.menuWidth || this.defaultMenuWidth
    const stopPoint = isMenuOpen ? menuWidth : 0
    const positon = stopPoint + touchX - startMove
    const xOffset = positon >= menuWidth ? menuWidth : positon

    this.setState({
      lastMove: touchX,
      xOffset: xOffset,
    })
  }

  render() {
    const { children, Content, zIndex = 2000 } = this.props
    const { xOffset } = this.state
    const menuWidth = this.props.menuWidth || this.defaultMenuWidth
    const translateX = -menuWidth + xOffset

    return (
      <div onTouchStart={this.touchStartHandler} onTouchMove={this.touchMoveHandler} onTouchEnd={this.touchEndHandler}>
        {children}
        <aside
          style={{
            transform: `translate(${translateX}px, 0)`,
            transition: 'transform .1s',
            position: 'fixed',
            top: '0',
            bottom: '0',
            minHeight: '100vh',
            overflowY: 'auto',
            zIndex: zIndex,
            left: '0',
            width: menuWidth,
          }}
        >
          {Content}
        </aside>
      </div>
    )
  }
}

OffCanvas.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
  Content: PropTypes.element,
  emitOpened: PropTypes.func,
  emitClosed: PropTypes.func,
  forceOpenState: PropTypes.bool,
  zIndex: PropTypes.number,
  sideGrabWidth: PropTypes.number,
  tollerance: PropTypes.number,
  menuWidth: PropTypes.number,
}

export default OffCanvas
