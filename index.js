const {ApolloServer, gql} = require("apollo-server");
const uuid = require("uuid"); //for generating _id's
const axios = require("axios");
const md5 = require("blueimp-md5");
const publickey = "bHPoDHfnH7R_ItX5W30c5kkaCsB8QKBPEcVea5Czt_0";
const privatekey = "hSNvZkKrMQ6IOX89dA_U7lZW97bU5PlRAol8gI4_Oiw";
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const redis = require("redis");
//const {json} = require("apollo-server-express/node_modules/@types/express");
const client = redis.createClient();

// Create the type definitions for the query and our data
const typeDefs = gql`
    type Query {
        unsplashImages(pageNum: Int): [ImagePost]
        binnedImages: [ImagePost]
        userPostedImages: [ImagePost]
        getTopTenBinnedPosts: [ImagePost]
    }

    type ImagePost {
        id: ID!
        url: String!
        posterName: String!
        description: String
        userPosted: Boolean!
        binned: Boolean!
        numBinned: Int!
    }

    type Mutation {
        uploadImage(
            url: String!
            description: String
            posterName: String
        ): ImagePost
        updateImage(
            id: ID!
            url: String
            posterName: String
            description: String
            userPosted: Boolean
            binned: Boolean
            numBinned: Int
        ): ImagePost
        deleteImage(id: ID!): ImagePost
    }
`;
async function getData(pageNum) {
    const url =
        `https://api.unsplash.com/photos/` +
        "?" +
        "&client_id=" +
        publickey +
        "&hash=" +
        hash +
        "&page=" +
        pageNum;
    const {data} = await axios.get(url);
    return data;
}
async function connect() {
    await client.connect();
}
connect();
const resolvers = {
    Query: {
        unsplashImages: async (_, args) => {
            const data = await getData(args.pageNum);
            let unsplashMap = [];
            const jsonPost = await client.hKeys("BinnedImages");
            for (var i = 0; i < data.length; i++) {
                let binFlag = false;
                if (jsonPost.includes(data[i]["id"])) {
                    binFlag = true;
                }
                unsplashMap.push({
                    id: data[i]["id"],
                    url: data[i]["urls"]["raw"],
                    posterName: data[i]["user"]["name"],
                    description: data[i]["description"],
                    userPosted: false,
                    binned: binFlag,
                    numBinned: data[i]["likes"],
                });
            }
            return unsplashMap;
        },
        binnedImages: async () => {
            const jsonPost = await client.hVals("BinnedImages");
            for (var i = 0; i < jsonPost.length; i++) {
                jsonPost[i] = JSON.parse(jsonPost[i]);
            }
            return jsonPost;
        },
        userPostedImages: async () => {
            const jsonPost = await client.hVals("UserPosted");
            const jsonId = await client.hKeys("BinnedImages");
            for (var i = 0; i < jsonPost.length; i++) {
                let binFlag = false;
                jsonPost[i] = JSON.parse(jsonPost[i]);
                if (jsonId.includes(jsonPost[i]["id"])) binFlag = true;
                jsonPost[i]["binned"] = binFlag;
            }
            return jsonPost;
        },
        getTopTenBinnedPosts: async () => {
            let popularPosts = await client.zRange("popularImages", -10, -1);
            let result = [];
            for (var i = popularPosts.length - 1; i >= 0; i--) {
                const jsonPost = await client.hGet(
                    "Posts",
                    JSON.parse(popularPosts[i])
                );

                result.push(JSON.parse(jsonPost));
            }
            return result;
        },
    },
    Mutation: {
        uploadImage: async (_, args) => {
            let idInsert = uuid.v4();
            const newPost = {
                id: idInsert,
                url: args.url,
                description: args.description,
                posterName: args.posterName,
                binned: false,
                userPosted: true,
                numBinned: 0,
            };
            let settingInCache = await client.hSet(
                "Posts",
                idInsert,
                JSON.stringify(newPost)
            ); // save in redis
            let settingInCacheImages = await client.hSet(
                "UserPosted",
                idInsert,
                JSON.stringify(newPost)
            );
            return newPost;
        },
        updateImage: async (_, args) => {
            let id = args.id;
            let postFound;
            if (args.binned) {
                postFound = {
                    id: id,
                    url: args.url,
                    description: args.description,
                    posterName: args.posterName,
                    binned: args.binned,
                    userPosted: args.userPosted,
                    numBinned: args.numBinned,
                };
                let settingInCache = await client.hSet(
                    "Posts",
                    id,
                    JSON.stringify(postFound)
                );
                let settingInCacheImages = await client.hSet(
                    "BinnedImages",
                    id,
                    JSON.stringify(postFound)
                );
                let popularAddZset = await client.zAdd("popularImages", [
                    {score: args.numBinned, value: JSON.stringify(id)},
                ]);
            } else {
                const jsonPost = await client.hGet("Posts", id);
                postFound = JSON.parse(jsonPost);
                postFound.binned = false;
                if (!postFound.userPosted) {
                    let deleteFromCache = await client.hDel("Posts", id);
                }
                let deleteImageFromCache = await client.hDel(
                    "BinnedImages",
                    id
                );
                let deleteImageFromzset = await client.zRem(
                    "popularImages",
                    JSON.stringify(id)
                );
            }
            return postFound;
        },
        deleteImage: async (_, args) => {
            let id = args.id; //get from react and find in cache
            const jsonPost = await client.hGet("Posts", id);
            let postFound = JSON.parse(jsonPost);
            if (postFound.userPosted) {
                let deleteFromCache = await client.hDel("Posts", id);
                let deleteImageFromCache = await client.hDel("UserPosted", id);
            }
            return postFound;
        },
    },
};

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
    console.log(`🚀  Server ready at ${url} 🚀`);
});
