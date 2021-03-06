/** MADE BY MASHARIBOV AZIZBEK */

export let _Version = "1.0.0";

export const Lesser = {
  Component: class extends HTMLElement {
    constructor() {
      super();
    }

    // Useless, but why not.
    get attrs() {
      return this.attributes;
    }

    // Special methods to change the attachShadow mode to open/closed (more fucking useless code)
    openShadow() {
      this.attachShadow({mode: "open"});
    }
    closedShadow() {
      this.attachShadow({mode: "closed"});
    }
    // TODO: IT IS NOT WORKING, MAKE IT WORK, CUNT!
    registerAs(tagname = "") {
      Lesser.define(this, tagname)
    } // TODO 2#: I should remove this chunk of code asap. Its pretty much useless, just like this project itself.

    // Some basic stuff
    OnInit() {}
    OnDestroy() {}

    // What the hell am I doing...
    Kill() {
      this.remove();
    }

    // Using built in shadow DOM callbacks and making it look like its framework's magic using OnInit and OnDestroy methods... I am a lazy and horrible human being.
    connectedCallback() {
      this.OnInit();
    }
    disconnectedCallback() {
      this.OnDestroy();
    }

    // These two funcs are designed to add html and css literals to the shadow root (component's root).
    // Well, I knew why and how I wrote that $Element function and why I put it here, but now, only god knows.
    // So, it stays, because it is still working.
    addHTML(htmlLIT) {
      this.shadowRoot.appendChild(
        $Element(htmlLIT)
      );
    }
    addCSS(cssLIT) {
      this.shadowRoot.appendChild(
        $Element(`<style>${cssLIT}</style>`)
      )
    }
  },

  // Registering the Component Class as a Custom Web Component. But it should include dash ("-"), otherwise it'll be ignored & fucked up. So I made this bloody awful method 
  Define: (tagName, className) => {
    if (tagName.includes("-")) window.customElements.define(tagName, className);
    else window.customElements.define(`l-${tagName}`, className); 
    // YAAAY "UNDEFINED" THINGY IS GONE NOW!
    BindScan(document.querySelector(tagName), GlobalBinds.variables);
  },

  // Half-ass Router object for managing SPA-routing and stuff.
  Router: {
    enabled: true,
    root: document.body,
    routeMap: {},
    hashrouteMap: {},
    setRoot: (elem) => {
      Lesser.Router.root = elem;
    },
    routeTo: (pathName = "/" ) => {
        window.history.pushState({}, pathName, window.location.origin + pathName);
        Lesser.Router.root.innerHTML = Lesser.Router.routeMap[pathName].content;
    }, // OMFG I CANT BELIEVE IT - IT IS ACTUALLY WORKING AAAAHHHHH
    assignRoutes: (routes=[]) => {
      for (let r of routes) {
        Lesser.Router.routeMap[r.path] = r;
      }
    },
    assignRoutemap: (routemap={}) => {
      Lesser.Router.routeMap = Object.assign(Lesser.Router.routeMap, routemap);
    }
  },
  // Basic Route object, routes are gonna be instances of this class.
  Route: class {
    constructor(path="/", content="", hashRoutes=[]) {
      this.path = path;
      this.content = content;
      this.hashRoutes = hashRoutes;
    }
    // Special one for hashroutes. Why not, right?
    static newHashRoute(hashpath, content) {
      let R_hashpath;
      if (hashpath[0] == "#") R_hashpath = hashpath;
      else R_hashpath = `#${hashpath}`;
      return {R_hashpath: content}      
    }
  },

  // Scope for binded variables; I mean, we can't just keep it in window scope forever. So I made this shitty object
  BINDED_VARIABLES: {},
  Utils: {
    typ: (_) => {
      return typeof _;
    },
    comptyp: (_, type) => {
      return typeof _ == type;
    },
    isNum: (_=0) => Utils.comptyp(_, "number"),
    isStr: (_="String") => Utils.comptyp(_, "string"),
    isChar: (_="_") => Utils.comptyp(_, "symbol"),
    isObj: (_={}) => Utils.comptyp(_, "object"),
    isBool: (_=true) => Utils.comptyp(_, "boolean"),
    isUndf: (_=undefined) => Utils.comptyp(_, "undefined"),
    isBig: (_=new BigInt()) => Utils.comptyp(_, "bigint"),
    isFunc: (_=function(){}) => Utils.comptyp(_, "function"),
    __show_warnings_RandomC__: false,
    Random: class {
      static suppressWarnings() {
        Utils.__show_warnings_RandomC__ = false;
        return this;
      }
      static showWarnings() {
        Utils.__show_warnings_RandomC__ = true;
        return this;
      }
      static seed(min=0, max=1, seed=null) {
        if (seed != null && (Utils.isNum(seed) || Utils.isStr(seed))) {
          console.log("Seed found...");
          if (Utils.isStr(seed)) seed = parseInt(seed); 
          let s = ( seed * 9301 + 49297 ) % 233280;
          let r = s / 233280;
          let d = Math.abs( Math.sin(seed));
          r = (r + d) - Math.floor((r + d));
          return Math.floor(min + r * (max - min + 1));
        } else {
          console.log("Seed not found");
          if (Utils.__show_warnings_RandomC__) console.warn("Could not run seeding in getRnd method [Lesser.Utils.Random.getRnd()], using built-in browser function to return random float...");
          return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
        }
      }
    }
  }
};

if (Lesser.Router.enabled) { 
  window.onbeforeunload = function() {
    Lesser.Router.routeTo(window.location.pathname);
  };
  
  window.onload = function() {
    Lesser.Router.routeTo(window.location.pathname);
  };
  
  window.onpopstate = () => {
    Lesser.Router.routeTo(window.location.pathname);
  };
}

var { Utils } = Lesser;

function makeLit(literals, ...vars) {
  let raw = literals.raw, result = '', i = 1, len = arguments.length, str, variable;
  // TODO: Sanitize before transfering the data, knobhead
  while (i < len) {
    str = raw[i - 1];    
    variable = vars[i -1];
    result += str + variable;
    i++;
  }
  result += raw[raw.length - 1];
  return result;
}

// Holy hell, these functions are USELESS
export function html(literals, ...vars) {
  let result = makeLit(literals, ...vars);
  return result;
}
export function css(literals, ...vars) {
  let result = makeLit(literals, ...vars);
  return result;
}

// WTH DOES THAT DO? CONVERT SOME MARKUP STRING INTO HTML ELEMENT INSIDE A FRAGMENT OBJECT? WHYYY?!?! HELL NO... But it is not working without these functions, so they will stay
export function $Elements(markup) {
 /* if (typeof document.body.insertAdjacentHTML === "function") {
    let template = document.createElement("template");
    template.insertAdjacentHTML("beforeend", markup);
    return template.childNodes;
  } else { */
    let supported = (function () {
      if (!window.DOMParser) return false;
      var parser = new DOMParser();
      try {
        parser.parseFromString('x', 'text/html');
      } catch(err) {
        return false;
      }
      return true;
    })();
    
    if (supported) {
      var parser = new DOMParser();
      var doc = parser.parseFromString(markup, 'text/html');
      return doc.body.childNodes;
 // }
}
    
  const temp = document.createElement('div');
  temp.innerHTML = markup;
  return temp.childNodes;
}
// Another amusing chunk of amateur work. Bravo, past me. (And, keeping "unneccesary" code in comments... Brilliant, m8)
export function $Element(markup) {
  /*if (typeof document.body.insertAdjacentHTML === "function") {
    let fragment = document.createDocumentFragment();
    let template = document.createElement("template");
    template.insertAdjacentHTML("beforeend", markup);
    fragment = template.content;
    return fragment;
  } else {*/
  let supported = (function () {
    if (!window.DOMParser) return false;
    var parser = new DOMParser();
    try {
      parser.parseFromString('x', 'text/html');
    } catch(err) {
      return false;
    }
    return true;
  })();

  if (supported) {
    var parser = new DOMParser();
		var doc = parser.parseFromString(markup, 'text/html');
    const frag = document.createDocumentFragment();
    const children = Array.prototype.slice.apply(doc.body.childNodes);
    children.map(el => frag.appendChild(el));
    return frag;
// }
  }

  const temp = document.createElement('div');
  temp.innerHTML = markup;
  const frag = document.createDocumentFragment();
  const children = Array.prototype.slice.apply(temp.childNodes);
  children.map(el => frag.appendChild(el));
  return frag;
}

// Idk what am I doing.
export class BindingManager {
  constructor(){
    this.localBinds = {};
  }

  newBinding(id, value) {
    Lesser.BINDED_VARIABLES[id] = value;
    this.localBinds[id] = value;
  }

  get variables() {
    return Lesser.BINDED_VARIABLES;
  }

  get locals() {
    return this.localBinds;
  }

  logBindings() {
    console.log(this.variables);
  }

  logLocalBindings() {
    console.log(this.localBinds);
  }

  logAllBindings() {
    console.log({GLOBALLY: this.variables, LOCALLY: this.localBinds});
  }
}

export const GlobalBinds = new BindingManager();
GlobalBinds.logLocalBindings = undefined;
GlobalBinds.logAllBindings = undefined;

let cachedBinds = {}

class CachedBind {
  constructor(options = {bindKey: "", bindValue: null, randomizedAddress: 0}) {
    this._bk = options.bindKey;
    this._bv = options.bindValue;
    this._rdadd = options.randomizedAddress;
  }
}

let cachedBindValues = {}

let execBindTag = (binder, scope, varName) => {
  let tmp = binder.innerText.trimLeft().trimRight();
  if (binder.tagName.toLowerCase() == "bind" && binder.innerText.trim() != "") {
    if (binder.hasAttribute("addressaftercaching")) {
      let _sckey = cachedBinds[binder.getAttribute("addressaftercaching")]._bk;
      binder.innerHTML = scope[_sckey];
      return
    } 
    if (tmp in cachedBindValues) {
      binder.setAttribute("addressaftercaching", cachedBindValues[tmp]);
      let _sckey = cachedBinds[binder.getAttribute("addressaftercaching")]._bk;
      binder.innerHTML = scope[_sckey];
      return
    }
    let randomizedAddress = Utils.Random.showWarnings().seed(0, 999999, Math.random());
    binder.setAttribute("addressaftercaching", randomizedAddress);
    cachedBinds[randomizedAddress] = new CachedBind({bindKey: tmp, bindValue: scope[tmp], randomizedAddress: randomizedAddress});
    cachedBindValues[tmp] = randomizedAddress;
    let _sckey = cachedBinds[binder.getAttribute("addressaftercaching")]._bk;
    binder.innerHTML = scope[_sckey]
  } else {
    binder.innerHTML = scope[varName];
  }
}

// !__EXPERIMENTAL__! (Did I fuck up?? Probably. At least, it is working...)
// Performance is not that good. Place over 70 bind tags, binded to same variable, and it will start to lag. But it works well with input binds
// Using bind attribute is highly recommended, performance is +228% higher that way (tested on Opera GX)
// lag limit: ~160 paragraph tags with bind tags; Almost same with input tags; ~70 bind tags;
export let BindScan = (elem, scope = window /** WINDOW? WTF? THAT IS TERRIBLE! Too bad..! */) => {
  let rootPoint;
  console.log(scope);
  if (elem.shadowRoot) rootPoint = elem.shadowRoot;
  else rootPoint = elem;
  let _SelectableElements = [
    ...rootPoint.querySelectorAll("[bind]"),
    ...rootPoint.querySelectorAll("bind"),
  ];
  _SelectableElements.forEach(binder => {
    let varName = binder.getAttribute("bind");
    if (binder.tagName.toLowerCase() == "input" || binder.tagName.toLowerCase() == "textarea") {
      binder.value = scope[varName]; 
      binder.oninput = () => {
        scope[varName] = binder.value;
       _SelectableElements.forEach(_binded => {
          if (_binded.tagName.toLowerCase() == "input" || _binded.tagName.toLowerCase() == "textarea") {
            _binded.value = scope[varName];
          } else {
           execBindTag(_binded, scope, varName);
          }
        });
      }
    } else {
      execBindTag(binder, scope, varName);
    }
  })
}

// Now we have to set up and place variable values between some bloody curvy scopes... I hate my life.
export let parseHtmlFile = rhtml => {
  // NOT FUCKING NOW, BITCH. IT IS #TODO, AND HAVE TO WAIT UNTIL WE FIX OTHER BUGS AND MAKE ACTUAL WORKING DEMO!
}