/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

function createBugzillaLink(id) {
  let a = document.createElement('a');
  a.appendChild(document.createTextNode("🐛"));
  a.href = "https://bugzilla.mozilla.org/show_bug.cgi?id=" + id;
  return a;
}

function boogs() {
    let h1 = document.querySelector('h1.gh-header-title');
    for (e of h1.childNodes) {
        console.log("WOO");
        console.log(e);
    }

    if (h1) {
        let found = e.innerText.match(/Bug\W+(\d{7})/)
        if (found) {
            e.appendChild(createBugzillaLink(found[1]));
        }
    }

    for (li of document.querySelectorAll('li.js-issue-row')) {
        let a = li.querySelector('a.js-navigation-open')
        if (a) {
            let found = a.innerText.match(/Bug\W+(\d{7})/)
            if (found) {
                let span = document.createElement('span');
                span.className = 'd-inline-block mr-1';
                span.appendChild(createBugzillaLink(found[1]));
                if (a.nextSibling) {
                    a.parentNode.insertBefore(span, a.nextSibling);
                } else {
                    a.parentNode.appendNode(span);
                }
            }
        }
    }
}

const re = /Bug\W+(\d{7})/i;

function annotateBoogsInContainer(div) {
    if (div.getAttribute('got-boogs')) {
        return;
    }

    let h1 = div.querySelector('h1.gh-header-title');
    if (h1) {
        let found = re.exec(h1.innerText);
        if (found) {
            h1.appendChild(createBugzillaLink(found[1]));
        }
    }

    for (li of div.querySelectorAll('li.js-issue-row')) {
        let a = li.querySelector('a.js-navigation-open')
        if (a) {
            let found = re.exec(a.innerText);
            if (found) {
                let span = document.createElement('span');
                span.className = 'd-inline-block mr-1';
                span.appendChild(createBugzillaLink(found[1]));
                if (a.nextSibling) {
                    a.parentNode.insertBefore(span, a.nextSibling);
                } else {
                    a.parentNode.appendNode(span);
                }
            }
        }
    }

    div.setAttribute('got-boogs', true);
}

const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function (n, i, a) {
            if (n.tagName === "DIV" && n.classList.contains("container")) {
                annotateBoogsInContainer(n);
            }
        })
    })
})

// TODO This can probably be optimized by looking at just the container or the ajax container
observer.observe(document, {subtree: true, childList: true});
