'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

function showUsersInRoom(roomName) {
    window.currentRoomName = roomName;
    window.currentRoomMembers = {};
    $('#assign-button').hide();

    ref.child(roomName).child('assignments').on('value', function(assignments) {
        // If we have people in the room and we don't have assignments,
        // show the assign button.
        if (Object.keys(window.currentRoomMembers).length > 1 && !assignments.val()) {
            $('#assign-button').show();
        }

        // If assignments exist, show the current user's assignment.
        if (window.currentUserRef) {
            var currentUserKey = window.currentUserRef.key();
            var assignmentKey = assignments.val()[currentUserKey];

            $('#assignment').show();
            $('#assignment-name').text(window.currentRoomMembers[assignmentKey]);
        }
    });
}

var SelectRoomForm = React.createClass({
    propTypes: {
        handleSubmitRoom: React.PropTypes.func
    },

    handleSubmitRoom: function(e) {
        e.preventDefault();
        var roomName = $('#room-input').val();
        this.props.handleSubmitRoom.call(null, roomName);
    },

    render: function() {
        return (
            <form id="room-form" onSubmit={ this.handleSubmitRoom }>
                <label>
                    <div><strong>What is the Secret Santa room name?</strong></div>
                    <input className="input" type="text" id="room-input" />
                </label>
                <button className="btn btn-1 btn-1e" type="submit">Go</button>
            </form>
        );
    }
});

var RoomMemberList = React.createClass({
    propTypes: {
        members: React.PropTypes.object.isRequired,
    },

    getInitialState: function() {
        return {
            hasAssignments: false
        }
    },

    handleAssignClick: function() {
        this.setState({
            hasAssignments: true
        });

        console.log('assigned!');
        // var originalUsers = Object.keys(window.currentRoomMembers);
        // var shuffledUsers = originalUsers.slice(0);
        // do {
        //     shuffleArray(shuffledUsers);
        // } while (!isValidShuffle(shuffledUsers, originalUsers));

        // var assignmentsRef = ref.child(window.currentRoomName).child('assignments');

        // var newAssignments = {};
        // for (var i = 0; i < shuffledUsers.length; i++) {
        //     newAssignments[originalUsers[i]] = shuffledUsers[i];
        // }
        // assignmentsRef.set(newAssignments);
    },

    render: function() {
        const members = this.props.members;
        const roomMembersEl = Object.keys(members).map(function(memberKey) {
            return (
                <span className="room-member" id={ memberKey } >
                    { members[memberKey] }
                </span>
            );
        });

        return (
            <div id="room-details">
                <div id="room-members-title">
                    <strong>In this room:</strong>
                </div>
                <div id="room-members">
                    { roomMembersEl }
                </div>
                <form id="add-user-form">
                    <label>
                        <div><strong>Who are you?</strong></div>
                        <input className="input" type="text" id="user-name-input" />
                    </label>
                    <button className="btn btn-1 btn-1e" type="submit">That's me</button>
                </form>

                {
                    this.state.hasAssignments ?
                    null : (
                        <button id="assign-button"
                                className="btn btn-1 btn-1e"
                                type="submit"
                                onClick={ this.handleAssignClick }
                                onMouseEnter={ () => {
                                    $('#button-text').addClass('animated shake');
                                } }
                                onMouseLeave={ () => {
                                    $('#button-text').removeClass('animated shake');
                                } }>
                            <div id="button-text">Shake the hat</div>
                        </button>
                    )
                }
            </div>
        )
    }
});

var SecretSanta = React.createClass({
    getInitialState: function() {
        return {
            isRoomSelected: false,
            members: {} // a mapping from user's Firebase key to user's name
        };
    },

    handleSubmitRoom: function(roomName) {
        const usersRef = ref.child(roomName).child('users');
        usersRef.on('child_added', (userResponse) => {
            const userKey = userResponse.key();
            const userName = userResponse.val();

            if (this.isMounted()) {
                let newMembers = Object.assign({}, this.state.members);
                newMembers[userKey] = userName;
                this.setState({
                    members: newMembers
                });
            }
        });

        showUsersInRoom(roomName);

        this.setState({
            isRoomSelected: true
        });
    },

    render: function() {
        return (
            <div>
                {
                    this.state.isRoomSelected ?
                    <RoomMemberList members={ this.state.members } /> :
                    <SelectRoomForm handleSubmitRoom={ this.handleSubmitRoom } />
                }
            </div>
        );
    }
});

// TODO: Wrap this component in another component that handles switching between pages.

ReactDOM.render(
    <SecretSanta />,
    document.getElementById('choose-room-target')
);
