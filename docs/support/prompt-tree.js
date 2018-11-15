'use strict';

const archy = require('archy');
const ast = {
  label: 'Prompt',
  description: 'The base class used to create all other prompts.',
  bold: true,
  nodes: [
    {
      label: 'Array',
      bold: true,
      description: 'Used to create prompts that present users with an array of choices.',
      nodes: [
        {
          label: 'LikertScale'
        },
        {
          label: 'Select',
          nodes: [
            {
              label: 'AutoComplete'
            },
            {
              label: 'Form'
            },
            {
              label: 'hSelect',
              nodes: [
                {
                  label: 'hMultiSelect'
                }
              ]
            },
            {
              label: 'MultiSelect'
            },
            {
              label: 'Sort'
            }
          ]
        },
        {
          label: 'Survey'
        }
      ]
    },
    {
      label: 'Boolean',
      description: 'For creating prompts that take and return boolean values.',
      bold: true,
      nodes: [
        {
          label: 'Confirm'
        }
      ]
    },
    {
      label: 'Number',
      description: 'For creating prompts that take and return numerical values.',
      bold: true,
      nodes: [
        {
          label: 'Numeral'
        }
      ]
    },
    {
      label: 'String',
      description: 'For creating prompts that take and return string values.',
      bold: true,
      nodes: [
        {
          label: 'Input'
        },
        {
          label: 'Invisible'
        },
        {
          label: 'List'
        },
        {
          label: 'Password'
        }
      ]
    },
    {
      label: 'Snippet'
    }
  ]
};

function visit(node) {
  let text = node.label + (node.label !== 'Prompt' ? ' Prompt' : '');
  let link = node.label.toLowerCase() + (node.label !== 'Prompt' ? '-prompt' : '');
  node.label = `<a href="#${link}">${text}</a>`;
  if (node.bold) {
    node.label = `<strong>${node.label}</strong>`;
  }
  if (node.description) {
    node.label += ' - ' + node.description;
  }
  if (node.nodes) {
    node.nodes.forEach(visit);
  }
}

visit(ast);
const tree = archy(ast);

console.log(ast);
console.log(tree);
