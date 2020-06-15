import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'

const CreatePost = () => {
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    useEffect(() => {
        if (url) {

            fetch("/api/createpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                },
                body: JSON.stringify({
                    title,
                    body,
                    pic: url
                })
            }).then(res => res.json())
                .then(data => {
                    if (data.error) {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'error',
                            title: data.error,
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                    else {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: "Post Successful",
                            showConfirmButton: false,
                            timer: 1500
                        })
                        history.push('/')
                    }
                }).catch(err => {
                    console.log(err)
                })
        }

    }, [url])

    const PostData = () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "instagram-clone")
        data.append("cloud_name", "vinipai45")
        fetch("https://api.cloudinary.com/v1_1/vinipai45/image/upload", {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                setUrl(data.url)
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <>
            {localStorage.getItem('token') ?
                <div className="card _createPostCard">
                    <h3>Create Post</h3>
                    {/* Title*/}
                    <div className="input-field _myInput">
                        <input id="title" type="text" className="validate" autoComplete="off"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <label htmlFor="title">Title</label>
                    </div>

                    {/* Body */}
                    <div className="input-field _myInput">
                        <input id="body" type="text" className="validate" autoComplete="off"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                        <label htmlFor="body">Body </label>
                    </div>

                    <div className="file-field input-field">
                        <div className="btn waves-effect waves-light black">
                            <span>Choose File</span><i className="material-icons right">perm_media</i>
                            <input type="file"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" />
                        </div>
                    </div>
                    <button onClick={() => PostData()} className="btn waves-effect waves-light black">
                        Upload<i className="material-icons right">backup</i>
                    </button>
                </div>
                : <h5>Session Ended - Login to continue</h5>}
        </>
    )
}

export default CreatePost