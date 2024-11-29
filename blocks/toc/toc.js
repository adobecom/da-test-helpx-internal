export default (block) => {
  construct(block);
  init(block);
};

function init(block) {
  const tocParentElement = block.querySelectorAll('li.toclink-label > .parentNode');
  const pageNavLink = block.querySelectorAll('.toclink-label a');
  const currentPagePath = window.location.pathname;
  setActiveIndicator(currentPagePath, pageNavLink);
  toggleIconAndExpandToc(tocParentElement);
  expandTOC(block,`.leafNode[href='${currentPagePath}']`);
}

function construct(block) {
  const appDiv = document.querySelector(`div.toc > div > div`);
  const iconImg = appDiv.querySelector("p > img");
  const iconPath = iconImg ? iconImg.src : null;

  // Extract the title
  const titleP = appDiv.querySelectorAll("p")[1];
  const title = titleP ? titleP.textContent.trim() : null;

  // Extract the link
  const linkAnchor = appDiv.querySelector("p > a");
  const link = linkAnchor ? linkAnchor.href : null;
  
  const tocList = [...block.querySelector(`div.toc > div:nth-child(2) > div`).children][0];
  tocList.classList.add('tocList');

  const newHtml = `
        <div class="container">
            <img src="${iconPath}" alt="${title} Icon" class="icon">
            <div class="content">
                <p class="title">${title}</p>
                <p class="link">
                    <a href="${link}" target="_blank">${link}</a>
                </p>
            </div>

        </div>
    `;

  tocList.querySelectorAll('p > a[href]').forEach(anchor => {
    anchor.parentNode.outerHTML = anchor.outerHTML;
  })

  replaceElement(tocList, 'p', 'span');
  wrapWithSpan(tocList);
  addClassName(tocList, 'li', 'toclink-label');
  addClassName(tocList, 'a', 'leafNode');
  [...tocList.children].forEach(childElement => {
    addChildClass(childElement);
  });
  block.innerHTML = tocList.outerHTML;
}

function replaceElement(node, currElement, newElement) {
  [...node.getElementsByTagName(currElement)].forEach((element) => {
    const replacedElement = document.createElement(newElement);
    replacedElement.innerHTML = element.innerHTML;
    element.parentNode.replaceChild(replacedElement, element);
  });
}

function wrapWithSpan(node) {
  [...node.getElementsByTagName('span')].forEach((element) => {
    const outerElement = document.createElement('span');
    outerElement.classList.add('parentNode');

    const icon = document.createElement('span');
    icon.classList.add('parentNodeIcon');

    element.classList.add('parentNodeLabel');

    outerElement.innerHTML = icon.outerHTML + element.outerHTML;
    element.parentNode.replaceChild(outerElement, element);
  });
}

function addClassName(node, element, className) {
  [...node.getElementsByTagName(element)].forEach((ele) => {
    ele.classList.add(className);
  });
}

function addChildClass(node) {
  if (node.tagName.toLowerCase() === 'ul') {
    node.classList.add('tocListItem');
    if (node.childElementCount > 0) node.classList.add('children');
    [...node.children].forEach((child) => addChildClass(child));
  } else if (node.tagName.toLowerCase() === 'li') {
    if (node.childElementCount === 1 && node.firstElementChild.tagName.toLowerCase() === 'a') {
      node.classList.add('noChild');
    } else {
      node.classList.add('hasChildren');
      [...node.children].forEach((child) => addChildClass(child));
    }
  }
}

function expandTOC(block, elem) {
  if(!elem || !block) return;

  const initialElement = block.querySelector(`${elem}`);

  if (initialElement) {
    let currentElement = initialElement.parentElement;
    while (currentElement) {
      if (currentElement.classList.contains('toclink-label')) {
        const parentNode = currentElement.querySelector('.parentNode');
        if (parentNode) {
          parentNode.classList.add('expandToc', 'highlightNode');
        }
      }
      currentElement = currentElement.parentElement;
    }

    initialElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
  }
}

function setActiveIndicator(currentPagePath, pageNavLink) {
  if (!currentPagePath || !pageNavLink) return;
  pageNavLink.forEach((link) => {
    if (link.getAttribute('href').includes(currentPagePath)) {
      link.closest('.toclink-label').classList.add('is-active');
    }
  });
}

function toggleIconAndExpandToc(tocParentElement) {
  tocParentElement.forEach(parent => {
    parent.setAttribute('onclick','this.classList.toggle("expandToc");')
  });
  
}
