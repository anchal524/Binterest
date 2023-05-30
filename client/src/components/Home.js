import React from "react";
import "./App.css";
import {useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import queries from "../queries";

function Images() {
    const [pageNum, setPageNum] = useState(1);
    const [addToBin] = useMutation(queries.UPDATE_IMAGE);
    const {loading, error, data, refetch} = useQuery(
        queries.GET_UNSPLASH_IMAGES,
        {variables: {pageNum}, fetchPolicy: "cache-and-network"}
    );

    function gettingNextPageData() {
        setPageNum(pageNum + 1);
        refetch();
    }
    function gettingLastPageData() {
        setPageNum(pageNum - 1);
        refetch();
    }
    if (data) {
        return (
            <div>
                {data.unsplashImages.map((post) => {
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
                                                    posterName: post.posterName,
                                                    description:
                                                        post.description,
                                                    userPosted: post.userPosted,
                                                    binned: true,
                                                    pageNum: post.pageNum,
                                                    numBinned: post.numBinned,
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
                                                    posterName: post.posterName,
                                                    description:
                                                        post.description,
                                                    userPosted: post.userPosted,
                                                    binned: false,
                                                    pageNum: post.pageNum,
                                                    numBinned: post.numBinned,
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
                })}
                <div>
                    {pageNum && pageNum === 1 ? (
                        <p></p>
                    ) : (
                        <button
                            className='button'
                            onClick={gettingLastPageData}
                        >
                            View Previous
                        </button>
                    )}
                    <br></br> <br></br>
                </div>
                <div>
                    <button className='button' onClick={gettingNextPageData}>
                        View More
                    </button>
                    <br></br> <br></br>
                </div>
            </div>
        );
    } else if (loading) {
        return <div>Loading</div>;
    } else if (error) {
        return <div>{error.message}</div>;
    }
}

export default Images;
