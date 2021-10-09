const log = (p1) => console.log(p1);

// http://rain.thecomicseries.com/comics/510    objetive site - id = comicimage

const cheerio = require('cheerio'),
	request = require('request'),
	shell = require('shelljs'),
	fs = require('fs');

request.defaults({ encoding: null });

const scraping = async (api, url, id, path, title, from, to) => {
	let $ = null;

	const headers = {
		accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
		'accept-language': 'en-US,en;q=0.9,es;q=0.8',
		'cache-control': 'max-age=0',
		'sec-ch-ua': '" Not;A Brand";v="99", "Microsoft Edge";v="91", "Chromium";v="91"'
	};

	try {
		shell.mkdir('-p', `${path}/${title}`);
		try {
			const options = {
				uri: `/${url}/${from}`,
				baseUrl: api,
				method: 'GET',
				headers: headers
			};
			await request.get(options, async (err, response, html) => {
				$ = cheerio.load(html);

				const nodes = $(`img#${id}`);
				if (nodes.length > 0) {
					const node = nodes[0] ? nodes[0] : null;
					if (node && node.name === 'img' && node.attribs.src !== 0) {
						// log(node.attribs.src);
						const partsBaseApi = String(node.attribs.src).split('/');
						const fileExtension = partsBaseApi[partsBaseApi.length - 1].split('.')[1];
						let newApi = `${partsBaseApi[0]}//${partsBaseApi[2]}`,
							newUri = ``;
						for (let index = 3; index < partsBaseApi.length; index++) {
							newUri += `/${partsBaseApi[index]}`;
						}
						const newHeaders = {
							accept: `text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/${fileExtension},*/*;q=0.8,application/signed-exchange;v=b3;q=0.9`,
							'accept-language': 'en-US,en;q=0.9,es;q=0.8',
							'cache-control': 'max-age=0',
							'sec-ch-ua': '" Not;A Brand";v="99", "Microsoft Edge";v="91", "Chromium";v="91"',
							'Content-Type': `image/${fileExtension}`
						};
						const newOptions = {
							uri: newUri,
							baseUrl: newApi,
							method: 'GET',
							headers: newHeaders,
							encoding: 'binary'
						};
						await request.get(newOptions, (err, response, img) => {
							// log(img);
							// writeFile function with filename, content and callback function
							fs.writeFile(
								`../downloads/${title}/page${from}.${fileExtension}`,
								img,
								'binary',
								function (err) {
									if (err) throw err;
									if (from < to) {
										from++;
										scraping(
											'http://rain.thecomicseries.com',
											'comics',
											'comicimage',
											'../downloads/',
											'RAIN',
											from,
											to
										);
									}
								}
							);
						});
					}
				}
			});
		} catch (e) {
			// log(e);
		}
	} catch (e) {
		// log(e);
	}
};

log(`it begin's...`);
scraping('http://rain.thecomicseries.com', 'comics', 'comicimage', '../downloads/', 'RAIN', 51, 1405);
