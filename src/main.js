'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Firebase = require('firebase');

const AssignButton = require('./assign_button.js');
const Assignment = require('./assignment.js');
const CurrentUserForm = require('./current_user_form.js');
const RoomMemberList = require('./room_member_list.js');
const SelectRoomForm = require('./select_room_form.js');

const firebaseRef = new Firebase('https://scorching-inferno-8300.firebaseio.com/');

const SecretSanta = React.createClass({
    getInitialState: function() {
        return {
            roomName: null,
            members: {}, // a mapping from user's Firebase key to user's name,
            hasAssignments: true, // default to true so we hide the button initially
            assignmentName: null,
            currentUserRef: null
        };
    },

    handleSubmitRoom: function(roomName) {
        const usersRef = firebaseRef.child(roomName).child('users');
        usersRef.on('child_added', (userResponse) => {
            const userKey = userResponse.key();
            const userName = userResponse.val();

            let newMembers = Object.assign({}, this.state.members);
            newMembers[userKey] = userName;
            this.setState({ members: newMembers });
        });

        firebaseRef.child(roomName).child('assignments').on('value', (assignments) => {
            this.setState({ hasAssignments: assignments.val() });

            // If assignments exist, show the current user's assignment.
            if (this.state.currentUserRef) {
                const currentUserKey = this.state.currentUserRef.key();
                const assignmentKey = assignments.val()[currentUserKey];

                this.setState({ assignmentName: this.state.members[assignmentKey] });
            }
        });

        this.setState({ roomName: roomName });
    },

    handleAddUser: function(userName) {
        const userRef = firebaseRef.child(this.state.roomName).child('users').push(userName);
        this.setState({ currentUserRef: userRef });
    },

    handleAssign: function(assignments) {
        firebaseRef.child(this.state.roomName).child('assignments').set(assignments);
    },

    render: function() {
        return (
            <div>
                {
                    this.state.roomName === null ?
                    <SelectRoomForm handleSubmitRoom={ this.handleSubmitRoom } /> :
                    <RoomMemberList members={ this.state.members } />
                }
                {
                    this.state.roomName !== null && this.state.currentUserRef === null &&
                        !this.state.hasAssignments ?
                    <CurrentUserForm handleAddUser={ this.handleAddUser } /> :
                    null
                }
                {
                    Object.keys(this.state.members).length > 1 && !this.state.hasAssignments ?
                    <AssignButton members={ this.state.members }
                                  handleAssign={ this.handleAssign } /> :
                    null
                }
                {
                    this.state.assignmentName !== null ?
                    <Assignment name={ this.state.assignmentName } /> :
                    null
                }
            </div>
        );
    }
});

ReactDOM.render(
    <SecretSanta />,
    document.getElementById('secretSantaTarget')
);
