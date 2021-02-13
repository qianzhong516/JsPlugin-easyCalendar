# Easy Calendar

An easy-to-use JS Calendar Plugin. View demo [here](https://qianzhong516.github.io/JsPlugin-easyCalendar/).

## Usage

```html
<html>
    <head>
        <link rel="stylesheet" href="path/to/easyCalendar.css" />
        <script src="path/to/easyCalendar.min.js"></script>
    </head>
    <body>
        <input id="anchor" type="text" placeholder="dd/mm/yy" />
        <script>
		const calendar = new EasyCalendar('anchor', {options})
	</script>
    </body>
</html>
```

## Options 

```js
{
	theme: {
		borderColor: '#ff3333',
		headerColor: '#fff',
		headerBg: '#1a1a1a',
		navBg: '#666666',
		cellBg: '#8c8c8c'
    	}  
}
```



