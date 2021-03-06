import { injectHTML } from '../../../helpers/index'

describe('Riot each keyed', () => {
  it('identity update', () => {
    injectHTML('<riot-tmp></riot-tmp>')

    riot.tag('riot-tmp-sub', '<div>{identifier}</div>', function(opts) {
      this.identifier = opts.identifier
    })

    riot.tag('riot-tmp', '<riot-tmp-sub key="id" each="{item in items}" ref="children" identifier="{ item.id }" />', function() {
      this.items = [
        { id: 0 },
        { id: 1 },
        { id: 2 }
      ]
    })

    const [tag] = riot.mount('riot-tmp')
    const [firstTag, secondTag, thirdTag] = tag.refs.children

    tag.items[0] = { id: 0, isNew: true }
    tag.items[1] = { id: 1, isNew: true }
    tag.items[2] = { id: 2, isNew: true }

    tag.update()

    expect(firstTag._riot_id).to.be.equal(tag.refs.children[0]._riot_id)
    expect(secondTag._riot_id).to.be.equal(tag.refs.children[1]._riot_id)
    expect(thirdTag._riot_id).to.be.equal(tag.refs.children[2]._riot_id)

    tag.unmount()
  })

  it('reorder', () => {
    injectHTML('<riot-tmp></riot-tmp>')

    riot.tag('riot-tmp-sub', '<div>{identifier}</div>', function(opts) {
      this.id = opts.identifier
    })

    riot.tag('riot-tmp', '<riot-tmp-sub key="id" each="{item in items}" ref="children" identifier="{ item.id }" />', function() {
      this.items = [
        { id: 0 },
        { id: 1 },
        { id: 2 }
      ]
    })

    const [tag] = riot.mount('riot-tmp')
    const [firstTag, secondTag, thirdTag] = tag.refs.children

    tag.items[0] = { id: 2 }
    tag.items[1] = { id: 1 }
    tag.items[2] = { id: 0 }

    tag.update()

    expect(firstTag._riot_id).to.be.equal(tag.refs.children[2]._riot_id)
    expect(secondTag._riot_id).to.be.equal(tag.refs.children[1]._riot_id)
    expect(thirdTag._riot_id).to.be.equal(tag.refs.children[0]._riot_id)

    tag.unmount()
  })

  it('identity (with expressions)', () => {
    injectHTML('<riot-tmp></riot-tmp>')

    riot.tag('riot-tmp-sub', '<div>{identifier}</div>', function(opts) {
      this.identifier = opts.identifier
    })

    riot.tag('riot-tmp', '<riot-tmp-sub key="{ item.id }" each="{item in items}" ref="children" identifier="{ item.id }" />', function() {
      this.items = [
        { id: 0 },
        { id: 1 },
        { id: 2 }
      ]
    })

    const [tag] = riot.mount('riot-tmp')
    const [firstTag, secondTag, thirdTag] = tag.refs.children

    tag.items[0] = { id: 0, isNew: true }
    tag.items[1] = { id: 1, isNew: true }
    tag.items[2] = { id: 2, isNew: true }

    tag.update()

    expect(firstTag._riot_id).to.be.equal(tag.refs.children[0]._riot_id)
    expect(secondTag._riot_id).to.be.equal(tag.refs.children[1]._riot_id)
    expect(thirdTag._riot_id).to.be.equal(tag.refs.children[2]._riot_id)

    tag.unmount()
  })

  it('reorder ( with expressions )', () => {
    injectHTML('<riot-tmp></riot-tmp>')

    riot.tag('riot-tmp-sub', '<div>{identifier}</div>', function(opts) {
      this.id = opts.identifier
    })

    riot.tag('riot-tmp', '<riot-tmp-sub key="{ item.id }" each="{item in items}" ref="children" identifier="{ item.id }" />', function() {
      this.items = [
        { id: 0 },
        { id: 1 },
        { id: 2 }
      ]
    })

    const [tag] = riot.mount('riot-tmp')
    const [firstTag, secondTag, thirdTag] = tag.refs.children

    tag.items[0] = { id: 2 }
    tag.items[1] = { id: 1 }
    tag.items[2] = { id: 0 }

    tag.update()

    expect(firstTag._riot_id).to.be.equal(tag.refs.children[2]._riot_id)
    expect(secondTag._riot_id).to.be.equal(tag.refs.children[1]._riot_id)
    expect(thirdTag._riot_id).to.be.equal(tag.refs.children[0]._riot_id)

    tag.unmount()
  })

  it('conditional and loop with strings (issue 2574)', () => {
    injectHTML('<riot-tmp></riot-tmp>')

    riot.tag('riot-tmp', '<p ref="letter" each="{ letter in \'string\' }" if="{ /s|t/.test(letter) }">{letter}</p>')

    const [tag] = riot.mount('riot-tmp')

    expect(tag.refs.letter).to.have.length(2)

    tag.unmount()
  })

  it('object loop should unmount child nodes properly (issue 2580)', () => {
    injectHTML('<riot-tmp></riot-tmp>')

    riot.tag('riot-tmp-sub', '<div>{opts.identifier}</div>', function(opts) {
      this.id = opts.identifier
    })

    riot.tag('riot-tmp', '<riot-tmp-sub key="{ item.id }" each="{item in items}" ref="children" identifier="{ item.id }" />', function() {
      this.items = {
        1: { id: 1 },
        2: { id: 2 },
        3: { id: 3 },
      }
    })

    const [tag] = riot.mount('riot-tmp')
    const [firstTag, secondTag, thirdTag] = tag.refs.children // eslint-disable-line

    delete tag.items[2]

    tag.update()

    expect(firstTag._riot_id).to.be.equal(tag.refs.children[0]._riot_id)
    expect(thirdTag._riot_id).to.be.equal(tag.refs.children[1]._riot_id)

    tag.unmount()
  })
})