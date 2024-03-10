import { getMetadata } from '../../scripts/aem.js';

async function loadFragment(path) {
  if (path ) {
    const resp = await fetch(path);
    if (resp.ok) {
      const parser = new DOMParser();
      return parser.parseFromString(await resp.text(), 'text/html');
    }
  }
  return null;
}

export default async function decorate(block) {
  [...block.children].forEach(async (div) => {
    console.log(div.outerHTML);
    const link = div.querySelector('div>div>a');
    console.log("link: " + link);
    const path = link ? link.getAttribute('href') : div.textContent.trim();
    console.log("path: " +path);
    if (path) {
    const doc = await loadFragment(path);
    //div.remove();

    const heroPicture = doc.querySelector('picture');
    const title = getMetadata('og:title', doc);
    const desc = getMetadata('og:description', doc);

    const card = document.createElement('div');
    card.classList.add('card');

    const h2 = document.createElement('h2');
    h2.textContent = title;

    const p = document.createElement('p');
    p.textContent = desc;

    card.appendChild(heroPicture);
    card.appendChild(h2);
    card.appendChild(p);

    const a = document.createElement('a');
    a.href = doc.querySelector('link').href;
    a.appendChild(card);

    block.appendChild(a);
  }
  });
}
 