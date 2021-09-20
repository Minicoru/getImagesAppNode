const log = (p1) => console.log(p1);

// http://rain.thecomicseries.com/comics/510    objetive site - id = comicimage

const cheerio = require('cheerio');
const request = require('request');
const sources = require('./sources');
const fs = require('fs');

const log = console.log;

const scraping = async (url, id, from, to) => {
	let $ = null;

	const headers = {
		accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
		'accept-language': 'en-US,en;q=0.9,es;q=0.8',
		'cache-control': 'max-age=0',
		'sec-ch-ua': '" Not;A Brand";v="99", "Microsoft Edge";v="91", "Chromium";v="91"'
	};

	try {
		do {
			try {
				const options = {
					uri: `${url}/${from}`,
					baseUrl: api,
					method: 'GET',
					headers: headers
				};
				await request.get(options, (err, response, html) => {
					$ = cheerio.load(html);

					const image = $('img#comicimage');
					log(image);
					debugger;
					// writeFile function with filename, content and callback function
					// fs.writeFile('newfile.txt', 'Learn Node FS module', function (err) {
					// 	if (err) throw err;
					// 	console.log('File is created successfully.');
					// });

					log(results);
				});
			} catch (e) {
				log(e);
			}
			from++;
		} while (from < to);
	} catch (e) {
		log(e);
	}
};

log(`it begin's...`);
scraping('http://rain.thecomicseries.com/comics', 'comicimage', 1, 1);
