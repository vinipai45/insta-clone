import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../../App'
import Swal from 'sweetalert2'

const SignIn = () => {
    const { state, dispatch } = useContext(UserContext)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const history = useHistory()

    const PostData = () => {
        fetch("/api/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
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
                else if (data.info) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'info',
                        title: data.info,
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
                else {
                    localStorage.setItem('token', data.token)
                    localStorage.setItem('user', JSON.stringify(data.user))
                    dispatch({ type: "USER", payload: data.user })
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: data.success,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    history.push("/")
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

                {/* Password */}
                <div className="input-field _myInput">
                    <input id="password" type="password" className="validate" autoComplete="off"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="password">Password </label>
                </div>
                <button onClick={() => PostData()} className="btn waves-effect waves-light black">
                    LOGIN <i className="material-icons right">login</i>
                </button>
                <br /><br />
                <Link to='/api/reset'>Forgot password?</Link>
                <br /><br />
                <Link to='/api/signup'>Don't have an account?</Link>

            </div>
        </div>
    )
}

export default SignIn