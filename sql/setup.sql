-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
drop table if exists gh_users;

create table gh_users(
    id bigint generated always as identity primary key,
    username text,
    email text,
    avatar text
);
