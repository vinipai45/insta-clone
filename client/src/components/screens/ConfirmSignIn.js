import React from 'react';
import { Link, useHistory, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

const ConfirmSignIn = () => {
    const history = useHistory()
    const { token } = useParams()

    const PostData = () => {
        fetch(`/api/confirm`, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token,
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
                <button onClick={() => PostData()} className="btn waves-effect waves-light black">
                    verify <i className="material-icons right">verified</i>
                </button>

            </div>
        </div>
    )
}

export default ConfirmSignIn