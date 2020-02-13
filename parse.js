tokens = ['a', 'b', 'i', 'strong']

isAlpha = (character) => /[a-z]/i.test(character)
isSpace = (character) => character === ' '
isOpenBracket = (character) => character === '<'
isCloseBracket = (character) => character === '>'
isForwardSlash = (character) => character === '/'

function Node ({ parent, tag, attributes, children=[] } = {}) {
    this.parent = parent
    this.tag = tag
    this.attributes = attributes
    this.children = children
}

Node.prototype[Symbol.iterator] = function* () {
    // Skip root
    if (this.parent) {
        if (this.children.length > 0) {
            yield {
                event: 'start',
                node: this
            }
        }
        else {
            yield {
                event: 'leaf',
                node: this
            }
            return
        }
    }

    for (let i = 0; i < this.children.length; i++) {
        // Node child
        if (this.children[i] instanceof Node) {
            yield* this.children[i][Symbol.iterator]()
        }
        // Text child
        else {
            yield {
                event: 'leaf',
                node: this.children[i]
            }
        }
    }

    if (this.parent) {
        yield {
            event: 'end',
            node: this
        }
    }
}

function toTree (html) {
    // Root node
    var rootNode = new Node()
    var currentNode = rootNode

    const data = html.split('')

    textNode = ''

    for (var i = 0; i < data.length; i++) {
        const char = data[i]
        const charNext = data[i+1]

        if (isOpenBracket(char) && isAlpha(charNext)) {
            // Clean up text nodes
            if (textNode) {
                currentNode.children.push(textNode)
                textNode = ''
            }
            i++
            tagStart()
        }
        else if (isOpenBracket(data[i]) && isForwardSlash(data[i+1])) {
            // Clean up text nodes
            if (textNode) {
                currentNode.children.push(textNode)
                textNode = ''
            }

            // Find and skip to after the close bracket.
            const expectedTag = currentNode.tag
            const skips = expectedTag.length
            i += skips+2
            tagEnd()
        }
        else {
            // Text node
            textNode += char
        }
    }

    // Clean up text nodes
    if (textNode) {
        currentNode.children.push(textNode)
        textNode = ''
    }

    return rootNode

    function tagStart () {
        var tagName = ''
        while (isAlpha(data[i])) {
            tagName += data[i]
            i++
        }

        const newNode = new Node({ parent: currentNode, tag: tagName })
        currentNode.children.push(newNode)
        currentNode = newNode

        if (tagName === 'br') {
            tagEnd()
        }
        if (isSpace(data[i])) {
            tagAttributes()
        }
        else if (isCloseBracket(data[i])) {
            // return to parse
        }
        else if (isForwardSlash(data[i]) && isCloseBracket(data[i+1])) {
            // return to parse
            tagEnd()
        }
    }

    function tagAttributes () {
        var attributes = ''
        while (!isCloseBracket(data[i])) {
            attributes += data[i]
            i++
        }

        currentNode.attributes = Object.fromEntries(attributes.trim().split(/["'] /).map(attr => {
            const keyValuePair = attr.split(/=["']/)
            keyValuePair[1] = keyValuePair[1].replace(/["']$/, '')
            return keyValuePair
        }))
    }

    function tagEnd () {
        currentNode = currentNode.parent
    }
}

function toMarkdown (html) {
    var markdown = ''

    const tree = toTree(html)
    const treeIterator = tree[Symbol.iterator]()

    while (true) {
        const result = treeIterator.next()
        if (result.done) break
        const { event, node } = result.value

        if (event === 'leaf' && typeof node === 'string') {
            if (typeof node === 'string') {
                markdown += node
                continue
            }

            switch (node.tag) {
                case 'br':
                    markdown += '\n'
            }
            continue
        }
        
        switch (node.tag) {
            case 'b':
                markdown += '**'
                break
            case 'i':
                markdown += '*'
                break
            case 'a':
                markdown += event === 'start' ? '[' : `](${node.attributes.href})`
                break
        }
    }

    return markdown
}

module.exports = {
    Node,
    toTree,
    toMarkdown
}