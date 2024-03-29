import axios, * as others from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as df from 'date-format';

let rawData = fs.readFileSync('./OutPut/2018.json');
let links = JSON.parse(rawData);

links.forEach(scrapeStory);
// links.forEach(testLink);

// function testLink (currentValue) {
//   let fixedLink = "https://www.theregister.com" + currentValue['link'];
//   console.log(fixedLink);
// }

function scrapeStory (currentValue) {
  let fixedLink = "https://www.theregister.com" + currentValue['link'];

  axios.get(fixedLink).then(response => { // The HTML code of the website is stored in the "data" property of the response object
    const html = response.data;
    const $ = cheerio.load(html);
    const episodeElements = $('div[id=page] > article');

  var title = (episodeElements
    .find('div[class=header_right] > h1')
    .text()
  );

  var subtitle = (episodeElements
    .find('div[class=header_right] > h2')
    .text()
  );

  var episodeNumber = (episodeElements 
    .find('#body > p:nth-child(1) > span')
    .text()
  );

  var pubDate = new Date (episodeElements
    .find('span[class=dateline]')
    .text()
  );

  var story = (episodeElements
    .find('div[id=body] > p')
    .toArray()
    .map(element => $(element)
    .text()
    )
  );

  let stringYear = df.asString('yyyy', pubDate);

  let fileName = "./OutPut/" + stringYear + " " + episodeNumber + (".md");

  //build a big string here and do the writing all at once
  let bigString = "# " + title + "\n\n## " + subtitle + "\n\n";

  story.forEach(element => {
    bigString = bigString + element + "\n\n"
    });

  bigString = bigString + "\n\n- Published on: " + pubDate + "\n\n- Written By: Simon Travaglia\n\n- Posted to: \[" + fixedLink + "\]\(" + fixedLink + "\)";

   fs.writeFile(fileName, bigString, err =>{
      if(err)
        console.log(err);
    });
  });
};
