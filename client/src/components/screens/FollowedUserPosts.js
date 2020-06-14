import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

const FollowedUserPost = () => {
    const [data, setData] = useState([])
    const { state, dispatch } = useContext(UserContext)

    useEffect(() => {
        fetch('/api/myfollowposts', {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        }).then(res => res.json())
            .then(result => {
                setData(result.posts)
            }).catch(err => {
                console.error("Error", err);
            })
    }, [])

    const confirmDelete = (data, postId, commentId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to delete this ${data}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#000',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                deleteComment(postId, commentId)
                Swal.fire(
                    'Deleted!',
                    `Your ${data} has been deleted`,
                    'success'
                )
            }
        }).catch(err => console.error("Error", err))
    }

    const likePost = (id) => {
        fetch('/api/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('token')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                let newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const unlikePost = (id) => {
        fetch('/api/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('token')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const makeComment = (text, postId) => {
        fetch('/api/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('token')
            },
            body: JSON.stringify({
                text,
                postId
            })
        }).then(res => res.json())
            .then(result => {
                let newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const deleteComment = (postId, commentId) => {
        fetch(`/api/deletecomment/${postId}/${commentId}`, {
            method: "delete",
            headers: {
                Authorization: localStorage.getItem('token')
            },
        }).then(res => res.json())
            .then(result => {
                let newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    return (
        <div className="_home">
            <>
                {localStorage.getItem('token') ?
                    data.map(item => {
                        return (
                            <div className="card _homeCard" key={item._id}>
                                <div className="card-image _postCard">
                                    <h6 style={{ display: "float" }} className="_nameOnCard">
                                        <Link to={item.postedBy._id !== state._id ? `/api/userprofile/${item.postedBy._id}` : `/api/profile`}><img className="_postAvatar" src={item.postedBy.pic} alt="profile here" /></Link>
                                        <Link to={item.postedBy._id !== state._id ? `/api/userprofile/${item.postedBy._id}` : `/api/profile`}>{item.postedBy.name}</Link>
                                    </h6>
                                    <img alt="post here" style={{ padding: "10px" }} src={item.pic} />
                                    <div className="card-content">
                                        {item.likes.includes(state._id)
                                            ? <i onClick={() => { unlikePost(item._id) }} style={{ color: "red" }} className="material-icons _likeToggle">favorite</i>
                                            : <i onClick={() => { likePost(item._id) }} style={{ color: "red" }} className="material-icons _likeToggle">favorite_border</i>
                                        }
                                        <h6>{item.likes.length} likes</h6>
                                        <br></br>
                                        <h6>{item.title}</h6>
                                        <p>{item.body}</p>{
                                            item.comments.map(comment => {
                                                return (
                                                    <h6 key={comment._id}>
                                                        <span style={{ fontWeight: "500" }}>{comment.commentedBy.name} </span> {comment.text}
                                                        {
                                                            comment.commentedBy._id === state._id
                                                            &&
                                                            <i
                                                                style={{ cursor: "pointer", marginRight: "15px" }}
                                                                onClick={() => confirmDelete("Comment", item._id, comment._id)}
                                                                className="material-icons right">delete</i>
                                                        }
                                                    </h6>
                                                )
                                            })}

                                        {/* Comment section */}
                                        <div className="input-field _myInput">
                                            <form onSubmit={(e) => {
                                                e.preventDefault()
                                                makeComment(e.target[0].value, item._id)
                                                e.target[0].value = ""
                                            }}>
                                                <input placeholder="add comment" type="text" className="validate" autoComplete="off" />
                                            </form>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        )
                    })
                    : <h5>Please Login</h5>
                }
            </>
        </div>


    )
}

export default FollowedUserPost