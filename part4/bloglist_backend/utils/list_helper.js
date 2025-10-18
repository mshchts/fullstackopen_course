const { getMaxListeners } = require("../app");

const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  if (blogs.length === 0){
    return 0
  } else if (blogs.length === 1) {
    return blogs[0].likes
  } else {
    return blogs.reduce(function(result, blog){
      return result + blog.likes
    }, 0)
  }
} 

const favoriteBlog = (blogs) => {
  if (blogs.length === 0){
    return null
  }
  // const mostLikedBlog = Math.max(...blogs.map(blog => blog.likes));
  console.log('Initial max value:', blogs[0])
  
  return blogs.reduce((max, blog) => (
    blog.likes > max.likes ? blog : max
  ), blogs[0])
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}