import "./content-script.scss";
import cheerio from 'cheerio';

window.onload = async () => {

  const url = new URL(window.location.href);
  const params = url.searchParams;

  if (
    params.get('tbm') === null &&
    (params.get('start') === null || params.get('start') === '0')
  ) {

    const insertDom = document.createElement('div');
    const resultsDom = document.createElement('ul');
    resultsDom.classList.add('gswd-search-results');
    const targetDom = document.querySelector('div#rhs') !== null ?
      document.querySelector('div#rhs') : document.querySelector('div.GyAeWb');
    targetDom?.classList.contains('GyAeWb') ?
      insertDom.classList.add('gswd-content') : insertDom.classList.add('gswd-content-2nd');

    const gsResLinks: string[] = []
    document.querySelectorAll('div#rso a').forEach((elem: any) =>{

      gsResLinks.push( elem.href );
    });

    insertDom.innerHTML = '<h2>' + chrome.i18n.getMessage('h2_title') + '</h2>';
    //insertDom.innerHTML += '<p>ここに表示されます。</p>';

    chrome.runtime.sendMessage(
      {
        contentScriptQuery: 'post',
        endpoint: 'https://html.duckduckgo.com/html/?q=' + params.get('q') + '&kg=-1&kd=-1'
      },
      (response) => {

        //console.log(response);
        const $ = cheerio.load( response );
        $('div#links div.links_main.links_deep.result__body').each((i, el) => {

          //console.log($(el).find('h2 a').attr('href'));
          if ( gsResLinks.indexOf( $(el).find('h2 a').attr('href') || 'none' ) > -1 ) {

            resultsDom.innerHTML += '<li class="bg">' + $(el).find('h2').html() + '</li>';
          }else resultsDom.innerHTML += '<li>' + $(el).find('h2').html() + '</li>';
        });
        insertDom.innerHTML += resultsDom.outerHTML;
        targetDom?.insertAdjacentElement('beforeend', insertDom);
      }
    );
  }
}