import React from "react";
import "./App.css";
import {Button, TextField} from "@material-ui/core";
import validator from "validator";
import {makeStyles} from "@material-ui/core/styles";
import {useMutation} from "@apollo/client";
import queries from "../queries";

const NewPost = (props) => {
    const [addPost] = useMutation(queries.UPLOAD_IMAGE);

    const useStyles = makeStyles((theme) => ({
        style: {
            "& .MuiTextField-root": {
                margin: theme.spacing(5),
                width: "40ch",
            },
            textField: {
                marginLeft: theme.spacing.unit,
                marginRight: theme.spacing.unit,
                width: 200,
            },
        },
    }));

    const styles = useStyles();

    return (
        <div>
            <form
                className={styles.style}
                noValidate
                autoComplete='off'
                method='POST'
                onSubmit={(e) => {
                    e.preventDefault();

                    if (!e.target.elements.imageurl.value) {
                        alert("Provide Image URL for your post");
                    } else if (
                        !validator.isURL(e.target.elements.imageurl.value)
                    ) {
                        alert("URL is not of URL type");
                    } else {
                        addPost({
                            variables: {
                                description:
                                    e.target.elements.description.value,
                                url: e.target.elements.imageurl.value,
                                posterName: e.target.elements.poster.value,
                            },
                        });

                        e.target.elements.imageurl.value = "";
                        e.target.elements.description.value = "";
                        e.target.elements.poster.value = "";
                        alert("New Post has been added");
                    }
                }}
            >
                <TextField
                    required
                    id='imageurl'
                    name='imageurl'
                    label='Image URL'
                    className={styles.textField}
                    margin='normal'
                    variant='outlined'
                />
                <br></br>

                <TextField
                    id='poster'
                    name='poster'
                    label='Poster Name'
                    className={styles.textField}
                    margin='normal'
                    variant='outlined'
                />
                <br></br>
                <TextField
                    id='description'
                    name='description'
                    label='Description'
                    className={styles.textField}
                    margin='normal'
                    variant='outlined'
                />
                <br></br>

                <Button type='submit' variant='outlined' color='inherit'>
                    Add Post
                </Button>
            </form>
            <br></br>
            <div>
                <a href='/my-posts'>
                    <button className='button' type='submit'>
                        Back to my-posts
                    </button>
                </a>
            </div>
        </div>
    );
};

export default NewPost;
