class ShoppingList {
  constructor(items = []) {
    this.state = { items };
    this.isEventRoot = true;
  }
  addItem = () => {
    const input = document.querySelector('#new-item');
    this.state.items.push(input.value);
  }
  removeItem = (itemToRemove) => {
    const newItems = this.state.items.filter(item => {
      return item !== itemToRemove
    });
    this.state.items = newItems;
  }
  render() {
    return {
      type: 'div',
      children: [
        {
          type: 'ul',
          name: 'Shopping List',
          children: this.state.items.map(item => ({
            type: 'li',
            name: 'Shopping Item',
            text: item,
            // these close buttons don't work because it's re-rendering the li not the parent div
            children: [{
              type: 'button',
              name: 'Remove Shopping Item Button',
              text: 'X',
              onClick: () => this.removeItem(item) // we need to somehow signal what the element to re-render is...
              // each class/obj needs a reference to itself as a node that it could use?
            }]
          }))
        },
        {
          type: 'input',
          id: 'new-item'
        },
        {
          type: 'button',
          text: 'add item',
          onClick: this.addItem,
        }
      ]
    }
  }
}

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

const myCounter = new Counter(0);
const myList = new ShoppingList(['milk', 'eggs', 'bread']);

const myRootComponent = {
  type: 'div',
  children: [
    {
      type: 'h1',
      text: 'Welcome to my VanillaJS',
      style: {
        color: 'red',
      },
      className: 'centered bold',
    },
    {
      type: 'h2',
      text: 'An Exploration of Vanilla Components',
      className: 'centered',
    },
    myList,
    myCounter,
  ]
}

let vDom;
framework('root', myRootComponent);
