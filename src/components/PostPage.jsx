import React, { Component } from 'react';

import Post from './Post';
import Comments from './Comments';
import { firestore } from '../firebase';
import { withRouter } from 'react-router-dom';
import withUser from './withUser';

class PostPage extends Component {
    state = { post: null, comments: [] };

    get postId() {
        return this.props.match.params.id;
    }

    get postRef() {
        return firestore.doc(`posts/${this.postId}`);
    }

    get commentsRef() {
        return this.postRef.collection('comments');
    }

    createComment = (comment) => {
        const { user } = this.props;
        this.commentsRef.add({
            ...comment,
            user,
        });
    }

    unsubscribeFromPost = null;
    unsubscribeFromComments = null;

    componentDidMount() {
        this.unsubscribeFromPost = this.postRef.onSnapshot(snapshot => {
            const post = { id: snapshot.id, ...snapshot.data()};
            this.setState({ post });
        });

        this.unsubscribeFromComments = this.commentsRef.onSnapshot(snapshot => {
            const comments = snapshot.docs.map(doc => { return {id: doc.id, ...doc.data() }; });
            this.setState({ comments });
        });
    }

    componentWillUnmount() {
        this.unsubscribeFromPost();
        this.unsubscribeFromComments();
    }
    
    render() {
        const { post, comments } = this.state;
        return (
            <section>
                { post && <Post {...post} /> }
                <Comments 
                    comments={comments}
                    onCreate={this.createComment}
                />
            </section>
        );
    }
}
 
export default withRouter(withUser(PostPage));