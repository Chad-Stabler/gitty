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

  static async insert({ post }) {
    const { rows } = await pool.query(`
    insert into posts (post) values ($1) returning *;`, [post]);

    return new Post(rows[0]);
  }
}

module.exports = Post;
