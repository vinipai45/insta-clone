import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'

const SignIn = () => {
    const [email, setEmail] = useState("")
    const history = useHistory()

    const PostData = () => {
        fetch("/api/reset-password", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
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
                        title: data.message,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    history.push("/api/signin")
                }
            }).catch(err => console.error("Error", err))
            .catch(err => console.error("Error", err))
    }

    return (
        <div className="mycard">
            <div className="card _authCard">
                <h2 className="_logo">Instagram</h2>

                {/* Email */}
                <div className="input-field _myInput">
                    <input id="email" type="email" className="validate" autoComplete="off"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="email">Email</label>
                </div>

                <button onClick={() => PostData()} className="btn waves-effect waves-light black">
                    verify <i className="material-icons right">verified</i>
                </button>

            </div>
        </div>
    )
}

export default SignIn