const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]
    const listWithManyBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f3',
      title: 'Second_title',
      author: 'Edgar Alan Po',
      url: '2https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 4,
      __v: 0
    }
  ]

  test('if empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    assert.strictEqual(result, 9)
  })
})

describe('blog with the most likes', () => {
       const listWithBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f3',
      title: 'The Black Cat',
      author: 'Edgar Allan Poe',
      url: '2https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 4,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f3',
      title: 'Pet Sematary',
      author: 'Stephen King',
      url: 'https://en.wikipedia.org/wiki/Pet_Sematary',
      likes: 7,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f3',
      title: 'Call of Cthulhu',
      author: 'HP Lovecraft',
      url: 'https://en.wikipedia.org/wiki/Pet_Sematary',
      likes: 9,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f3',
      title: 'The Fair of Darkness',
      author: 'Ray Bradbury',
      url: 'https://en.wikipedia.org/wiki/Pet_Sematary',
      likes: 7,
      __v: 0
    }
  ]

    test('which blog has the most likes', () => {
    const result = listHelper.favoriteBlog(listWithBlogs)
    console.log('dummy.test Actual Result:', result)
    assert.deepStrictEqual(result, listWithBlogs[3])
  })

})
