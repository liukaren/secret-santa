var React = require('react');
var ReactDOM = require('react-dom');

function showUsersInRoom(roomName) {
    window.currentRoomName = roomName;
    window.currentRoomMembers = {};
    $('#assign-button').hide();
    $('#room-members').empty();
    var usersRef = ref.child(roomName).child('users')
    usersRef.on('child_added', function(userResponse) {
        var userKey = userResponse.key();
        var userName = userResponse.val();
        window.currentRoomMembers[userKey] = userName;
        $('#room-details').show();
        $('#room-members').append('<span class="room-member">' + userName + '</span>');
    });

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

var RoomForm = React.createClass({
    handleSubmitRoom: function(e) {
        e.preventDefault();
        var roomName = $('#room-input').val();
        showUsersInRoom(roomName);
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

ReactDOM.render(
    <RoomForm />,
    document.getElementById('choose-room-target')
);
