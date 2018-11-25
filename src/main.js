const React = require('react');
const ReactDOM = require('react-dom');
const Firebase = require('firebase');

const AssignButton = require('./assign_button.js');
const Assignment = require('./assignment.js');
const CurrentUserForm = require('./current_user_form.js');
const ReminderButtons = require('./reminder_buttons.js');
const RoomMemberList = require('./room_member_list.js');
const SelectRoomForm = require('./select_room_form.js');

const firebaseConfig = {
    apiKey: "AIzaSyAarGCpopyjzzacan_ao1CpGmFczIKGXiw",
    authDomain: "scorching-inferno-8300.firebaseapp.com",
    databaseURL: "https://scorching-inferno-8300.firebaseio.com",
    storageBucket: "scorching-inferno-8300.appspot.com",
};
Firebase.initializeApp(firebaseConfig);
const firebaseDb = Firebase.database();

const PAGES = {
    SELECT_ROOM: 'select-room',
    LOADING: 'loading',
    ADD_USER: 'add-user',
    WAIT: 'wait-for-more-users',
    SHAKE: 'shake-hat',
    ALREADY_ASSIGNED: 'already-assigned',
    SHOW_ASSIGNMENT: 'show-assignment'
};

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

        const usersRef = firebaseDb.ref(`${roomName}/users`);
        usersRef.on('value', (usersResponse) => {
            this.setState({ members: usersResponse.val() || {} });
        });

        firebaseDb.ref(`${roomName}/assignments`).on('value', (assignments) => {
            const hasAssignments = assignments.val()

            let newState = {
                hasAssignments: hasAssignments,
                isLoading: false
            };

            // If assignments exist, show the current user's assignment.
            if (hasAssignments && this.state.currentUserRef) {
                const currentUserKey = this.state.currentUserRef.key;
                const assignmentKey = assignments.val()[currentUserKey];

                newState.assignmentName = this.state.members[assignmentKey];
            }

            this.setState(newState);
        });
    },

    handleAddUser: function(userName) {
        const userRef = firebaseDb.ref(`${this.state.roomName}/users`).push(userName);
        userRef.onDisconnect().remove(); // auto-remove me if I close the browser
        this.setState({ currentUserRef: userRef });
    },

    handleAssign: function(assignments) {
        firebaseDb.ref(`${this.state.roomName}/assignments`).set(assignments);
    },

    getCurrentPage: function() {
        const state = this.state;
        const hasOtherMembers = Object.keys(state.members).length > 1;
        if (state.roomName === null) { return PAGES.SELECT_ROOM; }
        if (state.isLoading) { return PAGES.LOADING; }
        if (!state.hasAssignments) {
            if (!state.currentUserRef) { return PAGES.ADD_USER; }
            if (!hasOtherMembers) { return PAGES.WAIT; }
            return PAGES.SHAKE;
        } else {
            if (!state.assignmentName) { return PAGES.ALREADY_ASSIGNED; }
            return PAGES.SHOW_ASSIGNMENT;
        }
    },

    render: function() {
        const page = this.getCurrentPage();
        let pageEl;
        switch(page) {
            case PAGES.SELECT_ROOM:
                pageEl = <SelectRoomForm handleSubmitRoom={ this.handleSubmitRoom } />;
                break;
            case PAGES.LOADING:
                pageEl = <div className="loader">Loading...</div>;
                break;
            case PAGES.ADD_USER:
                pageEl = (<div>
                    <RoomMemberList members={ this.state.members } />
                    <CurrentUserForm handleAddUser={ this.handleAddUser } />
                </div>);
                break;
            case PAGES.WAIT:
                pageEl = (<div>
                    <RoomMemberList members={ this.state.members } />
                    <div>Waiting for others to join the room...</div>
                </div>);
                break;
            case PAGES.SHAKE:
                pageEl = (<div>
                    <RoomMemberList members={ this.state.members } />
                    <div>Once everyone has joined the room:</div>
                    <AssignButton members={ this.state.members }
                                  handleAssign={ this.handleAssign } />
                </div>);
                break;
            case PAGES.ALREADY_ASSIGNED:
                pageEl = <div>Sorry, Secret Santas have already been assigned!</div>;
                break;
            case PAGES.SHOW_ASSIGNMENT:
                pageEl = <Assignment name={ this.state.assignmentName } />;
                break;
        }

        return (
            <div>
                <div className="main-content">
                    { pageEl }
                </div>
                { page === PAGES.SHOW_ASSIGNMENT &&
                    <ReminderButtons name={ this.state.assignmentName } /> }
            </div>
        );
    }
});

ReactDOM.render(
    <SecretSanta />,
    document.getElementById('secretSantaTarget')
);
