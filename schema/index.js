const graphql = require('graphql');
const graphqlISODate = require('graphql-iso-date');
const moment = require('moment');
const _ = require('lodash');
const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Thread = require('../models/threadModel');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const {
    GraphQLDate,
    GraphQLTime,
    GraphQLDateTime
} = graphqlISODate;

const {
    Page,
    convertNodeToCursor,
    convertCursorToNodeId
} = require('./pagination')

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        password: {type: GraphQLString},
        hash: {type: GraphQLString},
        avatar: {type: GraphQLString},
        threads: {
            type: new GraphQLList(ThreadType),
            resolve(parent, args){
                //return _.filter(books, {authorId: parent.id});
                return Thread.find({
                    _id: {$in: parent.thread_ids}
                });
            }
        },
        messages: {
            type: new GraphQLList(MessageType),
            resolve(parent, args){
                //return _.filter(books, {authorId: parent.id});
                return Message.find({ authorId: parent.id });
            }
        }
    })
});

const ThreadType = new GraphQLObjectType({
    name: 'Thread',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        type: {type: GraphQLString},
        description: {type: GraphQLString},
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args){
                //return _.filter(books, {authorId: parent.id});
                return User.find({
                    _id: {$in: parent.user_ids}
                });
            }
        },
        messages: {
            type: Page(MessageType),
            args: {
                first: { type: GraphQLInt },
                last: { type: GraphQLInt },
                after: { type: GraphQLString },
                before: { type: GraphQLString }
            },
            async resolve(parent, args){
                
                let { first, last, after, before } = args

                if (typeof after === 'string') {

                    let afterIndex = 0            

                    const data = await Message.find({ threadId: parent.id }).exec();

                    /* Extracting nodeId from afterCursor */
                    let nodeId = convertCursorToNodeId(after)
                    /* Finding the index of nodeId */
                    let nodeIndex = data.findIndex(datum => datum.id === nodeId)
                    if (nodeIndex >= 0) {
                        afterIndex = nodeIndex + 1 // 1 is added to exclude the afterIndex node and include items after it
                    }

                    const slicedData = data.slice(afterIndex, afterIndex + first)
                    const edges = slicedData.map (node => ({
                        node,
                        cursor: convertNodeToCursor(node)
                    }))
    
                    let startCursor, endCursor = null
                    if (edges.length > 0) {
                        startCursor = convertNodeToCursor(edges[0].node)
                        endCursor = convertNodeToCursor(edges[edges.length - 1].node)
                    }
                    let hasNextPage = data.length > afterIndex + first
    
                    return {
                        totalCount: data.length,
                        edges,
                        pageInfo: {
                            startCursor,
                            endCursor,
                            hasNextPage
                        }
                    }
                }

                if (typeof before === 'string') {

                    const data = await Message.find({ threadId: parent.id }).exec();

                    let beforeIndex = data.length - 1

                    /* Extracting nodeId from afterCursor */
                    let nodeId = convertCursorToNodeId(before)
                    /* Finding the index of nodeId */
                    let nodeIndex = data.findIndex(datum => datum.id === nodeId)
                    if (nodeIndex >= 0) {
                        beforeIndex = nodeIndex // 1 is added to exclude the beforeIndex node and include items after it
                    }

                    let actualIndex = beforeIndex - last < 0 ? 0 : beforeIndex - last + 1
                    const slicedData = data.slice(actualIndex, beforeIndex + 1)
                    const edges = slicedData.map (node => ({
                        node,
                        cursor: convertNodeToCursor(node)
                    }))
    
                    let startCursor, endCursor = null
                    if (edges.length > 0) {
                        startCursor = convertNodeToCursor(edges[0].node)
                        endCursor = convertNodeToCursor(edges[edges.length - 1].node)
                    }
                    let hasNextPage = actualIndex > 0
    
                    return {
                        totalCount: data.length,
                        edges,
                        pageInfo: {
                            startCursor,
                            endCursor,
                            hasNextPage
                        }
                    }
                }

            }
        }
    })
});

const MessageType = new GraphQLObjectType({
    name: 'Message',
    fields: () => ({
        id: {type: GraphQLID},
        text: {type: GraphQLString},
        record: {type: GraphQLString},
        attachments: {type: GraphQLString},
        timestamp: {type: GraphQLInt},
        author: {
            type: UserType,
            resolve(parent, args){
                //return _.find(authors, {id:parent.authorId});
                return User.findById(parent.author_id);
            }
        },
        thread: {
            type: ThreadType,
            resolve(parent, args){
                //return _.find(authors, {id:parent.authorId});
                return Thread.findById(parent.thread_id);
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        users:{
            type: new GraphQLList(UserType),
            resolve(parent, args){
                //return authors;
                return User.find({});
            }
        },
        user:{
            type: UserType,
            args: {id:{type:GraphQLID}},
            resolve(parent, args){
                //return _.find(authors, {id:args.id});
                return User.findById(args.id);
            }
        },
        threads:{
            type: new GraphQLList(ThreadType),
            resolve(parent, args){
                //return books;
                return Thread.find({});
            }
        },
        thread:{
            type: ThreadType,
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                // code to get data from database or other sources
                //return _.find(books, {id:args.id});
                return Thread.findById(args.id);
            }
        },
        messages:{
            type: new GraphQLList(MessageType),
            resolve(parent, args){
                //return books;
                return Message.find({});
            }
        },
        message:{
            type: MessageType,
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                // code to get data from database or other sources
                //return _.find(books, {id:args.id});
                return Message.findById(args.id);
            }
        },
    }
});


// const Mutation = new GraphQLObjectType({
//     name: 'Mutation',
//     fields: {
//         addUser: {
//             type: UserType,
//             args: {
//                 name: {type: new GraphQLNonNull(GraphQLString)},
//                 email: {type: new GraphQLNonNull(GraphQLString)}
//             },
//             resolve(parent, args){
//                 let user = new User({
//                     name: args.name,
//                     email: args.email
//                 });
//                 return user.save();
//             }
//         },
//         addNote: {
//             type: MessageType,
//             args: {
//                 title: {type: new GraphQLNonNull(GraphQLString)},
//                 content: {type: new GraphQLNonNull(GraphQLString)},
//                 color: {type: new GraphQLNonNull(GraphQLString)},
//                 author_id: {type: new GraphQLNonNull(GraphQLID)},
//                 thread_id: {type: new GraphQLNonNull(GraphQLID)}
//             },
//             resolve(parent, args){
//                 let message = new Message({
//                     title: args.title,
//                     content: args.content,
//                     color: args.color,
//                     authorId: args.authorId
//                 });
//                 return message.save();
//             }
//         }
//     }
// });

module.exports = new GraphQLSchema({
    query: RootQuery,
    // mutation: Mutation
});
