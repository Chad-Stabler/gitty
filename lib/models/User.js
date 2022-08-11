const pool = require('../utils/pool');

module.exports = class User {
  id;
  username;
  email;
  avatar;

  constructor(row) {
    this.id = row.id;
    this.username = row.username;
    this.email = row.email;
    this.avatar = row.avatar;
  }

  static async insert({ username, email, avatar }) {
    if(!username) throw new Error('Username is required');

    const { rows } = await pool.query('insert into gh_users (username, email, avatar) values ($1, $2, $3) returning *;', [username, email, avatar]);

    return new User(rows[0]);
  }

  static async findByUsername(username) {
    const { rows } = await pool.query(`
    select * from gh_users where username=$1`, [username]);

    if (!rows[0]) return null;

    return new User(rows[0]);

  }

  toJSON() {
    return { ...this };
  }

  
};
