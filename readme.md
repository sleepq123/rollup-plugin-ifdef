# rollup-plugin-ifdef

fork from [js-conditional-compile-loader](https://github.com/hzsrc/js-conditional-compile-loader)

- [中文文档](https://github.com/hzsrc/js-conditional-ifdef/blob/master/readme-cn.md)
- [Introduction](https://segmentfault.com/a/1190000020102151)

A conditional compiling plugin for rollup or vite, support js,ts,css,scss,vue,react.   
**Conditional compiling** means that we can use the same codes and compiling process, to build different applications with different  environment conditions.   
- For example: we can output two different program for debug or release environment with a same source code project.    
- Another sample: Use same codes and compiling process to supply different customers, just by using different building command args, like this: `npm run build --ali` for alibaba, `npm run build --tencent` for tencent。
![image](https://github.com/sleepq123/rollup-plugin-ifdef/blob/master/intro.png?raw=true)

### Usage
This loader provides two directives: `IFDEBUG` and `IFTRUE`. Just use them anywhere in js code like this: Start with `/*IFDEBUG` or `/*IFTRUE_xxx`, end with `FIDEBUG*/` or `FITRUE_xxx*/`, place js code in the center. The `xxx` is any condition property of the options in webpack, such like `myFlag`.
     
- Mode 1 - comment all   
Since it is designed by a js comment style, the code can run normaly even though the rollup-plugin-ifdef is not used.    
````js
/* IFDEBUG Any js here FIDEBUG */
````

````js
/* IFTRUE_yourFlagName ...js code... FITRUE_yourFlagName */
````

- Mode 2 -- head and foot   
In this mode, you can use eslint to check your code.
````js
/* IFDEBUG */
var anyJsHere = 'Any js here'
/*FIDEBUG */
````

````js
/* IFTRUE_yourFlagName*/ 
function anyJsHere(){
}
/*FITRUE_yourFlagName */
````

----
### Build result with source code
Source code:
````js
/* IFTRUE_forAlibaba */
var aliCode = require('./ali/alibaba-business.js')
aliCode.doSomething()
/* FITRUE_forAlibaba */
$state.go('win', {dir: menu.winId /*IFDEBUG , reload: true FIDEBUG*/})
````
Compiled output by options: `{isDebug: true, forAlibaba: true}`:
````js
var aliCode = require('./ali/alibaba-business.js')
aliCode.doSomething()
$state.go('win', {dir: menu.winId, reload: true })
````

Compiled output by options: `{isDebug: false, forAlibaba: false}`:
````js
$state.go('win', {dir: menu.winId})
````
----

### Setup
````bash
    npm i -D rollup-plugin-ifdef
````

### Config in vite
Change vite config like this:    
````js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import ifdef from "rollup-plugin-ifdef";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    ifdef({
        isDebug: process.env.NODE_ENV === 'development', // optional, this expression is default
        envTest: process.env.ENV_CONFIG === 'test', // any prop name you want, used for /* 
    }),
    vue(),
  ],
});
````
### options
- isDebug: boolean

 If `isDebug` === false, all the codes between `/\*IFDEBUG` and `FIDEBUG\*/` will be removed, otherwise the codes will be remained.    
 Defualt value of `isDebug` is set by: process.env.NODE_ENV === 'development'  

- changeSource: Function(source, options)

Custom function to change source code. Optional. Sample: change `.aspx` to `.do` for java backend:
````js
var options = {
    changeSource: process.env.npm_config_java ? source => source.replace(/\.aspx\b/i, '.do') : null
}
````


- \[any propertyName\]：{bool}
if [propertyValue] === false, all codes between `/\* IFTRUE_propertyName` and `FITRUE_propertyName \*/` will be removed, otherwise the codes will be remained.


	
## Samples -- Any file, Anywhere!
Conditional compiling directives can be used anywhere in any source files.   
Like these:
* 1:
````typescript
const tx = "This is app /* IFTRUE_Ali of debug FITRUE_Ali */ here";


/*IFDEBUG
let tsFunc = function(arr: number[]) : string {
    alert('Hi~');
    return arr.length.toString()
}
FIDEBUG*/
````

* 2:
````scss
/* IFTRUE_myFlag */
div > ul > li {
    a {
        color: red;
    }
}
/*FITRUE_myFlag */


h2{
    background: red;
    /* IFTRUE_myFlag 
    color: blue;
    FITRUE_myFlag */
}
````


* 3
```js
Vue.component('debugInfo', {
    template: ''
    /* IFDEBUG
        + '<pre style="font-size:13px;font-family:\'Courier\',\'Courier New\';z-index:9999;line-height: 1.1;position: fixed;top:0;right:0; pointer-events: none">{{JSON.stringify($attrs.info || "", null, 4).replace(/"(\\w+)":/g, "$1:")}}</pre>'
    FIDEBUG */
    ,
    watch: {
      /* IFTRUE_myFlag */
      curRule (v){
          this.ruleData = v
      },
      /*FITRUE_myFlag */
    },
});
```

* 4
```vue
<temeplate>
    <div>
        /* IFTRUE_myFlag
        <h2>This is a test! For HTML. vue模板内也可以使用！</h2>
        <pre>
            {{$attrs.info || ''}}
        </pre>
        FITRUE_myFlag */
    </div>
</temeplate>

<script>
    var vueComponent = {
        data: {
            /* IFTRUE_myFlag
            falgData: 'Flag Data',
            FITRUE_myFlag */
        },
    };
</script>

/* IFTRUE_myFlag*/
<style scoped>
    .any-where-test {
        color: red;
    }
</style>
/* FITRUE_myFlag*/


<style id="a" scoped>
    /* IFTRUE_myFlag*/
    .test-for-css {
        color: red;
    }
    /*FITRUE_myFlag */
</style>
```
