import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Image from '@editorjs/image';
import List from '@editorjs/list';
import edjsParser from 'editorjs-parser';
import { NodeHtmlMarkdown } from 'node-html-markdown';

fetch('http://localhost:5000/content/tree').then((data) => {
    console.log(data);
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
        console.log(NodeHtmlMarkdown.translate(html))
    })
})