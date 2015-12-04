const React = require('react');
const ReactDOM = require('react-dom');
const Firebase = require('firebase');

const AssignButton = require('./assign_button.js');
const Assignment = require('./assignment.js');
const CurrentUserForm = require('./current_user_form.js');
const ReminderButtons = require('./reminder_buttons.js');
const RoomMemberList = require('./room_member_list.js');
const SelectRoomForm = require('./select_room_form.js');

const firebaseRef = new Firebase('https://scorching-inferno-8300.firebaseio.com/');

const SecretSanta = React.createClass({
    getInitialState: function() {
        return {
            roomName: null,
            members: {}, // a mapping from user's Firebase key to user's name
            hasAssignments: false,
            isLoading: false,
            assignmentName: null,
            currentUserRef: null
        };
    },

    handleSubmitRoom: function(roomName) {
        this.setState({
            roomName: roomName,
            isLoading: true
        });

        const usersRef = firebaseRef.child(roomName).child('users');
        usersRef.on('value', (usersResponse) => {
            this.setState({ members: usersResponse.val() || {} });
        });

        firebaseRef.child(roomName).child('assignments').on('value', (assignments) => {
            let newState = {
                hasAssignments: assignments.val(),
                isLoading: false
            };

            // If assignments exist, show the current user's assignment.
            if (this.state.currentUserRef) {
                const currentUserKey = this.state.currentUserRef.key();
                const assignmentKey = assignments.val()[currentUserKey];

                newState.assignmentName = this.state.members[assignmentKey];
            }

            this.setState(newState);
        });
    },

    handleAddUser: function(userName) {
        const userRef = firebaseRef.child(this.state.roomName).child('users').push(userName);
        userRef.onDisconnect().remove(); // auto-remove me if I close the browser
        this.setState({ currentUserRef: userRef });
    },

    handleAssign: function(assignments) {
        firebaseRef.child(this.state.roomName).child('assignments').set(assignments);
    },

    render: function() {
        const reminderEl = this.state.assignmentName !== null ? (
            <ReminderButtons name={ this.state.assignmentName } />
        ) : null;

        let displayedEls = [];

        if (this.state.roomName === null) {
            displayedEls.push(<SelectRoomForm handleSubmitRoom={ this.handleSubmitRoom } />);
        }

        if (this.state.isLoading) {
            displayedEls.push(<div className="loader">Loading...</div>);
        } else if (this.state.roomName) {
            displayedEls.push(<RoomMemberList members={ this.state.members } />);

            if (!this.state.hasAssignments && !this.state.currentUserRef) {
                displayedEls.push(<CurrentUserForm handleAddUser={ this.handleAddUser } />);
            }
            if (!this.state.hasAssignments) {
                if (Object.keys(this.state.members).length > 1) {
                    displayedEls.push(<AssignButton members={ this.state.members }
                                      handleAssign={ this.handleAssign } />);
                } else {
                    displayedEls.push(<div>Waiting for others to join the room...</div>);
                }
            } else {
                if (this.state.assignmentName) {
                    displayedEls.push(<Assignment name={ this.state.assignmentName } />);
                } else {
                    displayedEls.push(<div>Sorry, Secret Santas have already been assigned!</div>);
                }
            }
        }

        return (
            <div>
                <div className="row center-xs">
                    <div className="col-xs-10 col-md-8">
                        { displayedEls }
                    </div>
                </div>
                { reminderEl }
            </div>
        );
    }
});

ReactDOM.render(
    <SecretSanta />,
    document.getElementById('secretSantaTarget')
);
