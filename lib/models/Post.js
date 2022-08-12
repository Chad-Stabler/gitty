const pool = require('../utils/pool');

class Post {
  id;
  posts;

  constructor(row) {
    this.id = row.id;
    this.post = row.post;
  }

  static async getPosts() {
    const { rows } = await pool.query('select post from posts');

    return rows.map(row => new Post(row));
  }
}

module.exports = Post;
