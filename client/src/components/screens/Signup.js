import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'

const Signup = () => {

    const history = useHistory()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)

    useEffect(() => {
        if (url) {
            uploadFields()
        }
    }, [url])

    const uploadPic = () => {
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

    const uploadFields = () => {
        fetch("/api/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password,
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
                        icon: 'info',
                        title: data.info,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    history.push("/api/signin")
                }
            }).catch(err => console.error("Error", err))
            .catch(err => console.error("Error", err))
    }

    const PostData = () => {

        if (image) {
            uploadPic()
        } else {
            uploadFields()
        }


    }

    return (
        <div className="mycard">
            <div className="card _authCard">

                <h2 className="_logo">Instagram</h2>

                {/* Username */}
                <div className="input-field _myInput">
                    <input id="name" type="text" className="validate" autoComplete="off"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <label htmlFor="name">Username  </label>
                </div>

                {/* Email */}
                <div className="input-field _myInput">
                    <input id="email" type="email" className="validate" autoComplete="off"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="email">Email</label>
                </div>

                {/* Password */}
                <div className="input-field _myInput">
                    <input id="password" type="password" className="validate" autoComplete="off"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="password">Password </label>
                </div>

                {/* Upload Profile */}
                <div className="file-field input-field">
                    <div className="btn waves-effect waves-light black">
                        <span>Upload Avatar</span><i className="material-icons right">person</i>
                        <input type="file"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>

                {/* Submit */}
                <button onClick={() => PostData()} className="btn waves-effect waves-light black">
                    SignUp <i className="material-icons right">how_to_reg</i>
                </button>
                <br /><br />
                <Link to='/api/signin'>Already have an account?</Link>
            </div>
        </div>
    )
}

export default Signup