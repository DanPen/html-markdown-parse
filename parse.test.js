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