import React from "react";
import "./App.css";
import {useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import queries from "../queries";

function UserBin() {
    const [addToBin] = useMutation(queries.UPDATE_IMAGE);
    const {loading, error, data, refetch} = useQuery(
        queries.GET_BINNED_IMAGES,
        {
            fetchPolicy: "cache-and-network",
        }
    );
    if (data) {
        return (
            <div>
                {data.binnedImages.map((post) => {
                    if (post) {
                        if (!post.binned) {
                            return (
                                <div className='card' key={post.id}>
                                    <div className='card-body'>
                                        <h1 className='card-title'>
                                            {post.description}
                                        </h1>
                                        <h2 className='card-title'>
                                            Image By: {post.posterName}
                                        </h2>
                                        <img
                                            alt={post.description}
                                            src={post.url}
                                            width='500'
                                            height='600'
                                        />
                                        <br />
                                        <br />
                                        <button
                                            className='button'
                                            onClick={() => {
                                                addToBin({
                                                    variables: {
                                                        id: post.id,
                                                        url: post.url,
                                                        posterName:
                                                            post.posterName,
                                                        description:
                                                            post.description,
                                                        userPosted:
                                                            post.userPosted,
                                                        binned: true,
                                                        numBinned:
                                                            post.numBinned,
                                                    },
                                                });
                                                refetch();
                                            }}
                                        >
                                            Add to Bin
                                        </button>
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <div className='card' key={post.id}>
                                    <div className='card-body'>
                                        <h1 className='card-title'>
                                            {post.description}
                                        </h1>
                                        <h2 className='card-title'>
                                            Image By: {post.posterName}
                                        </h2>
                                        <img
                                            alt={post.description}
                                            src={post.url}
                                            width='300'
                                            height='400'
                                        />
                                        <br />
                                        <br />
                                        <button
                                            className='button'
                                            onClick={() => {
                                                addToBin({
                                                    variables: {
                                                        id: post.id,
                                                        url: post.url,
                                                        posterName:
                                                            post.posterName,
                                                        description:
                                                            post.description,
                                                        userPosted:
                                                            post.userPosted,
                                                        binned: false,
                                                        numBinned:
                                                            post.numBinned,
                                                    },
                                                });
                                                refetch();
                                            }}
                                        >
                                            Remove from Bin
                                        </button>
                                    </div>
                                </div>
                            );
                        }
                    } else {
                        <p></p>;
                    }
                })}
            </div>
        );
    } else if (loading) {
        return <div>Loading</div>;
    } else if (error) {
        return <div>{error.message}</div>;
    }
}

export default UserBin;
