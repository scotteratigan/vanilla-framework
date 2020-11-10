# A Vanilla JS Framework

An exploration of how to create a component framework that uses as little 'magic' as possible. This may not work properly on old browsers.

It uses an object structure inspired by existing browser APIs. Learning this means learning the browser APIs.

## Component-based client-side rendering

Uses the concept of components that are JSON-based. A future expansion might be to create an object literal API as well.

## Trigger UI updates with native events

Native events are registered via a handler function which updates the state of the component (class-based for now) and then triggers a sync (re-render) to the appropriate component(s) searching up the tree until it finds the event root.

## Support for multiple component types
  - JSON objects
  - Class components
  - Function components

### JSON Component

Simple API to create single and nested components.

```javascript
const header = {
  type: 'h1',
  text: 'This is a header',
};

const anotherHeader = {
  type: 'h1',
  text: 'This is a another header',
  style: {
    color: 'red',
    backgroundColor: 'black',
  },
  className: 'centered' 
}

const article = {
  type: 'div',
  style: {
    border: '1px solid black',
    padding: '5px',
    borderRadius: '2px',
    margin: '5px',
  },
  children: [
    {
      type: 'p',
      text: 'Check out Oakland',
    },
    {
      type: 'img',
      src: './oakland.jpg',
      style: {
        width: '100%',
      }
    }
  ]
}
```

### Function-Based Component
```javascript
function makeBigHeadline(text) {
  return {
    type: 'h1',
    text,
    className: 'bold centered',
  }
}
const headline = makeBigHeadline('Check this out');
```

### Class-Based Component
```javascript
class Counter {
  constructor(count = 0) {
    this.state = { count };
    this.isEventRoot = true;
  }
  addCount = () => {
    this.state.count += 1;
  }
  subtractCount = () => {
    this.state.count -= 1;
  }
  render() {
    return ({
      type: 'div',
      text: `The counter is now ${this.state.count}.`,
      children: [
        {
          type: 'button',
          text: '+',
          onClick: this.addCount,
        },
        {
          type: 'button',
          text: '-',
          onClick: this.subtractCount,
        }
      ]
    })
  }
}
const myCounter = new Counter();
```

### Current Limitations

Support for small number of element properties currently, but easy to expand.
Must sync a single component (and it's children), due to use of replace API

UI updates currently rely on isEventRoot property to avoid re-rendering the entire app, needs to be updated.

