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

app.get('/', (req, res) => {
    res.send(tpl('Welcome',`
	<form action = "/search" method = "POST">
	<input type = "text" name = "search" align = "justify"/><br><br>
	<input type = "submit" value="Search" />
	</form>
	<div style="height: 10px"></div>
	<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
	<button onclick='swal( "Hint" ,  "Hacker: I know your address \\n Me: Bruh I know it too" )'>hint</button>`));
});
var screenshot = '';
var url = '';
app.post('/search', async (req,res) => {
	url = req.body.search;
	if (!/^https?:\/\//i.test(url)) {
    	url = 'http://' + url;
	}
	const browser = await puppeteer.launch({
		args: ["--no-sandbox"]
	});
	const page = await browser.newPage();
	await page.setViewport({
		width:1280,
		height:720,
	});
	try {
		await page.goto(url);
		await page.waitForTimeout(1500);
		screenshot = await page.screenshot({ encoding: 'base64' });
		res.send(tpl('Result',`
		<style>
		img {
			width: 100%;
			height: 100%;
		}
		</style>
		<form action = "/search" method = "POST">
		<input type = "text" name = "search" align = "justify"/><br><br>
		<input type = "submit" value="Search" />
		</form>
		<div style="height: 10px"></div>
		<img src="data:image/png;base64, ${screenshot}" />
		<div style="height: 150px"></div>`));
	} catch(err) {
		res.send(tpl('Error',`
		<form action = "/search" method = "POST">
		<input type = "text" name = "search" align = "justify"/><br><br>
		<input type = "submit" value="Search" />
		</form>
		<div style="height: 10px"></div>
		${err}
		<div style="height: 150px"></div>`));
	}
	
});

app.listen(port, () => console.log(`Listening on http://0.0.0.0:${port}/`));