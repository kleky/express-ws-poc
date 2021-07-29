var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
 type Query {
    quoteOfTheDay: String
    random: Float!
    rollXDices(numberOfRolls: Int!): [Int]
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
    quoteOfTheDay: () => {
        return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
    },
    random: () => {
        return Math.random();
    },
    rollXDices: ({ numberOfRolls }) => {
        const roll = () => 1 + Math.floor(Math.random() * 6);
        const rolls = [];
        for (i = 0; i < numberOfRolls; i++) {
            rolls.push(roll());
        }
        return rolls;
    },
};

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.use('/users', usersRouter);

module.exports = app;
