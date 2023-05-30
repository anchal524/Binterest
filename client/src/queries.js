import {gql} from "@apollo/client";

const GET_UNSPLASH_IMAGES = gql`
    query unsplashImages($pageNum: Int!) {
        unsplashImages(pageNum: $pageNum) {
            id
            url
            description
            posterName
            binned
            userPosted
            numBinned
        }
    }
`;

const GET_BINNED_IMAGES = gql`
    query {
        binnedImages {
            id
            url
            description
            posterName
            binned
            userPosted
            numBinned
        }
    }
`;

const GET_USERPOSTED_IMAGES = gql`
    query {
        userPostedImages {
            id
            url
            description
            posterName
            binned
            userPosted
            numBinned
        }
    }
`;

const GET_TOP_BINNED_IMAGES = gql`
    query {
        getTopTenBinnedPosts {
            id
            url
            description
            posterName
            binned
            userPosted
            numBinned
        }
    }
`;

const UPLOAD_IMAGE = gql`
    mutation uploadImage(
        $url: String!
        $description: String
        $posterName: String
    ) {
        uploadImage(
            url: $url
            description: $description
            posterName: $posterName
        ) {
            id
            url
            posterName
            description
            binned
            userPosted
            numBinned
        }
    }
`;

const UPDATE_IMAGE = gql`
    mutation update(
        $id: ID!
        $url: String
        $posterName: String
        $description: String
        $userPosted: Boolean
        $binned: Boolean
        $numBinned: Int
    ) {
        updateImage(
            id: $id
            url: $url
            posterName: $posterName
            description: $description
            userPosted: $userPosted
            binned: $binned
            numBinned: $numBinned
        ) {
            id
            url
            description
            posterName
            binned
            userPosted
            numBinned
        }
    }
`;

const DELETE_IMAGE = gql`
    mutation delete($id: ID!) {
        deleteImage(id: $id) {
            id
            url
            description
            posterName
            binned
            userPosted
            numBinned
        }
    }
`;

let exported = {
    GET_BINNED_IMAGES,
    GET_UNSPLASH_IMAGES,
    GET_USERPOSTED_IMAGES,
    UPLOAD_IMAGE,
    UPDATE_IMAGE,
    DELETE_IMAGE,
    GET_TOP_BINNED_IMAGES,
};

export default exported;
