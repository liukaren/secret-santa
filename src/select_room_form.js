const React = require('react');

module.exports = React.createClass({
    propTypes: {
        handleSubmitRoom: React.PropTypes.func.isRequired
    },

    handleSubmitRoom: function(e) {
        e.preventDefault();
        const roomName = this._roomInput.value.toLowerCase();
        if (!!roomName.trim()) {
            this.props.handleSubmitRoom.call(null, roomName);
        }
    },

    render: function() {
        return (
            <form id="room-form" onSubmit={ this.handleSubmitRoom }>
                <label>
                    <div><strong>What is the Secret Santa room name?</strong></div>
                    <input className="input"
                           type="text"
                           ref={ (c) => { this._roomInput = c } }
                           id="room-input" />
                </label>
                <button className="btn btn-1 btn-1e"
                        type="submit">
                    Go
                </button>
            </form>
        );
    }
});
