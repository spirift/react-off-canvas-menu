import React from 'react'
import { shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'

import OffCanvas from './index'

const styleTestHelper = (menuWidth, zIndex, defaults) => {
  it(`with transform: translate to move it off canvas`, () => {
    const props = defaults
      ? {}
      : {
        menuWidth,
        zIndex,
      }
    const wrapper = shallow(
      <OffCanvas {...props}>
        <p>a child</p>
      </OffCanvas>
    )

    expect(wrapper.find('aside').prop('style').transform).toEqual(`translate(-${menuWidth}px, 0)`)
  })

  it(`with z-index to put it above everything`, () => {
    const props = defaults
      ? {}
      : {
        menuWidth,
        zIndex,
      }
    const wrapper = shallow(
      <OffCanvas {...props}>
        <p>a child</p>
      </OffCanvas>
    )

    expect(wrapper.find('aside').prop('style').zIndex).toEqual(zIndex)
  })

  it(`with width set to be the same as the translate amount`, () => {
    const props = defaults
      ? {}
      : {
        menuWidth,
        zIndex,
      }
    const wrapper = shallow(
      <OffCanvas {...props}>
        <p>a child</p>
      </OffCanvas>
    )

    expect(wrapper.find('aside').prop('style').width).toEqual(menuWidth)
  })
}

describe(`OffCanvas Component`, () => {
  describe(`constructor`, () => {
    const constructorTestHelper = (prop, value) => {
      it(`should set a default for this.${prop}`, () => {
        // render without any props to get the defaults
        const wrapper = shallow(<OffCanvas />)
        const inst = wrapper.instance()

        expect(inst[prop]).toEqual(value)
      })
    }

    constructorTestHelper('sideGrabWidth', 40)

    constructorTestHelper('tollerance', 70)

    constructorTestHelper('defaultMenuWidth', 170)
  })

  describe(`render method`, () => {
    it(`should return a div with some touch handlers and an <aside> wrapper`, () => {
      const wrapper = shallow(
        <OffCanvas>
          <p>a child</p>
        </OffCanvas>
      )

      expect(toJson(wrapper)).toMatchSnapshot()
    })

    it(`should return some Content if the prop is passed`, () => {
      const wrapper = shallow(
        <OffCanvas Content={<div>this could be a menu</div>}>
          <p>a child</p>
        </OffCanvas>
      )

      expect(toJson(wrapper)).toMatchSnapshot()
    })

    describe(`should have a style based on defaults`, () => {
      styleTestHelper(170, 2000, true)
    })

    describe(`should have style based on props`, () => {
      styleTestHelper(200, 3, false)
    })
  })

  describe(`componentDidMount method`, () => {
    it(`should open the menu if forceOpenState is true`, () => {
      const wrapper = mount(<OffCanvas forceOpenState={true} />)
      const inst = wrapper.instance()
      inst.openMenu = jest.fn()
      inst.componentDidMount()

      expect(inst.openMenu).toHaveBeenCalled()
    })
  })

  describe(`componentWillReceiveProps method`, () => {
    describe(`might call this.openMenu`, () => {
      it(`when newProps.forceOpenState is true, was not true in prevProps (props) and the state doesn't think the menu is open, this.openMenu should be called`, () => {
        const wrapper = mount(<OffCanvas />)
        const inst = wrapper.instance()
        inst.openMenu = jest.fn()

        inst.componentWillReceiveProps({ forceOpenState: true })
        expect(inst.openMenu).toHaveBeenCalled()
      })

      it(`if newProps.forceOpenState is false, this.openMenu should be not called`, () => {
        const wrapper = mount(<OffCanvas />)
        const inst = wrapper.instance()
        inst.openMenu = jest.fn()

        inst.componentWillReceiveProps({ forceOpenState: false })
        expect(inst.openMenu).not.toHaveBeenCalled()
      })

      it(`if newProps.forceOpenState true but is is already true in the props as well, this.openMenu should be not called`, () => {
        const wrapper = mount(<OffCanvas />)
        wrapper.setProps({ forceOpenState: true })
        const inst = wrapper.instance()
        inst.openMenu = jest.fn()

        inst.componentWillReceiveProps({ forceOpenState: true })
        expect(inst.openMenu).not.toHaveBeenCalled()
      })

      it(`should not call this.openMenu if newProps.forceOpenState true and was not before but the menu is already open, this.openMenu should be not called`, () => {
        const wrapper = mount(<OffCanvas />)
        wrapper.setState({ isMenuOpen: true })
        const inst = wrapper.instance()
        inst.openMenu = jest.fn()

        inst.componentWillReceiveProps({ forceOpenState: true })
        expect(inst.openMenu).not.toHaveBeenCalled()
      })
    })

    describe(`might call this.closeMenu()`, () => {
      it(`when newProps.forceOpenState is false, was not false in prevProps (props) and the state doesn't think the menu is closed, this.closeMenu should be called`, () => {
        const wrapper = mount(<OffCanvas />)
        wrapper.setState({ isMenuOpen: true })
        const inst = wrapper.instance()
        inst.closeMenu = jest.fn()

        inst.componentWillReceiveProps({ forceOpenState: false })
        expect(inst.closeMenu).toHaveBeenCalled()
      })

      it(`if newProps.forceOpenState is true, this.closeMenu should be not called`, () => {
        const wrapper = mount(<OffCanvas />)
        const inst = wrapper.instance()
        inst.closeMenu = jest.fn()

        inst.componentWillReceiveProps({ forceOpenState: true })
        expect(inst.closeMenu).not.toHaveBeenCalled()
      })

      it(`if newProps.forceOpenState false but is is already false in the props as well, this.closeMenu should be not called`, () => {
        const wrapper = mount(<OffCanvas />)
        wrapper.setProps({ forceOpenState: false })
        const inst = wrapper.instance()
        inst.closeMenu = jest.fn()

        inst.componentWillReceiveProps({ forceOpenState: false })
        expect(inst.closeMenu).not.toHaveBeenCalled()
      })

      it(`should not call this.closeMenu if newProps.forceOpenState true and was not before but the menu is already open, this.closeMenu should be not called`, () => {
        const wrapper = mount(<OffCanvas />)
        wrapper.setState({ isMenuOpen: false })
        const inst = wrapper.instance()
        inst.closeMenu = jest.fn()

        inst.componentWillReceiveProps({ forceOpenState: true })
        expect(inst.closeMenu).not.toHaveBeenCalled()
      })
    })

    describe(`update the xCoord`, () => {
      it(`should setState with xCoord when the this.props.menuWidth changes and the menu is being forced open by a controller or parent`, () => {
        const wrapper = mount(<OffCanvas menuWidth={500} />)
        wrapper.setState({ isMenuOpen: true }) // This stops other parts of the method running
        const inst = wrapper.instance()
        inst.setState = jest.fn()
        const newWidth = 400

        inst.componentWillReceiveProps({ menuWidth: newWidth, forceOpenState: true })
        expect(inst.setState).toHaveBeenCalledWith({
          xOffset: newWidth,
        })
      })

      it(`should not setState if the menuWidth is different but forceOpenState is false`, () => {
        const wrapper = mount(<OffCanvas menuWidth={500} forceOpenState={false} />)
        wrapper.setState({ isMenuOpen: true }) // This stops other parts of the method running
        const inst = wrapper.instance()
        inst.setState = jest.fn()
        const newWidth = 400

        inst.componentWillReceiveProps({ menuWidth: newWidth, forceOpenState: false })
        expect(inst.setState).not.toHaveBeenCalled()
      })

      it(`should not setState if forceOpenState is true but the menuWidth is the same`, () => {
        const wrapper = mount(<OffCanvas menuWidth={500} forceOpenState={false} />)
        wrapper.setState({ isMenuOpen: true }) // This stops other parts of the method running
        const inst = wrapper.instance()
        inst.setState = jest.fn()

        inst.componentWillReceiveProps({ menuWidth: 500, forceOpenState: true })
        expect(inst.setState).not.toHaveBeenCalled()
      })
    })
  })

  describe(`touchStartHandler method`, () => {
    const clientX = 25
    const mockTouchEvent = {
      touches: [{ clientX }],
    }
    const touchStartTestHelper = (isMenuOpen, text) => {
      it(`should set state if menu is ${text}`, () => {
        const wrapper = shallow(<OffCanvas />)
        wrapper.setState({ isMenuOpen })
        const inst = wrapper.instance()
        inst.setState = jest.fn()
        inst.touchStartHandler(mockTouchEvent)

        expect(inst.setState).toHaveBeenCalledWith({ startMove: clientX })
      })
    }
    touchStartTestHelper(true, 'open')
    touchStartTestHelper(false, 'not open and the touch is inside the grab area on the left')

    it(`should not set startMove if the menu is closed and the touch does not start inside the grab area`, () => {
      const clientX = 41
      const mockTouchEvent = {
        touches: [{ clientX }],
      }
      const wrapper = shallow(<OffCanvas />)
      wrapper.setState({ isMenuOpen: false })
      const inst = wrapper.instance()
      inst.setState = jest.fn()
      inst.touchStartHandler(mockTouchEvent)

      expect(inst.setState).not.toHaveBeenCalledWith()
    })
  })

  describe(`touchEndHandler method`, () => {
    it(`should call openMenu when the menu isnt open and the menu has been dragged over the tollerance level`, () => {
      const startMove = 10.3456
      const lastMove = 85.0283
      const isMenuOpen = false
      const wrapper = shallow(<OffCanvas />)
      wrapper.setState({ startMove, lastMove, isMenuOpen })
      const inst = wrapper.instance()
      inst.openMenu = jest.fn()
      inst.touchEndHandler()

      expect(inst.openMenu).toHaveBeenCalled()
    })

    it(`should call close menu if the menu is not open and the menu has not been dragged past the tollerance level`, () => {
      const startMove = 10.3456
      const lastMove = 20
      const isMenuOpen = false
      const wrapper = shallow(<OffCanvas />)
      wrapper.setState({ startMove, lastMove, isMenuOpen })
      const inst = wrapper.instance()
      inst.closeMenu = jest.fn()
      inst.touchEndHandler()

      expect(inst.closeMenu).toHaveBeenCalled()
    })

    it(`should call closeMenu when the menu is open and it has been dragged over the tollerance (this is moving left remember so it's a negative)`, () => {
      const startMove = 210
      const lastMove = 100
      const isMenuOpen = true
      const wrapper = shallow(<OffCanvas />)
      wrapper.setState({ startMove, lastMove, isMenuOpen })
      const inst = wrapper.instance()
      inst.closeMenu = jest.fn()
      inst.touchEndHandler()

      expect(inst.closeMenu).toHaveBeenCalled()
    })

    it(`should call openMenu when the menu is open but it has not been dragged over the tollerance (this is moving left remember so it's a negative)`, () => {
      const startMove = 210
      const lastMove = 190
      const isMenuOpen = true
      const wrapper = shallow(<OffCanvas />)
      wrapper.setState({ startMove, lastMove, isMenuOpen })
      const inst = wrapper.instance()
      inst.openMenu = jest.fn()
      inst.touchEndHandler()

      expect(inst.openMenu).toHaveBeenCalled()
    })

    it(`should call closeMenu when menu is closed and dragDistance is a negative number`, () => {
      const startMove = 510
      const lastMove = 190
      const isMenuOpen = false
      const wrapper = shallow(<OffCanvas />)
      wrapper.setState({ startMove, lastMove, isMenuOpen })
      const inst = wrapper.instance()
      inst.closeMenu = jest.fn()
      inst.touchEndHandler()

      expect(inst.closeMenu).toHaveBeenCalled()
    })

    it(`should call openMenu when menu is open and dragDistance is a positive number (which makes invertedDragDistance negative)`, () => {
      const startMove = 10
      const lastMove = 190
      const isMenuOpen = false
      const wrapper = shallow(<OffCanvas />)
      wrapper.setState({ startMove, lastMove, isMenuOpen })
      const inst = wrapper.instance()
      inst.openMenu = jest.fn()
      inst.touchEndHandler()

      expect(inst.openMenu).toHaveBeenCalled()
    })

    describe(`should not call anything if`, () => {
      const nullChecker = (startMove, lastMove, text) => {
        it(text, () => {
          const isMenuOpen = false
          const wrapper = shallow(<OffCanvas />)
          wrapper.setState({ startMove, lastMove, isMenuOpen })
          const inst = wrapper.instance()
          inst.openMenu = jest.fn()
          inst.closeMenu = jest.fn()
          inst.touchEndHandler()

          expect(inst.openMenu).not.toHaveBeenCalled()
          expect(inst.closeMenu).not.toHaveBeenCalled()
        })
      }
      nullChecker(null, 20, 'startMove is null')
      nullChecker(39, null, 'lastMove is null')
    })
  })

  describe(`touchMoveHandler method`, () => {
    const clientX = 25
    const mockTouchEvent = {
      touches: [{ clientX }],
    }

    it(`should call this.trackMenuPosition if the menu is open`, () => {
      const wrapper = shallow(<OffCanvas />)
      wrapper.setState({ isMenuOpen: true })
      const inst = wrapper.instance()
      inst.trackMenuPosition = jest.fn()
      inst.touchMoveHandler(mockTouchEvent)

      expect(inst.trackMenuPosition).toHaveBeenCalledWith(clientX)
    })

    it(`should call this.trackMenuPosition if the menu is closed but the start touch is inside the grab area`, () => {
      const wrapper = shallow(<OffCanvas />)
      wrapper.setState({ startMove: 39.9 })
      const inst = wrapper.instance()
      inst.trackMenuPosition = jest.fn()
      inst.touchMoveHandler(mockTouchEvent)

      expect(inst.trackMenuPosition).toHaveBeenCalledWith(clientX)
    })

    it(`should not call this.trackMenuPosition when the menu is close and the touch is outside of the grab area`, () => {
      const wrapper = shallow(<OffCanvas />)
      wrapper.setState({ startMove: 40.1 })
      const inst = wrapper.instance()
      inst.trackMenuPosition = jest.fn()
      inst.touchMoveHandler(mockTouchEvent)

      expect(inst.trackMenuPosition).not.toHaveBeenCalledWith(clientX)
    })
  })

  describe(`openMenu method`, () => {
    it(`should call emitOpened if it exists`, () => {
      const emitOpened = jest.fn()
      const wrapper = shallow(<OffCanvas emitOpened={emitOpened} />)
      const inst = wrapper.instance()
      inst.openMenu()

      expect(emitOpened).toHaveBeenCalled()
    })

    it(`should call setState with the data for the open state`, () => {
      const wrapper = shallow(<OffCanvas />)
      const inst = wrapper.instance()
      inst.setState = jest.fn()
      inst.openMenu()

      expect(inst.setState).toHaveBeenCalledWith({ isMenuOpen: true, lastMove: null, startMove: null, xOffset: 170 }, expect.any(Function))
    })

    it(`should call funcNullCheck with this.props.emitOpened`, () => {
      const emitOpened = jest.fn()
      const wrapper = shallow(<OffCanvas emitOpened={emitOpened} />)
      const inst = wrapper.instance()
      inst.funcNullCheck = jest.fn()
      inst.openMenu()

      expect(inst.funcNullCheck).toHaveBeenCalledWith(inst.props.emitOpened)
    })
  })

  describe(`closeMenu method`, () => {
    it(`should call emitClosed if it exists`, () => {
      const emitClosed = jest.fn()
      const wrapper = shallow(<OffCanvas emitClosed={emitClosed} />)
      const inst = wrapper.instance()
      inst.closeMenu()

      expect(emitClosed).toHaveBeenCalled()
    })

    it(`should call setState with the data for the open state`, () => {
      const wrapper = shallow(<OffCanvas />)
      const inst = wrapper.instance()
      inst.setState = jest.fn()
      inst.closeMenu()

      expect(inst.setState).toHaveBeenCalledWith({ isMenuOpen: false, lastMove: null, startMove: null, xOffset: 0 }, expect.any(Function))
    })

    it(`should call funcNullCheck with this.props.emitClosed`, () => {
      const emitClosed = jest.fn()
      const wrapper = shallow(<OffCanvas emitClosed={emitClosed} />)
      const inst = wrapper.instance()
      inst.funcNullCheck = jest.fn()
      inst.closeMenu()

      expect(inst.funcNullCheck).toHaveBeenCalledWith(inst.props.emitClosed)
    })
  })

  describe(`trackMenuPosition method`, () => {
    describe(`will have an xOffset based on stopPoint, xOffset`, () => {
      it(`should be menuWidth if the menu is open and touchX and startMove are zero`, () => {
        const menuWidth = 170
        const wrapper = shallow(<OffCanvas />)
        wrapper.setState({ isMenuOpen: true, startMove: 0 })
        const inst = wrapper.instance()
        inst.setState = jest.fn()
        inst.trackMenuPosition(0)

        expect(inst.setState).toHaveBeenCalledWith({ lastMove: 0, xOffset: menuWidth })
      })
      it(`should be zero if the menu is closed and touchX and startMove are zero`, () => {
        const wrapper = shallow(<OffCanvas />)
        wrapper.setState({ isMenuOpen: false, startMove: 0 })
        const inst = wrapper.instance()
        inst.setState = jest.fn()
        inst.trackMenuPosition(0)

        expect(inst.setState).toHaveBeenCalledWith({ lastMove: 0, xOffset: 0 })
      })
    })
    describe(`xOffset is determined by whether the position is greater than the menu width`, () => {
      it(`should be set to menuWidth if the position is >= menuWidth when the menu is closed`, () => {
        const menuWidth = 170
        const touchX = 200
        const wrapper = shallow(<OffCanvas />)
        wrapper.setState({ isMenuOpen: false, startMove: 0 })
        const inst = wrapper.instance()
        inst.setState = jest.fn()
        inst.trackMenuPosition(touchX)

        expect(inst.setState).toHaveBeenCalledWith({ lastMove: touchX, xOffset: menuWidth })
      })

      it(`should be set to position if the position is < menuWidth when the menu is closed`, () => {
        const touchX = 100
        const wrapper = shallow(<OffCanvas />)
        wrapper.setState({ isMenuOpen: false, startMove: 0 })
        const inst = wrapper.instance()
        inst.setState = jest.fn()
        inst.trackMenuPosition(touchX)

        expect(inst.setState).toHaveBeenCalledWith({ lastMove: touchX, xOffset: touchX })
      })
    })
  })

  describe(`funcNullCheck method`, () => {
    it(`should not call it's first arg as a function if it does not exist`, () => {

      const wrapper = shallow(<OffCanvas />)
      const inst = wrapper.instance()
      const func = jest.fn()

      inst.funcNullCheck()
      expect(func).not.toHaveBeenCalled()
    })

    it(`should call it's first arg as a function when it exists`, () => {
      const wrapper = shallow(<OffCanvas />)
      const inst = wrapper.instance()
      const func = jest.fn()

      inst.funcNullCheck(func)
      expect(func).toHaveBeenCalled()
    })
  })
})
