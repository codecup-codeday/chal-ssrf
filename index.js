const express = require('express');
const bodyParser = require("body-parser");
const genericWebsite = require('@srnd/codecup-genericwebsite');
const puppeteer = require('puppeteer');

const port = process.env.PORT || 8080;
const flag = process.env.FLAG || 'test';
const tpl = genericWebsite.randomTemplate(flag);
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => { // simple search form
    res.send(tpl('Welcome',`
	<h1>Website Screenshotter</h1>
	<form action = "/search" method = "POST">
	<input placeholder = "codeday.org" type = "text" name = "search" align = "justify"/><br><br>
	<input type = "submit" value="Search" />
	</form>
	<div style="height: 10px"></div>
	<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
	<button onclick='swal( "Hint" ,  "Hacker: I know your address \\n Me: Bruh I know it too" )'>hint</button>
	<div style="height: 150px"></div>`));
});

var screenshot = '';
var url = '';
let globalBrowser = false;

app.post('/search', async (req,res) => { 
	url = req.body.search;
	if (!/^https?:\/\//i.test(url)) { // adds http:// if not
    	url = 'http://' + url;
	}

	if (!globalBrowser) {
		globalBrowser = await puppeteer.launch({
			args: ["--no-sandbox"]
		});
	}
	
	const page = await globalBrowser.newPage();
	await page.setViewport({
		width:1280,
		height:720,
	});
	try {
		await page.goto(url);
		await page.waitForTimeout(1600);
		screenshot = await page.screenshot({ encoding: 'base64' }); // encode image in b64 to include in html
		res.send(tpl('Result',`
		<style>
		img {
			width: 100%;
			height: 100%;
		}
		</style>
		<h1>Website Screenshotter</h1>
		<form action = "/search" method = "POST">
		<input placeholder = "codeday.org" type = "text" name = "search" align = "justify"/><br><br>
		<input type = "submit" value="Search" />
		</form>
		<div style="height: 10px"></div>
		<img src="data:image/png;base64, ${screenshot}" />
		<div style="height: 150px"></div>`));
	} catch(err) { // display err
		res.send(tpl('Error',`
		<h1>Website Screenshotter</h1>
		<form action = "/search" method = "POST">
		<input placeholder = "codeday.org" type = "text" name = "search" align = "justify"/><br><br>
		<input type = "submit" value="Search" />
		</form>
		<div style="height: 10px"></div>
		${err}
		<div style="height: 150px"></div>`));
	}
	page.close();
});

app.listen(port, () => console.log(`Listening on http://0.0.0.0:${port}/`));