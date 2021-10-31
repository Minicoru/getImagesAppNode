const log = (p1) => console.log(p1);

// http://rain.thecomicseries.com/comics/510    objetive site - id = comicimage

const cheerio = require('cheerio'),
	request = require('request'),
	shell = require('shelljs'),
	fs = require('fs');

request.defaults({ encoding: null });

const scraping = async (api, url, id, path) => {
	let $ = null;

	const headers = {
		accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
		'accept-language': 'en-US,en;q=0.9,es;q=0.8',
		'cache-control': 'max-age=0',
		'sec-ch-ua': '" Not;A Brand";v="99", "Microsoft Edge";v="91", "Chromium";v="91"'
	};

	console.log(api, url, id, path);
	try {
		const options = {
			uri: `/${url}`,
			baseUrl: api,
			method: 'GET',
			headers: headers
		};
		const mangas = [];
		let pages = 0;
		await request.get(options, async (err, response, html) => {
			$ = cheerio.load(html);

			const nodes = $(`.${id}`);
			const panel_page_number = nodes[0].children.find((element) => {
				if (
					element.hasOwnProperty('name') &&
					element.name === 'div' &&
					element.attribs.class === 'panel_page_number'
				) {
					return element;
				}
			});
			const group_page = panel_page_number.children.find((element) => {
				if (
					element.hasOwnProperty('name') &&
					element.name === 'div' &&
					element.attribs.class === 'group_page'
				) {
					return element;
				}
			});
			pages =
				group_page.children[group_page.children.length - 1].attribs.href.split('=')[
					group_page.children[group_page.children.length - 1].attribs.href.split('=').length - 1
				];

			console.log(pages);
			for (let i = 1; i <= pages; i++) {
				options.uri = `/${url}${i}`;
				console.log(options.uri);
				const result = await request.get(options, async (err, response, html) => {
					$ = cheerio.load(html);
					console.log(`${i}/${pages}`);
					// const nodes = $(`.${id}`);
					const nodes = $.root()[0].children;
					// nodes[0].children.forEach((element, index) => {
					// 	if (
					// 		element.hasOwnProperty('name') &&
					// 		element.name === 'div' &&
					// 		element.attribs.class === 'list-truyen-item-wrap'
					// 	) {
					// 		let manga = {};
					// 		let a = element.children[1];
					// 		if (a.hasOwnProperty('name') && a.name === 'a') {
					// 			manga = { ...manga, ...a.attribs };
					// 			mangas.push(manga);
					// 		}
					// 	}
					// });

					if (i === pages) {
						console.log(mangas);
						return mangas;
					}
				});
				console.log(result);
			}
		});
	} catch (e) {
		log(e);
	}
};

log(`it begin's...`);
scraping(
	'https://mangakakalot.com',
	'manga_list?type=newest&category=13&state=completed&page=',
	'truyen-list',
	'../downloads/'
);
