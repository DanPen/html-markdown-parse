const parse = require('./parse')

// Test that the node iterator works as expected (on whiteboard).
// Test mardown

test('tree parse b->t', () => {
    const tree = parse.toTree(`<b>Hello World!</b>`)
    expect(tree).toMatchSnapshot()
})

test('tree parse b->t | t', () => {
    const tree = parse.toTree(`<b>Hello World!</b> Test`)
    expect(tree).toMatchSnapshot()
})

test('tree parse b->i->t', () => {
    const tree = parse.toTree(`<b><i>Hello World!</i></b>`)
    expect(tree).toMatchSnapshot()
})

test('tree parse a->t', () => {
    const tree = parse.toTree(`<a href="https://google.com">Google</a>`)
    expect(tree).toMatchSnapshot()
})

test('tree parse b->t | br | br | i->t', () => {
    const tree = parse.toTree(`<b>hello</b><br><br> <i>world</i>`)
    expect(tree).toMatchSnapshot()
})

test('tree iterator', () => {
    const tree = parse.toTree(`<i><b><i>Hello World!</i> Here is my <a>Link</a>1</b>2</i>3`)
    expect([...tree]).toMatchSnapshot()
    // for (node of tree) {
    //     if (node instanceof parse.Node) {
    //         console.log(node.tag)
    //     }
    //     else {
    //         console.log(node)
    //     }
    // }
})

test('trim whitespace inside of tags', () => {
    const markdown = parse.toMarkdown(`1<b>   a</b> b <i> c</i> <i>d </i><b> e </b>`)
    expect(markdown).toBe('1 **a** b  *c* *d*  **e** ')
})

test('markdown b->t|i->t|a->t', () => {
    const markdown = parse.toMarkdown(`<b>foo <i>yo <a href="https://google.com">Google</a> </i></b>`)
    expect(markdown).toMatchSnapshot()
})
test('markdown b->t | br | br | i->t', () => {
    const markdown = parse.toMarkdown(`<b>hello</b><br><br> <i>world</i>`)
    expect(markdown).toMatchSnapshot()
})
test('markdown b|a', () => {
    const markdown = parse.toMarkdown(`<b>hello</b> <a href='https://bj.cards'>world</a>`)
    expect(markdown).toMatchSnapshot()
})
test('markdown p | p | p', () => {
    const markdown = parse.toMarkdown(`<p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p>`)
    expect(markdown).toMatchSnapshot()
})
test('markdown (paragraphs disabled) p | p | p', () => {
    const markdown = parse.toMarkdown(`<p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p>`, { disableParagraphs: true })
    expect(markdown).toMatchSnapshot()
})
test('markdown custom', () => {
    const markdown = parse.toMarkdown(`<p>Mediocre coffee spot. <strong>If</strong> you want an awesome coffee spot, <strong>go</strong> a few doors west to Lazarus.</p>`)
    expect(markdown).toMatchSnapshot()
})