'use strict';

const fs = require('fs');
const path = require('path');
const slug = require('markdown-slug');
const pkg = require('../../package');
const cwd = (...args) => path.resolve(__dirname, '../..', ...args);

function readme(name) {
  let str = fs.readFileSync(cwd(name), 'utf8');
  let headings = findHeadings(str);
  let tokens = [];
  let links = [];

  for (let match of str.match(/\[[^\]]+\]\(([^)]+)\)/g)) {
    let link = match.slice(match.indexOf('(') + 1, match.indexOf(')'));
    let tok = { type: 'url', link };
    links.push(link);

    if (link.startsWith('#')) {
      tok.type = 'heading';
      tok.heading = tok.link;
      tok.link = cwd(name);
    } else if (link.includes('#')) {
      let parts = link.split('#');
      tok.link = cwd(parts[0]);
      tok.file = { path: tok.link };
      tok.type = 'file';
      tok.heading = '#' + parts[1];
    } else if (link.startsWith('../../')) {
      tok.link = `${pkg.homepage}/${link.slice('../../'.length)}`;
    } else if (!link.startsWith('http')) {
      tok.type = 'file';
      tok.link = cwd(link);
      tok.file = { path: tok.link };
    }

    tokens.push(tok);
  }

  let report = { good: [], bad: [] };

  for (let tok of tokens) {
    if (tok.type === 'file') {
      if (!fs.existsSync(tok.file.path)) {
        report.bad.push(tok);
      } else if (tok.heading) {
        let s = fs.readFileSync(tok.file.path, 'utf8');
        let hds = findHeadings(s);
        report.good.push(tok);
      } else {
        report.good.push(tok);
      }
    }
  }
  console.log(report.bad);
}

function findHeadings(str) {
  let headings = str.match(/^#{1,6} [^\n\[]+/gm) || [];
  return headings.map(heading => {
    heading = heading.replace(/#+\s*/, '');
    heading = heading.replace(/❯\s*/, '-');
    return slug(heading);
  });
  return new Set(headings.sort());
}

readme('README.md');
