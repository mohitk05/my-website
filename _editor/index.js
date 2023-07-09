import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Image from '@editorjs/image';
import List from '@editorjs/list';
import edjsParser from 'editorjs-parser';
import { NodeHtmlMarkdown } from 'node-html-markdown';

function constructTree(el, dirChildren, marginLeft = 0) {
    const ul = document.createElement("ul");
    dirChildren.forEach((dir) => {
        const li = document.createElement("li");
        li.innerHTML = dir.name;
        li.style.marginLeft = marginLeft + 'px';
        if (dir.children)
            constructTree(li, dir.children, marginLeft + 2);
        ul.appendChild(li);
    })
    el.appendChild(ul);
}

fetch('http://localhost:5000/content/tree').then(d => d.json()).then((data) => {
    console.log(data);
    const dirTree = document.querySelector('#dir-tree');
    if (!dirTree) return;
    const ul = document.createElement("ul");
    ul.innerHTML = data.name;
    constructTree(ul, data.children);
    dirTree.appendChild(ul);
})

const editor = new EditorJS({
    /**
     * Id of Element that should contain Editor instance
     */
    holder: 'editor',
    tools: {
        header: Header,
        image: {
            class: Image,
            config: {
                endpoints: {
                    byFile: '/image-upload', // Your backend file uploader endpoint
                }
            }
        },
        list: List
    },
});


const parser = new edjsParser();

document.querySelector('#save-button').addEventListener('click', () => {
    editor.save().then(data => {
        const html = parser.parse(data);
        fetch({
            method: 'POST',
            url: "/content/"
        })
        console.log(NodeHtmlMarkdown.translate(html))
    })
})