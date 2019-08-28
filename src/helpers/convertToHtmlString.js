export const convertToHtmlString = (text, imageArr) => {
    console.log('images', `\r[0]`.match(/(\r\[[0-9]+\])/g))
    const images = text.match(/(\r\[[0-9]+\])/g) || []
    const captions = text.match(/(#.+#)/g) || []
    images.forEach(el => {
        let num = []
        let store = false
        el.split('').forEach(e => {
            if(e === ']'){
                store = false
            }
            if(store){
                num.push(e)
            }
            if(e === '['){
                store = true
            }
        })
        num = num.join('')
        console.log('num', num, el)
        text = text.replace(el, `<div class="myCard inPostImage" style="background-image: url('/assets/images/posts/${imageArr[parseInt(num, 10)]}')"></div>`)
    })
    captions.forEach(el => {
        let caption = []
        let store = false
        el.split('').forEach(e => {
            if(e === '#'){
                store = !store
            }
            if(store && e !== '#'){
                caption.push(e)
            }
        })
        caption = caption.join('')
        console.log('caption', caption, el)
        text = text.replace(el, `<span class="inPostCaption">${caption} ↑</span>`)
    })
    console.log(text)
    let arr = text.split('\r\n')
    return arr.map(el => {
        if(el.length > 15)
            return `<span>${el}</span><br/>`
        else return `<span class="inPostHeading">${el}</span>`
    }).join('')
}