class ShoppingList {
  constructor(items = []) {
    this.state = { items };
    this.isEventRoot = true; // todo: better way to identify the node to sync
    // could set a property on the class instance after rendering
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
            children: [{
              type: 'button',
              name: 'Remove Shopping Item Button',
              text: 'X',
              onClick: () => this.removeItem(item)
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
};

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
    article,
  ]
};

function makeBigHeadline(text) {
  return {
    type: 'h1',
    text,
    className: 'centered bold',
  };
}

framework('root', myRootComponent);
