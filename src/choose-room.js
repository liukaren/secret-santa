var React = require('react');
var ReactDOM = require('react-dom');

var RoomForm = React.createClass({
    render: function() {
        return (
            <form id="room-form">
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
