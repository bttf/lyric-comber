const request = requireNode('request');
const cheerio = requireNode('cheerio');
const _ = requireNode('underscore');

export function scrapeLyrics(artist, song, callback) {
  console.log('at scraper');

  //holy shit, null bytes
  artist = artist.replace(/\0/g, '');
  song = song.replace(/\0/g, '');

  let lyrics = '';
  let url = encodeURI(`http://lyrics.wikia.com/wiki/${artist}\:${song}`);
  console.log('debug', url);

  request(url, (err, response, html) => {
    console.log('made request, received response');
    if(err) { console.log('request err'); callback(err, null); }
    else {
      console.log('no errors');
          const $ = cheerio.load(html);
          $('script').remove();

          let lyrics = ($('.lyricbox').html());

          /**
           * Override default underscore escape map
           */
          const escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            "'": '&apos;',
            '`': '&#x60;',
            '' : '\n'
          };

          const unescapeMap = _.invert(escapeMap);
          const createEscaper = function(map) {
            const escaper = function(match) {
              return map[match];
            };

            const source = '(?:' + _.keys(map).join('|') + ')';
            const testRegexp = new RegExp(source);
            const replaceRegexp = new RegExp(source, 'g');
            return function(string) {
              string = string === null ? '' : '' + string;
              return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
            };
          };
          _.escape = createEscaper(escapeMap);
          _.unescape = createEscaper(unescapeMap);

          // replace html codes with punctuation
          lyrics = _.unescape(lyrics);
          // remove everything between brackets
          lyrics = lyrics.replace(/\[[^\]]*\]/g, '');
          // remove html comments
          lyrics = lyrics.replace(/(<!--)[^-]*-->/g, '');
          // replace newlines
          lyrics = lyrics.replace(/<br>/g, '\n');
          // remove all tags
          lyrics = lyrics.replace(/<[^>]*>/g, '');

          //console.log(lyrics);
          if(lyrics !== ""){
            callback(null, lyrics);
          }
          else{
            callback("not found", null);
          }
        }
  });
}
