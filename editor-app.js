const express = require('express');
const expressFileUpload = require('express-fileupload');
const cors = require('cors');
const fsPromise = require('fs/promises');
const path = require('path');
const dirTree = require('directory-tree');
const { readFileSync } = require('fs');
const { NodeHtmlMarkdown } = require('node-html-markdown');

const app = express();

let editorDataMap = {};
try { JSON.parse(readFileSync('.editordatamap', { encoding: 'utf-8' })) } catch { };

app.use(express.json())

app.use(cors())

app.use(expressFileUpload());

app.use(express.static(process.env.STATIC_PATH))

app.post('/image-upload', (req, res) => {
    const file = req.files.image, name = `img_${Date.now()}.${file.mimetype.split('/')[1]}`;
    fsPromise.writeFile(path.resolve(__dirname, 'img', 'uploads', name), file.data).then(() => {
        res.send({
            success: 1,
            file: {
                url: `img/uploads/${name}`
            }
        });
    }).catch((e) => {
        console.log(e);
        res.send({
            success: 0
        })
    })

})

app.get('/img/uploads/:name', (req, res) => {
    const name = req.params.name;
    res.sendFile(path.resolve(__dirname, 'img', 'uploads', name));
})

app.get('/content/tree', (req, res) => {
    res.send(dirTree(path.resolve(__dirname, "posts")));
})

app.get('/content/:path', (req, res) => {
    const pth = req.params.path;
    const editorData = editorDataMap[pth];
    res.send(editorData)
})

const MD_DELIM = '# delim'
app.post('/content/:path', (req, res) => {
    const pth = req.params.path;
    editorDataMap[pth] = req.body.data;
    const markdown = NodeHtmlMarkdown.translate(req.body.html);
    fsPromise.readFile(pth, { encoding: 'utf-8' }).then(file => {
        const [frontMatter, body] = file.split(MD_DELIM);
        if (!body) {
            res.status(500).send('Could not save, no delimitter found in file');
        } else {
            fsPromise.writeFile(pth, `${frontMatter}\n${MD_DELIM}\n${markdown}`).then(() => {
                res.send({ success: 1 })
            }).catch(e => {
                console.log(e);
                res.send({ success: 0 })
            })
        }
    }).catch(e => {
        console.log(e);
        res.status(404).send({
            success: 0
        })
    })
    res.send('Ok');
});

app.listen(5000);