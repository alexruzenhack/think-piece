import React, { Component } from 'react';
import { firestore, auth, storage } from '../firebase';

class UserProfile extends Component {
    state = { displayName: '' };
    imageInput = null;

    get uid() {
        return auth.currentUser.uid;
    }

    get userRef() {
        return firestore.doc(`users/${this.uid}`);
    }

    get file() {
        return this.imageInput && this.imageInput.files[0];
    }

    handleSubmit = event => {
        event.preventDefault();
        const { displayName } = this.state;

        if (displayName) {
            this.userRef.update({ displayName });
        }

        if (this.file) {
          storage
            .ref()
            .child('user-profiles')
            .child(this.uid)
            .child(this.file.name)
            .put(this.file)
            .then(response => response.ref.getDownloadURL())
            .then(photoURL => this.userRef.update({ photoURL }));
        }
    }

    render () {
        return (
            <section className="UserProfile">
                <form onSubmit={this.handleSubmit}>
                    <input type="file" id="" ref={ref => this.imageInput = ref} />
                    <input type="submit" className="update"/>
                </form>
            </section>

        );
    }
}

export default UserProfile;