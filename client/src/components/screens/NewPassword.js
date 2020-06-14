import React, { useState, useContext, } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

const NewPassword = () => {
    const history = useHistory()
    const [password, setPassword] = useState("")
    const { token } = useParams()

    const PostData = () => {
        fetch("/api/new-password", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password,
                token
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
                        title: data.message,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    history.push('/api/signin')
                }
            }).catch(err => {
                console.log(err)
            })
    }
    return (
        <div className="mycard">
            <div className="card _authCard">
                <h2 className="_logo">Instagram</h2>

                {/* Password */}
                <div className="input-field _myInput">
                    <input id="password" type="text" className="validate" autoComplete="off"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="password">Password </label>
                </div>

                <button onClick={() => PostData()} className="btn waves-effect waves-light black">
                    Update Password <i className="material-icons right">update</i>
                </button>

            </div>
        </div>
    )
}


export default NewPassword 