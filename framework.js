// Naming
// node - HTML Node
// component - class, function or object which can be used to create HTML node(s)
// componentObject - what a class or function component renders, is used to create the HTML node

var framework = (() => {
  const nodes = {};
  const definedComponentProps = new Set(['type', 'text', 'children', 'frameworkId', 'id', 'onClick', 'name', 'style']);
  let devMode

  function sync(node, component) {
    deleteRecordOfComponentsBeingReplaced(component);
    const newHtmlNode = makeNode({ component, parentNode: node });
    node.replaceWith(newHtmlNode);
    if (devMode) {
      console.log('total number of nodes:', Object.keys(nodes).length);
      console.log('nodes:', nodes);
    }
  }

  function deleteRecordOfComponentsBeingReplaced(component) {
    const thisId = component.frameworkId;
    if (!thisId) return; // if this is null we've never rendered this
    const children = nodes[thisId]?.children;
    if (children) children.forEach(deleteRecordOfComponentsBeingReplaced)
    delete nodes[thisId];
  }

  function render(idSelector, component, devModeData = true) {
    // used for the initial render, all future updates call sync
    // essentially a replacement for reactDOM.render
    devMode = devModeData
    const node = document.getElementById(idSelector);
    sync(node, component);
  }

  function handleEvent({ component, fn, e }) {
    if (!(fn instanceof Function)) throw new Error('handleEvent passed non-function parameter')
    fn(e);
    findEventRootToSync({ component });
  }

  function findEventRootToSync({ component }) {
    const nodeToUpdate = nodes[component.frameworkId].node;
    const parentComponent = nodes[component.frameworkId].parentComponent;
    if (component.isEventRoot || !parentComponent) {
      sync(nodeToUpdate, component);
    }
    else {
      findEventRootToSync({ component: parentComponent });
    }
  }

  function makeNode({ component, parentComponent }) {
    const frameworkId = uuidv4();
    component.frameworkId = frameworkId;
    const componentObject = convertComponentToObject(component);
    if (devMode) ensureNoExtraneousProperties(componentObject, component);
    const { type = 'div', text, onClick, children, id, value, onKeyUp, name, style, className } = componentObject
    const node = document.createElement(type);
    if (text !== undefined) {
      node.innerText = text;
    }
    if (id) {
      node.id = id;
    }
    if (value) {
      node.value = value;
    }
    if (name) {
      node.dataset.name = name;
    }
    if (style) {
      Object.entries(style).forEach(([styleName, styleValue]) => node.style[styleName] = styleValue);
    }
    if (className) {
      node.className = className;
    }
    if (onClick) {
      node.addEventListener('click', (e) => handleEvent({ e, component, fn: onClick }));
    }
    if (onKeyUp) {
      node.addEventListener('keyup', (e) => handleEvent({ e, component, fn: onKeyUp }));
    }
    if (children) {
      children.forEach(child => node.appendChild(makeNode({ component: child, parentComponent: component })));
    }
    nodes[frameworkId] = { component, node, children, parentComponent };
    return node
  }

  function convertComponentToObject(component) {
    if (!component) throw new Error('Component is not defined!')
    if (Array.isArray(component)) {
      throw new Error('Arrays not implemented yet - need to figure out how to perform replace efficiently')
    } else if (component.render) {
      return component.render()
    } else if (component instanceof Function) {
      return component();
    } else {
      return component;
    }
  }

  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function ensureNoExtraneousProperties(componentObject, component) {
    const extraProperties = Object.keys(componentObject).filter(
      prop => !definedComponentProps.has(prop)
    );
    if (extraProperties.length) {
      console.error('extra properties:', extraProperties, 'detected on component', component.name ? component.name : component);
    }
  }

  return render;
})();


