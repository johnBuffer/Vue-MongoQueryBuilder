# Vue-MongoQueryBuilder

A visual MongoDB query builder using Vuejs as framework with bootstrap for CSS.

This app builds a json object (with MongoDB query syntax) recursively using expression blocks.

## Installation

*  npm install
*  npm run dev
*  access 127.0.0.1:8080

## Instruction

This apps allows you to create blocks. A block can be an EXPRESSION or a GROUP.
*  A CONDITION compares a field to a value. It can be <, >, =, exists or matches
*  An EXPRESSION is a CONDITION on a field of the database's object
*  A GROUP is a set of EXPRESSIONS separated by an OPERATOR ('OR' or 'AND')

You may create nested blocks and reorganize them using drag and drop.

## Example

![Example](https://github.com/johnBuffer/Vue-MongoRequestBuilder/blob/master/img/example.png)
